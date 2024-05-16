import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import {
  DeletedURLResponse,
  ShortURLResponse,
  SingleURLResponse,
  URLListResponse,
} from './url.type';
import { getTokensFromLocalStorage } from '../../helpers/functions';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  constructor(private http: HttpClient) {}

  shortLink({
    originalUrl,
    slug,
  }: {
    originalUrl: string;
    slug?: string;
  }): Observable<ShortURLResponse> {
    try {
      const accessToken = getTokensFromLocalStorage()['access'];
      const apiUrl = `${environment.apiUrl}/url`;
      if (accessToken) {
        const header = new HttpHeaders().set(
          'Authorization',
          `Bearer ${accessToken}`
        );
        return this.http.post(
          apiUrl,
          {
            original_url: originalUrl,
            slug,
          },
          { headers: header }
        ) as Observable<ShortURLResponse>;
      }
      return this.http.post(apiUrl, {
        original_url: originalUrl,
      }) as Observable<ShortURLResponse>;
    } catch (e) {
      throw new Error('Error at shorten link');
    }
  }

  getLinksList(): Observable<URLListResponse[]> {
    try {
      const accessToken = getTokensFromLocalStorage()['access'];
      const header = new HttpHeaders().set(
        'Authorization',
        `Bearer ${accessToken}`
      );
      return this.http.get(environment.apiUrl + '/url_list', {
        headers: header,
      }) as Observable<URLListResponse[]>;
    } catch (e) {
      throw new Error('Error at getting urls');
    }
  }

  getLink({ id }: { id: string }): Observable<SingleURLResponse> {
    try {
      return this.http.get(
        environment.apiUrl + '/url/' + id
      ) as Observable<SingleURLResponse>;
    } catch (e) {
      throw new Error('Error at getting url');
    }
  }

  deleteLink(id: number): Observable<DeletedURLResponse> {
    try {
      const accessToken = getTokensFromLocalStorage()['access'];
      const header = new HttpHeaders().set(
        'Authorization',
        `Bearer ${accessToken}`
      );
      return this.http.delete(environment.apiUrl + '/url/' + id, {
        headers: header,
      }) as Observable<DeletedURLResponse>;
    } catch (e) {
      throw new Error('Error at deleting url');
    }
  }

  editLink({
    id,
    originalUrl,
    slug,
  }: {
    id: string;
    originalUrl: string;
    slug: string;
  }): Observable<Object> {
    try {
      const accessToken = getTokensFromLocalStorage()['access'];
      const header = new HttpHeaders().set(
        'Authorization',
        `Bearer ${accessToken}`
      );
      const body = {
        original_url: originalUrl,
        slug,
      };
      const apiUrl = `${environment.apiUrl}/url/${id}`;
      return this.http.patch(apiUrl, body, {
        headers: header,
      });
    } catch (e) {
      throw new Error('Error at editing link');
    }
  }
}
