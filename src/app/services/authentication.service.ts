import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { AuthParams, AuthResponse } from './auth.type';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  login({ email, password }: AuthParams): Observable<AuthResponse> {
    return this.http.post(
      environment.apiUrl + '/login',
      { email, password },
      { responseType: 'json' }
    ) as Observable<AuthResponse>;
  }

  logout() {}

  register({ email, password }: AuthParams) {}
}
