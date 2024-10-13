import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExamService } from '../../../Services/exam.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenService } from '../../../Services/token-service.service';

@Component({
  selector: 'app-add-exam',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  providers: [ExamService, TokenService],
  templateUrl: './add-exam.component.html',
  styles: ``,
})
export class AddExamComponent implements OnInit {
  Mytoken_id: any = '';
  constructor(
    private myServ: ExamService,
    private router: Router,
    private mytoken: TokenService
  ) {}

  userData = {
    exam_Date: '',
    start_Time: 0,
    end_Time: 0,
    min_Degree: 0,
    max_Degree: 0,
    class_name: '',
    teacher_ID: this.Mytoken_id,
  };

  subject: any;
  Class: any;
  teacher: any;
  classes: string[] = [];

  AddExam(userData: any) {
    console.log(userData);
    this.myServ.AddExam(userData).subscribe({
      next: () => {
        this.router.navigate(['/GetExamFormTeacher']);
      },
      error: (err) => {
        alert("يوجد خطأ في التاريخ يجب ان يكون التاريخ اليوم او يكون تاريخ جديد");
        console.error(err);
      },
    });
  }

  ngOnInit(): void {
    this.userData.teacher_ID = this.mytoken.getUserId();
    console.log(this.userData.teacher_ID);
    this.myServ.Getclassbyid(this.userData.teacher_ID).subscribe({
      next: (data: any) => {
        console.log('Returned data:', data);
        if (data.classname && Array.isArray(data.classname)) {
          this.classes = data.classname;
        } else {
          console.error('Classes data is not an array:', data.classname);
          this.classes = [];
        }
        console.log('Teacher Classes:', this.classes);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
