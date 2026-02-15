import {Component, inject} from '@angular/core';
import {PetitionService} from '../../services/petition';
import {Petition} from '../../../../core/models/petition';
import {CategoryService} from '../../services/category';
import {Category} from '../../../../core/models/category';
import {RouterLink} from '@angular/router';

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
  public petitions: Petition[] = [];
  public categories: Category[] = [];
  public loading: boolean = true;

  ngOnInit() {
    this.loading = true;
    this.petitionService.fetchPetitions().subscribe({
      next: (data) => {
        this.petitions = data;
        this.loading = false;
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
}
