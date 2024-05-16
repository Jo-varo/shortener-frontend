import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { URL_REGEX } from '../../helpers/constants';
import { UrlService } from '../services/url.service';

@Component({
  selector: 'app-custom-slug',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './custom-slug.component.html',
  styleUrl: './custom-slug.component.css',
})
export class CustomSlugComponent implements OnInit, OnDestroy {
  id = '';
  modalType?: ModalType;
  modalTitle = () => `${this.modalType} a custom url`;
  buttonText = () => `${this.modalType} link`;
  routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private urlService: UrlService
  ) {}

  formCustomSlug = this.fb.group({
    originalUrl: ['', [Validators.required, Validators.pattern(URL_REGEX)]],
    customSlug: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(20)],
    ],
  });

  get originalUrl() {
    return this.formCustomSlug.get('originalUrl') as FormControl;
  }

  get customSlug() {
    return this.formCustomSlug.get('customSlug') as FormControl;
  }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
    if (this.id === undefined) {
      //Create
      this.modalType = 'Create';
    } else {
      //Edit
      this.modalType = 'Edit';
      this.urlService.getLink({ id: this.id }).subscribe({
        next: (data) => {
          this.originalUrl.setValue(data.original_url);
          this.customSlug.setValue(data.slug);
        },
        error: (error) => alert('error at getting url'),
      });
    }
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
  }

  handleSubmit() {
    if (!this.formCustomSlug.valid) return alert('Form invalid');

    const formData = this.formCustomSlug.value;

    const body = {
      originalUrl: formData.originalUrl!,
      slug: formData.customSlug!,
    };

    if (this.modalType === 'Create') {
      return this.urlService.shortLink(body).subscribe({
        next: (data) => {
          alert('created');
          console.log(data);
          this.closeModal();
        },
        error: (error) => console.log(error),
      });
    }

    //Editing link/slug
    this.urlService.editLink({ id: this.id, ...body }).subscribe({
      next: (data) => {
        alert('edited' + this.id);
        console.log(data);
        this.closeModal();
      },
      error: (error) => console.log(error),
    });
  }

  closeModal() {
    this.router.navigate(['/manage-urls']);
  }
}
