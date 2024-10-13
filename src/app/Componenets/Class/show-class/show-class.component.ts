import { Component, OnInit } from '@angular/core';

import { RouterLink, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClassService } from '../../../Services/class.service';

@Component({
  selector: 'app-show-class',
  standalone: true,
  imports: [
    RouterModule,
    NgxPaginationModule,
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  providers: [ClassService],
  templateUrl: './show-class.component.html',
  styleUrl: './show-class.component.css',
})
export class ShowClassComponent implements OnInit {
  AllClass: any;
  p: number = 1;
  constructor(public myserv: ClassService) {}
  ngOnInit(): void {
    this.loadClass();
  }
  loadClass() {
    this.myserv.GetAll().subscribe({
      next: (data) => {
        this.AllClass = data;
        // console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  deleteClass(classID: number) {
    if (confirm('  هل متاكد انك  تريد حذف تلك المجموعه؟ ')) {
      this.myserv.delete(classID).subscribe({
        next: () => {
          this.loadClass();
          console.log(classID);
        },
        error: (err) => {
          console.error('Error delete student', err);
        },
      });
    }
  }
}
