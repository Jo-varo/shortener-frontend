import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { HttpClientModule } from '@angular/common/http';
import { removeTokensFromLocalStorage, saveTokensInLocalStorage } from '../../helpers/functions';

describe('AuthenticationService', () => {
  let originalTimeout:number;
  let authService: AuthenticationService;

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    TestBed.configureTestingModule({ imports: [HttpClientModule] });
    authService = TestBed.inject(AuthenticationService);
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('LoggedIn should be false at the start', () => {
    expect(authService.isLoggedIn.value).toBeFalsy();
  });

  it('LoggedIn should change its value', () => {
    authService.loggedInChange(true);
    expect(authService.isLoggedIn.value).toBeTruthy();
  });

  it('should register a new user', (done: DoneFn) => {
    const newUser = { email: 'test7@testmail.com', password: 'asdf_1234' };
    authService.register(newUser).subscribe({
      next: (data) => {
        expect(data).toBeTruthy();
        done();
      },
    });
  });

  it('should login', (done: DoneFn) => {
    const user = { email: 'mail@mail.com', password: 'asdf_1234' };
    authService.login(user).subscribe({
      next: (tokens) => {
        expect(tokens).toBeTruthy();
        done();
      },
    });
  });

  it('should logout', (done: DoneFn) => {
    const user = { email: 'mail@mail.com', password: 'asdf_1234' };
    authService.login(user).subscribe({
      next: (tokens) => {
        saveTokensInLocalStorage({
          access: tokens.access_token,
          refresh: tokens.refresh_token,
        });
        authService.logout().subscribe({
          next: (data) => {
            expect(data).toBeTruthy();
            done();
          },
        });
      },
    });
  });

  afterAll(()=>{
    removeTokensFromLocalStorage();
  })
});
