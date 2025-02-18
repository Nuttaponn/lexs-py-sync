import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionLEDCardComponent } from './auction-led-card.component';

describe('AuctionLEDCardComponent', () => {
  let component: AuctionLEDCardComponent;
  let fixture: ComponentFixture<AuctionLEDCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionLEDCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionLEDCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
