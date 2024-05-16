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
import { saveTokensInLocalStorage } from '../../helpers/functions';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

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
    private router: Router
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
    if (!this.formLogin.valid) return alert('Form invalid');

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
          alert('error at log in');
          throw new Error('error at log in');
        },
      });
    } catch (error) {
      alert('error at log in');
    }
  }
}
