import { TestBed } from '@angular/core/testing';

import { RecordDocsService } from './record-docs.service';

describe('RecordDocsService', () => {
  let service: RecordDocsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordDocsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
