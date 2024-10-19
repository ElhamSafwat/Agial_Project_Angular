import { Component, OnInit } from '@angular/core';
import { GetTeachersService } from '../../../Services/get-teachers.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-get-all-teacher',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,NgxPaginationModule],
  providers: [GetTeachersService],
  templateUrl: './get-all-teacher.component.html',
  styles: ``,
})
export class GetAllTeacherComponent implements OnInit {
  p:number=1;

  constructor(public myserve: GetTeachersService) {}
  teacher: any[] = [];
  filteredTeachers: any[] = [];
  searchTerm: string = '';

  ngOnInit(): void {
    //console.log(this.myserve.GetTeachers())

    this.myserve.GetTeachers().subscribe({
      next: (data) => {
        this.teacher = data as any[];
        this.filteredTeachers = this.teacher;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  confirmDelete(teacherId: any) {
    const isConfirmed = window.confirm('هل أنت متأكد إنك تريد حذف المعلم !');
    if (isConfirmed) {
      this.myserve.deleteTeacter(teacherId).subscribe(
        (response) => {
          console.log('Data deleted successfully', response);
          this.filteredTeachers = this.filteredTeachers.filter(subject => subject.teacherId !== teacherId);
          window.location.reload();
        },
        (error) => {
          console.error('Error deleting data', error);
        }
      );
    } else {
      console.log('Deletion cancelled');
    }
  }

  searchTeacher(): void {
    if (this.searchTerm) {
      this.filteredTeachers = this.teacher.filter((t) =>
        t.teacherName.includes(this.searchTerm)
      );
    } else {
      this.filteredTeachers = this.teacher;
    }
  }
}
