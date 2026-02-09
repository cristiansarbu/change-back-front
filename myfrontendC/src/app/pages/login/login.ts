import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink
  ],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  errorMessage: string = '';

  constructor(private auth: AuthService, private router: Router) {
  }

  login() {
    this.errorMessage = ''; // Reseteamos errores previos
    this.auth.login({email: this.email, password: this.password})
      .subscribe({
        next: () => {
          // Si todo va bien, nos vamos a las peticiones
          this.router.navigate(['/peticiones']);
        },
        error: (err: { status: number; }) => {
          console.error('LOGIN ERROR', err);
          if (err.status === 401) {
            this.errorMessage = 'El email o la contraseña son incorrectos.';
            this.password = ''; // Borramos pass para facilitar reintento
            console.log(this.errorMessage)
          } else {
            this.errorMessage = 'Ocurrió un error inesperado. Inténtalo luego.';
          }
        }
      });
  }

}

