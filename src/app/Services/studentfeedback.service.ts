import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentfeedbackService {
  private readonly api_url = "http://localhost:56966/api/Student_Teacher_Feedback"
  private readonly api_url_search = "http://localhost:56966/api/Student_Teacher_Feedback/"
  constructor(private readonly http: HttpClient) {

  }
  GetAllFeedback() {
    return this.http.get(this.api_url);
  }

  GetAllFeedbackbyid(id: any) {
    return this.http.get(this.api_url + "/" + id);
  }

  getFeedbacksByClassInfo(className: string, stage: string, level: number): Observable<any> {
    return this.http.get(this.api_url_search + className + "/" + stage + "/" + level);
  }
}
