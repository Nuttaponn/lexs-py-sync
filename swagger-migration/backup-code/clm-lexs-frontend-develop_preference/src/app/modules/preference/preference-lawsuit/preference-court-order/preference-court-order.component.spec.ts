import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceCourtOrderComponent } from './preference-court-order.component';

describe('PreferenceCourtOrderComponent', () => {
  let component: PreferenceCourtOrderComponent;
  let fixture: ComponentFixture<PreferenceCourtOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferenceCourtOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferenceCourtOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
