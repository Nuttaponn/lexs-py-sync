import { TestBed } from '@angular/core/testing';

import { ExecutionInfoService } from './execution-info.service';

describe('ExecutionInfoService', () => {
  let service: ExecutionInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecutionInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
