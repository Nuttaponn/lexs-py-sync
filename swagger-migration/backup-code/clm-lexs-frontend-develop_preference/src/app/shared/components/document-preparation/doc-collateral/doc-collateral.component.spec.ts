import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { DocCollateralComponent } from './doc-collateral.component';

describe('DocCollateralComponent', () => {
  let component: DocCollateralComponent;
  let fixture: ComponentFixture<DocCollateralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocCollateralComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
