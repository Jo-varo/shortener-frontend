import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ORIGINAL_URL } from '../../helpers/constants';
import { UrlService } from '../services/url.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapClipboard2Fill } from '@ng-icons/bootstrap-icons';
import { environment } from '../../environments/environment.development';
import { formatLengthOriginalURL } from '../../helpers/functions';
import { blink, slideDown, slideUp } from './home.animations';
import { originalUrlValidators } from '../../validators/FormValidators';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private urlService: UrlService, private toastr: ToastrService) {}

  shortenerForm = new FormGroup({
    [ORIGINAL_URL]: new FormControl('', originalUrlValidators),
  });

  get originalURL() {
    return this.shortenerForm.get(ORIGINAL_URL) as FormControl;
  }

  handleSubmit() {
    if (!this.shortenerForm.valid) {
      this.toastr.warning('Enter a valid url', 'Invalid URL');
      return;
    }

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
          this.toastr.success('Shorted link', 'Success');
          this.shortenerForm.reset();
        },
        error: (error) => {
          this.toastr.error('An error has occured at shortening link', 'Error');
          console.log(error);
        },
      });
  }

  copyShortedLink() {
    (async () => {
      try {
        await navigator.clipboard.writeText(this.shortenedLink);
        this.toastr.info('Shorted url copied', 'Copied');
      } catch (error) {
        this.toastr.error('Error at copying', 'Error');
      }
    })();
  }
}
