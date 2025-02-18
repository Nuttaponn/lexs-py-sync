import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionPropertySetBuyerComponent } from './auction-property-set-buyer.component';

describe('AuctionPropertySetBuyerComponent', () => {
  let component: AuctionPropertySetBuyerComponent;
  let fixture: ComponentFixture<AuctionPropertySetBuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionPropertySetBuyerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionPropertySetBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
