import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionAppointmentDateDetailComponent } from './auction-appointment-date-detail.component';

describe('AuctionAppointmentDateDetailComponent', () => {
  let component: AuctionAppointmentDateDetailComponent;
  let fixture: ComponentFixture<AuctionAppointmentDateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionAppointmentDateDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionAppointmentDateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
