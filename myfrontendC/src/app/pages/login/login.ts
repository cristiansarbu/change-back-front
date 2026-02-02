import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule
  ],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {
  }

  login() {
    this.auth.login({email: this.email, password: this.password})
      .subscribe({
        next: () => {
          this.router.navigate(['/profile']);
        },
        error: err => {
          console.error('LOGIN ERROR', err);
        }
      });
  }
}
