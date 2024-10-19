export interface Student {
  studentName: string;
  studentId: string;
}

export interface ClassData {
  className: string;
  students: Student[];
}

export interface ExamDetails {
  exam_ID: number;
  exam_Date: string;
  start_Time: number;
  end_Time: number;
  min_Degree: number;
  max_Degree: number;
  class_name: string;
  subject_name: string;
  teacher_Name: string;
}

export interface PutDegreeForTeacher {
  student_Id: string;
  exam_Id: number;
  degree: number;
  teacher_Id: any;
}

export interface ApiResponse {
  studentData?: ClassData[];
  examDetails?: ExamDetails[];
  insertResponse?: any;
}

export interface StudentExam {
  studentID: string;
  studentName: string;
  examID: number;
  degree: number;
  maxDegree: number;
  minDegree: number;
  subjectName: string;
  status: string;
  parentPhone: string;
}
