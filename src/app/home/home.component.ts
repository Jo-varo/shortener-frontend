import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ORIGINAL_URL } from '../../helpers/constants';
import { UrlService } from '../services/url.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapClipboard2Fill } from '@ng-icons/bootstrap-icons';
import { environment } from '../../environments/environment.development';
import { formatLengthOriginalURL } from '../../helpers/functions';
import { blink, slideDown, slideUp } from './home.animations';
import { originalUrlValidators } from '../../validators/FormValidators';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [ReactiveFormsModule, NgIconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  viewProviders: [provideIcons({ bootstrapClipboard2Fill })],
  animations: [slideDown, slideUp, blink],
})
export class HomeComponent {
  constantOriginalURL = ORIGINAL_URL;
  formatOriginalURL = formatLengthOriginalURL;

  //Displayed values at submitting
  shortedOriginalUrl = '';
  shortenedLink = '';

  //Variable to trigger blink animation
  incrementable = 0;

  constructor(private urlService: UrlService) {}

  shortenerForm = new FormGroup({
    [ORIGINAL_URL]: new FormControl('', originalUrlValidators),
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
          this.incrementable++;
          alert('Shorted link');
          this.shortenerForm.reset();
        },
        error: (error) => {
          console.log(error);
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
