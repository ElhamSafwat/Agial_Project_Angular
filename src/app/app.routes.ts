import { Routes } from '@angular/router';
import { SubjectComponent } from './Componenets/Subject/subject/subject.component';
import { HomeAdminComponent } from './Componenets/HomeAdmin/home-admin/home-admin.component';
import { UpdateSubjectComponent } from './Componenets/Subject/update-subject/update-subject.component';
import { ExamForAdminComponent } from './Componenets/exam-for-admin/exam-for-admin.component';
import { LoginPageComponent } from './Componenets/login-page/login-page.component';
import { AddParentComponent } from './Componenets/parent/add-parent/add-parent.component';
import { ShowParentComponent } from './Componenets/parent/show-parent/show-parent.component';
import { UpdateParentComponent } from './Componenets/parent/update-parent/update-parent.component';
import { StudentFeedbackComponent } from './Componenets/Feedback to Adamin/student-feedback/student-feedback.component';
import { ParentFeedbackComponent } from './Componenets/Feedback to Adamin/parent-feedback/parent-feedback.component';
import { TeacherFeedbackComponent } from './Componenets/Feedback to Adamin/teacher-feedback/teacher-feedback.component';
import { HomeComponent } from './Componenets/Feedback to Adamin/home/home.component';
import { GetAllTeacherComponent } from './Componenets/teacher/get-all-teacher/get-all-teacher.component';
import { AddTeacherComponent } from './Componenets/teacher/add-teacher/add-teacher.component';
import { AllSessionsComponent } from './Componenets/Sessions/all-sessions/all-sessions.component';

import { AddSessionsComponent } from './Componenets/Sessions/add-sessions/add-sessions.component';
import { EditSessionsComponent } from './Componenets/Sessions/edit-sessions/edit-sessions.component';

import { ProfileUserComponent } from './Componenets/profile-user/profile-user.component';
import { CalendarTeacherComponent } from './Componenets/calendar-teacher/calendar-teacher.component';
import { StudentCalendarComponent } from './Componenets/student-calendar/student-calendar.component';
import { ParentCalendarComponent } from './Componenets/parent-calendar/parent-calendar.component';
import { HomeParentComponent } from './Componenets/Home parent/home-parent.component';
import { HomeStudentComponent } from './Componenets/Home Student/home-student.component';
import { TeacherPageComponent } from './Componenets/TeacherHome/teacher-page.component';
import { TeacherParentFeedBackComponent } from './Componenets/teacher-parent-feed-back/teacher-parent-feed-back.component';
import { PutDegreeToStudentForTeacherComponent } from './Componenets/put-degree-to-student-for-teacher/put-degree-to-student-for-teacher.component';
import { AddAssignmentComponent } from './Componenets/Assignment/add-assignment/add-assignment.component';
import { TeacherClassComponent } from './Componenets/Assignment/teacher-class/teacher-class.component';
import { AddExamComponent } from './Componenets/CreateExam/add-exam/add-exam.component';
import { GetAllExamComponent } from './Componenets/CreateExam/get-all-exam/get-all-exam.component';
import { StudentTeacherFeedbackComponent } from './Componenets/student-feedback/student-teacher-feedback.component';
import { DegreeForStudentComponent } from './Componenets/GetDegree_E_A_forStudent/degree-for-student/degree-for-student.component';
import { ShowAssignmentForStudentComponent } from './Componenets/GetDegree_E_A_forStudent/show-assignment-for-student/show-assignment-for-student.component';
import { AdfeedbackComponent } from './Componenets/student-feedback/addfeedback/addfeedback.component';
import { EditExamComponent } from './Componenets/CreateExam/edit-exam/edit-exam.component';
import { AttendanceComponent } from './Componenets/Assignment/attendance/attendance.component';
import { UpdateDegreeForTeacherComponent } from './Componenets/update-degree-for-teacher/update-degree-for-teacher.component';
import { GetAllFeedbackComponent } from './Componenets/create feedback parent teacher/GetAllFeedBack/get-all-feedback/get-all-feedback.component';
import { AddFeedbackComponent } from './Componenets/create feedback parent teacher/add-feedback/add-feedback.component';

import { EditClassComponent } from './Componenets/Class/edit-class/edit-class.component';
import { AddClassComponent } from './Componenets/Class/add-class/add-class.component';
import { DegreeAssignmentParentComponent } from './Componenets/degree-assignment-parent/degree-assignment-parent.component';
import { DegreeExamParentComponent } from './Componenets/degree-exam-parent/degree-exam-parent.component';
import { HomeBasicComponent } from './Componenets/home-basic/home-basic.component';
import { ShowClassComponent } from './Componenets/Class/show-class/show-class.component';
import { AllStudentsComponent } from './Componenets/Students/all-students/all-students.component';
import { AddStudentComponent } from './Componenets/Students/add-student/add-student.component';
import { EditStudentComponent } from './Componenets/Students/edit-student/edit-student.component';

export const routes: Routes = [
  //route eng: fares
  { path: '', component: HomeBasicComponent },
  { path: 'Home', component: HomeBasicComponent },
  { path: 'HomeAdmin', component: HomeAdminComponent },
  { path: 'Subject', component: SubjectComponent },
  { path: 'Subject/:id', component: UpdateSubjectComponent },
  { path: 'ExamForAdmin', component: ExamForAdminComponent },
  { path: 'Login', component: LoginPageComponent },
  //route parent:raghda
  { path: 'add-parent', component: AddParentComponent },
  { path: 'show-parent', component: ShowParentComponent },
  { path: 'update/:id', component: UpdateParentComponent },
  //profile
  { path: 'profile', component: ProfileUserComponent },
  //calender

  //route eng :abdelhafez feedback
  { path: 'HomeFeedbackAdamin', component: HomeComponent },
  { path: 'student-feedback', component: StudentFeedbackComponent },
  { path: 'parent-feedback', component: ParentFeedbackComponent },
  { path: 'teacher-feedback', component: TeacherFeedbackComponent },
  //route :eng:mohammed addteacher
  { path: 'GetAllTeacher', component: GetAllTeacherComponent },
  { path: 'AddTeacher', component: AddTeacherComponent },
  //route eman session
  { path: 'sessions', component: AllSessionsComponent },
  { path: 'add-session', component: AddSessionsComponent },
  { path: 'edit-session/:session_ID', component: EditSessionsComponent },
  //route elham studen
  { path: 'detailsstudent', component: AllStudentsComponent },
  { path: 'CreateStudent', component: AddStudentComponent },

  { path: 'EditStudent/:student_Id', component: EditStudentComponent },
  { path: 'getClassDetails', component: ShowClassComponent },
  { path: 'EditClass/:classID', component: EditClassComponent },
  { path: 'AddClass', component: AddClassComponent },

  //home teacher
  { path: 'HomeTeacher', component: TeacherPageComponent },

  { path: 'TeacherParentfeadback', component: TeacherParentFeedBackComponent },
  {
    path: 'insertdegreeforteacher',
    component: PutDegreeToStudentForTeacherComponent,
  },
  { path: 'GetExamFormTeacher', component: GetAllExamComponent },
  { path: 'addExam', component: AddExamComponent },
  { path: 'updateExam/:id', component: EditExamComponent },

  { path: 'TeacherCalendar', component: CalendarTeacherComponent },
  { path: 'AssigmentandAtandence', component: TeacherClassComponent },
  { path: 'add-assignment/:classid', component: AddAssignmentComponent },
  { path: 'add-attendance/:classid', component: AttendanceComponent },

  {
    path: 'UpdateDegreeForTeacher/:examId/:studentId/:teacherId',
    component: UpdateDegreeForTeacherComponent,
  },
  ////////////////////////////////////////////////////////////////////
  //student home page
  { path: 'HomeStudent', component: HomeStudentComponent },

  { path: 'StudentCalendar', component: StudentCalendarComponent },

  { path: 'ShowStudentFeedback', component: StudentTeacherFeedbackComponent },
  { path: 'getdergreeforyou', component: DegreeForStudentComponent },
  { path: 'getforAssigment', component: ShowAssignmentForStudentComponent },
  { path: 'add-feedback-Student', component: AdfeedbackComponent },

  //home parent
  { path: 'Homeparent', component: HomeParentComponent },
  { path: 'GEtYourFeedback', component: GetAllFeedbackComponent },
  { path: 'CreateFeedBackForTeacher', component: AddFeedbackComponent },
  { path: 'ParentCalendar', component: ParentCalendarComponent },
  {
    path: 'DegreeForAssigmentParent',
    component: DegreeAssignmentParentComponent,
  },
  { path: 'DegreeForExamParent', component: DegreeExamParentComponent },
];
