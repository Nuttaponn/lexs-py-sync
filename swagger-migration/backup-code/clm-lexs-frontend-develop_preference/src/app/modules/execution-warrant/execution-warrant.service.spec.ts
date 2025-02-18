import { TestBed } from '@angular/core/testing';

import { ExecutionWarrantService } from './execution-warrant.service';

describe('ExecutionWarrantService', () => {
  let service: ExecutionWarrantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecutionWarrantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
