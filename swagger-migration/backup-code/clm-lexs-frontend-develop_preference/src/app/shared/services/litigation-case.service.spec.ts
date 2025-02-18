import { TestBed } from '@angular/core/testing';

import { LitigationCaseService } from './litigation-case.service';

describe('LitigationCaseService', () => {
  let service: LitigationCaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LitigationCaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
