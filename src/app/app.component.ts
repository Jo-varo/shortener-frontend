import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { getTokensFromLocalStorage } from '../helpers/functions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{
  title = '';
  isLogged = false;

  ngOnInit(): void {
    const token = getTokensFromLocalStorage();
    this.isLogged = Boolean(token.access)
  }
}
