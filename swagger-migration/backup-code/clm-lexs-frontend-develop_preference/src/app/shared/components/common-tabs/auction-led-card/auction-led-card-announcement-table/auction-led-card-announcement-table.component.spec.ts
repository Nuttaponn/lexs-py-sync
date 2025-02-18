import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionLedCardAnnouncementTableComponent } from './auction-led-card-announcement-table.component';

describe('AuctionLedCardAnnouncementTableComponent', () => {
  let component: AuctionLedCardAnnouncementTableComponent;
  let fixture: ComponentFixture<AuctionLedCardAnnouncementTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionLedCardAnnouncementTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionLedCardAnnouncementTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
