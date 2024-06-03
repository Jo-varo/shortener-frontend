import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  DeletedURLResponse,
  ShortURLResponse,
  SingleURLResponse,
  URLListResponse,
} from './url.type';
import { AuthenticationService } from './authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  linksList = new Subject<URLListResponse[]>();

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  shortLink({
    originalUrl,
    slug,
  }: {
    originalUrl: string;
    slug?: string;
  }): Observable<ShortURLResponse> {
    try {
      const apiUrl = `${environment.apiUrl}/url`;
      return this.http.post(apiUrl, {
        original_url: originalUrl,
        slug,
      }) as Observable<ShortURLResponse>;
    } catch (e) {
      throw new Error('Error at shorten link');
    }
  }

  getLinksList() {
    try {
      this.http
        .get(environment.apiUrl + '/url_list', { observe: 'response' })
        .subscribe({
          next: (data) => {
            this.linksList.next(data.body as URLListResponse[]);
          },
          error: (error) => {
            if (error.status === 401) {
              setTimeout(() => {
                return this.authenticationService.appLogout();
              }, 750);
            }
            this.toastr.error('Error at getting list of urls', 'Error');
            throw new Error('Error at getting urls');
          },
        });
    } catch (error) {
      console.log(error);
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
      return this.http.delete(
        environment.apiUrl + '/url/' + id
      ) as Observable<DeletedURLResponse>;
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
  }): Observable<SingleURLResponse> {
    try {
      const body = {
        original_url: originalUrl,
        slug,
      };
      const apiUrl = `${environment.apiUrl}/url/${id}`;
      return this.http.patch(apiUrl, body) as Observable<SingleURLResponse>;
    } catch (e) {
      throw new Error('Error at editing link');
    }
  }
}
