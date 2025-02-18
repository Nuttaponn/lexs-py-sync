import { TestBed } from '@angular/core/testing';

import { SummaryReimbursementService } from './summary-reimbursement.service';

describe('SummaryReimbursementService', () => {
  let service: SummaryReimbursementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummaryReimbursementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
