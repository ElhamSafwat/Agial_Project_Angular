import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TokenService } from '../../Services/token-service.service';
import { ProfileService } from '../../Services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-user',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  providers: [],
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css'],
})
export class ProfileUserComponent implements OnInit {
  userClaims: any;
  user_id: string = '';

  // user data
  user: any;
  isEditMode = false;
  editMode: 'personal' | 'password' = 'personal'; // نوع التعديل
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private myservec: ProfileService,
    private mytoken: TokenService,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      fullName: [null, Validators.required],

      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^((\\+20|0)?1[0-9]{9}|(\\+966|0)?5[0-9]{8}|(\\+965)?[569][0-9]{7}|(\\+971|0)?5[0-9]{8})$'
          ),
        ],
      ],
      currentPassword: [],
      newPassword: [],
      confirmPassword: [],
    });
  }

  ngOnInit(): void {
    this.userClaims = this.mytoken.getTokenClaims();
    this.user_id =
      this.userClaims?.[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ];

    this.myservec.get_profile(this.user_id).subscribe({
      next: (data) => {
        this.user = data;
        this.editForm.patchValue({
          fullName: this.user.full_name,
          username: this.user.username,
          phone: this.user.phone,
          email: this.user.email,
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // display form edit
  onEdit() {
    this.isEditMode = true;
  }

  onCancel() {
    this.isEditMode = false;
  }

  editPersonalInfo() {
    this.editMode = 'personal';
    this.editForm.reset();
    this.editForm.patchValue({
      fullName: this.user.full_name,
      // username: this.user.username,
      phone: this.user.phone,
      email: this.user.email,
    });
  }

  editPassword() {
    this.editMode = 'password';
    this.editForm.reset();
  }

  onSubmit() {
    if (this.editMode === 'personal') {
      if (
        this.editForm.value.fullName != '' &&
        this.editForm.value.email != '' &&
        this.editForm.value.phone != ''
      ) {
        const updatedData = {
          full_name: this.editForm.value.fullName,
          // username: this.editForm.value.username,
          email: this.editForm.value.email,
          phone: this.editForm.value.phone,
        };

        this.myservec.edit_profile(this.user_id, updatedData).subscribe({
          next: (result) => {
            this.isEditMode = false;
            this.myservec.get_profile(this.user_id).subscribe({
              next: (data) => {
                this.user = data;
                this.editForm.patchValue({
                  fullName: this.user.full_name,
                  username: this.user.username,
                  phone: this.user.phone,
                  email: this.user.email,
                });
              },
              error: (err) => {
                console.log(err);
              },
            });
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    } else if (this.editMode === 'password') {
      if (
        this.editForm.value.currentPassword != '' &&
        this.editForm.value.newPassword != ''
      ) {
        const passwordData = {
          oldpassword: this.editForm.value.currentPassword,
          new_password: this.editForm.value.newPassword,
        };

        this.myservec.change_password(this.user_id, passwordData).subscribe({
          next: (result) => {
            // console.log(result);
            this.isEditMode = false;
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    }
  }
}
