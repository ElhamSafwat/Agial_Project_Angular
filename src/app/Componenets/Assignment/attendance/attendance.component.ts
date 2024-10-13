import { Component, OnInit } from '@angular/core';
import { AssingmentService } from '../../../Services/assingment.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

export interface Student {
  userID: string;
  fullName: string;
  attendance: boolean;
}

export interface Session {
  session_ID: number;
  date: string;
  start_Time: number;
}
export interface Attandences {
  studentId?: string;
  attandence?: Boolean;
  session_id?: number;
}
@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [AssingmentService],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
})
export class AttendanceComponent implements OnInit {
  sessionId: number = -1;
  sessionDate: string = '';
  sessionTime: string = '';
  classId: number;
  students: Student[] = [];
  addAttend: Attandences = {};
  Attendece: Attandences[] = [];

  constructor(
    private assignmentService: AssingmentService,
    private route: ActivatedRoute
  ) {
    this.classId = this.route.snapshot.params['classid'];
    console.log('class id: ' + this.classId);
  }

  ngOnInit(): void {
    this.loadStudents(this.classId); // جلب الطلاب عند تحميل المكون
  }

  loadStudents(classId: number): void {
    this.assignmentService.GetStudentsForClass(classId).subscribe({
      next: (data: any) => {
        console.log(data);
        this.students = data;
      },
      error: (error) => {
        console.error('خطأ في تحميل الطلاب:', error);
      },
    });
  }

  getSessionId(): void {
    console.log('التاريخ المدخل:', this.sessionDate);
    console.log('وقت البدء المدخل:', this.sessionTime);

    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // تنسيق التاريخ إلى YYYY-MM-DD
    this.sessionDate = todayString;
    // تحقق من أن التاريخ المدخل يطابق تاريخ اليوم
    // if (this.sessionDate !== todayString) {
    //   alert('يجب أن يكون التاريخ المدخل هو تاريخ اليوم.');
    //   return; // إنهاء الدالة إذا كان التاريخ غير صحيح
    // }

    this.assignmentService
      .GetAllSessions()
      .pipe(
        switchMap((sessions: Session[]) => {
          console.log('الحصص المتاحة:', sessions);

          const filteredSession = sessions.find((session) => {
            const sessionStartTime = session.start_Time.toString();
            return (
              session.date === this.sessionDate &&
              sessionStartTime === this.sessionTime
            );
          });

          if (filteredSession) {
            this.sessionId = filteredSession.session_ID; // تأكد من تعيين sessionId
            console.log('تم العثور على الحصة:', filteredSession);
            return of(true);
          } else {
            this.sessionId = -1; // تعيينها إلى -1 عند عدم العثور على الحصة
            console.error(
              'لم يتم العثور على حصة تطابق التاريخ والوقت المحددين'
            );
            alert('لا توجد حصص متسجلة في هذا الموعد.');
            return of(false);
          }
        }),
        catchError((error) => {
          console.error('خطأ في جلب الحصص:', error);
          alert('حدث خطأ أثناء جلب الحصص.');
          return of(false);
        })
      )
      .subscribe((result) => {
        if (result) {
          this.submitAttendance(); // استدعاء submitAttendance بعد التأكد من تعيين sessionId
        }
      });
  }

  onSubmit(): void {
    this.getSessionId(); // استدعاء دالة جلب sessionId
  }

  onAttendanceChange(student: Student): void {
    console.log(
      `Attendance for ${student.fullName} is now: ${student.attendance}`
    );
  }

  submitAttendance(): void {
    console.log('التحقق من sessionId قبل الإرسال:', this.sessionId);
    if (this.sessionId === -1) {
      console.error('Invalid session ID');
      alert('يرجى التأكد من تحديد حصة صحيحة قبل إرسال الحضور.');
      return;
    }

    let completedRequests = 0; // عدّاد الطلبات المكتملة

    this.students.forEach((student) => {
      // تأكد من تسجيل الحضور بناءً على حالة checkbox
      this.addAttend={}
      const attendanceStatus =
        student.attendance !== undefined ? student.attendance : false;
      this.addAttend.attandence = attendanceStatus;
      this.addAttend.session_id = this.sessionId;
      this.addAttend.studentId = student.userID;
      this.Attendece.push(this.addAttend);
      // console.log(
      //   `Sending attendance for student ${student.fullName} (ID: ${student.userID}) with attendance: ${attendanceStatus}`
      // );
      console.log(this.Attendece);
      this.assignmentService.addAttendance(this.Attendece).subscribe({
        next: (response) => {
          console.log('تم تسجيل الحضور بنجاح', response);
        },
        error: (error) => {
          console.error(
            `خطأ في تسجيل الحضور للطالب ${student.fullName}:`,
            error
          );
        },
        complete: () => {
          completedRequests++; // زيادة العدّاد عند الانتهاء من الطلب

          // إذا كان عدد الطلبات المكتملة يساوي عدد الطلاب
          if (completedRequests === this.students.length) {
            alert('تم إضافة حضور الطلاب بنجاح!');
          }
        },
      });
    });
  }
}
