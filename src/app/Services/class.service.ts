import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  url_getstudent = 'http://localhost:56966/api/Class/students/';
  url_getteacher = 'http://localhost:56966/api/Class/teachers/';
  url_createclass = 'http://localhost:56966/api/Class';
  url_getall = 'http://localhost:56966/api/Class';
  url_delete = 'http://localhost:56966/api/Class/';
  url_for_get = 'http://localhost:56966/api/Class/GETClass/';
  url_edit = 'http://localhost:56966/api/Class/EditClass/';

  constructor(private http: HttpClient) {}

  //get student
  getStudent(stage: string, level: number) {
    return this.http.get(this.url_getstudent + stage + '/' + level);
  }
  //get teacher
  getTeacher(stage: string) {
    return this.http.get(this.url_getteacher + stage);
  }

  //create class
  createClass(data: any) {
    return this.http.post(this.url_createclass, data);
  }

  //get All classes
  GetAll() {
    return this.http.get(this.url_getall);
  }

  //delet
  delete(id: number) {
    return this.http.delete(this.url_delete + id);
  }

  //edite
  edit(id: number, data: any) {
    return this.http.put(this.url_edit + id, data);
  }

  //getbyid
  getbyid(id: number) {
    return this.http.get(this.url_getall + '/' + id);
  }
  getClass(id: number) {
    return this.http.get(this.url_for_get + id);
  }
}
