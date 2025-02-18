import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionCashierChequeComponent } from './auction-cashier-cheque.component';

describe('AuctionCashierChequeComponent', () => {
  let component: AuctionCashierChequeComponent;
  let fixture: ComponentFixture<AuctionCashierChequeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionCashierChequeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionCashierChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
