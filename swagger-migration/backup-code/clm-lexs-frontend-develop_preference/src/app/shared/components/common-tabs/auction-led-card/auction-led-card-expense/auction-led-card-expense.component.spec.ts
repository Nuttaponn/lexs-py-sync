import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionLEDCardExpenseComponent } from './auction-led-card-expense.component';

describe('AuctionLEDCardExpenseComponent', () => {
  let component: AuctionLEDCardExpenseComponent;
  let fixture: ComponentFixture<AuctionLEDCardExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionLEDCardExpenseComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionLEDCardExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
