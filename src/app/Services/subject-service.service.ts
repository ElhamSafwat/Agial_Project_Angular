import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubjectServiceService {

private readonly DB_URL = "http://localhost:56966/api/Subject"
  constructor(private http:HttpClient) { }

  GetAllSubjects(){
    return this.http.get(this.DB_URL);
  }
  AddSubject(subject: { description: string; subject_Name: string; }) {
    return this.http.post(this.DB_URL, subject); 
  }
  GetSubjectByID(id:number){
    return this.http.get(`${this.DB_URL}/${id}`); 
  }
  UpdateSubject(id: number, subject: { description: string; subject_Name: string; }) {
    return this.http.put(`${this.DB_URL}/${id}`, subject);
  }
}
