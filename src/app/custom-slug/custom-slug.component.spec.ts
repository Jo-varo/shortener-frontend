import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { CustomSlugComponent } from './custom-slug.component';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { UrlService } from '../services/url.service';
import { BehaviorSubject, of } from 'rxjs';

describe('CustomSlugComponent', () => {
  let component: CustomSlugComponent;
  let fixture: ComponentFixture<CustomSlugComponent>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;
  let urlServiceSpy: jasmine.SpyObj<UrlService>;
  let paramsSubject = new BehaviorSubject({});

  beforeEach(async () => {
    toastrServiceSpy = jasmine.createSpyObj('Toastr', [
      'success',
      'error',
      'warning',
    ]);
    urlServiceSpy = jasmine.createSpyObj('UrlService', ['getLink']);

    await TestBed.configureTestingModule({
      imports: [
        CustomSlugComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: UrlService, useValue: urlServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: ActivatedRoute, useValue: { params: paramsSubject } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSlugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle create scenario', () => {
    paramsSubject.next({});

    component.ngOnInit();

    expect(component.modalType).toBe('Create');
    expect(urlServiceSpy.getLink).not.toHaveBeenCalled();
    expect(document.querySelector('body')!.style.overflow).toBe('hidden');
  });

  it('should handle edit scenario', () => {
    const mockData = {
      id: 12,
      original_url: 'https://example.com',
      slug: 'abc123',
    };
    const id = '123';
    paramsSubject.next({ id });
    urlServiceSpy.getLink.and.returnValue(of(mockData));

    component.ngOnInit();

    expect(component.modalType).toBe('Edit');
    expect(urlServiceSpy.getLink).toHaveBeenCalledWith({ id });
    expect(component.originalURL.value).toBe(mockData.original_url);
    expect(component.customSlug.value).toBe(mockData.slug);
    expect(document.querySelector('body')!.style.overflow).toBe('hidden');
  });

  it('should handle error on getLink', () => {
    const id = '123';
    const error = new Error('Error at getting url');
    paramsSubject.next({ id });

    urlServiceSpy.getLink.and.throwError(error);

    component.ngOnInit();

    expect(component.modalType).toBe('Edit');
    expect(urlServiceSpy.getLink).toHaveBeenCalledWith({ id });
    expect(toastrServiceSpy.error).toHaveBeenCalledWith(
      'Error',
      'Error at getting url'
    );
  });

  afterEach(() => {
    paramsSubject.next({})
  });
});
