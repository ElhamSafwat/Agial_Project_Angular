// teacher-data.model.ts
export interface Student {
    studentName: string;
    studentId: string;
  }
  
  export interface Parent {
    parentName: string;
    parentId: string;
    students: Student[];
  }
  
  export interface ClassData {
    className: string;
    parentsWithStudents: Parent[];
  }
  