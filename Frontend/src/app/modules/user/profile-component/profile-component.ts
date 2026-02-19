import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UserHeader } from '../header/header';
import { RouterModule, Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';


interface User {
  username: string;
  email: string;
  image?: string;
  password?: string;
  confirmPassword?: string;
}


interface AlertMessage {
  type: 'success' | 'error';
  text: string;
}

@Component({
  selector: 'app-profile-component',
  imports: [FormsModule, CommonModule, UserHeader, RouterModule],
  templateUrl: './profile-component.html',
  styleUrls: ['./profile-component.css'],
})
export class ProfileComponent implements OnInit {
  user: User = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: '',
  };
  selectedFile: File | null = null;
  isSaving: boolean = false;
  saveSuccess: boolean = false;
  saveError: string = '';
  isLoading: boolean = false;
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;





  alertMessages: AlertMessage[] = [];

  private pushAlert(type: 'success' | 'error', text: string) {
    this.alertMessages = [...this.alertMessages, { type, text }];
    setTimeout(() => this.alertMessages = this.alertMessages.slice(1), 4000);
  }

  clearAlert(index: number) {
    this.alertMessages = this.alertMessages.filter((_, i) => i !== index);
  }





  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.pushAlert('error', 'User ID not found. Redirecting to login…');
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    this.authService.fetchUserProfile(userId).subscribe({
      next: (profile) => {
        this.isLoading = false;
        this.user = {
          username: profile.username || '',
          email: profile.email || '',
          image: profile.image || '',
          password: '',
          confirmPassword: '',
        };
      },
      error: (err) => {
        this.isLoading = false;
        this.pushAlert('error', err.message || 'Failed to load profile.');
        if (err.message?.includes('Unauthorized')) this.router.navigate(['/login']);
      },
    });
  }

  onFileSelect(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.user.image = URL.createObjectURL(this.selectedFile);
    }
  }

  onUpload(): void {
    if (!this.selectedFile) return;
    const id = localStorage.getItem('userId');
    if (!id) { this.router.navigate(['/login']); return; }

    const fd = new FormData();
    fd.append('profileImage', this.selectedFile);

    this.isLoading = true;
    this.authService.uploadProfileImage(id, fd).subscribe({
      next: () => {
        this.isLoading = false;
        this.pushAlert('success', 'Profile image uploaded successfully.');
        this.selectedFile = null;
        if (this.fileInput?.nativeElement) this.fileInput.nativeElement.value = '';
        this.loadUserProfile();               // refresh image URL
      },
      error: (e) => {
        this.isLoading = false;
        this.pushAlert('error', e.message || 'Failed to upload image.');
      }
    });
  }

  isFormValid(): boolean {
    if (!this.user.username || !this.user.email) return false;
    if (this.user.password && this.user.password !== this.user.confirmPassword) return false;
    return true;
  }

  onSave(): void {
    if (this.isSaving) return;
    const id = localStorage.getItem('userId');
    if (!id) { this.router.navigate(['/login']); return; }

    const payload: any = { username: this.user.username, email: this.user.email };
    if (this.user.password) payload.password = this.user.password;

    this.isSaving = true;
    this.authService.updateUserProfile(id, payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.pushAlert('success', 'Profile updated successfully.');
      },
      error: (e) => {
        this.isSaving = false;
        this.pushAlert('error', e.message || 'Failed to update profile.');
      }
    });
  }

  get imageUrl(): string {
    if (!this.user?.image || this.user.image.trim() === '') return '/default-avatar.jpeg';
    return `http://localhost:3000/uploads/${this.user.image}`;
  }

  onImageError(event: any) {
    event.target.src = '/default-avatar.jpeg';
  }
}