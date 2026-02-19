import { Component } from '@angular/core';
import { AdminHeader } from '../header/header';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-user',
  imports: [AdminHeader, RouterLink, CommonModule, FormsModule],
  templateUrl: './update-user.html',
  styleUrl: './update-user.css'
})
export class UpdateUser {
  userData: any = {};
  userId!: string;


  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.userId = this.route.snapshot.paramMap.get('id') as string;

    if (!this.userId) {
      console.error('No User ID found in route!');
      return;
    }

    this.authService.getUserById(this.userId).subscribe({
      next: (res) => {
        this.userData = res.user;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onUpdateUser() {
    console.log(this.userData);
  this.authService.updateUser(this.userData).subscribe({
    next: (res) => alert(res.message),
    error: (err) => console.log(err)
  });
}



}
