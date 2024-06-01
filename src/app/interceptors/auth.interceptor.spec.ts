import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { AuthenticationService } from '../services/authentication.service';
import { BehaviorSubject } from 'rxjs';
import {
  removeTokensFromLocalStorage,
  saveTokensInLocalStorage,
} from '../../helpers/functions';

describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', [
      'isLoggedIn',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: AuthenticationService, useValue: authServiceSpy }],
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should send token in headers if a user is logged in', () => {
    const accessToken = 'valid-access-token';
    saveTokensInLocalStorage({ access: accessToken, refresh: 'refresh-token' });
    authServiceSpy.isLoggedIn = new BehaviorSubject(true);

    const req = new HttpRequest('GET', 'https://example.com/');
    const next = jasmine.createSpy('next');

    interceptor(req, next);

    expect(next).toHaveBeenCalledWith(
      req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
      })
    );
  });

  it('should pass unmodified request when user is not logged in', () => {
    authServiceSpy.isLoggedIn = new BehaviorSubject(false);

    // Create a test request
    const request = new HttpRequest('GET', 'https://example.com/');
    const next = jasmine.createSpy('next');

    // Intercept the request
    interceptor(request, next);

    // Verify that the request is not modified
    expect(next).toHaveBeenCalledWith(request);
  });

  afterEach(() => {
    removeTokensFromLocalStorage();
  });
});
