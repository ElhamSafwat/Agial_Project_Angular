import { Component, OnInit } from '@angular/core';
import { PutDegreeToStudentForTeacherService } from '../../Services/put-degree-to-student-for-teacher.service';
import {
ApiResponse,
PutDegreeForTeacher,
StudentExam,
} from '../../Types/put-degree-for-teacher';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../Services/token-service.service';
@Component({
selector: 'app-put-degree-to-student-for-teacher',
standalone: true,
imports: [FormsModule, CommonModule, RouterModule],
providers: [PutDegreeToStudentForTeacherService, TokenService],
templateUrl: './put-degree-to-student-for-teacher.component.html',
styleUrls: ['./put-degree-to-student-for-teacher.component.css'],
})
export class PutDegreeToStudentForTeacherComponent implements OnInit {
studentData: any[] = [];
selectedStudentId = '';
selectedDate: string = '';
Mytoken_id: any = '';
selectedAnotherDate: string = '';
anotherDateErrorMessage: string = '';
ExamID: number = 0;
minDegree: number = 0;
maxDegree: number = 0;
subjectName: string = '';
noExamMessage: string = '';
successMessage: string = '';
errorMessage: string = '';
StudentExams: StudentExam[] = [];
searchTerm: string = '';
filteredStudentExams: any[] = [];
studentNotFoundMessage: string = '';
classDataByTeacherID:any[]=[];
studentsByClassID: Array<any> = [];
selectedClassId = 0;
constructor(
private myService: PutDegreeToStudentForTeacherService,
private mytoken: TokenService
) {}

staticExamResult: PutDegreeForTeacher = {
student_Id: this.selectedStudentId,
exam_Id: this.ExamID,
degree: 0,
teacher_Id: '',
};

ngOnInit(): void {
this.getClassData();
const storedDate = localStorage.getItem('selectedAnotherDate');
const storedExamDetails = localStorage.getItem('examDetails');
if (storedDate && storedExamDetails) {
this.selectedAnotherDate = storedDate;
const examDetails = JSON.parse(storedExamDetails);
this.ExamID = examDetails[0].exam_ID;
this.getExamsByExamID();
}
if (localStorage.getItem('token') != null) {
this.staticExamResult.teacher_Id = this.mytoken.getUserId();
}
}
getClassData() {
this.staticExamResult.teacher_Id = this.mytoken.getUserId(); 
this.myService.getClassIDByTeacherID(this.staticExamResult.teacher_Id).subscribe({
next: (data) => {
this.classDataByTeacherID = data.map(item => ({
      classId: item.classid,  
      className: item.className
  }))
console.log(this.classDataByTeacherID[0].classId);
console.log(this.classDataByTeacherID[0].className);
},
error: (err) => {
console.error('Error fetching class data:', err);
},
});
}
getStudentsByClass() {
if (!this.selectedClassId) return;

this.myService.getStudentsByClassID(this.selectedClassId).subscribe({
next: (studentData) => {
this.studentsByClassID = studentData.map(student => ({
...student,
degree: null // Add degree property for input
}));
},
error: (err) => {
console.error('Error fetching students:', err);
},
});
}
getExamDetails() {
const teacherId: any = this.mytoken.getUserId();
console.log(teacherId); // static Now
if (!this.selectedDate) {
this.noExamMessage = 'يرجى اختيار تاريخ';
return;
}
this.myService
.getExamDetailsByTeacherAndDate(teacherId, this.selectedDate)
.subscribe({
next: (response: ApiResponse) => {
const examDetails = response;

if (Array.isArray(examDetails) && examDetails.length > 0) {
this.noExamMessage = '';
for (const exam of examDetails) {
  this.ExamID = exam.exam_ID;
  console.log(this.ExamID);
  this.minDegree = exam.min_Degree;
  this.maxDegree = exam.max_Degree;
  this.subjectName = exam.subject_name;
}
} else {
this.noExamMessage = 'لا يمتلك امتحان في هذا اليوم';
}
},
error: (err) => {
this.noExamMessage = 'ليس لديك امتحانات في هذا اليوم';
},
});
}
insertAllDegrees() {
  // Check if the date is selected
  if (!this.selectedDate) {
    this.errorMessage = 'يرجى اختيار تاريخ الامتحان'; // Message to prompt for date selection
    return;
  }

  // Check if there are students to enter grades for
  if (!this.studentsByClassID || this.studentsByClassID.length === 0) {
    this.errorMessage = 'لا يوجد طلاب لإدخال الدرجات';
    return;
  }

  // Check for invalid degrees
  const invalidDegree = this.studentsByClassID.some(student => 
    student.degree === null || student.degree < 0 || student.degree > this.maxDegree
  );

  if (invalidDegree) {
    this.errorMessage = `يجب أن تكون الدرجة بين 0 و ${this.maxDegree}`;
    return;
  }

  // Check if an exam is selected
  if (!this.ExamID) {
    this.errorMessage = 'يرجى اختيار امتحان قبل إدخال الدرجات';
    return;
  }

  const teacherId = this.mytoken.getUserId();

  // Loop over students and submit their degrees
  this.studentsByClassID.forEach(student => {
    const examResult = {
      student_Id: student.userID,
      exam_Id: this.ExamID,
      degree: student.degree,
      teacher_Id: teacherId
    };
    this.myService.insertExamResult(examResult).subscribe({
      next: (response) => {
        this.successMessage = 'تم إدخال الدرجات بنجاح!';

        // Clear the success message and student data after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
          this.studentsByClassID = []; // Clear the students list
          this.selectedClassId = 0; // Reset selected class
        }, 3000); // 3000 milliseconds = 3 seconds
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.errorMessage = 'لقد تم إدخال درجات الطلاب من قبل لهذا الامتحان اذا تريد ان تستعلم على درجات الطلاب اذهب للاسفل وادخل تاريخ الامتحان';
        } else {
          console.error('Error inserting exam result:', err);
          this.errorMessage = 'حدث خطأ أثناء إدخال الدرجات: ' + err.message;
        }
      },
    });
  });
}

clearErrorMessage() {
this.errorMessage = '';
}

onAnotherDateChange() {
this.clearErrorMessage();
if (!this.selectedAnotherDate) {
this.anotherDateErrorMessage = 'يرجى إدخال تاريخ صحيح';
return;
}
const teacherId: any = this.mytoken.getUserId(); // Static Now
this.myService
.getExamDetailsByTeacherAndDate(teacherId, this.selectedAnotherDate)
.subscribe({
next: (response: ApiResponse) => {
const examDetails = response;
if (Array.isArray(examDetails) && examDetails.length > 0) {
this.anotherDateErrorMessage = '';
this.ExamID = examDetails[0].exam_ID;
this.getExamsByExamID();
localStorage.setItem(
  'selectedAnotherDate',
  this.selectedAnotherDate
);
localStorage.setItem('examDetails', JSON.stringify(examDetails));
} else {
this.anotherDateErrorMessage = 'ليس لديك امتحانات في هذا اليوم';
}
},
error: (err: HttpErrorResponse) => {
console.error('Error fetching exam details:', err);
if (err.status === 404) {
this.anotherDateErrorMessage = 'ليس لديك امتحانات في هذا اليوم';
} else {
this.anotherDateErrorMessage =
  'حدث خطأ أثناء جلب تفاصيل الامتحان: ' + err.message;
}
},
});
}
onSearch() {
this.studentNotFoundMessage = '';
if (this.searchTerm.trim() === '') {
this.filteredStudentExams = this.StudentExams;
return;
}
const searchLowerCase = this.searchTerm.trim().toLowerCase();
this.filteredStudentExams = this.StudentExams.filter((studentExam) =>
studentExam.studentName.toLowerCase().includes(searchLowerCase)
);
if (this.filteredStudentExams.length === 0) {
this.studentNotFoundMessage = 'اسم الطالب ليس موجود فى هذا الامتحان';
}
}
getExamsByExamID() {
if (this.ExamID === 0) {
this.anotherDateErrorMessage = 'يرجى اختيار امتحان صحيح لجلب البيانات';
return;
}
this.myService.getStudentExamsByExamId(this.ExamID).subscribe({
next: (data) => {
this.StudentExams = data;
this.filteredStudentExams = data;
// console.log(this.StudentExams);
},
error: (err) => {
console.error('Error fetching student exams:', err);
},
});
}

clearDateAndData() {
this.selectedAnotherDate = '';
this.anotherDateErrorMessage = '';
this.StudentExams = [];
this.filteredStudentExams = [];
this.searchTerm = '';
this.studentNotFoundMessage = '';
localStorage.removeItem('selectedAnotherDate');
localStorage.removeItem('examDetails');
}
}




