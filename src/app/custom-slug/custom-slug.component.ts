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

@Component({
  selector: 'app-custom-slug',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './custom-slug.component.html',
  styleUrl: './custom-slug.component.css',
})
export class CustomSlugComponent implements OnDestroy, OnInit {
  id = '';
  modalType?: ModalType;
  modalTitle = () => `${this.modalType} a custom url`;
  buttonText = () => `${this.modalType} link`;
  routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  formCustomSlug = this.fb.group({
    originalUrl: ['', [Validators.required, Validators.pattern(URL_REGEX)]],
    customSlug: ['', [Validators.required, Validators.maxLength(15)]],
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
      //edit
      this.modalType = 'Edit';
    }
    console.log(this.id);
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
  }

  handleSubmit() {
    if (!this.formCustomSlug.valid) return alert('Form invalid');
    this.closeModal();
  }

  closeModal() {
    this.router.navigate(['/manage-urls']);
  }
}