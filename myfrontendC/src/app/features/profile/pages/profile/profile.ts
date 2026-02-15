import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from '../../../../core/services/auth.service';
import {Router} from '@angular/router';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [
    AsyncPipe
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  standalone: true,
})
export class Profile {
  user$!: Observable<any>;

  constructor(private auth: AuthService, private router: Router) {
    this.user$ = this.auth.user$;
    this.auth.getProfile().subscribe();
  }

  logout() {
    this.auth.logout().subscribe(() => this.router.navigate(['/auth/login']));
  }

}
