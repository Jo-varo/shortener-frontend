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
import { saveTokensInLocalStorage } from '../../helpers/functions';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIconComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  viewProviders: [provideIcons({ bootstrapPersonCircle, bootstrapArrowRight })],
})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  formLogin = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  get email() {
    return this.formLogin.get('email') as FormControl;
  }

  get password() {
    return this.formLogin.get('password') as FormControl;
  }

  handleSubmit() {
    if (!this.formLogin.valid) {
      this.toastr.warning('Some fields are incomplete', 'Invalid Form');
      return;
    }

    try {
      const formData = this.formLogin.value;
      const loginFormData = {
        email: formData.email!,
        password: formData.password!,
      };

      this.authenticationService.login(loginFormData).subscribe({
        next: (data) => {
          saveTokensInLocalStorage({
            access: data.access_token,
            refresh: data.refresh_token,
          });
          this.router.navigate(['/']);
          this.authenticationService.loggedInChange(true);
        },
        error: (error) => {
          this.toastr.error('Error at log in', 'Error');
          throw new Error('error at log in');
        },
      });
    } catch (error) {
      this.toastr.error('Error at log in', 'Error');
    }
  }
}
