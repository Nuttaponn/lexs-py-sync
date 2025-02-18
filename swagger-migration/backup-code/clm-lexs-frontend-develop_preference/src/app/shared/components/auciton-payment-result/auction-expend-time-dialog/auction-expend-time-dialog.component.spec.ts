import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionExpendTimeDialogComponent } from './auction-expend-time-dialog.component';

describe('AuctionExpendTimeDialogComponent', () => {
  let component: AuctionExpendTimeDialogComponent;
  let fixture: ComponentFixture<AuctionExpendTimeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionExpendTimeDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionExpendTimeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
