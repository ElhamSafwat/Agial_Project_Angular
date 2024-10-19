import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShowAttandenceService } from '../../Services/show-attandence.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-show-attandence',
  standalone: true,
  imports: [
    RouterModule,
    NgxPaginationModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [ShowAttandenceService],
  templateUrl: './show-attandence.component.html',
  styleUrl: './show-attandence.component.css',
})
export class ShowAttandenceComponent implements OnInit {
  p: number = 1;
  filteredSessions: {
    teachername: string;
    className: string;
    date: Date;
    session_name: string;
    studentname: string;
    attendance: string;
  }[] = [];
  Alldata: any;
  isLoading: boolean = true;
  constructor(private myService: ShowAttandenceService) {}
  input1Value: string = '';
  input2Value: string = '';
  input3Value: string = '';
  input4Value: any;
  search_date: any;
  No_data_search: string = '';

  onInput1Change() {
    if (this.Alldata.length > 0) {
      this.filteredSessions = this.Alldata;
      this.search_date = this.filteredSessions.filter((user) =>
        user.className.includes(this.input1Value)
      );

      if (this.search_date.length == 0) {
        this.No_data_search = 'لا توجد مجموعه بهذا اسم ';
      } else {
        this.filteredSessions = this.search_date;
        this.No_data_search = '';
      }
    }
  }

  onInput2Change() {
    if (this.Alldata.length > 0) {
      this.filteredSessions = this.Alldata;
      this.search_date = this.filteredSessions.filter((user) =>
        user.teachername.includes(this.input2Value)
      );

      if (this.search_date.length == 0) {
        this.No_data_search = 'لا  يوجد مدرس  بهذا اسم ';
      } else {
        this.filteredSessions = this.search_date;
        this.No_data_search = '';
      }
    }
  }

  onInput3Change() {
    if (this.Alldata.length > 0) {
      this.filteredSessions = this.Alldata;
      this.search_date = this.filteredSessions.filter((user) =>
        user.studentname.includes(this.input3Value)
      );

      if (this.search_date.length == 0) {
        this.No_data_search = 'لا  يوجد طالب   بهذا اسم ';
      } else {
        this.filteredSessions = this.search_date;
        this.No_data_search = '';
      }
    }
  }

  onInput4Change() {
    if (this.Alldata.length > 0) {
      this.filteredSessions = this.Alldata;
      this.search_date = this.filteredSessions.filter(
        (user) => user.date === this.input4Value
      );

      if (this.search_date.length == 0) {
        this.No_data_search = 'لا يوجد داتا حضور في تلك اليوم ';
      } else {
        this.filteredSessions = this.search_date;
        this.No_data_search = '';
      }
    }
  }
  ngOnInit(): void {
    this.myService.getAllAttendence().subscribe({
      next: (data: any) => {
        this.filteredSessions = data;
        this.Alldata = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  showAll() {
    this.myService.getAllAttendence().subscribe({
      next: (data: any) => {
        this.filteredSessions = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  myformdate = new FormGroup({
    dateto: new FormControl(Date.now, Validators.required),
    datefrom: new FormControl(Date.now, Validators.required),
  });
  myform = new FormGroup({
    student_stage: new FormControl('أبتدائي', Validators.required),
    student_level: new FormControl(1, Validators.required),
    classname: new FormControl('', Validators.required),
    date: new FormControl(Date.now, Validators.required),
  });
  search_byclass() {
    if (this.myform.valid) {
      // this.isLoading = true;
      this.myService
        .getbyclassname(
          this.myform.controls['classname'].value,
          this.myform.controls['student_stage'].value,
          this.myform.controls['student_level'].value,
          this.myform.controls['date'].value
        )
        .subscribe({
          next: (data: any) => {
            this.filteredSessions = data;
            // this.isLoading = false;
          },
          error: (err) => {
            // alert(
            //   'من فضلك ادخل داتا مجموعه صحيحه حتي تحصل علي جدول حضور مجموعه صحيحه'
            // );
            Swal.fire({
              title: 'خطأ!',
              text: 'من فضلك ادخل داتا مجموعه صحيحه حتي تحصل علي جدول حضور مجموعه صحيحه',
              width: 380,
              confirmButtonColor: 'red',
              confirmButtonText: 'حسنا',

              icon: 'warning',
              // timer: 3000,
              showConfirmButton: true,
            });
            console.log(err);
          },
        });
    } else {
      // alert('ادخل داتا اولا في جميع الحقول');
      Swal.fire({
        title: 'خطأ!',
        text: 'ادخل داتا اولا في جميع الحقول',
        width: 380,
        confirmButtonColor: 'red',
        confirmButtonText: 'حسنا',

        icon: 'warning',
        // timer: 3000,
        showConfirmButton: true,
      });
    }
  }
  search_bydate() {
    if (this.myformdate.valid) {
      // this.isLoading = true;
      this.myService
        .getbydate(
          this.myformdate.controls['datefrom'].value,
          this.myformdate.controls['dateto'].value
        )
        .subscribe({
          next: (value: any) => {
            this.filteredSessions = value;
            // this.isLoading = false;
          },
          error: (err) => {
            // alert('من فضلك يجب ان يكون تاريخ اول اصغر من تاريخ تاني ');
            Swal.fire({
              title: 'خطأ!',
              text: 'من فضلك يجب ان يكون تاريخ اول اصغر من تاريخ تاني ',
              width: 380,
              confirmButtonColor: 'red',
              confirmButtonText: 'حسنا',

              icon: 'warning',
              // timer: 3000,
              showConfirmButton: true,
            });
            console.log(err);
          },
        });
    } else {
      // alert('ادخل داتا اولا في جميع الحقول');
      Swal.fire({
        title: 'خطأ!',
        text: 'ادخل داتا اولا في جميع الحقول',
        width: 380,
        confirmButtonColor: 'red',
        confirmButtonText: 'حسنا',

        icon: 'warning',
        // timer: 3000,
        showConfirmButton: true,
      });
    }
  }
}
