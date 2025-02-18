import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AucAnnounementMapCollateralComponent } from './auc-announement-map-collateral.component';

describe('AucAnnounementMapCollateralComponent', () => {
  let component: AucAnnounementMapCollateralComponent;
  let fixture: ComponentFixture<AucAnnounementMapCollateralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AucAnnounementMapCollateralComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AucAnnounementMapCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
