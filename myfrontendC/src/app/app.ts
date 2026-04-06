import {Component, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NavbarComponent} from './shared/components/navbar-component/navbar-component';
import {FooterComponent} from './shared/components/footer-component/footer-component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NavbarComponent, FooterComponent],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {
    private router = inject(Router);
    
    isAdminRoute(): boolean {
        return this.router.url.startsWith('/admin');
    }
}