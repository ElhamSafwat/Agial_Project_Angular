import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../../../Services/students.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-student',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  providers: [StudentsService],
  templateUrl: './edit-student.component.html',
  styleUrl: './edit-student.component.css',
})
export class EditStudentComponent implements OnInit {
  studentid: any;
  students: any = {
    fullName: '',
    student_Email: '',
    phone_Number: '',
    stage: '',
    level: '',
  };

  studentForm: FormGroup;
  levels: number[] = [];

  constructor(
    public myserv: StudentsService,
    myroute: ActivatedRoute,
    private fb: FormBuilder,
    public router: Router
  ) {
    this.studentid = myroute.snapshot.params['student_Id'];
    console.log('Student ID:', this.studentid);

    this.studentForm = this.fb.group({
      fullName: ['', Validators.required],
      student_Email: ['', [Validators.required, Validators.email]],
      phone_Number: ['', Validators.required],
      stage: ['', Validators.required],
      level: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.loadstudent();
    this.loadstag();
  }

  loadstudent() {
    this.myserv.getStudentById(this.studentid).subscribe({
      next: (data: any) => {
        this.students = data;
        this.studentForm.patchValue(data);
        this.updateLevels(data.stage);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadstag() {
    this.studentForm.get('Stage')?.valueChanges.subscribe((stage) => {
      this.updateLevels(stage);
    });
  }

  updateLevels(stage: string) {
    if (stage === 'أبتدائي') {
      this.levels = [1, 2, 3, 4, 5, 6];
    } else if (stage === 'أعدادي' || stage === 'ثانوي') {
      this.levels = [1, 2, 3];
    } else {
      this.levels = [];
    }
    this.studentForm.get('Level')?.setValue('');
  }
  onSubmit() {
    this.students.student_Id = this.studentid;
    const studentData = {
      ...this.studentForm.value,
      student_Id: this.studentid,
      Student_Name: this.studentForm.value.fullName,
    };
    console.log(studentData);
    this.myserv.updateStudent(studentData).subscribe({
      next: (respons) => {
        console.log('تم تعديل', respons);
        alert('تم تعديل بيانات الطالب');
        this.router.navigate(['/detailsstudent']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
