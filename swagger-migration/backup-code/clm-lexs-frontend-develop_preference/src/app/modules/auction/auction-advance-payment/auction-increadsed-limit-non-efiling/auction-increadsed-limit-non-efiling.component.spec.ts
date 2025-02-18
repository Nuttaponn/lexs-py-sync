import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionIncreadsedLimitNonEfilingComponent } from './auction-increadsed-limit-non-efiling.component';

describe('AuctionIncreadsedLimitNonEfilingComponent', () => {
  let component: AuctionIncreadsedLimitNonEfilingComponent;
  let fixture: ComponentFixture<AuctionIncreadsedLimitNonEfilingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionIncreadsedLimitNonEfilingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionIncreadsedLimitNonEfilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
