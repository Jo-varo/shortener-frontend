import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService)
  const router = inject(Router)
  const urlTreeReturn = router.createUrlTree(['/login'])
  return authService.isLoggedIn.value || urlTreeReturn;
};