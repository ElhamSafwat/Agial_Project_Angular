import { Component, OnInit } from '@angular/core';
import { SubjectServiceService } from '../../../Services/subject-service.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface Subject {
  id: number;
  subject_Name: string;
  description: string;
  teacherNames: string[];
}

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  providers: [SubjectServiceService],
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
})
export class SubjectComponent implements OnInit {
  subjects: Subject[] = [];
  filteredSubjects: Subject[] = [];
  subjectForm: FormGroup;
  searchForm: FormGroup;
  formSubmitted: boolean = false;
  subjectExistsError: boolean = false;
  isLoading: boolean = true;
  isAdding: boolean = false;

  constructor(
    public myService: SubjectServiceService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.subjectForm = this.fb.group({
      subject_Name: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.searchForm = this.fb.group({
      search: [''],
    });
  }

  ngOnInit(): void {
    this.myService.GetAllSubjects().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.subjects = data;
          this.filteredSubjects = data;
          this.isLoading = false;
        } else {
          console.error('Data is not an array', data);
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });

    this.searchForm
      .get('search')
      ?.valueChanges.subscribe((searchTerm: string) => {
        this.filterSubjects(searchTerm);
      });
    this.subjectForm.get('subject_Name')?.valueChanges.subscribe(() => {
      this.subjectExistsError = false;
    });
  }

  addSubject(): void {
    this.formSubmitted = true;
    this.subjectExistsError = false;
    this.isAdding = true;

    if (this.subjectForm.valid) {
      const newSubject = this.subjectForm.value;

      const subjectExists = this.subjects.some(
        (subject) =>
          subject.subject_Name.toLowerCase() ===
          newSubject.subject_Name.toLowerCase()
      );

      if (subjectExists) {
        this.subjectExistsError = true;
        this.isAdding = false;
      } else {
        this.myService.AddSubject(newSubject).subscribe({
          next: (data: any) => {
            const addedSubject: Subject = {
              id: data.subject_ID,
              subject_Name: data.subject_Name,
              description: data.description,
              teacherNames: data.teacherNames || [],
            };

            this.subjects.push(addedSubject);

            this.filterSubjects(this.searchForm.get('search')?.value || '');

            this.subjectForm.reset();
            this.formSubmitted = false;
            this.isAdding = false;
          },
          error: (err) => {
            if (err.status === 400 && err.error === 'المادة موجودة بالفعل.') {
              this.subjectExistsError = true;
              this.isAdding = false;
            } else {
              console.error('Error adding subject', err);
              this.isAdding = false;
            }
          },
        });
      }
    } else {
      this.isAdding = false;
    }
  }

  filterSubjects(searchTerm: string): void {
    if (searchTerm) {
      this.filteredSubjects = this.subjects.filter((subject) =>
        subject.subject_Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.filteredSubjects = this.subjects;
    }
  }
}
