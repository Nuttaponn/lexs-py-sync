import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionDetailLedCollateralTableComponent } from './auction-detail-led-collateral-table.component';

describe('AuctionDetailLedCollateralTableComponent', () => {
  let component: AuctionDetailLedCollateralTableComponent;
  let fixture: ComponentFixture<AuctionDetailLedCollateralTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionDetailLedCollateralTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionDetailLedCollateralTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
