import {Component} from '@angular/core';
import {AuthService} from '../../../../core/services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true,
})
export class Register {
  errorMessage: string = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  userForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
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
    const {name, email, password} = this.userForm.value;

    this.auth.register({name: name!, email: email!, password: password!}).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('REGISTER ERROR', err);
        if (err.status === 422) {
          this.errorMessage = Object.values(err.error).flat().join(' ');
        } else {
          this.errorMessage = 'Ha habido un error al registrar el usuario.'
        }
      },
    });
  }
}
