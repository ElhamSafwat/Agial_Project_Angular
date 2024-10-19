import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../../Services/token-service.service';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css',
})
export class HomeAdminComponent {}
