import { TestBed } from '@angular/core/testing';

import { DebtRelatedInfoTabService } from './debt-related-info-tab.service';

describe('DebtRelatedInfoTabService', () => {
  let service: DebtRelatedInfoTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DebtRelatedInfoTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
