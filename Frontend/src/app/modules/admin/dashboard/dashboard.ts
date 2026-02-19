import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, RouterModule } from '@angular/router';
import { AdminHeader } from '../header/header';
import { CommonModule } from '@angular/common';
import { loadUsers } from '../../../store/adminUser/users.actions';
import { selectAllUsers, selectLoading } from '../../../store/adminUser/users.selectors';
import { User } from '../../../models/user.interface';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, AdminHeader, CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  constructor(private authService: AuthService) {

  }

  searchQuery: string = '';
  filteredUsers: User[] = [];
  users: User[] = [];

  private store = inject(Store);
  usersSignal = signal<User[]>([]);
  loadingSignal = signal<boolean>(false);
  user: any;

  ngOnInit() {
    this.store.dispatch(loadUsers());
    this.store.select(selectAllUsers).subscribe(users => {
      this.usersSignal.set(users);
      this.users = users;
      this.filteredUsers = users
    });
    this.store.select(selectLoading).subscribe(loading => this.loadingSignal.set(loading));
  }



  onDeleteUser(id: string) {
    if (confirm('Are You Sure!')) {
      this.authService.deleteUser(id).subscribe({
        next: (response: any) => {
          alert(response.message);
          this.store.dispatch(loadUsers());
        },
        error: (error: any) => {
          alert(error);
        }
      });
    }
  }



  filterUsers() {
    const query = this.searchQuery.toLowerCase().trim();

    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user._id.toLowerCase().includes(query)
    );
  }

}
