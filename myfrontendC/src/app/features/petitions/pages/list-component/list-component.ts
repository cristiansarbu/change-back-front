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
