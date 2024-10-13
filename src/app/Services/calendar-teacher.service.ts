import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalendarTeacherService {
  constructor(private http: HttpClient) {}
  url = 'http://localhost:56966/api/TeacheCalendar/';
  //get calendar data for session for teather
  get_teacher_data(id: string, month: number, year: number) {
    return this.http.get(this.url + id + '/' + month + '/' + year);
  }
  //get calendar for student
  get_student_data(id: string, month: number, year: number) {
    return this.http.get(this.url + 'student/' + id + '/' + month + '/' + year);
  }
  //get student for this parent
  getStudentname(id: string) {
    return this.http.get(this.url + 'parent/' + id);
  }
}
