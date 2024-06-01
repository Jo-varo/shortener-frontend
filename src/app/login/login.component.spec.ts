import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication.service';
import { of } from 'rxjs';
import {
  removeTokensFromLocalStorage,
  getTokensFromLocalStorage,
} from '../../helpers/functions';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', [
      'login',
      'loggedInChange',
    ]);
    toastrSpy = jasmine.createSpyObj('Toastr', ['success', 'error', 'warning']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submit button should exist', () => {
    const submitElementButton: HTMLButtonElement = fixture.nativeElement;
    const submitButton = submitElementButton.querySelector('button');
    expect(submitButton?.type).toBe('submit');
  });

  it('should handle invalid form submission', () => {
    component.email.setValue('mail.com');
    component.handleSubmit();

    expect(toastrSpy.warning).toHaveBeenCalledWith(
      'Some fields are incomplete',
      'Invalid Form'
    );
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should handle successful login', () => {
    const mockUser = { email: 'test@example.com', password: 'password_123' };
    const mockResponse = {
      access_token: 'abc123',
      refresh_token: 'xyz456',
    };
    component.email.setValue(mockUser['email']);
    component.password.setValue(mockUser['password']);
    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.handleSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith(mockUser);
    expect(getTokensFromLocalStorage()).toEqual({
      access: mockResponse.access_token,
      refresh: mockResponse.refresh_token,
    });

    expect(toastrSpy.success).toHaveBeenCalledWith('Logged in');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    expect(authServiceSpy.loggedInChange).toHaveBeenCalledWith(true);
  });

  it('should handle unsuccessful login', () => {
    const mockUser = { email: 'test@example.com', password: 'password_123' };
    const mockError = new Error('Login failed');

    component.email.setValue(mockUser['email']);
    component.password.setValue(mockUser['password']);

    authServiceSpy.login.and.throwError(mockError);

    component.handleSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith(mockUser);
    expect(toastrSpy.error).toHaveBeenCalledWith('Error at log in', 'Error');
  });

  afterAll(() => {
    removeTokensFromLocalStorage();
  });
});
