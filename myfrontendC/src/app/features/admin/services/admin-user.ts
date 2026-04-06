import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminUserService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/api';

  fetchUsers() {
    return this.http.get<{ data: any[] }>(`${this.API_URL}/admin/users`).pipe(
      map(res => res.data)
    );
  }

  getUserById(id: number) {
    return this.http.get<{ data: any }>(`${this.API_URL}/admin/users/${id}`).pipe(
      map(res => res.data)
    );
  }

  updateUser(id: number, data: { name: string; admin: boolean }) {
    return this.http.put<{ data: any }>(`${this.API_URL}/admin/users/${id}`, data);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.API_URL}/admin/users/${id}`);
  }
}