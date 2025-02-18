import { TestBed } from '@angular/core/testing';

import { WithdrawnWritExecutionService } from './withdrawn-writ-execution.service';

describe('WithdrawnWritExecutionService', () => {
  let service: WithdrawnWritExecutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WithdrawnWritExecutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
