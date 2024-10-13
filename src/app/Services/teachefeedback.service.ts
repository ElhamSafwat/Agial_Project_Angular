import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherFeedbackService {
  private readonly api_url = "http://localhost:56966/api/TeacherParentFeedback";  // API URL
  private readonly api_url_search = "http://localhost:56966/api/ParentTeacherFeedback";  // API URL


  constructor(private readonly http: HttpClient) { }

  // Fetch all feedback data
  GetAllFeedback(): Observable<any> {
    return this.http.get(this.api_url);
  }

  // Fetch feedback data by specific class info (className, stage, level)
  getFeedbacksByClassInfo(className: string, stage: string, level: number,from="Teacher"): Observable<any> {
    return this.http.get(this.api_url_search+"/"+className+"/"+ stage+"/"+level+"/"+from)
  }


}
