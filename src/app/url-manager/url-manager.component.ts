import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { bootstrapPencilFill, bootstrapXLg } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { UrlService } from '../services/url.service';
import { URLListResponse } from '../services/url.type';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-url-manager',
  standalone: true,
  imports: [NgIconComponent, RouterOutlet, RouterLink],
  templateUrl: './url-manager.component.html',
  styleUrl: './url-manager.component.css',
  viewProviders: [provideIcons({ bootstrapPencilFill, bootstrapXLg })],
})
export class UrlManagerComponent implements OnInit {
  urls: URLListResponse[] = [];
  apiPreffix = environment.apiUrlPreffix;

  constructor(private router: Router, private urlService: UrlService) {}

  handleDelete(id: number) {
    alert(`deleted: ${id}`);
    this.urlService.deleteLink(id).subscribe({
      next: (data) => {
        this.urls = this.urls.filter(url=>url.id !== id)
      },
      error: (error) => alert('Error at deleting' + id),
    });
  }

  ngOnInit(): void {
    this.urlService.getLinksList().subscribe({
      next: (data) => {
        this.urls = data;
      },
      error: (error) => {
        alert('Error at getting urls');
      },
    });
  }
}
