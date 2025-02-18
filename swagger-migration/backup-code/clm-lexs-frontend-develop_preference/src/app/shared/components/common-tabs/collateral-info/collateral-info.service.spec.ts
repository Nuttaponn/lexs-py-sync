import { TestBed } from '@angular/core/testing';

import { CollateralInfoService } from './collateral-info.service';

describe('CollateralInfoService', () => {
  let service: CollateralInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollateralInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
