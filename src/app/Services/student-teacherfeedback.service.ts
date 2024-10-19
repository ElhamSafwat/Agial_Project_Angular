import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentfeedbackService {
  private readonly api_url =
    'http://localhost:56966/api/Student_Teacher_Feedback';
  private readonly api_url_search =
    'http://localhost:56966/api/Student_Teacher_Feedback/';
  private readonly api_url_teacherforstudent =
    ' http://localhost:56966/api/Student/teachers/';
  private readonly api_url_student_id =
    'http://localhost:56966/api/Student_Teacher_Feedback/get-feedbacks-by-student/';

  constructor(private readonly http: HttpClient) {}
  GetAllFeedback() {
    return this.http.get(this.api_url);
  }

  GetAllFeedbackbyid(id: any) {
    return this.http.get(this.api_url_student_id + id);
  }

  getFeedbacksByClassInfo(
    className: string,
    stage: string,
    level: number
  ): Observable<any> {
    return this.http.get(
      this.api_url_search + className + '/' + stage + '/' + level
    );
  }

  // Retrieve teachers for a specific student
  GetTeachersByStudentId(studentId: string): Observable<any> {
    return this.http.get(this.api_url_teacherforstudent + studentId);
  }

  // Submit feedback
  addFeedback(feedbackData: any): Observable<any> {
    return this.http.post(`${this.api_url}/add-feedback`, feedbackData);
  }
}
