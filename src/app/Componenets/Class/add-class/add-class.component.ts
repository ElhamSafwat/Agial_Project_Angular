import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClassService } from '../../../Services/class.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-class',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-class.component.html',
  styleUrl: './add-class.component.css',
})
export class AddClassComponent {
  level: number | any = 1;
  stage: string | any = 'أبتدائي';
  // level: any;
  // stage: any;
  students: any;
  teachers: any;
  class: {} = {};
  message_error: string[] = [];
  constructor(private myserve: ClassService, private router: Router) {
    this.getstudent();
  }
  classForm = new FormGroup({
    className: new FormControl('', Validators.required),
    student_stage: new FormControl('أبتدائي', Validators.required),
    student_level: new FormControl(1, Validators.required),
    studentIds: new FormControl([], Validators.required),
    teacherId: new FormControl([], Validators.required),
  });
  //value of level
  selectlevel() {
    this.level = this.classForm.controls['student_level'].value;
    this.getstudent();
  }
  //value satage
  selectstage() {
    this.stage = this.classForm.controls['student_stage'].value;
    this.getTeacher();
    this.getstudent();
  }
  // this.getstudent();
  getstudent() {
    this.myserve.getStudent(this.stage, this.level).subscribe({
      next: (data) => {
        this.students = data;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getTeacher() {
    this.myserve.getTeacher(this.stage).subscribe({
      next: (data) => {
        this.teachers = data;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSubmit() {
    const selectedTeacherIds: number[] =
      this.classForm.controls['teacherId'].value || [];

    if (selectedTeacherIds.length > 0) {
      const selectedTeachers = this.teachers.filter((teacher: any) =>
        selectedTeacherIds.includes(teacher.teacher_id)
      );
      var nameteacher: string[] = [];
      for (let i = 0; i < selectedTeachers.length; i++) {
        for (let j = 1; j < selectedTeachers.length; j++) {
          if (
            selectedTeachers[i].stubject_id == selectedTeachers[j].stubject_id
          ) {
            nameteacher.push(selectedTeachers[i].teacher_name);
            break;
          }
        }
      }

      if (nameteacher.length > 1) {
        const teacherNames = nameteacher.join(' والمدرس ');
        var mess = `المدرس ${teacherNames} يدرسون نفس المادة\n`;
        alert(mess);
        return;
      } else {
        if (this.classForm.valid) {
          const data = {
            stage: this.classForm.controls['student_stage'].value,
            className: this.classForm.controls['className'].value,
            level: this.classForm.controls['student_level'].value,
            studentIds: this.classForm.controls['studentIds'].value,
            teacherIds: selectedTeacherIds,
          };

          this.myserve.createClass(data).subscribe({
            next: (response) => {
              alert('تم انشاء المجموعه بنجاح ');
              console.log('تم إنشاء الفصل بنجاح', response);
              this.router.navigate(['/getClassDetails']);
            },
            error: (error) => {
              if (error.error && error.error.message) {
                if (typeof error.error.message === 'string') {
                  this.message_error = [error.error.message];
                } else if (Array.isArray(error.error.message)) {
                  this.message_error = error.error.message;
                }

                alert(this.message_error.join('\n'));
              } else {
                this.message_error = ['حدث خطأ غير متوقع'];
                alert(this.message_error.join('\n'));
              }
              console.log(this.message_error);
            },
          });
        }
      }
    }
  }
}
