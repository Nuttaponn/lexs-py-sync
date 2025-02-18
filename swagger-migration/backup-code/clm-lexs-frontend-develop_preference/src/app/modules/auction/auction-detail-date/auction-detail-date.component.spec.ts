import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionDetailDateComponent } from './auction-detail-date.component';

describe('AuctionDetailDateComponent', () => {
  let component: AuctionDetailDateComponent;
  let fixture: ComponentFixture<AuctionDetailDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionDetailDateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionDetailDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
