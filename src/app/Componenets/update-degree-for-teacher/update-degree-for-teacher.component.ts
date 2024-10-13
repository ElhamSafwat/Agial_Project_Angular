import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PutDegreeToStudentForTeacherService } from '../../Services/put-degree-to-student-for-teacher.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-degree-for-teacher',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-degree-for-teacher.component.html',
  styleUrls: ['./update-degree-for-teacher.component.css'],
})
export class UpdateDegreeForTeacherComponent implements OnInit {
  degree: number | null = null;
  studentId!: string;
  examId!: number;
  teacherId!: string;
  StudentName: string = '';
  errorMessage: string | null = null;
  maxDegree!: number;
  minDegree!: number;

  constructor(
    private route: ActivatedRoute,
    private myService: PutDegreeToStudentForTeacherService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.examId = params['examId'];
      this.studentId = params['studentId'];
      this.teacherId = params['teacherId'];
      this.getStudentDegree(this.studentId, this.examId);
    });
  }

  getStudentDegree(studentId: string, examId: number): void {
    this.myService.getStudentDegree(studentId, examId).subscribe({
      next: (response) => {
        this.degree = response.degree;
        this.StudentName = response.studentName;
        this.maxDegree = response.maxDegree; // Assign maxDegree
        this.minDegree = response.minDegree; // Assign minDegree
        console.log('Student Degree:', this.degree);
        console.log('Student Name:', response.studentName);
        console.log('Max Degree:', this.maxDegree);
        console.log('Min Degree', this.minDegree);
      },
      error: (error) => {
        console.error('Error fetching student degree:', error);
      },
    });
  }
  updateDegree(): void {
    this.errorMessage = null;
    if (this.degree === null) {
      this.errorMessage = 'الرجاء إملاء البيانات';
      return;
    } else if (this.degree < 0) {
      this.errorMessage = 'الدرجة يجب أن تكون أكبر من أو تساوي صفر';
      return;
    } else if (this.degree > this.maxDegree) {
      this.errorMessage = `الدرجة يجب أن تكون بين 0 و ${this.maxDegree}`;
      return;
    }
    const confirmMessage = `هل أنت متأكد من تعديل الدرجة للطالب ${this.StudentName} إلى ${this.degree}?`;
    if (confirm(confirmMessage)) {
      this.myService
        .updateStudentDegree(
          this.studentId,
          this.examId,
          this.teacherId,
          this.degree
        )
        .subscribe({
          next: (response) => {
            console.log('Degree updated successfully:', response);
            this.router.navigate(['/insertdegreeforteacher']);
          },
          error: (error) => {
            console.error('Error updating degree:', error);
          },
        });
    }
  }
  clearMessage(): void {
    this.errorMessage = null;
  }
}
