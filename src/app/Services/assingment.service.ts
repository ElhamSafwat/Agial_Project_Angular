import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Session } from '../Componenets/Assignment/attendance/attendance.component';

@Injectable({
  providedIn: 'root',
})
export class AssingmentService {
  private readonly assignment_Url = `http://localhost:56966/api/Assignment`;
  private readonly attendance_url = `http://localhost:56966/api/Attendance`;
  constructor(private readonly http: HttpClient) {}

  // get all classes for one teacher
  GetClassesForTeacher(techID: string) {
    const classTeah_url = `http://localhost:56966/api/Student/${techID}/teachers`;
    return this.http.get(classTeah_url);
  }
  // get all students for one class
  GetStudentsForClass(classid: number) {
    const studClass_url = `http://localhost:56966/api/Student/${classid}/students`;
    return this.http.get(studClass_url);
  }
  getAssignmentsByDate(data: any) {
    const assdate_url = `http://localhost:56966/api/Assignment/ByDate/${data}`;
    return this.http.get(assdate_url);
  }
  // اجيب كل الحصص
  GetAllSessions() {
    return this.http.get<Session[]>('http://localhost:56966/api/Session');
  }

  // اضافه اسيمنت
  createAssignment(sessionId: number, assignment: string) {
    const params = new HttpParams().set('assignment', assignment);
    return this.http.post(
      `${this.assignment_Url}/AddAssignmentToSession/${sessionId}`,
      null,
      { params }
    );
  }

  // اجيب اسيمنت
  getAllAssignments() {
    return this.http.get('http://localhost:56966/api/Assignment');
  }
  // اضافه درجه للاسيمنت
  addStudentGrade(data: any) {
    return this.http.post(`${this.assignment_Url}/AddStudentDegree`, data);
  }

  addAttendance(data: any) {
    return this.http.post(`${this.attendance_url}/RecordAttendance/`, data);
  }
}
