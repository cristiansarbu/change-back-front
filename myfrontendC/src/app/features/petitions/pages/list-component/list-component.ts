import {Component, computed, effect, inject, signal} from '@angular/core';
import {PetitionService} from '../../services/petition';
import {Petition} from '../../../../core/models/petition';
import {CategoryService} from '../../services/category';
import {Category} from '../../../../core/models/category';
import {RouterLink} from '@angular/router';
import {Search} from '../../services/search';

@Component({
  selector: 'app-list-component',
  imports: [
    RouterLink
  ],
  templateUrl: './list-component.html',
  styleUrl: './list-component.css',
})
export class ListComponent {
  private petitionService = inject(PetitionService);
  private categoryService = inject(CategoryService);
  private searchService = inject(Search);
  public petitions: Petition[] = [];
  public categories: Category[] = [];
  public loading: boolean = true;

  activePetitions = signal<Petition[]>([]);
  signFilter = signal<string>('Todas');
  categoryFilter = signal<number | null>(null);

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

  public searchQuery = this.searchService.searchQuery;
  ngOnInit() {
    this.loading = true;
    this.petitionService.fetchPetitions().subscribe({
      next: (data) => {
        this.petitions = data;
        this.loading = false;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error al cargar peticiones:', err);
        this.loading = false;
      }
    });
    this.categoryService.fetchCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
      }
    })
  }

  applyFilters() {
    let filtradas = this.petitions;
    this.currentPage.set(1);

    if (this.signFilter() === 'Firmada') {
      filtradas = filtradas.filter(petition => ((petition.signers ?? 0) > 0))
    } else if (this.signFilter() === 'No Firmada') {
      filtradas = filtradas.filter(petition => ((petition.signers ?? 0) === 0))
    }

    if (this.categoryFilter() !== null) {
      filtradas = filtradas.filter(petition => (petition.category_id === this.categoryFilter()));
    }

    if (this.searchQuery() !== '') {
      filtradas = filtradas.filter(petition =>
        (petition.title.toLowerCase().includes(this.searchQuery().toLowerCase()))
      );
    }

    this.activePetitions.set(filtradas);
  }

  signFilterChanged(value: string) {
    this.signFilter.set(value);
    this.applyFilters();
  }

  categoryFilterChanged(value: number | null) {
    this.categoryFilter.set(value);
    this.applyFilters();
  }

  categoryFilterText = computed(() => {
    if (this.categoryFilter() === null) {
      return 'Todas';
    }
    return this.categories.find(category => (category.id === this.categoryFilter()))?.name
  })

  searchEffect = effect(() => {
    this.searchQuery();
    this.applyFilters();
  })

}
