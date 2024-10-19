import { Component, OnInit } from '@angular/core';
import { ExamForAdmin } from '../../Types/exam-for-admin';
import { ExamForAdminService } from '../../Services/exam-for-admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exam-for-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [ExamForAdminService],
  templateUrl: './exam-for-admin.component.html',
  styleUrls: ['./exam-for-admin.component.css']
})
export class ExamForAdminComponent implements OnInit {
  ExamsData: ExamForAdmin[] = [];
  filteredExamsList: ExamForAdmin[] = [];
  
  searchTeacher: string = '';
  searchClass: string = '';
  searchSubject: string = '';
  searchDate: string = '';

  alertMessage: string = '';
  loading: boolean = true;

  // Pagination 
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private myService: ExamForAdminService) {}

  ngOnInit(): void {
    this.myService.GetAllExams().subscribe({
      next: (data: any) => {
        this.ExamsData = data;
        this.filteredExamsList = data;
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      }
    });
  }

  updateFilteredExams() {
    const filtered = this.ExamsData.filter(exam => {
      const teacherMatches = this.searchTeacher
        ? exam.teacher_Name.toLowerCase().includes(this.searchTeacher.toLowerCase())
        : true;

      const classMatches = this.searchClass
        ? exam.class_name.toLowerCase().includes(this.searchClass.toLowerCase())
        : true;

      const subjectMatches = this.searchSubject
        ? exam.subject_name.toLowerCase().includes(this.searchSubject.toLowerCase())
        : true;

      const dateMatches = this.searchDate
        ? new Date(exam.exam_Date).setHours(0, 0, 0, 0) === new Date(this.searchDate).setHours(0, 0, 0, 0)
        : true;

      return teacherMatches && classMatches && subjectMatches && dateMatches;
    });

    this.filteredExamsList = filtered;
    this.currentPage = 1; 

    if (filtered.length === 0) {
      if (this.searchTeacher) {
        this.alertMessage = 'لا يوجد مدرس بهذا الاسم';
      } else if (this.searchClass) {
        this.alertMessage = 'لا يوجد فصل بهذا الاسم';
      } else if (this.searchSubject) {
        this.alertMessage = 'لا توجد ماده بهذا الاسم';
      } else if (this.searchDate) {
        this.alertMessage = 'لا يوجد امتحان في هذا التاريخ';
      } else {
        this.alertMessage = '';
      }
    } else {
      this.alertMessage = '';
    }
  }

  // Pagination methods
  paginatedExams(): ExamForAdmin[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredExamsList.slice(start, end);
  }

  totalPages(): number {
    return Math.ceil(this.filteredExamsList.length / this.itemsPerPage);
  }

  totalPagesArray(): number[] {
    return Array(this.totalPages()).fill(0).map((x, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }
}
