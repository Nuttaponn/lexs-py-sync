import { TestBed } from '@angular/core/testing';

import { AuctionAppointmentDateResolver } from './auction-appointment-date.resolver';

describe('AuctionAppointmentDateResolver', () => {
  let resolver: AuctionAppointmentDateResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AuctionAppointmentDateResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
