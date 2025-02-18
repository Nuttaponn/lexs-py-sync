import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectAuctionCashierChequeDialogComponent } from './reject-auction-cashier-cheque-dialog.component';

describe('RejectAuctionCashierChequeDialogComponent', () => {
  let component: RejectAuctionCashierChequeDialogComponent;
  let fixture: ComponentFixture<RejectAuctionCashierChequeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RejectAuctionCashierChequeDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectAuctionCashierChequeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
