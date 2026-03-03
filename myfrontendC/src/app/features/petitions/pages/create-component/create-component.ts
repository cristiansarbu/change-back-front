import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PetitionService} from '../../services/petition';
import {CategoryService} from '../../services/category';
import {Category} from '../../../../core/models/category';
import {Location} from '@angular/common';

@Component({
  selector: 'app-create-component',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './create-component.html',
  styleUrl: './create-component.css',
})
export class CreateComponent {
  private fb = inject(FormBuilder);
  private petitionService = inject(PetitionService);
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private locationService = inject(Location);

  categories: Category[] = [];
  loading = signal(false);
  filesToUpload: File[] = [];
  fileError = signal('');
  itemForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    destinatary: ['', [Validators.required]],
    category_id: ['', [Validators.required]]
  });

  ngOnInit() {
    this.categoryService.fetchCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
      }
    });
  }

  goBack() {
    this.locationService.back();
  }

  onFileSelected(event: any) {
    this.fileError.set('');
    const files: FileList = event.target.files;

    if (!files || files.length === 0) {
      this.filesToUpload = [];
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'image/svg+xml'];

    for (let file of files) {
      if (!allowed.includes(file.type)) {
        this.fileError.set(`Formato inválido en el archivo "${file.name}". Usa JPG, PNG o SVG.`);
        this.filesToUpload = [];
        return;
      }
      this.filesToUpload.push(file);
    }
  }

  onSubmit() {
    this.fileError.set('');

    if (this.filesToUpload.length === 0) {
      this.fileError.set('Debes seleccionar al menos una imagen.');
      return;
    }

    if (this.itemForm.valid && this.filesToUpload.length > 0) {
      this.loading.set(true);
      const formData = new FormData();
      formData.append('title', this.itemForm.value.title!);
      formData.append('description', this.itemForm.value.description!);
      formData.append('destinatary', this.itemForm.value.destinatary!);
      formData.append('category_id', this.itemForm.value.category_id!);

      this.filesToUpload.forEach(file => {
        formData.append('files[]', file);
      });

      this.petitionService.create(formData).subscribe({
        next: () => {
          console.log('ha venido la respuesta:');
          this.router.navigate(['/petitions/mine'])
        },
        error: (err) => {
          this.loading.set(false)
          console.error(err);
        }
      });
    } else {
      this.itemForm.markAllAsTouched();
      return;
    }
  }
}
