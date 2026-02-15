import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';
import {PetitionService} from '../../services/petition';
import {Petition} from '../../../../core/models/petition';

@Component({
  selector: 'app-show-component',
  imports: [
    RouterLink
  ],
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
  public isOwner: boolean = false;
  readonly API_STORAGE = 'http://localhost:8000/storage/';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.authService.user$.subscribe(user => {
      this.currentUserId = user ? user.id : null;
    });
    this.authService.loadUserIfNeeded();
    if (id) {
      this.cargarPeticion(Number(id));
    }
  }

  cargarPeticion(id: number) {
    this.petitionService.getById(id).subscribe({
      next: (res: any) => {
        this.petition.set(res.data ? res.data : res);
        this.loading.set(false);
        if (this.petition()!.user!.id! === this.currentUserId) {
          this.isOwner = true;
        }
      },
      error: (err) => {
        this.loading.set(false);
      }
    });
  }

  signError = signal('');
  signSuccess = signal('');

  firmar() {
    this.signError.set('');

    const petition = this.petition();

    this.petitionService.sign(petition!.id!).subscribe({
      next: (res) => {
        this.petition.set(res.data);
        this.signSuccess.set('Has firmado con éxito esta petición.');
      },
      error: (err) => {
        this.signError.set(err?.error?.message ?? 'No se pudo firmar.');
      }
    });
  }

  deletePetition() {
    if (!this.isOwner) return;
    const petition = this.petition();
    this.petitionService.delete(petition!.id!).subscribe(() => {
      this.router.navigate(['/petitions/mine']);
    });
  }
}
