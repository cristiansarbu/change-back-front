import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  errorMessage: string = '';

  constructor(private auth: AuthService, private router: Router) {
  }

  userForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  });

  submitForm(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.userForm.value;
    this.errorMessage = '';

    this.auth.login({email: email!, password: password!})
      .subscribe({
        next: () => {
          if (this.auth.isAdmin()) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (err: { status: number; }) => {
          console.error('LOGIN ERROR', err);
          if (err.status === 401) {
            this.errorMessage = 'El email o la contraseña son incorrectos.';
            this.userForm.get('password')?.reset();
          } else if (err.status === 400) {
            this.errorMessage = 'El formato de los datos proporcionados es inválido.'
          } else {
            this.errorMessage = 'Ocurrió un error inesperado. Inténtalo luego.';
          }
        }
      });
  }


}

