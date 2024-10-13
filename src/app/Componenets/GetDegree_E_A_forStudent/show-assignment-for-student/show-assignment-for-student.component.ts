import { Component, OnInit } from '@angular/core';
import { DegreeForStudentsService } from '../../../Services/degree-for-students.service';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../../Services/token-service.service';

@Component({
  selector: 'app-show-assignment-for-student',
  standalone: true,
  imports: [RouterModule],
  providers: [TokenService, DegreeForStudentsService],
  templateUrl: './show-assignment-for-student.component.html',
  styleUrl: './show-assignment-for-student.component.css',
})
export class ShowAssignmentForStudentComponent implements OnInit {
  assignment: any[] = [];
  Studnet_Id: any = '';
  constructor(
    public myserv: DegreeForStudentsService,
    private mytoken: TokenService
  ) {
    this.Studnet_Id = this.mytoken.getUserId();
  }
  ngOnInit(): void {
    this.myserv.getassignmentforstud(this.Studnet_Id).subscribe({
      next: (data: any) => {
        this.assignment = data;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
