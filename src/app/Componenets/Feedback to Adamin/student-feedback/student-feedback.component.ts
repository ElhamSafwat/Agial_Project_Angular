import { Component, OnInit } from '@angular/core';
import { StudentfeedbackService } from '../../../Services/studentfeedback.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-student-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [StudentfeedbackService],
  templateUrl: './student-feedback.component.html',
})
export class StudentFeedbackComponent implements OnInit {
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
  constructor(
    private myserv: StudentfeedbackService,
    private location: Location
  ) {}

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
              ' فضلك قم بادخال داتا صح حتي اسطيع ارجع لك اراء طلاب علي مدرس تلك مجموعه';
            this.showTable = false;
          },
        });
    } else {
      this.errorMessage = 'ادخل داتا اولا حتي اسطيع البحث';
      this.showTable = false;
    }
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
    this.location.back();
  }

  // Function to fetch feedback data (all feedbacks)
  fetchFeedbackData(): void {
    this.myserv.GetAllFeedback().subscribe({
      next: (data) => {
        this.feedbackData = data;
        // console.log(data);
        this.filteredData = data; // Initialize filteredData with all feedback
        this.showTable = true;
        // Check if data is empty
        //  if (this.filteredData.length === 0) {
        //   this.errorMessage = 'لا توجد بيانات متاحة للعرض.';
        // } else {
        //   this.errorMessage = '';
        // }

        this.showTable = true;
      },
      error: (err) => {
        console.error('Error fetching feedback data:', err);
      },
    });
  }
}
