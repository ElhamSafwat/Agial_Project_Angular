import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home-basic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-basic.component.html',
  styleUrl: './home-basic.component.css'
})
export class HomeBasicComponent {
  currentImage: string = 'Images/basic6.jpg';
  activeButton: number = 1;
  changeImage(imageNumber: number) {
    this.activeButton = imageNumber;
    switch (imageNumber) {
      case 1:
        this.currentImage = 'Images/basic6.jpg'; 
        break;
      case 2:
        this.currentImage = 'Images/basic5.jpg'; 
        break;
      case 3:
        this.currentImage = 'Images/basic7.jpg'; 
        break;
      default:
        this.currentImage = 'Images/Test1.jpg';
        break;
    }
  }
}
