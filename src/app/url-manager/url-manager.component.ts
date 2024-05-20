import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { bootstrapPencilFill, bootstrapXLg } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { UrlService } from '../services/url.service';
import { URLListResponse } from '../services/url.type';
import { environment } from '../../environments/environment.development';
import { Subscription } from 'rxjs';
import { formatLengthOriginalURL } from '../../helpers/functions';

@Component({
  selector: 'app-url-manager',
  standalone: true,
  imports: [NgIconComponent, RouterOutlet, RouterLink],
  templateUrl: './url-manager.component.html',
  styleUrl: './url-manager.component.css',
  viewProviders: [provideIcons({ bootstrapPencilFill, bootstrapXLg })],
})
export class UrlManagerComponent implements OnInit, OnDestroy {
  urls: URLListResponse[] = [];
  urlsSubscription!: Subscription;
  apiPreffix = environment.apiUrlPreffix;
  formatOriginalURL = formatLengthOriginalURL;

  constructor(private router: Router, private urlService: UrlService) {}

  handleDelete(id: number) {
    alert(`deleted: ${id}`);
    this.urlService.deleteLink(id);
  }

  ngOnInit(): void {
    this.urlService.getLinksList();
    this.urlsSubscription = this.urlService.linksList.subscribe({
      next: (data) => (this.urls = data)
    });
  }

  ngOnDestroy(): void {
    this.urlsSubscription.unsubscribe();
  }
}
