import { Component, OnInit } from '@angular/core';
import { ParentteacherfeedbackServiseService } from '../../../../Services/parentteacherfeedback-servise.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../../Services/token-service.service';

@Component({
  selector: 'app-get-all-feedback',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  providers: [TokenService],
  templateUrl: './get-all-feedback.component.html',
  styles: ``,
})
export class GetAllFeedbackComponent implements OnInit {
  constructor(
    public myserve: ParentteacherfeedbackServiseService,
    private mytoken: TokenService
  ) {
    this.parentid = this.mytoken.getUserId();
    console.log('hhhhh' + this.parentid);
  }
  parentid: any;
  Allfeedback: any[] = [];
  //Search
  filteredTeachers: any[] = [];
  searchTerm: string = '';

  ngOnInit(): void {
    //console.log(this.myserve.GetTeachers())
    this.myserve.GetFeedbackParentbyid(this.parentid).subscribe({
      next: (data) => {
        this.Allfeedback = data as any[];
        this.filteredTeachers = data as any[];
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  searchTeacher(): void {
    if (this.searchTerm) {
      this.filteredTeachers = this.Allfeedback.filter((t) =>
        t.teacher_Name.includes(this.searchTerm)
      );
    } else {
      this.filteredTeachers = this.Allfeedback;
    }
  }
}
