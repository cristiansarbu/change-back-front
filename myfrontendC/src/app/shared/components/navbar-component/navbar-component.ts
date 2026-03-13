import {Component, inject} from '@angular/core';
import {RouterLink, Router} from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Search} from '../../../features/petitions/services/search';

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private searchService = inject(Search);
  public router: Router = inject(Router);

  // REFERENCIA A SIGNALS:
  // No las ejecutamos con (), pasamos la referencia para que el template las "escuche"
  public currentUser = this.authService.currentUser;
  public isLoggedIn = this.authService.isLoggedIn;

  public searchText: string = '';

  ngOnInit() {
    this.authService.loadUserIfNeeded();
  }

  logout() {
    this.authService.logout().subscribe();
  }

  search() {
      if (this.router.url !== '/petitions') {
        this.router.navigate(['/petitions']);
      }
      this.searchService.changeSearchQuery(this.searchText);
  }
}
