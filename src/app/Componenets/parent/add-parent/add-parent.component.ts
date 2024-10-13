import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ParentService } from '../../../Services/parent.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { parents, students } from '../../../Types/parent';

@Component({
  selector: 'app-add-parent',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [ParentService],
  templateUrl: './add-parent.component.html',
  styleUrl: './add-parent.component.css',
})
export class AddParentComponent {
  //to load error messages and success messages
  message_success: string = '';
  message_error: string[] = [];
  //to connection server
  constructor(public parentService: ParentService, private router: Router) {}

  //#region save data student

  student: students[] = [];
  //#endregion
  /*+++++++++++++++++++++++++++++++++++++++++++*/
  //#region save data parent
  parent: parents = {};
  //#region controlles in form

  myform = new FormGroup({
    parent_username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern('^[a-zA-Z0-9]+$'), // الأحرف والأرقام العربية والإنجليزية
    ]),
    parent_fullname: new FormControl('', Validators.required),
    parent_email: new FormControl('', [Validators.required, Validators.email]),
    parent_password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(
        '^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'
      ),
    ]),
    parent_confirm_password: new FormControl('', Validators.required),
    parent_phone: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^((\\+20|0)?1[0-9]{9}|(\\+966|0)?5[0-9]{8}|(\\+965)?[569][0-9]{7}|(\\+971|0)?5[0-9]{8})$'
      ),
    ]),

    student_username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern('^[a-zA-Z0-9]+$'),
    ]),
    student_fullname: new FormControl('', Validators.required),
    student_email: new FormControl('', [Validators.required, Validators.email]),
    student_password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(
        '^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'
      ),
    ]),
    student_confirm_password: new FormControl('', Validators.required),
    student_phone: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^((\\+20|0)?1[0-9]{9}|(\\+966|0)?5[0-9]{8}|(\\+965)?[569][0-9]{7}|(\\+971|0)?5[0-9]{8})$'
      ),
    ]),
    student_stage: new FormControl('أبتدائي', Validators.required),
    student_level: new FormControl(1, Validators.required),
    student_enrollmentDate: new FormControl(new Date(), [
      Validators.required,
      // this.dateValidator,
    ]),
  });

  addStudent() {
    this.message_success = '';
    if (this.myform.valid) {
      const newStudent = {
        Student_Name: this.myform.controls['student_username'].value || '',
        fullName: this.myform.controls['student_fullname'].value || '',
        Phone_Number: this.myform.controls['student_phone'].value || '',
        Student_Email: this.myform.controls['student_email'].value || '',
        Password: this.myform.controls['student_password'].value || '',
        ConfirmPassword:
          this.myform.controls['student_confirm_password'].value || '',
        enrollmentDate:
          this.myform.controls['student_enrollmentDate'].value || new Date(),
        Stage: this.myform.controls['student_stage'].value || 'أبتدائي',
        Level: this.myform.controls['student_level'].value || 1,
      };

      this.student.push(newStudent);
      this.message_success =
        'تم إضافه بيانات طالب بنجاح لقائمه قم بداخال بيانات طالب اخر';
      console.log(this.student);

      this.myform.controls['student_username'].setValue(''),
        this.myform.controls['student_fullname'].setValue(''),
        this.myform.controls['student_phone'].setValue(''),
        this.myform.controls['student_email'].setValue(''),
        this.myform.controls['student_password'].setValue(''),
        this.myform.controls['student_confirm_password'].setValue(''),
        this.myform.controls['student_enrollmentDate'].setValue(new Date()),
        this.myform.controls['student_stage'].setValue('أبتدائي'),
        this.myform.controls['student_level'].setValue(1);
    } else {
      console.error('النموذج غير صالح');
    }
  }

  //#region to add data in object parent
  add_data() {
    this.parent = {
      UserName: this.myform.controls['parent_username'].value || '',
      FullName: this.myform.controls['parent_fullname'].value || '',
      Email: this.myform.controls['parent_email'].value || '',
      Password: this.myform.controls['parent_password'].value || '',
      ConfirmPassword:
        this.myform.controls['parent_confirm_password'].value || '',
      Phone: this.myform.controls['parent_phone'].value || '',
      students:
        this.student.length > 0
          ? this.student
          : [
              {
                Student_Name:
                  this.myform.controls['student_username'].value || '',
                fullName: this.myform.controls['student_fullname'].value || '',
                Phone_Number: this.myform.controls['student_phone'].value || '',
                Student_Email:
                  this.myform.controls['student_email'].value || '',
                Password: this.myform.controls['student_password'].value || '',
                ConfirmPassword:
                  this.myform.controls['student_confirm_password'].value || '',
                enrollmentDate:
                  this.myform.controls['student_enrollmentDate'].value ||
                  new Date(),
                Stage: this.myform.controls['student_stage'].value || 'أبتدائي',
                Level: this.myform.controls['student_level'].value || 1,
              },
            ],
    };
  }
  //#endregion

  send_data() {
    this.message_error = [];
    if (this.student.length > 0) {
      this.add_data();
    } else {
      if (this.myform.valid) {
        this.add_data();
      }
    }

    this.parentService.add_parent(this.parent).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigate(['/show-parent']);
      },
      error: (error: HttpErrorResponse) => {
        this.message_error = [];
        if (
          error.error &&
          error.error.errors &&
          Array.isArray(error.error.errors)
        ) {
          this.message_error = error.error.errors;
          // } else {
          //   this.message_error.push(
          //     'من فضلك ادخل داتا في جميع الحقول اولا حتي يتم انشاء الحسابات '
          //   );
          // }
          console.log(this.message_error);
        }
      },
    });
  }
}
