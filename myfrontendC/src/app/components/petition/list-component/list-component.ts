import {Component, inject} from '@angular/core';
import {PetitionService} from '../../../services/petition';
import {AuthService} from '../../../auth/auth.service';
import {ActivatedRoute} from '@angular/router';
import {Petition} from '../../../models/petition';

@Component({
  selector: 'app-list-component',
  imports: [],
  templateUrl: './list-component.html',
  styleUrl: './list-component.css',
})
export class ListComponent {
  petitionService = inject(PetitionService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  public petitions: Petition[] = [];
  public loading: boolean = true;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const busqueda = params['q'];
      this.loading = true;
      this.petitionService.fetchPetitions().subscribe({
        next: (data) => {
          if (busqueda) {
            this.petitions = data.filter((p: any) =>
              p.title.toLowerCase().includes(busqueda.toLowerCase()) ||
              p.description.toLowerCase().includes(busqueda.toLowerCase())
            );
          } else {
            this.petitions = data;
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar peticiones:', err);
          this.loading = false;
        }
      });
    });
  }

  delete(id: number) {
    if (confirm('¿Seguro?')) {
      this.petitionService.delete(id).subscribe({
        error: (err) => alert('No puedes borrar esto (quizás no eres el dueño)'),
        next: () => this.petitions = this.petitions.filter(p => p.id !== id)
      });
    }
  }
}
