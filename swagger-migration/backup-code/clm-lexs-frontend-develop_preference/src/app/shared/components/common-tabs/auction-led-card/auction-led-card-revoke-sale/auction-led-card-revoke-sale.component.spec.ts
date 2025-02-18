import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionLedCardRevokeSaleComponent } from './auction-led-card-revoke-sale.component';

describe('AuctionLedCardRevokeSaleComponent', () => {
  let component: AuctionLedCardRevokeSaleComponent;
  let fixture: ComponentFixture<AuctionLedCardRevokeSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionLedCardRevokeSaleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionLedCardRevokeSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
