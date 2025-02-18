import { TestBed } from '@angular/core/testing';

import { AuctionAppointmentDateDetailResolver } from './auction-appointment-date-detail.resolver';

describe('AuctionAppointmentDateDetailResolver', () => {
  let resolver: AuctionAppointmentDateDetailResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AuctionAppointmentDateDetailResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
