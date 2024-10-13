import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../../Services/exam.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../Services/token-service.service';

@Component({
  selector: 'app-edit-exam',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './edit-exam.component.html',
  providers: [ExamService, TokenService],
  styles: [],
})
export class EditExamComponent implements OnInit {
  userData = {
    exam_Date: '',
    start_Time: 0,
    end_Time: 0,
    min_Degree: 0,
    max_Degree: 0,
    class_name: '',
  };

  ID = '';
  Exam: any;
  teacher_ID: any;
  classes: string[] = [];
  selectedClass: string = '';

  constructor(
    public myRoute: ActivatedRoute,
    public _myserve: ExamService,
    private router: Router,
    private mytoken: TokenService
  ) {
    this.ID = myRoute.snapshot.params['id'];
    this.teacher_ID = this.mytoken.getUserId();
  }

  ngOnInit(): void {
    this._myserve.getbyExamid(this.ID).subscribe({
      next: (data) => {
        this.Exam = data;
        this.userData = {
          exam_Date: this.formatDate(this.Exam.exam_Date),
          start_Time: this.Exam.start_Time,
          end_Time: this.Exam.end_Time,
          min_Degree: this.Exam.min_Degree,
          max_Degree: this.Exam.max_Degree,
          class_name: this.Exam.class_name,
        };
        this.selectedClass = this.Exam.class_name;
      },
      error: (err) => {
        console.log(err);
      },
    });

    this._myserve.Getclassbyid(this.teacher_ID).subscribe({
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

  onUpdate(): void {
    this.userData.class_name = this.selectedClass;
    this._myserve.UpdateExam(this.ID, this.userData).subscribe({
      next: () => {
        this.router.navigate(['/GetExamFormTeacher']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return '';
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
