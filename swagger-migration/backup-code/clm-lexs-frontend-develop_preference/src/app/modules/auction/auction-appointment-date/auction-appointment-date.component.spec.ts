import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionAppointmentDateComponent } from './auction-appointment-date.component';

describe('AuctionAppointmentDateComponent', () => {
  let component: AuctionAppointmentDateComponent;
  let fixture: ComponentFixture<AuctionAppointmentDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionAppointmentDateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionAppointmentDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
