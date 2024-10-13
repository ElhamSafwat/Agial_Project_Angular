import { Component, OnInit } from '@angular/core';
import { GetTeachersService } from '../../../Services/get-teachers.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-teacher',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [GetTeachersService],
  templateUrl: './add-teacher.component.html',
  styles: [],
})
export class AddTeacherComponent implements OnInit {
  userData = {
    userName: '',
    full_Name: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    stage: '',
    subject_ID: 0,
    hireDate: '',
  };

  teachers: any[] = []; //+
  subject: any;

  constructor(private myServ: GetTeachersService, private router: Router) {}

  ngOnInit(): void {
    this.myServ.GetTeachers().subscribe({
      next: (data) => {
        this.teachers = data as any[]; //+
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.myServ.Getsubject().subscribe({
      next: (data) => {
        this.subject = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  AddTeacher(userData: any) {
    const NameEx = this.teachers.some(
      (teacher) => teacher.teacherName === userData.full_Name
    ); //+
    const phoneEx = this.teachers.some(
      (teacher) => teacher.phoneNumber === userData.phone
    ); //+

    console.log(NameEx); //+
    console.log(phoneEx); //+

    if (NameEx) {
      alert('هذا المدرس موجود بالفعل');
    } else if (phoneEx) {
      alert(' رقم الهاتف مسجل بالفعل  ');
    } else {
      console.log(userData);
      this.myServ.AddTeacher(userData).subscribe({
        next: () => {
          this.router.navigate(['/GetAllTeacher']);
          alert("تم اضافه معلم ");
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }
}
