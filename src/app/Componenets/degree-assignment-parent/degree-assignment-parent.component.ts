import { Component, OnInit } from '@angular/core';
import { DegreeForParentService } from '../../Services/degree-for-parent.service';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../Services/token-service.service';

@Component({
  selector: 'app-degree-assignment-parent',
  standalone: true,
  imports: [CommonModule],
  providers: [DegreeForParentService, TokenService],
  templateUrl: './degree-assignment-parent.component.html',
  styleUrl: './degree-assignment-parent.component.css',
})
export class DegreeAssignmentParentComponent implements OnInit {
  students: any[] = [];
  degreeAssignment: any[] = [];
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
    // this.degreeAssignment = [];
    // this.noDataMessage = true;
    const selectedStudent = this.students.find(
      (student) => student.studentId === this.studentId
    );
    this.selectedStudentName = selectedStudent
      ? selectedStudent.studentName
      : null;

    this.getAssignmentDegree(this.studentId);
  }

  getAssignmentDegree(studentId: string) {
    this.myServ.getdegraaAssignment(studentId).subscribe({
      next: (data: any) => {
        this.degreeAssignment = data;
        this.noDataMessage = this.degreeAssignment.length === 0;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
        this.degreeAssignment = [];
        this.noDataMessage = true;
      },
    });
  }
}
