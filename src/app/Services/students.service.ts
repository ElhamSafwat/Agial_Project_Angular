import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../Componenets/Students/add-student/add-student.component';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private readonly DB_URL = 'http://localhost:56966/api/student';
  private readonly ParentURL = 'http://localhost:56966/api/Parent';

  constructor(private http: HttpClient) {}
  getStudents() {
    return this.http.get(this.DB_URL);
  }
  // Delete a student
  deleteStudent(id: string) {
    return this.http.delete(`${this.DB_URL}/${id}`);
  }
  // Get all Parents
  getParents() {
    return this.http.get(this.ParentURL);
  }
  // Add a new student
  addStudent(student: Student) {
    return this.http.post(this.DB_URL, student);
  }
  // Get a student by ID
  getStudentById(id: string) {
    return this.http.get(`${this.DB_URL}/${id}`);
  }
  // Update an existing student
  updateStudent(student: any) {
    return this.http.put(`${this.DB_URL}/${student.student_Id}`, student);
  }
  // EditSession(session: any) {
  //   const url = `http://localhost:56966/api/Session/int?id=${session.session_ID}`; // استخدام session_ID
  //   return this.http.put(url, session);
  // }
}
