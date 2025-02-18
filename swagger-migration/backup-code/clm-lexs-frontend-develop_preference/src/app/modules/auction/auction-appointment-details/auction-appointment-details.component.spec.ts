import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionAppointmentDetailsComponent } from './auction-appointment-details.component';

describe('AuctionAppointmentDetailsComponent', () => {
  let component: AuctionAppointmentDetailsComponent;
  let fixture: ComponentFixture<AuctionAppointmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionAppointmentDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionAppointmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
