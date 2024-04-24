import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ShortURLResponse } from './url.type';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  constructor(private http: HttpClient) {}

  shortLink() {}

  shortLinkAsAnonymous({
    originalUrl,
  }: {
    originalUrl: string;
  }): Observable<ShortURLResponse> {
    return this.http.post(
      environment.apiUrl + '/url_an',
      { original_url: originalUrl },
      { responseType: 'json' }
    ) as Observable<ShortURLResponse>;
  }

  getLinksList() {}
}
