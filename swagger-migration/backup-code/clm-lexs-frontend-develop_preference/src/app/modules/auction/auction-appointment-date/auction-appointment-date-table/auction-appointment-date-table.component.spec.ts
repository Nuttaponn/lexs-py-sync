import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionAppointmentDateTableComponent } from './auction-appointment-date-table.component';

describe('AuctionAppointmentDateTableComponent', () => {
  let component: AuctionAppointmentDateTableComponent;
  let fixture: ComponentFixture<AuctionAppointmentDateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionAppointmentDateTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionAppointmentDateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
