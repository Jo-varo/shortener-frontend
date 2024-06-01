import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthenticationService } from '../services/authentication.service';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthenticationService,
          useValue: {
            isLoggedIn: {
              value: false,
            },
          },
        },
        {
          provide: Router,
          useValue: { createUrlTree: jasmine.createSpy('createUrlTree') },
        },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access if user is logged in', () => {
    const authService = TestBed.inject(AuthenticationService);
    (authService as any).isLoggedIn.value = true; // Set mock value for isLoggedIn

    const canActivate = executeGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    expect(canActivate).toBe(true);
    // Uncomment the bottom line if 'router.createUrlTree(['/login'])'
    // is being returned inmmediately ->
    // return authService.isLoggedIn.value || router.createUrlTree(['/login']);

    //expect(TestBed.inject(Router).createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to login if user is not logged in', () => {
    const authService = TestBed.inject(AuthenticationService);
    (authService as any).isLoggedIn = false; // Set mock value for isLoggedIn

    const canActivate = executeGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );

    expect(canActivate).toEqual(
      TestBed.inject(Router).createUrlTree(['/login'])
    );
    expect(TestBed.inject(Router).createUrlTree).toHaveBeenCalledWith([
      '/login',
    ]);
  });
});
