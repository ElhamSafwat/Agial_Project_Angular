import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SessionsService } from '../../../Services/sessions.service';
// import { SessionsService } from 'Services/sessions.service.ts';

@Component({
  selector: 'app-add-sessions',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  providers: [SessionsService],
  templateUrl: './add-sessions.component.html',
  styleUrl: './add-sessions.component.css',
})
export class AddSessionsComponent implements OnInit {
  teachers: { teacherId: string; teacherName: string }[] = [];
  classes: { classID: string; className: string }[] = [];

  selectedTeacher: { teacherId: string; teacherName: string } | null = null;
  selectedClass: { classID: string; className: string } | null = null;
  filteredTeachers: { userID: string; fullName: string }[] = [];
  selecttechfilter: { userID: string; fullName: string } | null = null;

  selectedClassMode: string = 'online';
  roomNumber: string = '';
  selectedDate: string = '';
  selectedPeriod: string = 'morning';
  startTime: string = '';
  endTime: string = '';
  sessionList: any[] = [];

  dateInvalid: boolean = false;
  startTimeInvalid: boolean = false;
  endTimeInvalid: boolean = false;
  groupInvalid: boolean = false;
  teacherInvalid: boolean = false;
  roomNumberInvalid: boolean = false;
  validateDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight to compare only dates
    const selectedDateObj = new Date(this.selectedDate);
    this.dateInvalid = !this.selectedDate || selectedDateObj < today; // Allow today and future dates
  }

  validateStartTime() {
    const startTimeNum = parseInt(this.startTime, 10);
    this.startTimeInvalid =
      !this.startTime ||
      isNaN(startTimeNum) ||
      startTimeNum < 1 ||
      startTimeNum > 12;
  }

  validateEndTime() {
    const endTimeNum = parseInt(this.endTime, 10);
    this.endTimeInvalid =
      !this.endTime || isNaN(endTimeNum) || endTimeNum < 1 || endTimeNum > 12;
  }

  validateFields() {
    this.groupInvalid = !this.selectedClass;
    this.teacherInvalid = !this.selecttechfilter;
    const periodInvalid = !this.selectedPeriod;

    // Only check for room number if class mode is offline
    if (this.selectedClassMode === 'offline') {
      this.roomNumberInvalid = !this.roomNumber;
    } else {
      this.roomNumberInvalid = false; // Reset if online
    }

    return !(
      this.groupInvalid ||
      this.teacherInvalid ||
      this.roomNumberInvalid ||
      periodInvalid
    );
  }
  constructor(public myserv: SessionsService, private router: Router) {}

  ngOnInit(): void {
    this.loadteacher();
    this.loadclass();
  }

  loadteacher(): void {
    this.myserv.GetAllTeachers().subscribe({
      next: (data) => {
        this.teachers = data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  loadclass(): void {
    this.myserv.GetAllClasses().subscribe({
      next: (data) => {
        this.classes = data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  onClassChange() {
    if (this.selectedClass && this.selectedClass.classID) {
      this.myserv.getTeachersByClass(this.selectedClass.classID).subscribe({
        next: (data) => {
          this.filteredTeachers = data;
          this.selectedTeacher = null;
        },
        error: (error) => {
          console.error('Error fetching teachers:', error.message);
        },
      });
    } else {
      this.filteredTeachers = [];
      this.selectedTeacher = null;
    }
  }
  sessions: any;
  loadSessions(): void {
    this.myserv.GetAllSessions().subscribe({
      next: (data) => {
        this.sessions = data; // تخزين الجلسات المحملة
      },
      error: (error) => {
        console.error('Error fetching sessions:', error);
      },
    });
  }
  checkDuplicateSession(newSession: any): boolean {
    return this.sessionList.some((sessions) => {
      return (
        sessions.date === newSession.date &&
        sessions.start_Time === newSession.start_Time &&
        sessions.end_Time === newSession.end_Time &&
        sessions.class_ID === newSession.class_ID &&
        (this.selectedClassMode === 'offline'
          ? sessions.room === newSession.room
          : true)
      );
    });
  }

  AddNewSession() {
    this.validateDate();
    this.validateStartTime();
    this.validateEndTime();
    if (!this.validateFields()) {
      alert(
        'يرجى التأكد من اختيار المجموعة والمدرس ورقم القاعة (إذا كان الوضع أوفلاين).'
      );
      return;
    }

    if (this.dateInvalid || this.startTimeInvalid || this.endTimeInvalid) {
      alert('يرجى تصحيح الأخطاء قبل إضافة الحصة.');
      return;
    }

    const teacherId = this.selecttechfilter
      ? this.selecttechfilter.userID
      : null;
    const classId = this.selectedClass ? this.selectedClass.classID : null;

    const newSession = {
      date: this.selectedDate,
      room: this.selectedClassMode === 'offline' ? this.roomNumber : 'أونلاين',
      end_Time: this.endTime,
      start_Time: this.startTime,
      period: this.selectedPeriod,
      class_ID: classId,
      teacher_ID: teacherId,
    };
    // تحقق من تكرار البيانات
    if (this.checkDuplicateSession(newSession)) {
      alert(
        'الجلسة موجودة بالفعل بنفس التاريخ والوقت. يرجى التحقق من البيانات.'
      );
      return;
    }
    this.sessionList.push(newSession);
    alert(
      'تم يمكنك إضافة المزيد من مواعيد الحصص. إذا كنت لا تريد إضافة أخرى اضغط على حفظ لإتمام عملية الإضافة.'
    );
    console.log(this.sessionList);
    this.resetForm();
  }

  resetForm() {
    this.selectedDate = '';
    this.roomNumber = '';
    this.startTime = '';
    this.endTime = '';
    this.selectedClass = null;
    this.selecttechfilter = null;
    this.selectedClassMode = 'online';
    this.selectedPeriod = 'morning';
  }

  savesession() {
    if (this.sessionList.length === 0) {
      alert('من فضلك أدخل البيانات المطلوبة قبل حفظ الحصص.');
      return;
    }

    this.myserv.AddSession(this.sessionList).subscribe({
      next: (response) => {
        console.log(response); // تأكد من وجود استجابة صحيحة
        alert('تمت الإضافة بنجاح.');
        this.sessionList = []; // Clear the session list after saving
        this.router.navigate(['/sessions']); // توجيه المستخدم إلى صفحة الحصص
      },
      error: (error) => {
        console.error('Error adding session:', error);
        alert('لقد ادخلت مواعيد موجوده بالفعل من قبل ');
      },
    });
  }
}
