import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParentFeedbackService } from '../../../Services/parent-feedback.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-parent-feedback',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './parent-feedback.component.html',
})
export class ParentFeedbackComponent implements OnInit {
  feedbackData: any; // جميع البيانات التي تم جلبها من السيرفر
  filteredFeedbackData: any; // البيانات المفلترة
  showTable: boolean = false;
  className: string = '';
  stage: string = '';
  level: number = 1;

  parentname: string = '';
  parentNotFound: boolean = false;

  errorMessage: string = '';
  parentNameFilter: string = '';
  availableLevels: number[] = [];
  userData = {
    stage: '',
    level: null,
  };
  from = 'parent'; // حقل لتخزين اسم الأب المستخدم في الفلترة

  constructor(
    private myserv: ParentFeedbackService,
    private location: Location
  ) {}

  ngOnInit(): void {}
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
  // دالة لجلب جميع البيانات
  fetchFeedbackData(): void {
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

  // دالة لتصفية البيانات بناءً على اسم الأب المدخل
  // filterByParentName(): void {
  //   if (this.parentNameFilter) {
  //     this.filteredFeedbackData = this.filteredFeedbackData.filter((feedback: { parent_Name: string }) =>
  //       feedback.parent_Name.toUpperCase().toLowerCase().includes(this.parentNameFilter.toLowerCase())
  //     );

  //     if (this.filteredFeedbackData.length === 0) {
  //       this.errorMessage = 'لا توجد نتائج مطابقة لهذا الاسم';
  //     } else {
  //       this.errorMessage = '';
  //     }
  //   } else {
  //     this.filteredFeedbackData = this.feedbackData; // إذا لم يتم إدخال أي فلتر، عرض جميع البيانات
  //     this.errorMessage = '';
  //   }
  // }
  //   filterByParentName(): void {
  // console.log(this.parentname)
  //     if (this.filteredFeedbackData && this.filteredFeedbackData.length > 0) { // Ensure there is data to filter
  //       if (this.parentname.trim()) {
  //         this.filteredFeedbackData = this.filteredFeedbackData.filter((feedback: { parentname: string }) =>
  //           feedback.parentname.toLowerCase().includes(this.parentname.toLowerCase())
  //         );
  // console.log(this.parentname )
  //         // Show warning if no student found
  //         this.parentNotFound = this.filteredFeedbackData.length === 0;
  //       } else {
  //         this.filteredFeedbackData = [...this.feedbackData]; // Reset to all data if no search input
  //         this.parentNotFound = false; // Reset studentNotFound flag
  //       }
  //     }
  //   }
  filterByParentName(): void {
    console.log(this.parentname);

    // Reset filtered data to full data set if input is empty
    if (!this.parentname.trim()) {
      this.filteredFeedbackData = [...this.feedbackData];
      this.parentNotFound = false; // Hide warning message
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
            .includes(this.parentname.toLowerCase())
      );

      console.log(this.filteredFeedbackData);

      // Show warning if no data is found
      this.parentNotFound = this.filteredFeedbackData.length === 0;
    }
  }

  goBack() {
    this.location.back();
  }
  searchFeedbacks() {
    // console.log(this.className)
    // console.log(this.userData.stage)
    // console.log(this.userData.level)
    if (
      this.className &&
      this.userData.stage &&
      this.userData.level !== null &&
      this.from == 'parent'
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

            this.showTable = true;
          },
          error: (error) => {
            this.errorMessage =
              error.error.massege ||
              'من فضلك قم بادخال داتا صح حتي اسطيع إرجاع الاراء علي تلك مجموعه';
            this.showTable = false;
            console.log(error);
          },
        });
    } else {
      this.errorMessage = 'ممكن تتدخل اسم الفصل والمرحلة والمستوي.';
      this.showTable = false;
    }
  }
}
