import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../auth/auth.service';
import {PetitionService} from '../../../services/petition';
import {Petition} from '../../../models/petition';

@Component({
  selector: 'app-show-component',
  imports: [],
  templateUrl: './show-component.html',
  styleUrl: './show-component.css',
})
export class ShowComponent {
  private petitionService = inject(PetitionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  petition = signal<Petition | null>(null);
  loading = signal(true);
  public currentUserId: number | null = null;
  readonly API_STORAGE = 'http://localhost:8000/storage/';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarPeticion(Number(id));
    }
    this.authService.user$.subscribe(user => {
      this.currentUserId = user ? user.id : null;
    });
    this.authService.loadUserIfNeeded();
  }

  cargarPeticion(id: number) {
    this.petitionService.getById(id).subscribe({
      next: (res: any) => {
        this.petition.set(res.data ? res.data : res);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
      }
    });
  }

  getImagenUrl(): string {
    const pet = this.petition();
    if (pet && pet.files && pet.files.length > 0) {
      const path = pet.files[0].file_path.replace('storage/', '');
      return `${this.API_STORAGE}${path}`;
    }
    return 'assets/no‐image.png';
  }

  delete() {
    const pet = this.petition();
    if (!pet?.id) return;
    if (confirm('¿Eliminar petición?')) {
      this.petitionService.delete(pet.id).subscribe(() => {
        this.router.navigate(['/petitions']);
      });
    }
  }

}
