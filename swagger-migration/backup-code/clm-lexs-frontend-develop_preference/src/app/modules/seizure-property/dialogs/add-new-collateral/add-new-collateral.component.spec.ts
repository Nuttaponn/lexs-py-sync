import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCollateralComponent } from './add-new-collateral.component';

describe('AddNewCollateralComponent', () => {
  let component: AddNewCollateralComponent;
  let fixture: ComponentFixture<AddNewCollateralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNewCollateralComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
