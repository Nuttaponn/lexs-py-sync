import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionOfficerOrderComponent } from './auction-officer-order.component';

describe('AuctionOfficerOrderComponent', () => {
  let component: AuctionOfficerOrderComponent;
  let fixture: ComponentFixture<AuctionOfficerOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionOfficerOrderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionOfficerOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
