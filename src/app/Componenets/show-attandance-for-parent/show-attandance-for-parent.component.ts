import { Component, OnInit } from '@angular/core';
import { AttendanceForParentShowService } from '../../Services/attendance-for-parent-show.service';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../Services/token-service.service';

@Component({
  selector: 'app-show-attandance-for-parent',
  standalone: true,
  imports: [CommonModule],
  providers: [AttendanceForParentShowService],
  templateUrl: './show-attandance-for-parent.component.html',
  styleUrl: './show-attandance-for-parent.component.css',
})
export class ShowAttandanceForParentComponent implements OnInit {
  students: any[] = [];
  studentId: string | null = null;
  selectedStudentName: string | null = null;
  noDataMessage: boolean = false;
  parent_id: any;
  attendance: any[] = [];
  // constructor(public myserv:AttendanceForParentShowService){}
  constructor(
    private myserv: AttendanceForParentShowService,
    private mytoken: TokenService
  ) {
    this.parent_id = this.mytoken.getUserId();
  }
  ngOnInit(): void {
    // this.myserv.getstudentsforparent(this.parent_id).subscribe({
    //   next:(data)=>{console.log(data)},
    //   error:(error)=>{console.log(error)}
    // });
    this.loadStudents();
  }

  loadStudents(): void {
    this.myserv.getstudentsforparent(this.parent_id).subscribe({
      next: (data: any) => {
        this.students = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error loading students:', error);
      },
    });
  }
  onStudentChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.studentId = target.value;

    const selectedStudent = this.students.find(
      (student) => student.studentId === this.studentId
    );
    this.selectedStudentName = selectedStudent
      ? selectedStudent.studentName
      : null;

    this.getattendatnce(this.studentId);
  }
  getattendatnce(studentId: string): void {
    this.myserv.GetAttendanceforParent(studentId).subscribe({
      next: (data: any) => {
        this.attendance = data;
        this.noDataMessage = this.attendance.length === 0;
        console.log(data);
      },
      error: (error) => {
        console.error('Error loading exam degrees:', error);
        this.attendance = [];
        this.noDataMessage = true;
      },
    });
  }
}
