import { TestBed } from '@angular/core/testing';

import { AuctionConclusionHistoryResolver } from './auction-conclusion-history.resolver';

describe('AuctionConclusionHistoryResolver', () => {
  let resolver: AuctionConclusionHistoryResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AuctionConclusionHistoryResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
