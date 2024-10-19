import { Component, OnInit } from '@angular/core';
// import { SessionsService } from '../../../services/sessions.service';

import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionsService } from '../../../Services/sessions.service';

@Component({
  selector: 'app-all-sessions',
  standalone: true,
  imports: [RouterModule, NgxPaginationModule, CommonModule, FormsModule],
  providers: [SessionsService],
  templateUrl: './all-sessions.component.html',
  styleUrl: './all-sessions.component.css',
})
export class AllSessionsComponent implements OnInit {
  showAdvancedSearch = false;
  toggleSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }
  className: string = '';
  // stage: string = '';
  // level: number = 0;
  specificDate: string = '';
  fromDate: string = '';
  toDate: string = '';
  p: number = 1;
  sessions: any;
  searchDate: string = '';

  selectedStage: string = '';
  selectedLevel: number = 0;
  levels: string[] = [];

  periods = [
    { value: 'أبتدائي', label: 'أبتدائي' },
    { value: 'أعدادي', label: 'أعدادي' },
    { value: 'ثانوي', label: 'ثانوي' },
  ];

  updateLevels() {
    if (this.selectedStage === 'أبتدائي') {
      this.levels = ['1', '2', '3', '4', '5', '6'];
    } else if (
      this.selectedStage === 'أعدادي' ||
      this.selectedStage === 'ثانوي'
    ) {
      this.levels = ['1', '2', '3'];
    } else {
      this.levels = [];
    }
    this.selectedLevel = 0; // Reset selected level when period changes
  }
  constructor(public myserv: SessionsService) {}
  ngOnInit(): void {
    this.loadSessions();
    this.showAllSessions();
  }
  loadSessions() {
    this.myserv.GetAllSessions().subscribe({
      next: (data) => {
        this.sessions = data;
        this.sortSessions();
        console.log(this.sessions);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  sortSessions() {
    this.sessions.sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime(); // ترتيب من الأحدث إلى الأقدم
    });
  }
  deleteSession(id: number) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذه الجلسة؟')) {
      this.myserv.DeleteSession(id).subscribe({
        next: () => {
          alert('تم حذف الجلسة بنجاح!');
          this.loadSessions();
        },
        error: (error) => {
          console.error('خطأ في حذف الجلسة:', error);
          alert('حدث خطأ أثناء حذف الجلسة. يرجى المحاولة مرة أخرى.');
        },
      });
    }
  }
  // بحث باسم المجموعة والمرحلة والمستوى
  searchByClassStageLevel() {
    // this.searchDate = '';
    // this.fromDate = '';
    // this.toDate = '';
    const stage = this.selectedStage;
    const level = this.selectedLevel;

    if (this.className || stage || level !== null) {
      this.myserv
        .Getsessionbyclassname(this.className, stage, level)
        .subscribe({
          next: (data) => {
            this.sessions = data || []; // تحديث الجلسات
          },
          error: (error) => {
            console.error('خطأ في جلب الجلسات:', error);
            alert(
              `لا توجد حصص لهذه المجموعة: ${this.className}، المرحلة: ${stage}، المستوى: ${level}`
            );
          },
        });
    } else {
      alert('يرجى ملء على الأقل حقل واحد للبحث.');
    }
  }
  searchByDate() {
    // this.fromDate = '';
    // this.toDate = '';
    // this.className = "";
    // this.stage = "";
    // this.level = 0;
    if (this.searchDate) {
      this.filteredSessions; // استخدام الفلتر مباشرة
    } else {
      alert('يرجى إدخال تاريخ.');
    }
  }
  // بحث بفترة
  searchByDateRange() {
    // this.className = "";
    // this.stage = "";
    // this.level = 0;
    // this.searchDate = "";

    // التحقق من وجود تواريخ
    if (this.fromDate || this.toDate) {
      this.filteredSessions; // استخدام الفلتر مباشرة
    } else {
      alert('يرجى إدخال تواريخ.');
    }
  }

  get filteredSessions() {
    if (!this.sessions) {
      return []; // إذا كانت الجلسات غير موجودة، إرجاع مصفوفة فارغة
    }

    return this.sessions.filter((session: { date: string | number | Date }) => {
      const sessionDate = new Date(session.date).getTime();

      // إذا كان هناك تاريخ محدد للبحث
      if (this.searchDate) {
        const exactDate = new Date(this.searchDate).getTime();
        return sessionDate === exactDate;
      }

      // إذا كان هناك فترة محددة للبحث
      if (this.fromDate || this.toDate) {
        const startDate = this.fromDate
          ? new Date(this.fromDate).getTime()
          : -Infinity;
        const endDate = this.toDate
          ? new Date(this.toDate).getTime()
          : Infinity;
        return sessionDate >= startDate && sessionDate <= endDate;
      }

      return true;
    });
  }

  showAllSessions() {
    // this.loadSessions(); // استرجاع جميع الجلسات
    this.searchDate = ''; // إعادة تعيين تاريخ البحث
    this.fromDate = '';
    this.toDate = '';
    this.className = '';
    this.selectedStage = '';
    this.selectedLevel = 0;
    this.loadSessions();
  }
}
