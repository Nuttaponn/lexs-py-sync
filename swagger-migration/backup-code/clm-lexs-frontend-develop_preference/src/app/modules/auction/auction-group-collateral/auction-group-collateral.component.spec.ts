import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionGroupCollateralComponent } from './auction-group-collateral.component';

describe('AuctionGroupCollateralComponent', () => {
  let component: AuctionGroupCollateralComponent;
  let fixture: ComponentFixture<AuctionGroupCollateralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionGroupCollateralComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionGroupCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
