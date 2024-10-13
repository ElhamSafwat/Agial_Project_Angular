import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { login } from '../Types/login';

@Injectable({
  providedIn: 'root',
})
export class LoginServiceService {
  URL: string = 'http://localhost:56966/api/Account/Login';
  constructor(private http: HttpClient) {}
  add_login(data: login) {
    return this.http.post<any>(this.URL, data);
  }
  //set token in local storage
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  //return token from local storage

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  //remve token from local storage
  logout(): void {
    localStorage.removeItem('token');
  }

  //check if user is logged in by has token
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
