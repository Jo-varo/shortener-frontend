import { Component } from '@angular/core';
import { bootstrapExclamationTriangle } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './page-not-found.component.html',
  viewProviders: [provideIcons({bootstrapExclamationTriangle})]
})
export class PageNotFoundComponent {}
