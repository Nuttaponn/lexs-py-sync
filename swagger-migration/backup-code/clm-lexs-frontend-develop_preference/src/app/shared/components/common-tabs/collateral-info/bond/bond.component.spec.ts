import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { BondComponent } from './bond.components';

describe('BondComponent', () => {
  let component: BondComponent;
  let fixture: ComponentFixture<BondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BondComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
