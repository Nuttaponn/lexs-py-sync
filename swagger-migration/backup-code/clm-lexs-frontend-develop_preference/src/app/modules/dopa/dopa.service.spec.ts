import { TestBed } from '@angular/core/testing';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { DopaService } from './dopa.service';

describe('DopaService', () => {
  let service: DopaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...UnittestImports],
      providers: [...UnittestProviders],
    });
    service = TestBed.inject(DopaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
