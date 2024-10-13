import { Type } from '@angular/compiler';

export interface students {
  Student_Name: string;
  fullName: string;
  Student_Email: string;
  Password: string;
  ConfirmPassword: string;
  Phone_Number: string;
  Level: number;
  enrollmentDate: Date;
  Stage: string;
}

//type for create
export type parents = {
  UserName?: string;
  FullName?: string;
  Email?: string;
  Password?: string;
  ConfirmPassword?: string;
  Phone?: string;
  students?: students[];
};
//type for get_parent
export type get_parents = {
  userId: string;
  fullName: string;
  fullphone: string;
  email: string;
  studentname: string[];
};
