import { TestBed } from '@angular/core/testing';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { RouterService } from './router.service';

describe('RouterService', () => {
  let service: RouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...UnittestImports],
      providers: [...UnittestProviders],
    });
    service = TestBed.inject(RouterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
