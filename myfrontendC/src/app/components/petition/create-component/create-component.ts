import {Component, inject, signal} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PetitionService} from '../../../services/petition';

@Component({
  selector: 'app-create-component',
  imports: [],
  templateUrl: './create-component.html',
  styleUrl: './create-component.css',
})
export class CreateComponent {
  private fb = inject(FormBuilder);
  private petitionService = inject(PetitionService);
  private router = inject(Router);
  loading = signal(false);
  fileToUpload: File | null = null;
  itemForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    destinatary: ['', [Validators.required]],
    category_id: ['', [Validators.required]]
  });

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.fileToUpload = file;
  }

  onSubmit() {
    if (this.itemForm.valid && this.fileToUpload) {
      this.loading.set(true);
      const formData = new FormData();
      formData.append('title', this.itemForm.value.title!);
      formData.append('description', this.itemForm.value.description!);
      formData.append('destinatary', this.itemForm.value.destinatary!);
      formData.append('category_id', this.itemForm.value.category_id!);
      formData.append('file', this.fileToUpload);
      this.petitionService.create(formData).subscribe({
        next: () => this.router.navigate(['/peticiones']),
        error: (err) => this.loading.set(false)
      });
    } else {
      alert('Rellena todos los campos e imagen');
    }
  }
}
