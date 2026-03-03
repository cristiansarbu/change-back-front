import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PetitionService} from '../../services/petition';
import {Petition} from '../../../../core/models/petition';
import {Location} from '@angular/common';
import {CategoryService} from '../../services/category';
import {Category} from '../../../../core/models/category';

@Component({
  selector: 'app-edit-component',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-component.html',
  styleUrl: './edit-component.css',
})
export class EditComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private petitionService = inject(PetitionService);
  private locationService = inject(Location);
  private categoryService = inject(CategoryService);
  categories: Category[] = [];
  id = signal<number | null>(null);
  loading = signal(false);
  fileError = signal('');
  filesToUpload: File[] = [];
  petition: Petition | null = null;
  itemForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    destinatary: ['', [Validators.required]],
    category_id: ['', [Validators.required]]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(Number(idParam));
      this.cargarDatos(this.id()!);
    }
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

  cargarDatos(id: number) {
    this.petitionService.getById(id).subscribe({
      next: (data: Petition) => {
        this.petition = data;
        this.itemForm.patchValue({
          title: data.title,
          description: data.description,
          destinatary: data.destinatary,
          category_id: String(data.category_id)
        });
      }
    });
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
    if (this.itemForm.invalid || !this.id()) return;
    this.loading.set(true);
    const formData = new FormData();
    formData.append('title', this.itemForm.get('title')?.value || '');
    formData.append('description', this.itemForm.get('description')?.value || '');
    formData.append('destinatary', this.itemForm.get('destinatary')?.value || '');
    formData.append('category_id', this.itemForm.get('category_id')?.value || '');

    if (this.filesToUpload.length > 0) {
      this.filesToUpload.forEach(file => {
        formData.append('files[]', file);
      });
    }
    this.petitionService.update(this.id()!, formData).subscribe({
      next: () => this.router.navigate(['/petitions/mine']),
      error: () => this.loading.set(false)
    });
  }

}
