import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})

export class ExamForAdminService {
private readonly DB_URL = "http://localhost:56966/api/Exam"
  constructor(private http:HttpClient) {}
  GetAllExams(){
    return this.http.get(this.DB_URL)
  }
}
