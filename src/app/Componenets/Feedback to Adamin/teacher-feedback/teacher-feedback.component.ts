import { Component } from '@angular/core';
import { TeacherFeedbackService } from '../../../Services/teachefeedback.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-teacher-feedback',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './teacher-feedback.component.html',
  styleUrl: './teacher-feedback.component.css',
})
export class TeacherFeedbackComponent {
  feedbackData: any; // جميع البيانات التي تم جلبها من السيرفر
  filteredFeedbackData: any; // البيانات المفلترة
  showTable: boolean = false;
  className: string = '';
  stage: string = '';
  level: number = 1;
  displaycolumn: boolean = false;

  teacherName: string = '';
  teacherNotFound: boolean = false;

  errorMessage: string = '';
  teachertNameFilter: string = '';
  availableLevels: number[] = [];
  userData = {
    stage: '',
    level: 1,
  };
  from = 'Teacher';
  originalData: any[] = []; // حقل لتخزين اسم الأب المستخدم في الفلترة

  constructor(
    private myserv: TeacherFeedbackService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.originalData = [...this.filteredFeedbackData];
  }

  // Fetch all feedback data from the API
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
    this.userData.level = 1;
  }
  // دالة لجلب جميع البيانات
  fetchFeedbackData(): void {
    this.displaycolumn = false;
    this.myserv.GetAllFeedback().subscribe({
      next: (data) => {
        console.log(data);
        this.feedbackData = data;
        this.filteredFeedbackData = data;
        this.showTable = true;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Error fetching feedback data:', err);
        this.errorMessage = 'حدث خطأ أثناء جلب البيانات.';
        this.showTable = false;
      },
    });
  }

  // Function to filter feedbacks by teacher name
  // filterFeedbackByTeacher(): void {
  //   if (this.teacherName) {
  //     this.filteredFeedbackData = this.feedbackData.filter(feedback =>
  //       feedback.teacherName.toLowerCase().includes(this.teacherName.toLowerCase())
  //     );

  //     if (this.filteredFeedbackData.length === 0) {
  //       this.errorMessage = 'لم يتم العثور على أراء للمعلم المدخل.';
  //     } else {
  //       this.errorMessage = '';
  //     }
  //   } else {
  //     // Reset to all data if no input is provided
  //     this.filteredFeedbackData = this.feedbackData;
  //     this.errorMessage = '';
  //   }
  filterFeedbackByTeacher(): void {
    // Reset filtered data to full data set if input is empty
    if (!this.teacherName.trim()) {
      this.filteredFeedbackData = [...this.feedbackData];
      this.teacherNotFound = false; // Hide warning message
      return; // Exit the function early
    }

    // Ensure there's data to filter and input to search
    if (this.feedbackData && this.feedbackData.length > 0) {
      this.filteredFeedbackData = this.feedbackData.filter(
        (feedback: { parentname: string }) =>
          feedback.parentname &&
          feedback.parentname
            .toUpperCase()
            .toLowerCase()
            .includes(this.teacherName.toLowerCase())
      );

      console.log(this.filteredFeedbackData);

      // Show warning if no data is found
      this.teacherNotFound = this.filteredFeedbackData.length === 0;
    }
  }

  searchFeedbacks() {
    // console.log(this.className)
    // console.log(this.userData.stage)
    // console.log(this.userData.level)
    this.displaycolumn = true;
    if (
      this.className &&
      this.userData.stage &&
      this.userData.level !== null &&
      this.from == 'Teacher'
    ) {
      this.myserv
        .getFeedbacksByClassInfo(
          this.className,
          this.userData.stage,
          this.userData.level,
          this.from
        )
        .subscribe({
          next: (data) => {
            this.feedbackData = data;
            console.log(data);
            this.filteredFeedbackData = data; // Initialize filteredData with all feedback
            this.showTable = true;
            this.errorMessage = '';

            // // Check if data is empty
            // if (this.filteredFeedbackData.length === 0) {
            //   this.errorMessage = 'لا توجد بيانات متاحة للعرض.';
            // } else {
            //   this.errorMessage = '';
            // }
          },
          error: (error) => {
            this.errorMessage =
              error.error.massege ||
              'قم بختيار اسم مجموعه مع مستوي ومرحله صح حتي تسطيع ارجاع داتا';
            this.showTable = false;
          },
        });
    } else {
      this.errorMessage = 'ممكن تدخل البيانات في اسم الفصل والمرحلة والمستوي';
      this.showTable = false;
    }
  }
  goBack() {
    this.location.back();
  }
}
