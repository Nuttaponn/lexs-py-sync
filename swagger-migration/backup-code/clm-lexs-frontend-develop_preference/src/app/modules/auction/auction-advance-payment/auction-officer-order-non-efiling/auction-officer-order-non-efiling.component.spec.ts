import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionOfficerOrderNonEfilingComponent } from './auction-officer-order-non-efiling.component';

describe('AuctionOfficerOrderNonEfilingComponent', () => {
  let component: AuctionOfficerOrderNonEfilingComponent;
  let fixture: ComponentFixture<AuctionOfficerOrderNonEfilingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionOfficerOrderNonEfilingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionOfficerOrderNonEfilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
