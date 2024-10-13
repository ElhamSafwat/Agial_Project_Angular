import { Component, OnInit } from '@angular/core';
import { ParentService } from '../../../Services/parent.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../Services/token-service.service';

@Component({
  selector: 'app-show-parent',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  providers: [ParentService],
  templateUrl: './show-parent.component.html',
  styleUrl: './show-parent.component.css',
})
export class ShowParentComponent implements OnInit {
  isLoading: boolean = true;
  //value of sreach
  parentName: string = '';
  users: any[] = [];
  sreach_users: any[] = [];
  No_data_search = '';
  currentPage: number = 1;
  pageSize: number = 40;
  paginatedUsers: any[] = [];
  totalPages: number = 0;

  constructor(
    private mysr: ParentService,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.loadUserData();
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.mysr.get_all().subscribe({
      next: (data: any) => {
        this.users = data;

        this.totalPages = Math.ceil(this.users.length / this.pageSize);
        this.paginate();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error retrieving data', err);
      },
    });
  }

  paginate() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    if (this.sreach_users.length > 0) {
      this.paginatedUsers = this.sreach_users.slice(startIndex, endIndex);
    } else {
      this.paginatedUsers = this.users.slice(startIndex, endIndex);
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginate();
    }
  }
  del(id: string) {
    if (
      confirm('هل متاكد نك تريد حذف تلك ولي امر لان بذلك سيتم حذف جميع ابناءه ')
    ) {
      this.mysr.delete(id).subscribe({
        next: () => {
          this.getUsers();
          console.log(id);
        },
        error: (err) => {
          console.error('Error delete student', err);
        },
      });
    }
  }

  onSearch() {
    if (this.parentName.trim() === '') {
      this.No_data_search = '';
      this.sreach_users = this.users;
      this.totalPages = Math.ceil(this.sreach_users.length / this.pageSize);
      this.paginate();
      return;
    }

    this.sreach_users = this.users.filter((user) =>
      user.fullName.toLowerCase().includes(this.parentName.toLowerCase())
    );

    if (this.sreach_users.length === 0) {
      this.No_data_search = 'لا توجد بيانات لولي الأمر بهذا الاسم';
      this.paginatedUsers = [];
    } else {
      this.No_data_search = '';
      this.totalPages = Math.ceil(this.sreach_users.length / this.pageSize);
      this.paginate();
    }
  }
  //save value token
  userClaims: any;
  loadUserData() {
    this.userClaims = this.tokenService.getTokenClaims();
    //all token
    console.log(this.userClaims);
    //role
    console.log(
      this.userClaims?.[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ]
    );
    //username
    console.log(
      this.userClaims?.[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
      ]
    );
    //id
    console.log(
      this.userClaims?.[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ]
    );
  }
}
