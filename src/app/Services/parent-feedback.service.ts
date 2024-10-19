import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParentFeedbackService {
  private readonly api_url = "http://localhost:56966/api/ParentTeacherFeedback"
  private readonly api_urlserach = "http://localhost:56966/api/ParentTeacherFeedback"
  constructor(private readonly http: HttpClient) { }

  GetAllFeedback() {
    return this.http.get(this.api_url);
  }

  // GetAllFeedbackbyid(id:any){
  // return this.http.get(this.api_url+"/"+id);
  // }

  getFeedbacksByClassInfo(className: string, stage: string, level: number, from = "parent"): Observable<any> {
    return this.http.get(this.api_urlserach + "/" + className + "/" + stage + "/" + level + "/" + from);
  }
}
