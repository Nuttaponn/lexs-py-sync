import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionReceiptEfilingComponent } from './auction-receipt-efiling.component';

describe('AuctionReceiptEfilingComponent', () => {
  let component: AuctionReceiptEfilingComponent;
  let fixture: ComponentFixture<AuctionReceiptEfilingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionReceiptEfilingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionReceiptEfilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
