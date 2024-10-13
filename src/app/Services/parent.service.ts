import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ParentService {
  URL = 'http://localhost:56966/api/Parent';
  constructor(private http: HttpClient) {}
  //add
  add_parent(addparents: any) {
    return this.http.post(this.URL + '/' + 'AddParent', addparents);
  }
  //get_all
  get_all() {
    return this.http.get(this.URL);
  }
  getbyid(id: string) {
    return this.http.get(this.URL + '/' + id);
  }

  updata(id: string, data: any) {
    return this.http.put(this.URL + '/' + id, data);
  }
  delete(id: string) {
    return this.http.delete(this.URL + '/' + id);
  }
  getbyName(name: string) {
    return this.http.get(this.URL + '/byname/' + name);
  }
}
