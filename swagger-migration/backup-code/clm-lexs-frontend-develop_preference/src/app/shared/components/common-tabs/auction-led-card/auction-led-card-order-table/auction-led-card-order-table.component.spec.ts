import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionLedCardOrderTableComponent } from './auction-led-card-order-table.component';

describe('AuctionLedCardOrderTableComponent', () => {
  let component: AuctionLedCardOrderTableComponent;
  let fixture: ComponentFixture<AuctionLedCardOrderTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionLedCardOrderTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionLedCardOrderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
