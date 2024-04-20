import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ORIGINAL_URL, URL_REGEX } from '../../helpers/constants';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  constantOriginalURL = ORIGINAL_URL;

  shortenerForm = new FormGroup({
    [ORIGINAL_URL]: new FormControl('', [
      Validators.required,
      Validators.pattern(URL_REGEX),
    ]),
  });

  get originalURL() {
    return this.shortenerForm.get(ORIGINAL_URL) as FormControl;
  }

  shortenedLink = '';
  //TODO: remove 'commonModule', only imported for the json pipe

  handleSubmit() {
    if (!this.shortenerForm.valid) return alert('Please, enter a valid url');
    const formData = this.shortenerForm.value;
    console.log(formData)
    this.shortenedLink = 'https://our-host.com/5h0r7nd'
  }
}
