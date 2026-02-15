import {Component, inject} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private authService = inject(AuthService);
  public router: Router = inject(Router);

  // REFERENCIA A SIGNALS:
  // No las ejecutamos con (), pasamos la referencia para que el template las "escuche"
  public currentUser = this.authService.currentUser;
  public isLoggedIn = this.authService.isLoggedIn;

  logout() {
    this.authService.logout().subscribe();
  }
}
