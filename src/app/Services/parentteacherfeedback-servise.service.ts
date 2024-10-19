import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParentteacherfeedbackServiseService {

  constructor(private http:HttpClient) { }
  private  Feedbackparent="http://localhost:56966/api/"

  GetFeedbackParentbyid(parentid:any)
  {
    return this.http.get(this.Feedbackparent+"ParentTeacherFeedback/parent/"+parentid)
  }

  AddFeedback(Data:any)
  {
    return this.http.post(this.Feedbackparent+"ParentTeacherFeedback",Data)
  }

  GetStudentfromparent(parentid:any)
  {
    return this.http.get("http://localhost:56966/api/Parent/liststudent/"+parentid)
  }

  GetTeacherstudent(teacherid:any)
  {
    return this.http.get("http://localhost:56966/api/StudentClass/GetTeachersByStudent/"+teacherid)
  }






}
