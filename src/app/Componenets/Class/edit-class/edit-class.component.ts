import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from '../../../Services/class.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-edit-class',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-class.component.html',
  styleUrls: ['./edit-class.component.css'],
})
export class EditClassComponent implements OnInit {
  classId!: number;
  classData: any = {};

  subjectids: any;
  studentsList: any;
  teachersList: any;
  selectedStudentId: string = '';
  selectedTeacherId: string = '';

  student_ids: string[] = [];
  teacher_ids: string[] = [];
  newclass: {
    stage: string;
    className: string;
    level: number;
    studentIds: string[];
    teacherIds: string[];
  } = {
    stage: this.classData.stage,
    className: this.classData.className,
    level: this.classData.level,
    studentIds: [''],
    teacherIds: [''],
  };
  constructor(
    private classService: ClassService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.classId = Number(this.route.snapshot.paramMap.get('classID'));
    this.getClassData();
  }

  // جلب بيانات الفصل
  getClassData(): void {
    this.classService.getClass(this.classId).subscribe({
      next: (data) => {
        this.classData = data;
        console.log(this.classData);

        this.getAvailableStudents();
        this.getAvailableTeachers();
      },
      error: (error) => {
        console.error('Error fetching class data', error);
      },
    });
  }

  getAvailableStudents(): void {
    this.classService
      .getStudent(this.classData.stage, this.classData.level)
      .subscribe({
        next: (data: any) => {
          console.log('Students data:', data);
          const availableStudents = data;

          console.log('Available Students before filter:', availableStudents);
          console.log('Class Data Students:', this.classData.students);

          this.studentsList = availableStudents.filter((student: any) => {
            const exists = this.classData.students.some(
              (existingStudent: any) =>
                existingStudent.studentID === student.student_id
            );
            return !exists;
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  //get teacher new
  getAvailableTeachers(): void {
    this.classService.getTeacher(this.classData.stage).subscribe({
      next: (data: any) => {
        console.log('Teachers data:', data);
        const availableTeachers = data;

        console.log('Available Teachers before filter:', availableTeachers);
        console.log('Class Data Teachers:', this.classData.teachers);

        this.teachersList = availableTeachers.filter((teacher: any) => {
          const exists = this.classData.teachers.some(
            (existingTeacher: any) =>
              existingTeacher.teacherID === teacher.teacher_id
          );
          return !exists;
        });
        console.log(this.teachersList);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  // delete studentId
  deleteStudent(studentId: string): void {
    this.student_ids.push(studentId);
  }

  //delete teacher
  deleteTeacher(teacherId: string): void {
    this.teacher_ids.push(teacherId);
  }

  //add student
  addStudent(): void {
    if (!this.selectedStudentId) return;
    this.student_ids.push(this.selectedStudentId);
  }

  // // إضافة مدرس
  addTeacher(): void {
    if (!this.selectedTeacherId) return;
    this.teacher_ids.push(this.selectedTeacherId);
  }

  edit() {
    this.newclass.className = this.classData.className;
    this.newclass.stage = this.classData.stage;
    this.newclass.level = this.classData.level;
    this.newclass.studentIds = this.student_ids;

    this.newclass.teacherIds = this.teacher_ids;
    console.log(this.newclass);
    this.classService.edit(this.classData.classID, this.newclass).subscribe({
      next: (data: any) => {
        console.log(data);
        alert(data.message);
        this.router.navigate(['/getClassDetails']);
      },
      error: (error) => {
        console.log(error.message, error);
      },
    });
  }
}
