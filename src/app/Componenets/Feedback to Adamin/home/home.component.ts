import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StudentFeedbackComponent } from '../student-feedback/student-feedback.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule, 
    StudentFeedbackComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
