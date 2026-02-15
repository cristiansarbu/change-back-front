import {Component, inject} from '@angular/core';
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

  ngOnInit() {
    this.loading = true;
    this.petitionService.fetchMySignedPetitions().subscribe({
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
