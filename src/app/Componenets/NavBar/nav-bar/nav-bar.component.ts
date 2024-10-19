import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../../Services/token-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {
  userlogin: any;
  role: any;
  myroute: string = '';
  constructor(private tokenService: TokenService, private router: Router) {
   
  }
  ngOnInit(): void {
    this.loadUserData();
    this.role = this.tokenService.getRole();
    if (this.role == 'Student') {
      this.myroute = '/HomeStudent';
    } else if (this.role == 'Teacher') {
      this.myroute = '/HomeTeacher';
    } else if (this.role == 'Parent') {
      this.myroute = '/Homeparent';
    } else {
      this.myroute = 'HomeAdmin';
    } 
   }

  userClaims: any;
  loadUserData() {
    if (localStorage.getItem('token')) {
      this.userlogin = this.tokenService.getUsername();
      console.log(this.tokenService.getRole());
    }
  }
  // romve token and appear button login
  logout() {
    localStorage.removeItem('token');
    this.userlogin = '';
    this.router.navigate(['/Home']);
  }
  //check is loginuser
  getlogin() {
    return localStorage.getItem('token') != null;
  }
}
