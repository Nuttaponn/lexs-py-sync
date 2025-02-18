import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionAppointmentDataComponent } from './auction-appointment-data.component';

describe('AuctionAppointmentDataComponent', () => {
  let component: AuctionAppointmentDataComponent;
  let fixture: ComponentFixture<AuctionAppointmentDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionAppointmentDataComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionAppointmentDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
