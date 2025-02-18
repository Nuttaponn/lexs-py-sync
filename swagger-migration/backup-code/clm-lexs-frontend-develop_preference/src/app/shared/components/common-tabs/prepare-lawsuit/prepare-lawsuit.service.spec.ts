import { TestBed } from '@angular/core/testing';

import { PrepareLawsuitService } from './prepare-lawsuit.service';

describe('PrepareLawsuitService', () => {
  let service: PrepareLawsuitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrepareLawsuitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
