import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ORIGINAL_URL } from '../../helpers/constants';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  constantOriginalURL = ORIGINAL_URL;


  urlPattern = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

  shortenerForm = new FormGroup({
    [ORIGINAL_URL]: new FormControl('', [
      Validators.required,
      Validators.pattern(this.urlPattern),
    ]),
  });

  get originalURL() {
    return this.shortenerForm.get(ORIGINAL_URL) as FormControl;
  }

  //TODO: just a placeholder, delete it later
  shortenedLink = '';
  //TODO: remove 'commonModule', only imported for the json pipe

  handleSubmit() {
    if (!this.shortenerForm.valid) return alert('Please, enter a valid url');
    const formData = this.shortenerForm.value;
    console.log(formData)
    this.shortenedLink = 'https://our-host.com/5h0r7nd'
  }
}
