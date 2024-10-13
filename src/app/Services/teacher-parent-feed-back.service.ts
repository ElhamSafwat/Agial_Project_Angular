  import { HttpClient } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
  import { ClassData } from '../Types/parent-teacher-feed-back-data';

  // Define the interface for the feedback data
  export interface TeacherFeedback {
    parentName: string;
    studentName: string;
    date: string;
    feedBack: string;
  }

  @Injectable({
    providedIn: 'root'
  })
  export class TeacherParentFeedBackService {
    private apiUrl = 'http://localhost:56966/api/TeacherParentFeedback/students';
    private apiUrlPost = 'http://localhost:56966/api/TeacherParentFeedback';
    private apiUrlTeacherFeedback = 'http://localhost:56966/api/TeacherParentFeedback/teacher'; // New API URL for teacher feedback

    constructor(private http: HttpClient) { }

    // Get students by teacher ID
    getStudentsByTeacher(teacherId: string): Observable<ClassData[]> {
      return this.http.get<ClassData[]>(`${this.apiUrl}/${teacherId}`);
    }

    // Submit feedback
    submitFeedback(feedbackData: { 
      teacher_ID: string; 
      parent_ID: string; 
      student_ID: string; 
      feedBack: string; 
      feedbackDate: string 
    }): Observable<any> {
      return this.http.post(this.apiUrlPost, feedbackData, { responseType: 'text' }); // Expect plain text response
    }

    // Get feedback by teacher ID
    getFeedbackByTeacher(teacherId: string): Observable<TeacherFeedback[]> {
      return this.http.get<TeacherFeedback[]>(`${this.apiUrlTeacherFeedback}/${teacherId}`);
    }
  }
