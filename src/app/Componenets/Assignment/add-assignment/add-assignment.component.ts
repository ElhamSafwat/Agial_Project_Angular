import { Component, OnInit } from '@angular/core';
import { AssingmentService } from '../../../Services/assingment.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Student {
  userID: string;
  fullName: string;
  degree?: number;
}

export interface Session {
  session_ID: number;
  date: string;
  start_Time: string;
}

export interface Assignment {
  sessionID: number;
  assignment: string;
  session_Date: string;
}

export interface AddAssignment {
  sessionId?: number;
  degree?: number;
  studentId?: string;
}

@Component({
  selector: 'app-add-assignment',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [AssingmentService],
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit {
  addAss: AddAssignment = {};
  Assignmentss: AddAssignment[] = [];
  sessionId: number = -1;

  sessionDate: string = '';
  sessionTime: number = 0;
  assignmentText: string = '';
  classId: number;
  students: Student[] = [];
  assignments: Assignment[] = [];
  selectedAssignment: any;
  selectedDate: string = '';
  constructor(
    private assignmentService: AssingmentService,
    private route: ActivatedRoute
  ) {
    this.classId = this.route.snapshot.params['classid'];
  }

  ngOnInit(): void {
    this.loadAssignments();
    this.loadStudents();
  }

  loadAssignments(): void {
    if (this.selectedDate) {
      this.assignmentService.getAssignmentsByDate(this.selectedDate).subscribe({
        next: (data: any) => {
          this.assignments = data;
        },
        error: (error) => {
          console.error('خطأ في تحميل الواجبات:', error);
        },
      });
    }
  }

  loadStudents(): void {
    this.assignmentService.GetStudentsForClass(this.classId).subscribe({
      next: (data: any) => {
        this.students = data;
        console.log('الطلاب المحملين:', data);
        // this.students = data;
      },
      error: (error) => {
        console.error('خطأ في تحميل الطلاب:', error);
      },
    });
  }

  async onSubmitAssignment(): Promise<void> {
    await this.getSessionId();

    if (this.sessionId !== -1) {
      this.assignmentService
        .createAssignment(this.sessionId, this.assignmentText)
        .subscribe({
          next: (response) => {
            alert('تم إضافة الواجب');
            this.loadAssignments();
          },
          error: (error) => {
            console.error('خطأ في إنشاء الواجب:', error);
          },
        });
    }
  }

  async getSessionId(): Promise<void> {
    if (this.sessionDate && this.sessionTime) {
      const sessions = await this.assignmentService
        .GetAllSessions()
        .toPromise();

      if (sessions) {
        console.log('الجلسات المحملة:', sessions); // سجل البيانات المستردة
        const foundSession = sessions.find(
          (session) =>
            session.date === this.sessionDate &&
            session.start_Time == this.sessionTime
        ); // استخدام == للمقارنة العددية

        this.sessionId = foundSession ? foundSession.session_ID : -1;

        if (this.sessionId === -1) {
          alert('يرجى التأكد من صحة تاريخ ووقت الجلسة.');
        }
      } else {
        alert('لم يتم العثور على أي جلسات.');
      }
    } else {
      alert('يرجى إدخال تاريخ ووقت الجلسة.');
    }
  }

  onSubmitGrades(): void {
    if (this.selectedAssignment === undefined) {
      alert('يرجى اختيار واجب قبل تسجيل الدرجات.');
      return;
    }
    let count = 0;
    this.students.forEach((student) => {
      this.addAss = {};
      this.addAss.sessionId = this.selectedAssignment;
      this.addAss.studentId = student.userID;
      this.addAss.degree = student.degree;
      this.Assignmentss.push(this.addAss);
      if (student.degree != null) {
        this.assignmentService.addStudentGrade(this.Assignmentss).subscribe({
          next: (response) => {
            console.log('تم الاضافه الطالب ', response);
          },
          error: (error) => {
            console.error(
              `خطأ في إضافة الدرجة للطالب ${student.fullName}:`,
              error
            );
          },
        });
      }
      count++;
    });
    alert('تم إضافة الدرجة بنجاح');
  }
}
