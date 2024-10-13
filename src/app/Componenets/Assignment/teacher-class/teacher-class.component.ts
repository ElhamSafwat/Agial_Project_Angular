import { Component, OnInit } from '@angular/core';
import { AssingmentService } from '../../../Services/assingment.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../../Services/token-service.service';

@Component({
  selector: 'app-teacher-class',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [AssingmentService, TokenService],
  templateUrl: './teacher-class.component.html',
  styleUrl: './teacher-class.component.css',
})
export class TeacherClassComponent implements OnInit {
  ID: any;
  assignment: any;
  constructor(
    public myserve: AssingmentService,
    private mytoken: TokenService
  ) {
    this.ID = this.mytoken.getUserId();
  }
  ngOnInit(): void {
    this.myserve.GetClassesForTeacher(this.ID).subscribe({
      next: (data) => {
        console.log(data);
        this.assignment = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
