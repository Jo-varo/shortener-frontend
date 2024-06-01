import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UrlService } from '../services/url.service';
import { ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { ORIGINAL_URL } from '../../helpers/constants';
import { of } from 'rxjs';
import { environment } from '../../environments/environment.development';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let urlServiceSpy: jasmine.SpyObj<UrlService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let clipboardSpy: jasmine.SpyObj<Clipboard>;
  let shortenerForm: FormGroup;

  beforeEach(async () => {
    shortenerForm = new FormGroup({
      [ORIGINAL_URL]: new FormControl(''),
    });

    urlServiceSpy = jasmine.createSpyObj('UrlService', ['shortLink']);
    toastrSpy = jasmine.createSpyObj('Toastr', [
      'success',
      'info',
      'error',
      'warning',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: UrlService, useValue: urlServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Shortener');
  });

  it('shortedOriginalUrl and shortenedLink should be empty at start', () => {
    expect(component.shortedOriginalUrl).toEqual('');
    expect(component.shortenedLink).toEqual('');
  });

  it('should copy shortened link successfully', async () => {
    clipboardSpy = jasmine.createSpyObj('Clipboard', ['writeText']);
    spyOnProperty(navigator, 'clipboard').and.returnValue(clipboardSpy);

    const shortenedLink = 'https://shortened.link';
    component.shortenedLink = shortenedLink;
    clipboardSpy.writeText.and.returnValue(Promise.resolve());

    await component.copyShortedLink();

    expect(clipboardSpy.writeText).toHaveBeenCalledWith(shortenedLink);
    expect(toastrSpy.info).toHaveBeenCalledWith('Shorted url copied', 'Copied');
  });

  it('should handle copy error', async () => {
    clipboardSpy = jasmine.createSpyObj('Clipboard', ['writeText']);
    spyOnProperty(navigator, 'clipboard').and.returnValue(clipboardSpy);

    const shortenedLink = 'https://shortened.link';
    const mockError = new Error('Clipboard write failed');
    component.shortenedLink = shortenedLink;
    clipboardSpy.writeText.and.returnValue(Promise.reject(mockError));

    await component.copyShortedLink();

    expect(clipboardSpy.writeText).toHaveBeenCalledWith(shortenedLink);
    expect(toastrSpy.error).toHaveBeenCalledWith('Error at copying', 'Error');
  });

  it('submit button should exist', () => {
    const submitElementButton: HTMLButtonElement = fixture.nativeElement;
    const submitButton = submitElementButton.querySelector('button');
    expect(submitButton?.type).toBe('submit');
  });

  it('should handle invalid url submission', () => {
    component.shortenerForm.get(ORIGINAL_URL)!.setValue('invalid_url'); // Set invalid url
    component.handleSubmit();

    expect(toastrSpy.warning).toHaveBeenCalledWith(
      'Enter a valid url',
      'Invalid URL'
    );
    expect(urlServiceSpy.shortLink).not.toHaveBeenCalled();
  });

  it('should handle successful url shortening', () => {
    const validUrl = 'https://www.example.com';
    const mockResponse = { slug: 'abc123' };
    component.shortenerForm.get(ORIGINAL_URL)!.setValue(validUrl);
    urlServiceSpy.shortLink.and.returnValue(of(mockResponse));

    component.handleSubmit();

    expect(urlServiceSpy.shortLink).toHaveBeenCalledWith({
      originalUrl: validUrl,
    });
    expect(toastrSpy.success).toHaveBeenCalledWith('Shorted link', 'Success');
    expect(component.shortenedLink).toBe(
      `${environment.apiUrlPreffix}/${mockResponse.slug}`
    );
    expect(component.shortedOriginalUrl).toBe(validUrl);
    expect(component.shortenerForm.value).toEqual({
      originalURL: null,
    });
  });

  it('should handle unsuccessful url shortening', () => {
    const validUrl = 'https://www.example.com';
    const mockError = new Error('An error has occured at trying to short link');
    component.originalURL.setValue(validUrl);

    urlServiceSpy.shortLink.and.throwError(mockError);

    spyOn(console, 'log');
    component.handleSubmit();

    expect(urlServiceSpy.shortLink).toHaveBeenCalledWith({
      originalUrl: validUrl,
    });
    expect(toastrSpy.error).toHaveBeenCalledWith(
      'An error has occured at trying to short link',
      'Error'
    );
    expect(console.log).toHaveBeenCalledWith(mockError.message); // Assert error logged to console
  });
});
