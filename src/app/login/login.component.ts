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
  patternRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&\.\-_])[A-Za-z\d@$!%*#?&\.\-_]{8,}$/;

  formLogin = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.pattern(this.patternRegex)],
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
