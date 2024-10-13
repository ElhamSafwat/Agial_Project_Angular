import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DegreeForParentService {
  constructor(private http: HttpClient) {}
  getstudentsforparent(parent_id: string) {
    const parent_url = `http://localhost:56966/api/Parent/liststudent/${parent_id}`;
    return this.http.get(parent_url);
  }

  getdegreeExam(stuid: string) {
    return this.http.get(
      `http://localhost:56966/api/StudentExamForTeacher/GetStudentExamsByStudentId/${stuid}`
    );
  }
  getdegraaAssignment(stuid: string) {
    return this.http.get(
      `http://localhost:56966/api/Student/assignmentgrades/${stuid}`
    );
  }
}
