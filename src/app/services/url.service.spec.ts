import { TestBed } from '@angular/core/testing';

import { UrlService } from './url.service';
import {
  HttpClientModule,
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('UrlService', () => {
  let urlService: UrlService;
  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let isLoggedIn = false;

  const mockedTokens = {
    access:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE3MjgzMjE2LCJpYXQiOjE3MTcyNjUyMTYsImp0aSI6ImY3MjBiNmUxYWJmZDRhZTg4ZDUyMWI3YjUzZTg3MGFhIiwidXNlcl9pZCI6MTB9.k4bcomuI79BX_AD0VmrrXwIjdGKybrGcUYL9aIqkvt8',
    refresh:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcxNzM1MTYxNiwiaWF0IjoxNzE3MjY1MjE2LCJqdGkiOiI0Mjc4ZTkxZjlhZjQ0M2M2ODRlZDhkZmVlMWQwYjdjYSIsInVzZXJfaWQiOjEwfQ.cfUJ7JxTA8BWnJkFCREOrOwfdN1V7XKFOpyYN31R46Y',
  };

  const mockInterceptor: HttpInterceptor = {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
      if (isLoggedIn) {
        // Simulate adding the token to the request headers
        const authToken = mockedTokens.access; // Replace with your token generation logic
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${authToken}` },
        });
        return next.handle(authReq);
      }
      return next.handle(req);
    },
  };

  beforeEach(() => {
    isLoggedIn = false;
    const authServiceSpy = jasmine.createSpyObj('AuthenticationService', [
      'appLogout',
      'isLoggedIn',
    ]);
    toastrService = jasmine.createSpyObj<ToastrService>('ToasterService', [
      'error',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientModule, ToastrModule.forRoot()],
      providers: [
        UrlService,
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: ToastrService, useValue: toastrService },
        { provide: HTTP_INTERCEPTORS, useValue: mockInterceptor, multi: true },
      ],
    });
    urlService = TestBed.inject(UrlService);
  });

  it('should be created', () => {
    expect(urlService).toBeTruthy();
  });

  it('should short link', (done: DoneFn) => {
    isLoggedIn = true;
    const body = { originalUrl: 'https://google.com/' };
    urlService.shortLink(body).subscribe({
      next: (data) => {
        expect(data.slug).toBeTruthy();
        done();
      },
    });
  });

  it('should get links list', (done: DoneFn) => {
    isLoggedIn = true;

    urlService.getLinksList();
    urlService.linksList.subscribe({
      next: (data) => {
        expect(data.length).toBeGreaterThan(0);
        done();
      },
    });
  });

  it('should get a single link', (done: DoneFn) => {
    const body = { id: '10' };
    urlService.getLink(body).subscribe({
      next: (data) => {
        expect(data).toBeTruthy();
        done();
      },
    });
  });

  it('should delete link', (done: DoneFn) => {
    isLoggedIn = true;
    const id = 278;

    urlService.deleteLink(id).subscribe({
      next: (data) => {
        expect(data.message).toBeTruthy();
        done();
      },
    });
  });

  it('should edit link', (done: DoneFn) => {
    isLoggedIn = true;
    const id = '203';
    const body = { originalUrl: 'https://gugul.com/', slug: 'gptat13' };

    urlService.editLink({ id, ...body }).subscribe({
      next: (data) => {
        expect(data).toBeTruthy();
        done();
      },
    });
  });
});
