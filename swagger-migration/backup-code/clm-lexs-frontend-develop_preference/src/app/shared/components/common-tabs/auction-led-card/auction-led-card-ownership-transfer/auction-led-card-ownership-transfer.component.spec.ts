import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionLedCardOwnershipTransferComponent } from './auction-led-card-ownership-transfer.component';

describe('AuctionLedCardOwnershipTransferComponent', () => {
  let component: AuctionLedCardOwnershipTransferComponent;
  let fixture: ComponentFixture<AuctionLedCardOwnershipTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionLedCardOwnershipTransferComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionLedCardOwnershipTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
