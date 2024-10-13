import { Component } from '@angular/core';
import { ExamService } from '../../../Services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../../Services/token-service.service';

@Component({
  selector: 'app-get-all-exam',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './get-all-exam.component.html',
  styles: ``,
})
export class GetAllExamComponent {
  Exam: any[] = [];
  userid: any = '';
  filteredExams: any[] = [];
  searchDate: string | undefined;

  constructor(
    public myserve: ExamService,
    private router: Router,
    private mytoken: TokenService
  ) {
    this.userid = this.mytoken.getUserId();
  }

  ngOnInit(): void {
    this.myserve.GetExamByid(this.userid).subscribe({
      next: (data) => {
        this.Exam = data as any[];
        this.filteredExams = this.Exam;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  confirmDelete(Examid: any) {
    const isConfirmed = window.confirm('هل أنت متأكد إنك تريد حذف الإمتحان !');

    if (isConfirmed) {
      this.myserve.deleteExam(Examid).subscribe({
        next: (response) => {
          console.log('Data deleted successfully', response);
          this.Exam = this.Exam.filter((exam) => exam.exam_ID !== Examid);
          this.filteredExams = this.Exam;
        },
        error: (error) => {
          console.error('Error deleting data', error);
        },
      });
    } else {
      console.log('Deletion cancelled');
    }
  }

  // Update
  goToUpdate(id: number) {
    this.router.navigate(['/updateExam', id]);
  }

  // Search
  searchExams() {
    if (this.searchDate) {
      const selectedDate = new Date(this.searchDate).toLocaleDateString();
      this.filteredExams = this.Exam.filter((exam) => {
        return new Date(exam.exam_Date).toLocaleDateString() === selectedDate;
      });
    } else {
      this.filteredExams = this.Exam;
    }
  }
}
