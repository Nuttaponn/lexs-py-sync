import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AucAnnounementVerifyCollateralComponent } from './auc-announement-verify-collateral.component';

describe('AucAnnounementVerifyCollateralComponent', () => {
  let component: AucAnnounementVerifyCollateralComponent;
  let fixture: ComponentFixture<AucAnnounementVerifyCollateralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AucAnnounementVerifyCollateralComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AucAnnounementVerifyCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
