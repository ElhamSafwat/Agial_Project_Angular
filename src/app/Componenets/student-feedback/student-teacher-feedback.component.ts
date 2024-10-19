import { Component, OnInit } from '@angular/core';
import { StudentfeedbackService } from '../../Services/student-teacherfeedback.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../Services/token-service.service';
@Component({
  selector: 'app-student-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [StudentfeedbackService],
  templateUrl: './student-teacher-feedback.component.html',
})
export class StudentTeacherFeedbackComponent implements OnInit {
  userid: any = '';
  feedbackData: any; // Ensure it's an array
  filteredData: any; // Ensure it's an array
  showTable: boolean = false;
  className: string = '';
  stage: string = '';
  level: number = 1;
  errorMessage: string = '';
  studentName: string = ''; // Student name for filtering
  studentNotFound: boolean = false; // Variable to track if student is not found
  availableLevels: number[] = [];
  userData = {
    stage: '',
    level: null,
  };
  originalData: any[] = [];
  isLoading: boolean = false;
  constructor(
    private myserv: StudentfeedbackService,
    private location: Location,
    private rr: Router,
    private mytoken: TokenService
  ) {
    this.userid = this.mytoken.getUserId();
  }

  ngOnInit(): void {
    this.originalData = [...this.filteredData];
  }
  updateLevelOptions() {
    if (this.userData.stage === 'أبتدائي') {
      this.availableLevels = [1, 2, 3, 4, 5, 6];
    } else if (this.userData.stage === 'أعدادي') {
      this.availableLevels = [1, 2, 3];
    } else if (this.userData.stage === 'ثانوي') {
      this.availableLevels = [1, 2, 3];
    } else {
      this.availableLevels = [];
    }
    // Reset the selected level if the stage changes
    this.userData.level = null;
  }
  searchFeedbacks() {
    // console.log(this.className)
    // console.log(this.userData.stage)
    // console.log(this.userData.level)
    if (this.className && this.userData.stage && this.userData.level !== null) {
      this.myserv
        .getFeedbacksByClassInfo(
          this.className,
          this.userData.stage,
          this.userData.level
        )
        .subscribe({
          next: (data) => {
            this.feedbackData = data;
            console.log(data);
            this.filteredData = data; // Initialize filteredData with all feedback
            this.showTable = true;
            this.errorMessage = '';

            // تفريغ حقل اسم الفصل بعد البحث
            // this.className = '';  // تفريغ حقل اسم الفصل
            // this.userData.stage = '';      // تفريغ حقل المرحلة
            // this.userData.level = null;    // تفريغ حقل المستوى
          },
          error: (error) => {
            this.errorMessage =
              error.error ||
              'No feedbacks found for the specified class, stage, and level.';
            this.showTable = false;
          },
        });
    } else {
      this.errorMessage = 'Please provide class name, stage, and level.';
      this.showTable = false;
    }
  }
  onSubmitFeedback() {
    this.myserv.addFeedback(this.feedbackData).subscribe({
      next: (response) => {
        console.log('Feedback submitted successfully', response);

        // Show success message
        alert('Feedback submitted successfully!');

        // Reset the form
        this.feedbackData = {
          Teacher_ID: '',
          Feedback: '',
        };

        // Optionally, navigate to a different page or reload data
        // this.router.navigate(['/feedback-list']); // Example of redirecting to a feedback list page
      },
      error: (error) => {
        console.error('Error submitting feedback', error);

        // Handle error, show feedback to the user
        if (error.status === 400) {
          alert(
            'Bad request: Please ensure the teacher and student IDs are correct.'
          );
        } else if (error.status === 401) {
          alert('Unauthorized: Please log in first.');
        } else if (error.status === 500) {
          alert('Server error: Please try again later.');
        } else {
          alert('Error submitting feedback: ' + error.message);
        }
      },
    });
  }
  // Function to filter data by student's name
  filterFeedbackByStudentName(): void {
    if (!this.studentName.trim()) {
      this.filteredData = [...this.feedbackData];
      this.studentNotFound = false; // Hide warning message
      return; // Exit the function early
    }
    if (this.filteredData && this.filteredData.length > 0) {
      // Ensure there is data to filter
      if (this.studentName.trim()) {
        this.filteredData = this.filteredData.filter(
          (feedback: { studentName: string }) =>
            feedback.studentName
              .toUpperCase()
              .toLowerCase()
              .includes(this.studentName.toLowerCase())
        );

        // Show warning if no student found
        this.studentNotFound = this.filteredData.length === 0;
      } else {
        // this.filteredData = [...this.filteredData];
        // Reset to all data if no search input
        this.filteredData = [...this.originalData];
        this.studentNotFound = false;
        // Reset studentNotFound flag
      }
    }
  }

  goBack() {
    this.rr.navigate(['/HomeStudent']);
  }

  // Function to fetch feedback data (all feedbacks)
  fetchFeedbackData(): void {
    this.isLoading = true;
    this.myserv.GetAllFeedbackbyid(this.userid).subscribe({
      next: (data) => {
        this.feedbackData = data;
        // console.log(data);
        this.filteredData = data; // Initialize filteredData with all feedback
        this.showTable = true;
        this.isLoading = false;
        // Check if data is empty
        //  if (this.filteredData.length === 0) {
        //   this.errorMessage = 'لا توجد بيانات متاحة للعرض.';
        // } else {
        //   this.errorMessage = '';
        // }
      },
      error: (err) => {
        console.error('Error fetching feedback data:', err);
        this.isLoading = false;
      },
    });
  }
}
