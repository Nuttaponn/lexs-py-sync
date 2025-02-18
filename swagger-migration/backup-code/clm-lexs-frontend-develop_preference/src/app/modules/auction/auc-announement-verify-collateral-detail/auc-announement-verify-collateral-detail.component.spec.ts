import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AucAnnounementVerifyCollateralDetailComponent } from './auc-announement-verify-collateral-detail.component';

describe('AucAnnounementVerifyCollateralDetailComponent', () => {
  let component: AucAnnounementVerifyCollateralDetailComponent;
  let fixture: ComponentFixture<AucAnnounementVerifyCollateralDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AucAnnounementVerifyCollateralDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AucAnnounementVerifyCollateralDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
