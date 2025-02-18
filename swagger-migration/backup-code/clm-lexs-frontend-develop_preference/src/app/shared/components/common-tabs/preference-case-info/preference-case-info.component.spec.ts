import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceCaseInfoComponent } from './preference-case-info.component';

describe('PreferenceCaseInfoComponent', () => {
  let component: PreferenceCaseInfoComponent;
  let fixture: ComponentFixture<PreferenceCaseInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferenceCaseInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferenceCaseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
