import {Component, inject} from '@angular/core';
import {RouterLink, Router} from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  public router: Router = inject(Router);

  // REFERENCIA A SIGNALS:
  // No las ejecutamos con (), pasamos la referencia para que el template las "escuche"
  public currentUser = this.authService.currentUser;
  public isLoggedIn = this.authService.isLoggedIn;

  ngOnInit() {
    this.authService.loadUserIfNeeded();
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
