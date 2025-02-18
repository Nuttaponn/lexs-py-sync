import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { MainCollateralComponent } from './main-collateral.component';

describe('MainCollateralComponent', () => {
  let component: MainCollateralComponent;
  let fixture: ComponentFixture<MainCollateralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainCollateralComponent],
      imports: [...UnittestImports],
      providers: [
        ...UnittestProviders,
        Configuration,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
