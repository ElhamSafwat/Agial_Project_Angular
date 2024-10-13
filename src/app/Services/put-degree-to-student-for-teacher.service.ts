import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  PutDegreeForTeacher,
  StudentExam,
} from '../Types/put-degree-for-teacher';

@Injectable({
  providedIn: 'root',
})
export class PutDegreeToStudentForTeacherService {
  private baseUrl = 'http://localhost:56966/api/StudentExamForTeacher';
  private teacherUrl = 'http://localhost:56966/Teacher';
  private studentUrl = 'http://localhost:56966/api/Student';
  constructor(private http: HttpClient) {}
  // Method to POST exam result using PutDegreeForTeacher interface
  insertExamResult(examResult: PutDegreeForTeacher): Observable<any> {
    const url = `${this.baseUrl}/InsertExamResult`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(url, examResult, { headers, responseType: 'text' });
  }
  // Method to GET students by teacher ID
  getStudentsByTeacher(teacherId: string): Observable<ApiResponse> {
    const url = `${this.baseUrl}/students/${teacherId}`;
    return this.http.get<ApiResponse>(url);
  }
  // Method to GET exam details by teacher ID and date
  getExamDetailsByTeacherAndDate(
    teacherId: string,
    date: string
  ): Observable<ApiResponse> {
    const url = `${this.teacherUrl}/${teacherId}/date/${date}`;
    return this.http.get<ApiResponse>(url);
  }
  // Method to GET student exams by exam ID
  getStudentExamsByExamId(examId: number): Observable<StudentExam[]> {
    const url = `${this.baseUrl}/GetStudentExamsByExamId/${examId}`;
    return this.http.get<StudentExam[]>(url);
  }
  // Method to PUT updated degree for a student by studentId, examId, and teacherId
  updateStudentDegree(
    studentId: string,
    examId: number,
    teacherId: string,
    degree: number
  ): Observable<any> {
    const url = `${this.baseUrl}/UpdateStudentDegree/${studentId}/${examId}/${teacherId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put(url, degree, { headers, responseType: 'text' }); // Send degree directly
  }
  // New Method to GET the degree of a student by studentId and examId
  getStudentDegree(
    studentId: string,
    examId: number
  ): Observable<{
    studentName: string; // Add student name
    degree: number; // Current degree of the student
    maxDegree: number; // Maximum degree for the exam
    minDegree: number; // Minimum degree for passing
  }> {
    const url = `${this.baseUrl}/GetStudentDegree/${studentId}/${examId}`;
    return this.http.get<{
      studentName: string;
      degree: number;
      maxDegree: number;
      minDegree: number;
    }>(url);
  }
  getStudentsByClassID(
    classId: number
  ): Observable<{ userID: string; fullName: string }[]> {
    const url = `${this.studentUrl}/${classId}/students`;
    return this.http.get<{ userID: string; fullName: string }[]>(url);
  }
  // New Method to GET ClassID by TeacherID
  getClassIDByTeacherID(
    teacherId: string
  ): Observable<{ classid: number; className: string }[]> {
    const url = `${this.studentUrl}/${teacherId}/teachers`;
    return this.http.get<{ classid: number; className: string }[]>(url);
  }
}
