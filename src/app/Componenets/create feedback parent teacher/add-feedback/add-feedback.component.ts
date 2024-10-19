import { Component, OnInit } from '@angular/core';
import { ParentteacherfeedbackServiseService } from '../../../Services/parentteacherfeedback-servise.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../Services/token-service.service';

@Component({
  selector: 'app-add-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [TokenService],
  templateUrl: './add-feedback.component.html',
  styles: [],
})
export class AddFeedbackComponent implements OnInit {
  userid: any;
  feedback = {
    teacher_ID: '',
    parent_ID: '',
    student_ID: '',
    feedBack: '',
    feedbackDate: '',
  };

  Studentfromparent: any;
  Teacherstudent: any;

  constructor(
    public myserve: ParentteacherfeedbackServiseService,
    public route: Router,
    private mytoken: TokenService
  ) {
    this.userid = this.mytoken.getUserId();
  }

  ngOnInit(): void {
    this.feedback.feedbackDate = this.getCurrentDate();
    this.feedback.parent_ID = this.userid;
    this.myserve.GetStudentfromparent(this.feedback.parent_ID).subscribe({
      next: (data) => {
        this.Studentfromparent = data;
        console.log(this.Studentfromparent);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  AddFeedback(feedback: any) {
    console.log(feedback);

    this.myserve.AddFeedback(feedback).subscribe({
      next: () => {
        this.route.navigate(['/GEtYourFeedback']);
      },
      error: (err) => {
        console.error(err);
        alert('حدث خطأ أثناء إضافة الملاحظات.');
      },
    });
  }

  getCurrentDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // يناير هو 0!
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`; // التنسيق: YYYY-MM-DD
  }

  onStudentChange(studentId: string) {
    this.myserve.GetTeacherstudent(studentId).subscribe({
      next: (data) => {
        this.Teacherstudent = data;
        console.log(this.Teacherstudent);
      },
      error: (err) => {
        console.error(err);
        alert('لا يوجد معلمين لهذا الطالب ');
      },
    });
  }
}
