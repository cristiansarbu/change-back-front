import {Component, inject, OnInit, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {PetitionService} from '../../../petitions/services/petition';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './panel.html',
  styleUrl: './panel.css'
})
export class Panel implements OnInit {
  petitionService = inject(PetitionService);
  
  petitions = signal<any[]>([]);
  loading = signal<boolean>(true);

  ngOnInit() {
    this.loadPetitions();
  }

  loadPetitions() {
    this.loading.set(true);
    this.petitionService.fetchAdminPetitions().subscribe({
      next: (res) => {
        this.petitions.set(res.data || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando el panel', err);
        this.loading.set(false);
      }
    });
  }

  changeStatus(id: number) {
    this.petitionService.changeAdminPetitionStatus(id).subscribe({
      next: (res) => {
        this.petitions.update(current =>
          current.map(p => p.id === id ? res.data : p)
        );
      },
      error: (err) => console.error('Error cambiando el estado', err)
    });
  }

  deletePetition(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta petición? Esta acción NO se puede deshacer.')) {
      this.petitionService.deleteAdminPetition(id).subscribe({
        next: () => {
          this.petitions.update(current => current.filter(p => p.id !== id));
          alert('Petición eliminada correctamente.');
        },
        error: (err) => {
          console.error('Hubo un error eliminando la petición.', err);
        }
      });
    }
  }
}