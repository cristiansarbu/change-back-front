import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs';
import {Petition} from '../../../core/models/petition';


@Injectable({
  providedIn: 'root',
})

export class PetitionService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/api';
  // ‐‐‐ State (Signals) ‐‐‐
  // Store privado de peticiones
  #petitions = signal<Petition[]>([]);
  loading = signal<boolean>(false);
  // ‐‐‐ Selectors ‐‐‐
  // Exponemos las peticiones como solo lectura
  allPetitions = this.#petitions.asReadonly();

  fetchPetitions() {
    this.loading.set(true);
    return this.http.get<{ data: Petition[] }>(`${this.API_URL}/petitions`).pipe(
      map(res => res.data),
      tap(data => {
        this.#petitions.set(data);
        this.loading.set(false);
      })
    );
  }

  fetchMyPetitions() {
    this.loading.set(true);
    return this.http.get<{ data: Petition[] }>(`${this.API_URL}/mypetitions`).pipe(
      map(res => res.data),
      tap(data => {
        this.#petitions.set(data);
        this.loading.set(false);
      })
    );
  }

  fetchMySignedPetitions() {
    this.loading.set(true);
    return this.http.get<{ data: Petition[] }>(`${this.API_URL}/signedpetitions`).pipe(
      map(res => res.data),
      tap(data => {
        this.#petitions.set(data);
        this.loading.set(false);
      })
    );
  }

  getById(id: number) {
    return this.http.get<{ data: Petition }>(`${this.API_URL}/petitions/${id}`).pipe(
      map(res => res.data)
    );
  }

  create(formData: FormData) {
    return this.http.post<{ data: Petition }>(`${this.API_URL}/petitions`, formData).pipe(
      tap(res => {
        // Añadimos la nueva petición al principio de la lista local
        this.#petitions.update(list => [res.data, ...list]);
      })
    );
  }

  update(id: number, formData: FormData) {
    // Truco para que Laravel acepte archivos en actualización
    formData.append('_method', 'PUT');
    return this.http.post<{ data: Petition }>(`${this.API_URL}/petitions/${id}`, formData).pipe(
      tap(res => {
        // Actualizamos solo la petición modificada en la lista local
        this.#petitions.update(list =>
          list.map(p => p.id === id ? res.data : p)
        );
      })
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/petitions/${id}`).pipe(
      tap(() => {
        // Eliminamos la petición de la lista local
        this.#petitions.update(list => list.filter(p => p.id !== id));
      })
    );
  }

  sign(id: number) {
    return this.http.put<{ success: boolean, data: Petition; message: string }>(
      `${this.API_URL}/petitions/sign/${id}`,
      {}
    );
  }

  // Admin
  fetchAdminPetitions() {
    return this.http.get<{ data: Petition[] }>(`${this.API_URL}/admin/petitions`);
  }

  deleteAdminPetition(id: number) {
    return this.http.delete(`${this.API_URL}/admin/petitions/${id}`);
  }

  getAdminPetitionById(id: number) {
    return this.http.get<{ data: Petition }>(`${this.API_URL}/admin/petitions/${id}`).pipe(
      map(res => res.data)
    );
  }

  createAdminPetition(formData: FormData) {
    return this.http.post<{ data: Petition }>(`${this.API_URL}/admin/petitions`, formData);
  }

  updateAdminPetition(id: number, formData: FormData) {
    formData.append('_method', 'PUT');
    return this.http.post<{ data: Petition }>(`${this.API_URL}/admin/petitions/${id}`, formData);
  }

  changeAdminPetitionStatus(id: number) {
    return this.http.put<{ data: Petition }>(`${this.API_URL}/admin/petitions/status/${id}`, {});
  }

}
