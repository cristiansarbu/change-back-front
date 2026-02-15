import {Component, inject} from '@angular/core';
import {PetitionService} from '../../services/petition';
import {Petition} from '../../../../core/models/petition';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-mine-component',
  imports: [
    RouterLink
  ],
  templateUrl: './mine-component.html',
  styleUrl: './mine-component.css',
})
export class MineComponent {
  private petitionService = inject(PetitionService);
  public petitions: Petition[] = [];
  public loading: boolean = true;

  ngOnInit() {
    this.loading = true;
    this.petitionService.fetchMyPetitions().subscribe({
      next: (data) => {
        this.petitions = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar peticiones:', err);
        this.loading = false;
      }
    });
  }
}
