import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionHeaderComponent } from './auction-header.component';

describe('AuctionHeaderComponent', () => {
  let component: AuctionHeaderComponent;
  let fixture: ComponentFixture<AuctionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
