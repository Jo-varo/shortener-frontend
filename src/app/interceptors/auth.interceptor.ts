import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { getTokensFromLocalStorage } from '../../helpers/functions';
import { AuthenticationService } from '../services/authentication.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);
  const isLoggedIn = authService.isLoggedIn.value;
  if (isLoggedIn) {
    const accessToken = getTokensFromLocalStorage()['access'];
    const modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
    });
    return next(modifiedReq);
  }
  return next(req);
};
