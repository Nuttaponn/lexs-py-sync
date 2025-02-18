import { TestBed } from '@angular/core/testing';

import { AucAnnounementMapCollateralResolver } from './auc-announement-map-collateral.resolver';

describe('AucAnnounementMapCollateralResolver', () => {
  let resolver: AucAnnounementMapCollateralResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AucAnnounementMapCollateralResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
