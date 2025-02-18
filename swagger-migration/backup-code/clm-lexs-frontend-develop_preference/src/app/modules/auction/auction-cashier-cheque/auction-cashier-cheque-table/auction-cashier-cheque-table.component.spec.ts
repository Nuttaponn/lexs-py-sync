import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionCashierChequeTableComponent } from './auction-cashier-cheque-table.component';

describe('AuctionCashierChequeTableComponent', () => {
  let component: AuctionCashierChequeTableComponent;
  let fixture: ComponentFixture<AuctionCashierChequeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionCashierChequeTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionCashierChequeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
