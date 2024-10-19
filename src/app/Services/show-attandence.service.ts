import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShowAttandenceService {
  constructor(private http: HttpClient) {}
  url = 'http://localhost:56966/api/ShowAttandance/';
  getAllAttendence() {
    return this.http.get(this.url);
  }
  getbyclassname(classname: any, stage: any, level: any, date: any) {
    return this.http.get(
      this.url + classname + '/' + stage + '/' + level + '/' + date
    );
  }
  //by date
  getbydate(date: any, dateto: any) {
    return this.http.get(this.url + date + '/' + dateto);
  }
}
