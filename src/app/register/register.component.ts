import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  bootstrapArrowRight,
  bootstrapPersonCircle,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { PASSWORD_REGEX } from '../../helpers/constants';
import { matchValuesValidator } from './validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIconComponent, ReactiveFormsModule],
  templateUrl: './register.component.html',
  viewProviders: [provideIcons({ bootstrapPersonCircle, bootstrapArrowRight })],
})
export class RegisterComponent {
  constructor(private fb: FormBuilder) {}

  formRegister = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(PASSWORD_REGEX)]],
      confirmPassword: [
        '',
        [Validators.required, Validators.pattern(PASSWORD_REGEX)],
      ],
    },
    {
      validators: matchValuesValidator,
    }
  );

  get email() {
    return this.formRegister.get('email') as FormControl;
  }

  get password() {
    return this.formRegister.get('password') as FormControl;
  }

  get confirmPassword() {
    return this.formRegister.get('confirmPassword') as FormControl;
  }

  handleSubmit() {
    if (!this.formRegister.valid) return alert('invalid form');

    const formData = this.formRegister.value;
    if (formData.password !== formData.confirmPassword)
      throw new Error("Passwords don't match");

    //Send registerData to endpoint
    const registerData = { email: formData.email, password: formData.password };
    console.log(registerData);
  }
}
