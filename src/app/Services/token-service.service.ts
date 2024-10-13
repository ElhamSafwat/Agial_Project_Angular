import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  //decoding token
  getTokenClaims() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded; //retern token
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getRole(): string | null {
    const myClamis = this.getTokenClaims();
    const role =
      myClamis['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return role;
  }
  getUserId(): string | null {
    const myClamis = this.getTokenClaims();
    const userid =
      myClamis[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ];

    return userid;
  }

  getUsername(): string | null {
    const myClamis = this.getTokenClaims();
    const username =
      myClamis['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

    return username;
  }
}
