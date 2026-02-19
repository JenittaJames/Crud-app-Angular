import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Profile } from '../store/user';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  register(user: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user)
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
  }



  fetchUserProfile(userId: string): Observable<Profile> {
    return this.http
      .get<Profile>(`${this.apiUrl}/profile?id=${userId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((profile) => {
          if (!profile) {
            throw new Error('No profile found for the user');
          }
          return profile;
        }),
        catchError(this.handleError)
      );
  }



  uploadProfileImage(userId: string, formData: FormData): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/upload-image?id=${userId}`,
      formData,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }





  updateUserProfile(userId: string, data: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/profile?id=${userId}`,
      data,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }







  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred. Please try again.';
    if (error.status === 401) {
      errorMessage = 'Unauthorized. Please log in again.';
    } else if (error.status === 404) {
      errorMessage = 'Profile not found.';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    }
    console.error('Error details:', error);
    return throwError(() => new Error(errorMessage));
  }



  get LoggedIn() {
    if (localStorage.getItem('adminToken')) {
      return true;
    } else {
      return false
    }
  }






  isAdminLoggedIn() {
    return !!localStorage.getItem('token');
  }




  loginAdmin(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/login`, credentials);
  }


  // fetchAllUsers(): Observable<User[]> {
  //   return this.http.get<User[]>(`${this.apiUrl}/fetchUsers`)
  // }


  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/fetchUsers`);
  }


  createUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/create`, userData)
  }

  updateUser(userData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/admin/update`, userData)
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/delete?id=${id}`)
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/user/${id}`);
  }


}