import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SessionsService } from '../../../Services/sessions.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-sessions',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  providers: [SessionsService],
  templateUrl: './edit-sessions.component.html',
  styleUrls: ['./edit-sessions.component.css'],
})
export class EditSessionsComponent implements OnInit {
  ID = 0;
  session: any = {
    session_ID: 0,
    room: '',
    date: '',
    start_Time: '',
    end_Time: '',
    period: '',
  };
  dateInvalid: boolean = false;
  startTimeInvalid: boolean = false;
  endTimeInvalid: boolean = false;
  roomNumberInvalid: boolean = false;

  validateDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateObj = new Date(this.session.date);
    this.dateInvalid = !this.session.date || selectedDateObj < today;
  }

  validateStartTime() {
    const startTimeNum = parseInt(this.session.start_Time, 10);
    this.startTimeInvalid =
      !this.session.start_Time ||
      isNaN(startTimeNum) ||
      startTimeNum < 1 ||
      startTimeNum > 12;
  }

  validateEndTime() {
    const endTimeNum = parseInt(this.session.end_Time, 10);
    this.endTimeInvalid =
      !this.session.end_Time ||
      isNaN(endTimeNum) ||
      endTimeNum < 1 ||
      endTimeNum > 12;
  }

  validateRoom() {
    this.roomNumberInvalid = !this.session.room;
  }

  constructor(
    private myroute: ActivatedRoute,
    private myserv: SessionsService,
    private router: Router
  ) {
    this.ID = myroute.snapshot.params['session_ID'];
    console.log('Session ID:', this.ID);
  }

  ngOnInit(): void {
    this.myserv.GetSessionByID(this.ID).subscribe({
      next: (data) => {
        this.session = data;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  saveChanges() {
    this.session.session_ID = this.ID;

    this.myserv.EditSession(this.session).subscribe({
      next: (response) => {
        console.log('Session updated successfully:', response);
        this.router.navigate(['/sessions']);
      },
      error: (error) => {
        console.error('Error updating session:', error);
        if (error.error) {
          console.error('Error details:', error.error);
        }
        alert('حدث خطأ أثناء تحديث الجلسة. حاول مرة أخرى.');
      },
    });
  }
}
