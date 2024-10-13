import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../../../Services/students.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-all-students',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgxPaginationModule],
  providers: [StudentsService],
  templateUrl: './all-students.component.html',
  styleUrl: './all-students.component.css',
})
export class AllStudentsComponent implements OnInit {
  students: any[] = [];
  filteredStudents: any[] = [];
  searchTerm: string = '';
  p: number = 1;
  constructor(public myserv: StudentsService) {}
  ngOnInit(): void {
    this.loadStudents();
  }
  loadStudents() {
    this.myserv.getStudents().subscribe({
      next: (data: any) => {
        this.students = data;
        this.filteredStudents = data;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  searchstudents(): void {
    if (this.searchTerm) {
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      this.filteredStudents = this.students.filter((student) =>
        student.fullName.toLowerCase().includes(lowerSearchTerm)
      );
    } else {
      this.filteredStudents = this.students;
    }
  }
  confirmDelete(student_Id: any) {
    const isConfirmed = window.confirm('هل تريد حذف هذا الطالب ؟');
    console.log('student_Id:', student_Id);
    if (isConfirmed) {
      this.myserv.deleteStudent(student_Id).subscribe(
        (response) => {
          console.log('Student deleted successfully', response);
          alert('تم الحذف بنجاح ');
          this.loadStudents();
          // window.location.reload();
        },
        (error) => {
          console.error('Error deleting data', error);
        }
      );
    } else {
      console.log('Deletion Cancelled');
    }
  }
}
