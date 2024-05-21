import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { bootstrapExclamationTriangle } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './page-not-found.component.html',
  viewProviders: [provideIcons({ bootstrapExclamationTriangle })],
})
export class PageNotFoundComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2000);
  }
}
