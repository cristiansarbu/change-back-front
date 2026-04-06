import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AdminUserService} from '../../services/admin-user';

@Component({
  selector: 'app-admin-user-show',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-user-show.html',
  styleUrl: './admin-user-show.css'
})
export class AdminUserShow implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(AdminUserService);
  user = signal<any>(null);
  loading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.getUserById(Number(id)).subscribe({
        next: (data) => {
          this.user.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading user', err);
          this.loading.set(false);
        }
      });
    }
  }
}