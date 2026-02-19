import { Component } from '@angular/core';
import { AdminHeader } from '../header/header';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  imports: [AdminHeader,RouterModule,CommonModule,FormsModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css'
})
export class CreateUser {
  constructor(private authService : AuthService, private router: Router) {}

  onCreateUser(form: NgForm) {
    if (form.invalid) return;

    const { username, email, password, confirmPassword } = form.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    this.authService.createUser({ username, email, password })
      .subscribe({
        next: (response: any) => {
          alert(response.message);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          alert(err.error.message || 'Error occurred');
        }
      });
  }
}
