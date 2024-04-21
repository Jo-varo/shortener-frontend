import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { bootstrapPencilFill, bootstrapXLg } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-url-manager',
  standalone: true,
  imports: [NgIconComponent, RouterOutlet, RouterLink],
  templateUrl: './url-manager.component.html',
  styleUrl: './url-manager.component.css',
  viewProviders: [provideIcons({ bootstrapPencilFill, bootstrapXLg })],
})
export class UrlManagerComponent {
  urls = [1, 2, 3, 4, 5, 6, 7];

  constructor(private router: Router) {}

  handleDelete(id: number) {
    alert(`deleted: ${id}`);
  }

  redirectTo(id: number) {
    this.router.navigate(['/manage-urls', id]);
  }
}
