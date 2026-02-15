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
}
