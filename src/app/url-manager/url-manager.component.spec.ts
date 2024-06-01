import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlManagerComponent } from './url-manager.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { UrlService } from '../services/url.service';
import { BehaviorSubject, of } from 'rxjs';
import { URLListResponse } from '../services/url.type';

describe('UrlManagerComponent', () => {
  let component: UrlManagerComponent;
  let fixture: ComponentFixture<UrlManagerComponent>;
  let urlServiceSpy: jasmine.SpyObj<UrlService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const mockLinksList = new BehaviorSubject<URLListResponse[]>([
      {
        id: 5,
        original_url: 'https://google.com/',
        slug: 'gpt-custom',
      },
      {
        id: 6,
        original_url: 'https://chatgpt.com/',
        slug: 'Dlo3In',
      },
    ]);

    urlServiceSpy = jasmine.createSpyObj('UrlService', [
      'deleteLink',
      'getLinksList',
      'linksList',
    ]);
    toastrSpy = jasmine.createSpyObj('Toastr', ['info', 'error']);

    urlServiceSpy.linksList = mockLinksList;

    await TestBed.configureTestingModule({
      imports: [
        UrlManagerComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: ToastrService, useValue: toastrSpy },
        { provide: UrlService, useValue: urlServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UrlManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle delete successfully', () => {
    const id = 10;
    urlServiceSpy.deleteLink.and.returnValue(
      of({ message: 'Succesful deleted' })
    );

    component.handleDelete(id);
    fixture.detectChanges();

    expect(urlServiceSpy.deleteLink).toHaveBeenCalledWith(id);
    expect(urlServiceSpy.getLinksList).toHaveBeenCalled();
    expect(toastrSpy.info).toHaveBeenCalledWith(
      'The url was deleted',
      `Deleted ${id}`
    );
  });

  it('should handle delete error', () => {
    const id = 20;
    const mockError = new Error('An error occurred at trying to delete');
    urlServiceSpy.deleteLink.and.throwError(mockError);

    spyOn(console, 'log'); // Spy on console.error
    component.handleDelete(id);
    fixture.detectChanges();

    expect(console.log).toHaveBeenCalledWith(mockError.message);
    expect(toastrSpy.error).toHaveBeenCalledWith(
      'An error occurred at trying to delete',
      'Error'
    );
  });
});
