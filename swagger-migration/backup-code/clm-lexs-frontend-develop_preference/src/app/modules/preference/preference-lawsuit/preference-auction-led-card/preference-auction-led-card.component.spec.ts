import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceAuctionLedCardComponent } from './preference-auction-led-card.component';

describe('PreferenceAuctionLedCardComponent', () => {
  let component: PreferenceAuctionLedCardComponent;
  let fixture: ComponentFixture<PreferenceAuctionLedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferenceAuctionLedCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferenceAuctionLedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
