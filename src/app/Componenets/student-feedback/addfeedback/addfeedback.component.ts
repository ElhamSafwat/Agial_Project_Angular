import { Component, OnInit } from '@angular/core';
import { StudentfeedbackService } from '../../../Services/student-teacherfeedback.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { TokenService } from '../../../Services/token-service.service';

@Component({
  selector: 'app-adfeedback',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './addfeedback.component.html',
})
export class AdfeedbackComponent implements OnInit {
  studentId: any = ''; // ID of the logged-in student
  teachers: any[] = []; // List of teachers for the student
  feedbackData = { Teacher_ID: '', Feedback: '' }; // Feedback data
  filteredData: any; // Feedback data to display
  showTable: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  constructor(
    private feedbackService: StudentfeedbackService,
    private rr: Router,
    private location: Location,
    private mytoken: TokenService
  ) {
    this.studentId = this.mytoken.getUserId();
  }
  ngOnInit(): void {
    this.fetchTeachers();
  }
  goBack() {
    this.rr.navigate(['/ShowStudentFeedback']);
  }

  fetchTeachers(): void {
    this.feedbackService.GetTeachersByStudentId(this.studentId).subscribe({
      next: (data) => {
        this.teachers = data;
        console.log(data); // Assign the fetched teachers to the array
      },
      error: (error) => {
        console.error('Error fetching teachers', error);
      },
    });
  }

  // fetchAllFeedback(): void {
  //   this.feedbackService.GetAllFeedback().subscribe({
  //     next: (data) => {
  //       this.filteredData = data; // Set the feedback data to display
  //       this.showTable = true; // Show the table once data is fetched
  //     },
  //     error: (error) => {
  //       console.error('Error fetching feedback', error);
  //     }
  //   });
  // }
  clearErrorMessage(): void {
    this.errorMessage = ''; // إلغاء رسالة الخطأ عند تغيير الإدخال
  }
  submitFeedback(): void {
    if (!this.feedbackData.Teacher_ID) {
      this.errorMessage = 'يرجى اختيار مدرس قبل إرسال الملاحظات.';
      return; // أوقف تنفيذ الدالة
    }
    if (!this.feedbackData.Feedback) {
      this.errorMessage = 'يرجى كتابة الملاحظات قبل الإرسال.';
      return; // أوقف تنفيذ الدالة
    }

    this.feedbackService
      .addFeedback({ Student_ID: this.studentId, ...this.feedbackData })
      .subscribe({
        next: (response) => {
          console.log('Feedback added successfully', response);
          alert("تم ارسال الملاحظات")
          this.rr.navigate(['/ShowStudentFeedback']);
          this.successMessage = 'تم إضافة الملاحظات بنجاح!';
          this.errorMessage = ''; // إلغاء رسالة الخطأ إذا كانت موجودة
          // Refresh feedback list after adding new feedback
          
        },
        error: (error) => {
          console.error('Error adding feedback', error);
          this.errorMessage = 'حدث خطأ أثناء إضافة الملاحظات. حاول مرة أخرى.';
        },
      });
  }
}
