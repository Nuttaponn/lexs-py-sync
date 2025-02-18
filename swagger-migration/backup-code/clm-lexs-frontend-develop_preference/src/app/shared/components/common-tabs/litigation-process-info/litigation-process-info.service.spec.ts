import { TestBed } from '@angular/core/testing';

import { LitigationProcessInfoService } from './litigation-process-info.service';

describe('LitigationProcessInfoService', () => {
  let service: LitigationProcessInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LitigationProcessInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
