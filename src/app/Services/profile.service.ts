import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  url = 'http://localhost:56966/api/Account/';
  constructor(private http: HttpClient) {}
  get_profile(id: string) {
    return this.http.get(this.url + id);
  }
  edit_profile(id: string, data: any) {
    return this.http.put(this.url + id, data);
  }
  change_password(id: string, data: any) {
    return this.http.put(this.url + 'password/' + id, data);
  }
}
