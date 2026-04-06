import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs';
import {Category} from '../../../core/models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/api';
  #categories = signal<Category[]>([]);
  allCategories = this.#categories.asReadonly();

  fetchCategories() {
    return this.http.get<{ data: Category[] }>(`${this.API_URL}/categories`).pipe(
      map(res => res.data),
      tap(data => {
        this.#categories.set(data);
      })
    );
  }

  fetchAdminCategories() {
    return this.http.get<{ data: Category[] }>(`${this.API_URL}/admin/categories`).pipe(
      map(res => res.data),
      tap(data => {
        this.#categories.set(data);
      })
    );
  }

  createAdminCategory(name: string) {
    return this.http.post<{ data: Category }>(`${this.API_URL}/admin/categories`, { name });
  }

  updateAdminCategory(id: number, name: string) {
    return this.http.put<{ data: Category }>(`${this.API_URL}/admin/categories/${id}`, { name });
  }

  deleteAdminCategory(id: number) {
    return this.http.delete(`${this.API_URL}/admin/categories/${id}`);
  }
}
