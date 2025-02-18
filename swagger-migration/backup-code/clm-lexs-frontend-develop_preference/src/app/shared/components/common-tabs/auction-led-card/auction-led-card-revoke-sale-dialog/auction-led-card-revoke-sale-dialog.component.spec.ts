import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionLedCardRevokeSaleDialogComponent } from './auction-led-card-revoke-sale-dialog.component';

describe('AuctionLedCardRevokeSaleDialogComponent', () => {
  let component: AuctionLedCardRevokeSaleDialogComponent;
  let fixture: ComponentFixture<AuctionLedCardRevokeSaleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionLedCardRevokeSaleDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionLedCardRevokeSaleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
