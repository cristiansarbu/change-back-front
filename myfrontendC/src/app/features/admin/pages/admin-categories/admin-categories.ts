import {Component, inject, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CategoryService} from '../../../petitions/services/category';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css'
})
export class AdminCategories implements OnInit {
  private categoryService = inject(CategoryService);
  categories = signal<any[]>([]);
  loading = signal(true);
  newCategoryName = '';
  editingId = signal<number | null>(null);
  editingName = '';

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading.set(true);
    this.categoryService.fetchAdminCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.loading.set(false);
      }
    });
  }

  createCategory() {
    if (!this.newCategoryName.trim()) return;
    this.categoryService.createAdminCategory(this.newCategoryName.trim()).subscribe({
      next: (res) => {
        this.categories.update(current => [...current, res.data]);
        this.newCategoryName = '';
      },
      error: (err) => console.error('Error creating category', err)
    });
  }

  startEdit(category: any) {
    this.editingId.set(category.id);
    this.editingName = category.name;
  }

  cancelEdit() {
    this.editingId.set(null);
    this.editingName = '';
  }

  saveEdit(id: number) {
    if (!this.editingName.trim()) return;
    this.categoryService.updateAdminCategory(id, this.editingName.trim()).subscribe({
      next: (res) => {
        this.categories.update(current =>
          current.map(c => c.id === id ? res.data : c)
        );
        this.editingId.set(null);
        this.editingName = '';
      },
      error: (err) => console.error('Error updating category', err)
    });
  }

  deleteCategory(id: number) {
    this.categoryService.deleteAdminCategory(id).subscribe({
      next: () => {
        this.categories.update(current => current.filter(c => c.id !== id));
      },
      error: (err) => console.error('Error deleting category', err)
    });
  }
}