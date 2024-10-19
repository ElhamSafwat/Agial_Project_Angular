import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectServiceService } from '../../../Services/subject-service.service';
import { FormsModule } from '@angular/forms';

// Define the Subject interface
interface Subject {
  id: number;
  subject_Name: string;
  description: string;
}

@Component({
  selector: 'app-update-subject',
  standalone: true,
  imports: [FormsModule],
  providers: [SubjectServiceService],
  templateUrl: './update-subject.component.html',
  styleUrls: ['./update-subject.component.css']
})
export class UpdateSubjectComponent implements OnInit {
  id = 0;
  subjectName = '';
  description = '';

  constructor(
    private myRoute: ActivatedRoute,
    private myService: SubjectServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.myRoute.params.subscribe(params => {
      this.id = +params['id'];

    
      this.myService.GetSubjectByID(this.id).subscribe({
        next: (data: any) => {
          console.log(data);
          this.subjectName = data.subject_Name; 
          this.description = data.description;
        },
        error: (err) => {
          console.log(err);
        }
      });
    });
  }

  onUpdate(): void {
    const updatedSubject: Subject = {
      id: this.id,
      subject_Name: this.subjectName, // Use subjectName and description for update
      description: this.description,
    };

    // Pass the subject and ID for updating
    this.myService.UpdateSubject(this.id, updatedSubject).subscribe({
      next: () => {
        console.log('Subject updated successfully');
        this.router.navigate(['/Subject']); // Navigate back to the subject list
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
