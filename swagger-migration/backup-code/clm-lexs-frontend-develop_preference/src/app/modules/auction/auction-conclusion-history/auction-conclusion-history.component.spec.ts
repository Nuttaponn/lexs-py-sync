import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionConclusionHistoryComponent } from './auction-conclusion-history.component';

describe('AuctionConclusionHistoryComponent', () => {
  let component: AuctionConclusionHistoryComponent;
  let fixture: ComponentFixture<AuctionConclusionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionConclusionHistoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionConclusionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
