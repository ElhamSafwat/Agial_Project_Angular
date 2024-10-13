import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  //Task2

  private GetTeacherURL2 = 'http://localhost:56966/api/Exam';

  constructor(private http: HttpClient) {}

  GetExam() {
    return this.http.get(this.GetTeacherURL2);
  }

  AddExam(Data: any) {
    return this.http.post(this.GetTeacherURL2, Data);
  }

  Getsubject() {
    return this.http.get('http://localhost:56966/api/Subject');
  }

  GetClass() {
    return this.http.get('http://localhost:56966/api/Class');
  }
  Getteacher() {
    return this.http.get('http://localhost:56966/api/Teacher');
  }

  deleteExam(Examid: any) {
    return this.http.delete('http://localhost:56966/api/Exam/' + Examid);
  }

  Getclassbyid(teacherId: string) {
    const url = `http://localhost:56966/api/teacher_Classes/${teacherId}/classes`;
    return this.http.get(url);
  }

  UpdateExam(Examid: any, Data: any) {
    return this.http.put('http://localhost:56966/api/Exam/' + Examid, Data);
  }

  getbyExamid(Examid: string) {
    return this.http.get('http://localhost:56966/id/' + Examid);
  }
  GetExamByid(teacherid: any) {
    return this.http.get('http://localhost:56966/Teacher/' + teacherid);
  }
}
