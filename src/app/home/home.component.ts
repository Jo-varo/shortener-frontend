import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ORIGINAL_URL, URL_REGEX } from '../../helpers/constants';
import { UrlService } from '../services/url.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapClipboard2Fill } from '@ng-icons/bootstrap-icons';
import { environment } from '../../environments/environment.development';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [ReactiveFormsModule, NgIconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  viewProviders: [provideIcons({ bootstrapClipboard2Fill })],
})
export class HomeComponent {
  constantOriginalURL = ORIGINAL_URL;

  //Displayed values at submitting
  shortedOriginalUrl = '';
  shortenedLink = '';

  constructor(private urlService: UrlService) {}

  shortenerForm = new FormGroup({
    [ORIGINAL_URL]: new FormControl('', [
      Validators.required,
      Validators.pattern(URL_REGEX),
    ]),
  });

  get originalURL() {
    return this.shortenerForm.get(ORIGINAL_URL) as FormControl;
  }

  handleSubmit() {
    if (!this.shortenerForm.valid) return alert('Please, enter a valid url');

    const originalUrl = this.shortenerForm.value[ORIGINAL_URL]!;

    this.urlService
      .shortLink({
        originalUrl,
      })
      .subscribe({
        next: (data) => {
          this.shortenedLink = `${environment.apiUrlPreffix}/${data.slug}`;
          this.shortedOriginalUrl = originalUrl;
          alert('Shorted link');
          this.shortenerForm.reset();
        },
        error: (error) => {
          alert('error at getting shortened url');
        },
      });
  }

  copyShortedLink() {
    (async () => {
      try {
        await navigator.clipboard.writeText(this.shortenedLink);
        alert('url copied');
      } catch (error) {
        alert('error at copying');
      }
    })();
  }
}
