import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AdminUserService} from '../../services/admin-user';

@Component({
  selector: 'app-admin-user-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-user-edit.html',
  styleUrl: './admin-user-edit.css'
})
export class AdminUserEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private userService = inject(AdminUserService);
  loading = signal(false);
  userId: number | null = null;

  userForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    admin: [false]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = Number(id);
      this.userService.getUserById(this.userId).subscribe({
        next: (data) => {
          this.userForm.patchValue({
            name: data.name,
            admin: !!data.admin
          });
        }
      });
    }
  }

  onSubmit() {
    if (this.userForm.invalid || !this.userId) return;
    this.loading.set(true);
    this.userService.updateUser(this.userId, {
      name: this.userForm.value.name!,
      admin: !!this.userForm.value.admin
    }).subscribe({
      next: () => this.router.navigate(['/admin/users']),
      error: (err) => {
        console.error('Error updating user', err);
        this.loading.set(false);
      }
    });
  }
}