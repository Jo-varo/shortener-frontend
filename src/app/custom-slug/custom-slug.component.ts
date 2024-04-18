import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-custom-slug',
  standalone: true,
  imports: [],
  templateUrl: './custom-slug.component.html',
  styleUrl: './custom-slug.component.css',
})
export class CustomSlugComponent implements OnDestroy, OnInit {
  id = '';
  routeSubscription?: Subscription;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
    if (this.id === 'create') {
      //Create new register
    } else {
      //Edit url
    }
  }

  handleSubmit() {
    if (this.id === 'create') {
      //Create new register
      alert('created');
    } else {
      //Edit url
      alert('edited');
    }
    this.handleClose();
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
  }

  handleClose() {
    this.router.navigate(['/manage-urls']);
  }
}
