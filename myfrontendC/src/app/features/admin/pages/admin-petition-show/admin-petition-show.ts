import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {PetitionService} from '../../../petitions/services/petition';
import {Petition} from '../../../../core/models/petition';

@Component({
  selector: 'app-admin-petition-show',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-petition-show.html',
  styleUrl: './admin-petition-show.css'
})
export class AdminPetitionShow {
  private petitionService = inject(PetitionService);
  private route = inject(ActivatedRoute);
  petition = signal<Petition | null>(null);
  loading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.petitionService.getAdminPetitionById(Number(id)).subscribe({
        next: (data) => {
          this.petition.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading petition', err);
          this.loading.set(false);
        }
      });
    }
  }
}
