import { TestBed } from '@angular/core/testing';

import { SearchControllerService } from './search-controller.service';

describe('SearchControllerService', () => {
  let service: SearchControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
