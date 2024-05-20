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
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIconComponent, ReactiveFormsModule],
  templateUrl: './register.component.html',
  viewProviders: [provideIcons({ bootstrapPersonCircle, bootstrapArrowRight })],
})
export class RegisterComponent {
  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
  ) {}

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
    if (!this.formRegister.valid) {
      this.toastr.warning('Some fields have errors', 'Invalid form');
      return;
    }

    try {
      const formData = this.formRegister.value;
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords don't match");
      }
      const registerFormData = {
        email: formData.email!,
        password: formData.password!,
      };

      this.authenticationService.register(registerFormData).subscribe({
        next: () => {
          this.toastr.success('The user was created', 'Created');
          this.formRegister.reset();
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.toastr.error('Error at registering new user', 'Error');
          console.log(error);
          throw new Error('Error at register');
        },
      });
    } catch (error) {
      this.toastr.error('An error has occurred at registering', 'Error');
      console.log(error);
    }
  }
}
