import { TestBed } from '@angular/core/testing';

import { LitigationCaseInfoService } from './litigation-case-info.service';

describe('LitigationCaseInfoService', () => {
  let service: LitigationCaseInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LitigationCaseInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
