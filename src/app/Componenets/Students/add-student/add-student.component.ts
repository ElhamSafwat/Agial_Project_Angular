import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StudentsService } from '../../../Services/students.service';
import { Router } from '@angular/router';

export interface Student {
  Student_Name: string;
  fullName: string;
  Student_Email: string;
  Password: string;
  ConfirmPassword: string;
  Phone_Number: string;
  enrollmentDate: Date;
  Stage: string;
  Level: number;
  parent_ID: string;
}

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css'],
})
export class AddStudentComponent implements OnInit {
  studentForm: FormGroup;
  levels: number[] = [];
  parentnames: { userId: string; fullName: string }[] = [];
  filteredNames: { userId: string; fullName: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private myserv: StudentsService,
    private router: Router
  ) {
    this.studentForm = this.fb.group(
      {
        Student_Name: ['', Validators.required],
        fullName: ['', Validators.required],
        // Student_Email: ['', [Validators.required, Validators.email]],
        // Password: ['', [Validators.required, Validators.minLength(6)]],
        Student_Email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail)\.com$/
            ),
          ],
        ],
        Password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?~`-]).+$/
            ),
          ],
        ],
        ConfirmPassword: ['', Validators.required],
        Phone_Number: ['', Validators.required],
        enrollmentDate: ['', Validators.required],
        Stage: ['', Validators.required],
        Level: ['', [Validators.required]],
        parent_ID: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  ngOnInit(): void {
    this.loadstag();
    this.loadparent();
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

  passwordsMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get('Password')?.value;
    const confirmPassword = control.get('ConfirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  loadparent() {
    this.myserv.getParents().subscribe({
      next: (data: any) => {
        this.parentnames = data.map((item: any) => ({
          userId: item.userId,
          fullName: item.fullName,
        }));
        this.filteredNames = this.parentnames;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const newStudent: Student = {
        ...this.studentForm.value,
        enrollmentDate: new Date(
          this.studentForm.get('enrollmentDate')?.value
        ).toISOString(),
      };
      console.log('Sending data:', newStudent);

      this.myserv.addStudent(newStudent).subscribe({
        next: (response) => {
          console.log(response);
          alert('تم اضافه الطالب ');
          this.router.navigate(['/detailsstudent']);
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
    }
  }
}
