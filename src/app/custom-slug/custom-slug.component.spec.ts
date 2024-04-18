import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSlugComponent } from './custom-slug.component';

describe('CustomSlugComponent', () => {
  let component: CustomSlugComponent;
  let fixture: ComponentFixture<CustomSlugComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSlugComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomSlugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
