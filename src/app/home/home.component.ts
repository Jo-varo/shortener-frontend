import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  originalURL = ''
  shortenedLink = 'https://our-host.com/5h0r7nd';
  handleSubmit(){
    alert('submitted')
  }
}
