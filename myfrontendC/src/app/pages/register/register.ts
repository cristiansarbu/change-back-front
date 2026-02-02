import {Component} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true,
})
export class Register {
  formData = {
    name: '',
    email: '',
    password: '',
  };

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  register() {
    this.auth.register(this.formData).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Register error', err);
        alert('Error registering user');
      },
    });
  }
}
