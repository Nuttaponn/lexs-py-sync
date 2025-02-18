import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionDetailSummaryComponent } from './auction-detail-summary.component';

describe('AuctionDetailSummaryComponent', () => {
  let component: AuctionDetailSummaryComponent;
  let fixture: ComponentFixture<AuctionDetailSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionDetailSummaryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionDetailSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
