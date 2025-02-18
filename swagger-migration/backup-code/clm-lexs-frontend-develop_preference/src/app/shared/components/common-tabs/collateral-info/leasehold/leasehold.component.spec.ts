import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { LeaseholdComponent } from './leasehold.component';

describe('LeaseholdComponent', () => {
  let component: LeaseholdComponent;
  let fixture: ComponentFixture<LeaseholdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaseholdComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaseholdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
