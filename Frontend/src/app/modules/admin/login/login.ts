import { Component } from '@angular/core';
import { RouterModule,Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterModule,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class AdminLogin {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  loginAdmin(): void {

    if (!this.isFormValid()) {
      this.errorMessage = 'Email and password are required';
      return;
    }

    this.isLoading = true;

    this.auth.loginAdmin({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {

          localStorage.setItem('token', response.token);
          localStorage.setItem('admin', JSON.stringify(response.admin));
          localStorage.setItem('adminId', response.admin._id);

          this.router.navigate(['/dashboard'])

          this.isLoading = false;
        },

        error: (err) => {
          console.error('Login ERROR:', err);
          this.errorMessage = err.error?.message || 'Admin login failed';
          this.isLoading = false;
        },

        complete: () => console.log('Login observable completed')
      });
  }

  private isFormValid(): boolean {
    const valid = this.email.trim() !== '' && this.password.trim() !== '';
    return valid;
  }
}
