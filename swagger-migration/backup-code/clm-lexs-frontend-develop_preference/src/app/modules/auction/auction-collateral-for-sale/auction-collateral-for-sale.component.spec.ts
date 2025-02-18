import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionCollateralForSaleComponent } from './auction-collateral-for-sale.component';

describe('AuctionCollateralForSaleComponent', () => {
  let component: AuctionCollateralForSaleComponent;
  let fixture: ComponentFixture<AuctionCollateralForSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionCollateralForSaleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionCollateralForSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
