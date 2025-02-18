import { TestBed } from '@angular/core/testing';

import { LitigationInvestigatePropertyService } from './litigation-investigate-property.service';

describe('LitigationInvestigatePropertyService', () => {
  let service: LitigationInvestigatePropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LitigationInvestigatePropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
