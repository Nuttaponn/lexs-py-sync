import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionIncreadsedLimitComponent } from './auction-increadsed-limit.component';

describe('AuctionIncreadsedLimitComponent', () => {
  let component: AuctionIncreadsedLimitComponent;
  let fixture: ComponentFixture<AuctionIncreadsedLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionIncreadsedLimitComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionIncreadsedLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
