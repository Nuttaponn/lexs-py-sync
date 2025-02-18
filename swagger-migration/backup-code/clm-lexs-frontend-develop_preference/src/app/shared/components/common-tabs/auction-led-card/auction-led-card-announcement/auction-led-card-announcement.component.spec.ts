import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionLEDCardAnnouncementComponent } from './auction-led-card-announcement.component';

describe('AuctionLEDCardAnnouncementComponent', () => {
  let component: AuctionLEDCardAnnouncementComponent;
  let fixture: ComponentFixture<AuctionLEDCardAnnouncementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionLEDCardAnnouncementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionLEDCardAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
