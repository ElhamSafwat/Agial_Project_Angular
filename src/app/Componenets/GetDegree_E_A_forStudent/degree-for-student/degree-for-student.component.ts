import { Component, OnInit } from '@angular/core';
import { DegreeForStudentsService } from '../../../Services/degree-for-students.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../../Services/token-service.service';

@Component({
  selector: 'app-degree-for-student',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [DegreeForStudentsService, TokenService],
  templateUrl: './degree-for-student.component.html',
  styleUrl: './degree-for-student.component.css',
})
export class DegreeForStudentComponent implements OnInit {
  Studnet_Id: any = '';
  degreeExam: any[] = [];
  deAssignment: any[] = [];
  constructor(
    public myserv: DegreeForStudentsService,
    private mytoken: TokenService
  ) {
    this.Studnet_Id = this.mytoken.getUserId();
  }
  ngOnInit(): void {
    this.getExamDegree();
    this.getAssignmentDegree();
  }
  getExamDegree() {
    this.myserv.getdegreeExam(this.Studnet_Id).subscribe({
      next: (data: any) => {
        this.degreeExam = data;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getAssignmentDegree() {
    this.myserv.getdegraaAssignment(this.Studnet_Id).subscribe({
      next: (data: any) => {
        this.deAssignment = data;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
