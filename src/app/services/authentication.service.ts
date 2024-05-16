import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, Subject } from 'rxjs';
import {
  AuthParams,
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
} from './auth.type';
import { getTokensFromLocalStorage } from '../../helpers/functions';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isLoggedIn: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  loggedInChange(isLoggedIn: boolean) {
    this.isLoggedIn.next(isLoggedIn);
  }

  login({ email, password }: AuthParams): Observable<LoginResponse> {
    return this.http.post(
      environment.apiUrl + '/login',
      { email, password },
      { responseType: 'json' }
    ) as Observable<LoginResponse>;
  }

  logout() {
    try {
      const { refresh, access } = getTokensFromLocalStorage();
      const header = new HttpHeaders().set('Authorization', `Bearer ${access}`);

      return this.http.post(
        environment.apiUrl + '/logout',
        {
          refresh_token: refresh,
        },
        { headers: header, responseType: 'json' }
      ) as Observable<LogoutResponse>;
    } catch {
      throw new Error('Error at logout');
    }
  }

  //review this endpoint, body and response
  register({ email, password }: AuthParams): Observable<RegisterResponse> {
    return this.http.post(
      environment.apiUrl + '/register',
      {
        email,
        password,
      },
      { responseType: 'json' }
    ) as Observable<RegisterResponse>;
  }
}
