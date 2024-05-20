import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {
  getTokensFromLocalStorage,
  removeTokensFromLocalStorage,
} from '../helpers/functions';
import { AuthenticationService } from './services/authentication.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const token = getTokensFromLocalStorage();
    this.loggedInSubscription = this.authenticationService.isLoggedIn.subscribe(
      (loggedInValue) => {
        console.log({ time: Date.now(), loggedInValue });
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
      next: (_) => {
        this.toastr.success('Logged out', 'Success');
      },
      error: (error) => {
        console.log(error);
        this.toastr.error('Error at logout', 'Error');
      },
    });
    removeTokensFromLocalStorage();
    this.authenticationService.loggedInChange(false);
    this.router.navigate(['/']);
  }
}
