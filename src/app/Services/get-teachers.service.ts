import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetTeachersService {
  //1
  private GetTeacherURL="http://localhost:56966/api/Teacher"

  constructor(private http:HttpClient) {
   }

  //2 Handel all req
  GetTeachers()
  {
    return this.http.get(this.GetTeacherURL)
  }

  AddTeacher(Data:any)
  {
    return this.http.post(this.GetTeacherURL+"/AddTeacher",Data)
  }

 

  deleteTeacter(teacherId: any) {
    return this.http.delete(this.GetTeacherURL+"/DeleteTeacher/"+teacherId);
  }

  Getsubject()
  {
    return this.http.get("http://localhost:56966/api/Subject")

  }

  

}
