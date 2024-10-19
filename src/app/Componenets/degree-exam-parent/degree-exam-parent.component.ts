import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DegreeForParentService } from '../../Services/degree-for-parent.service';
import { TokenService } from '../../Services/token-service.service';

@Component({
  selector: 'app-degree-exam-parent',
  standalone: true,
  imports: [CommonModule],
  providers: [DegreeForParentService, TokenService],
  templateUrl: './degree-exam-parent.component.html',
  styleUrls: ['./degree-exam-parent.component.css'],
})
export class DegreeExamParentComponent implements OnInit {
  students: any[] = [];
  degreeExam: any[] = [];
  studentId: string | null = null;
  selectedStudentName: string | null = null;
  noDataMessage: boolean = false;
  parent_id: any;

  constructor(
    private myServ: DegreeForParentService,
    private mytoken: TokenService
  ) {
    this.parent_id = this.mytoken.getUserId();
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.myServ.getstudentsforparent(this.parent_id).subscribe({
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

    this.getExamDegree(this.studentId);
  }

  getExamDegree(studentId: string): void {
    this.myServ.getdegreeExam(studentId).subscribe({
      next: (data: any) => {
        this.degreeExam = data;
        this.noDataMessage = this.degreeExam.length === 0;
        console.log(data);
      },
      error: (error) => {
        console.error('Error loading exam degrees:', error);
        this.degreeExam = [];
        this.noDataMessage = true;
      },
    });
  }
}
