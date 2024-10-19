import { Component, OnInit } from '@angular/core';
import { ClassData } from '../../Types/parent-teacher-feed-back-data';
import { TeacherParentFeedBackService } from '../../Services/teacher-parent-feed-back.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../Services/token-service.service';

export interface TeacherFeedback {
  parentName: string;
  studentName: string;
  date: string;
  feedBack: string;
}

@Component({
  selector: 'app-teacher-parent-feed-back',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [TeacherParentFeedBackService, TokenService],
  templateUrl: './teacher-parent-feed-back.component.html',
  styleUrls: ['./teacher-parent-feed-back.component.css'],
})
export class TeacherParentFeedBackComponent implements OnInit {
  teacherId: any;
  studentsData: ClassData[] = [];
  selectedStudentId: string = '';
  selectedParentId: string = '';
  selectedParentName: string = '';
  teacherFeedback: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  feedbackData: TeacherFeedback[] = [];
  showFeedbackTable: boolean = false;
  searchParentName: string = '';
  searchStudentName: string = '';
  searchDate: string = '';
  filteredFeedbackData: TeacherFeedback[] = [];

  constructor(
    private myService: TeacherParentFeedBackService,
    private mytoken: TokenService
  ) {
    this.teacherId = this.mytoken.getUserId();
    console.log(this.teacherId);
  }

  ngOnInit(): void {
    console.log(this.teacherId);
    this.myService.getStudentsByTeacher(this.teacherId).subscribe({
      next: (data) => {
        this.studentsData = data;
      },
      error: (error) => {
        console.error('Error fetching students:', error);
      },
    });
  }
  onStudentSelect(studentId: string): void {
    this.selectedStudentId = studentId;
    this.errorMessage = '';
    for (const classData of this.studentsData) {
      for (const parent of classData.parentsWithStudents) {
        const student = parent.students.find((s) => s.studentId === studentId);
        if (student) {
          this.selectedParentId = parent.parentId;
          this.selectedParentName = parent.parentName;
          break;
        }
      }
    }
  }
  onFeedbackChange(): void {
    this.errorMessage = '';
  }
  submitFeedback(): void {
    if (!this.selectedStudentId || !this.teacherFeedback.trim()) {
      this.errorMessage = 'برجاء تحديد الطالب وكتابة بيانات الرأي.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    const feedbackData = {
      teacher_ID: this.teacherId,
      parent_ID: this.selectedParentId,
      student_ID: this.selectedStudentId,
      feedBack: this.teacherFeedback,
      feedbackDate: new Date().toISOString(),
    };

    this.myService.submitFeedback(feedbackData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = `تم إرسال الرأي بنجاح إلى ${this.selectedParentName}`;

        setTimeout(() => {
          this.successMessage = '';
          this.teacherFeedback = '';
          this.selectedStudentId = '';
          this.selectedParentId = '';
          this.selectedParentName = '';
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error submitting feedback:', error);
      },
    });
  }

  loadFeedback(): void {
    this.myService.getFeedbackByTeacher(this.teacherId).subscribe({
      next: (data) => {
        this.feedbackData = data;
        this.filteredFeedbackData = data;
        this.showFeedbackTable = true;
      },
      error: (error) => {
        console.error('Error fetching feedback:', error);
      },
    });
  }
  filterFeedback(): void {
    this.filteredFeedbackData = this.feedbackData.filter((feedback) => {
      const matchesParentName = feedback.parentName
        .toLowerCase()
        .includes(this.searchParentName.toLowerCase());
      const matchesStudentName = feedback.studentName
        .toLowerCase()
        .includes(this.searchStudentName.toLowerCase());

      const searchDateObj = new Date(this.searchDate);
      const isValidDate = !isNaN(searchDateObj.getTime());
      const feedbackDate = new Date(feedback.date);
      const matchesDate =
        this.searchDate && isValidDate
          ? feedbackDate.toDateString() === searchDateObj.toDateString()
          : true;

      return matchesParentName && matchesStudentName && matchesDate;
    });

    if (this.filteredFeedbackData.length === 0) {
      this.errorMessage = 'نتيجة البحث غير موجودة.';
    } else {
      this.errorMessage = '';
    }
  }

  closeFeedbackTable(): void {
    this.showFeedbackTable = false;
  }
}
