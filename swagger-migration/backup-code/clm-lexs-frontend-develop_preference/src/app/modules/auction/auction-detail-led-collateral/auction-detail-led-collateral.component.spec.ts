import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionDetailLedCollateralComponent } from './auction-detail-led-collateral.component';

describe('AuctionDetailLedCollateralComponent', () => {
  let component: AuctionDetailLedCollateralComponent;
  let fixture: ComponentFixture<AuctionDetailLedCollateralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionDetailLedCollateralComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionDetailLedCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
