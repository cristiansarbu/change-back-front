import {Component, computed, inject, signal} from '@angular/core';
import {PetitionService} from '../../services/petition';
import {Petition} from '../../../../core/models/petition';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-signed-component',
  imports: [
    RouterLink
  ],
  templateUrl: './signed-component.html',
  styleUrl: './signed-component.css',
})
export class SignedComponent {
  private petitionService = inject(PetitionService);
  public petitions: Petition[] = [];
  public loading: boolean = true;
  activePetitions = signal<Petition[]>([]);

  public petitionsPerPage = 1;
  currentPage = signal<number>(1);
  totalPages = computed(() => {
    // Redondear hacia arriba para no perder peticiones (última página)
    return Math.ceil(this.activePetitions().length / this.petitionsPerPage);
  });

  paginatedPetitions = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.petitionsPerPage;
    const endIndex = startIndex + this.petitionsPerPage;
    return this.activePetitions().slice(startIndex, endIndex);
  });

  paginatorPages = computed(() => {
    let pages: number[] = [];

    // Comprobación si hay menos de 3 elementos
    if (this.totalPages() <= 3) {
      for (let i = 1; i <= this.totalPages(); i++) {
        pages.push(i);
      }
      return pages;
    }

    // Lógica números
    if (this.currentPage() === 1) {
      pages.push(this.currentPage());
      pages.push(this.currentPage() + 1);
      pages.push(this.currentPage() + 2);
    } else if (this.currentPage() === this.totalPages()) {
      pages.push(this.currentPage() - 2);
      pages.push(this.currentPage() - 1);
      pages.push(this.currentPage());
    } else {
      pages.push(this.currentPage() - 1);
      pages.push(this.currentPage());
      pages.push(this.currentPage() + 1);
    }
    return pages;
  });

  ngOnInit() {
    this.loading = true;
    this.petitionService.fetchMySignedPetitions().subscribe({
      next: (data) => {
        this.petitions = data;
        this.loading = false;
        this.activePetitions.set(this.petitions);
      },
      error: (err) => {
        console.error('Error al cargar peticiones:', err);
        this.loading = false;
      }
    });
  }
}
