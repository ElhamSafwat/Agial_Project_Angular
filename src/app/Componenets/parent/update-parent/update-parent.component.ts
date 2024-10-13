import { Component, NgModule, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ParentService } from '../../../Services/parent.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-parent',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [ParentService],
  templateUrl: './update-parent.component.html',
  styleUrl: './update-parent.component.css',
})
export class UpdateParentComponent implements OnInit {
  each_obj: any;
  id: string = '';
  constructor(
    private myservice: ParentService,
    private myrout: ActivatedRoute,
    private router: Router
  ) {
    this.id = this.myrout.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.each_obj = this.myservice.getbyid(this.id).subscribe({
      next: (data) => {
        this.each_obj = data;
        console.log(this.each_obj);
        this.userForm.patchValue({
          Full_Name: this.each_obj.fullName,
          Email: this.each_obj.email,
          phoneNumber: this.each_obj.fullphone,
        });
        console.log(this.userForm.value);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  userForm = new FormGroup({
    Full_Name: new FormControl('', Validators.required),
    Email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^((\\+20|0)?1[0-9]{9}|(\\+966|0)?5[0-9]{8}|(\\+965)?[569][0-9]{7}|(\\+971|0)?5[0-9]{8})$'
      ),
    ]),
  });

  onSubmit() {
    if (this.userForm.valid) {
      this.myservice.updata(this.id, this.userForm.value).subscribe({
        next: (massege) => {
          this.router.navigate(['/show-parent']);
          console.log(massege);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
