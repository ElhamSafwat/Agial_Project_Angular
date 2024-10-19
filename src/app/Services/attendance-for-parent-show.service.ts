import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AttendanceForParentShowService {

  constructor(private http:HttpClient) { }
  getstudentsforparent(parent_id: string) {
    const parent_url = `http://localhost:56966/api/Parent/liststudent/${parent_id}`;
    return this.http.get(parent_url);
  }
  GetAttendanceforParent(studentid:string){
    const url=`http://localhost:56966/api/ShowAttandance/${studentid}`;
    return this.http.get(url);
  }
}
