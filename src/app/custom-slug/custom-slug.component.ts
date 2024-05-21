import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ORIGINAL_URL } from '../../helpers/constants';
import { UrlService } from '../services/url.service';
import { originalUrlValidators } from '../../validators/FormValidators';
import { ToastrService } from 'ngx-toastr';

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
    private urlService: UrlService,
    private toastr: ToastrService
  ) {}

  formCustomSlug = this.fb.group({
    [ORIGINAL_URL]: ['', originalUrlValidators],
    customSlug: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(20)],
    ],
  });

  get originalURL() {
    return this.formCustomSlug.get(ORIGINAL_URL) as FormControl;
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
          this.originalURL.setValue(data.original_url);
          this.customSlug.setValue(data.slug);
        },
        error: (error) => this.toastr.error('Error', 'Error at getting url'),
      });
    }
    document.querySelector('body')!.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
    document.querySelector('body')!.style.removeProperty('overflow');
  }

  handleSubmit() {
    if (!this.formCustomSlug.valid) {
      this.toastr.warning('Fill the fields correctly', 'Invalid Form');
      return;
    }

    const formData = this.formCustomSlug.value;

    const body = {
      originalUrl: formData[ORIGINAL_URL]!,
      slug: formData.customSlug!,
    };

    if (this.modalType === 'Create') {
      this.urlService.shortLink(body).subscribe({
        next: (_) => {
          this.toastr.success('New shortened url was created', 'Created');
          this.urlService.getLinksList();
          this.closeModal();
        },
        error: (error) => {
          this.toastr.error('Error at creating', 'Error');
          console.log(error);
        },
      });
      return;
    }

    //Editing link/slug
    this.urlService.editLink({ id: this.id, ...body }).subscribe({
      next: (_) => {
        this.toastr.success(`The resource ${this.id} was edited`, 'Success');
        this.urlService.getLinksList();
        this.closeModal();
      },
      error: (error) => {
        this.toastr.error(error.error.error, 'Error');
      },
    });
  }

  closeModal() {
    this.router.navigate(['/manage-urls']);
  }
}
