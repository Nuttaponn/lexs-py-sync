import { TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';
import { RouterService } from '@shared/services/router.service';
import { IndictmentMainComponent } from './indictment-main/indictment-main.component';
import { SuitService } from './suit.service';

describe('SuitService', () => {
  let service: SuitService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndictmentMainComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, UntypedFormBuilder, RouterService],
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...UnittestImports],
      providers: [UntypedFormBuilder, RouterService, ...UnittestProviders],
    });
    service = TestBed.inject(SuitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
