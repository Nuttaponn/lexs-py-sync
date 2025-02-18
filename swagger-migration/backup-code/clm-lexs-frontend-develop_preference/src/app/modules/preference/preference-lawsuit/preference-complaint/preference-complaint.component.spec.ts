import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceComplaintComponent } from './preference-complaint.component';

describe('PreferenceComplaintComponent', () => {
  let component: PreferenceComplaintComponent;
  let fixture: ComponentFixture<PreferenceComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferenceComplaintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferenceComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
