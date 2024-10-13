import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {
//api link
  private readonly api_url="http://localhost:56966/api/Session";
  private readonly subjects_url = "http://localhost:56966/api/Subject"; // رابط API لجلب المواد
  private readonly teachers_url = "http://localhost:56966/api/Teacher"; // رابط API لجلب المدرسين
  private readonly class_url="http://localhost:56966/api/Class";
  // private readonly editsession_url = "http://localhost:56966/api/Session/int?id=${session.session_ID}";
  constructor(private readonly http:HttpClient) {}

  // handel requests

  // اجيب كل الحصص
 GetAllSessions(){
  return this.http.get(this.api_url);
 }
 // اجيب الحصه بال id 
 GetSessionByID(id:any){
  return this.http.get(this.api_url+"/"+id);
 }
 // اجيب اسم الماده
  GetAllSubjects(){
  return this.http.get<{subject_id:number,subject_Name: string }[]>(this.subjects_url);
 }
 // اجيب اسم المدرس
 GetAllTeachers(){
  return this.http.get<{ teacherId:string,teacherName: string }[]>(this.teachers_url);
 }
  // اجيب اسم المجموعه
  GetAllClasses(){
    return this.http.get<{ classID:string,className: string }[]>(this.class_url);
  }
  // يجيب المدرسين لكل مجموعه
  getTeachersByClass(classID: string) {
    const url = `http://localhost:56966/api/Session/${classID}/teachers`;
    return this.http.get<{ userID: string, fullName: string }[]>(url);
}


 // اضيف ميعاد حصه جديده
 AddSession(sessiondata:any){
  return this.http.post<any>(this.api_url,sessiondata);
 }

EditSession(session: any) {
  const url = `http://localhost:56966/api/Session/int?id=${session.session_ID}`; // استخدام session_ID
  return this.http.put(url, session);
}

DeleteSession(id:number){
  return this.http.delete(this.api_url+"/"+id);
}
Getsessionbyclassname(class_name:string,stage:string,level:number){
  const url=`http://localhost:56966/api/Session/${class_name}/${stage}/${level}`;
  return this.http.get(url);
}
}
