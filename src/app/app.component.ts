import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {
  getTokensFromLocalStorage,
  removeTokensFromLocalStorage,
} from '../helpers/functions';
import { AuthenticationService } from './services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  //TODO: Remove 'title'
  title = '';
  isLoggedIn = false;
  loggedInSubscription!: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = getTokensFromLocalStorage();
    this.loggedInSubscription = this.authenticationService.isLoggedIn.subscribe(
      (loggedInValue) => {
        console.log({ loggedInValue });
        this.isLoggedIn = loggedInValue;
      }
    );
    this.authenticationService.loggedInChange(Boolean(token));
  }

  ngOnDestroy(): void {
    this.loggedInSubscription.unsubscribe();
  }

  handleLogout() {
    this.authenticationService.logout().subscribe({
      next: (data) => {
        console.log(data);
        alert('Succesful logged out');
      },
      error: (error) => {
        console.log(error);
        alert('error at logout');
      },
    });
    removeTokensFromLocalStorage();
    this.authenticationService.loggedInChange(false);
    this.router.navigate(['/']);
  }
}
