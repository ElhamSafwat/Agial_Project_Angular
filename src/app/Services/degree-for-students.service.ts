import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DegreeForStudentsService {
  private readonly dExamS_url =
    'http://localhost:56966/api/StudentExamForTeacher/GetStudentExamsByStudentId/';
  private readonly assignment_url =
    'http://localhost:56966/api/Student/unsubmittedassignments/';
  private readonly asDegree_url =
    'http://localhost:56966/api/Student/assignmentgrades/';
  constructor(private http: HttpClient) {}

  getdegreeExam(id: any) {
    return this.http.get(this.dExamS_url + id);
  }

  getdegraaAssignment(id: any) {
    return this.http.get(this.asDegree_url + id);
  }
  getassignmentforstud(id: any) {
    return this.http.get(this.assignment_url + id);
  }
}
