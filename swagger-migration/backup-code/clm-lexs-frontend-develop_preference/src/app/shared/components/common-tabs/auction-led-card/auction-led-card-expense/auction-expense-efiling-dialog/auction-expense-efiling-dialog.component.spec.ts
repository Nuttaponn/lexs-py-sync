import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionExpenseEfilingDialogComponent } from './auction-expense-efiling-dialog.component';

describe('AuctionExpenseEfilingDialogComponent', () => {
  let component: AuctionExpenseEfilingDialogComponent;
  let fixture: ComponentFixture<AuctionExpenseEfilingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionExpenseEfilingDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionExpenseEfilingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
