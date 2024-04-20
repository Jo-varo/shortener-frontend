import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  bootstrapPersonCircle,
  bootstrapArrowRight,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { PASSWORD_REGEX } from '../../helpers/constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIconComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  viewProviders: [provideIcons({ bootstrapPersonCircle, bootstrapArrowRight })],
})
export class LoginComponent {
  constructor(private fb: FormBuilder) {}
  //Minimum eight characters, at least one letter, one number and one special character

  formLogin = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.pattern(PASSWORD_REGEX)],
    ],
  });

  get email() {
    return this.formLogin.get('email') as FormControl;
  }

  get password() {
    return this.formLogin.get('password') as FormControl;
  }

  handleSubmit() {
    if (!this.formLogin.valid) return alert('Form invalid')
    console.log('submitted')
    console.log(this.formLogin.value);
  }
}
