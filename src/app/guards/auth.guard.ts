import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  // Affects performance, urlTreeReturn only left to improve readability
  // and since authGuard is not called frequently it doesn´t affect
  // performance that much.
  const urlTreeReturn = router.createUrlTree(['/login']);
  return authService.isLoggedIn.value || urlTreeReturn;

  // "Avoid urlTreeReturn if performance is critical"
  // This is more efficient
  //return authService.isLoggedIn.value || router.createUrlTree(['/login']);
};
