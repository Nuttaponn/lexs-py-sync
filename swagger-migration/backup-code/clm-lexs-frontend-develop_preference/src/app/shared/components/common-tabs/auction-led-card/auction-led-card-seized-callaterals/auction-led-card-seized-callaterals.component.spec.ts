import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionLEDCardSeizedCallateralsComponent } from './auction-led-card-seized-callaterals.component';

describe('AuctionLEDCardSeizedCallateralsComponent', () => {
  let component: AuctionLEDCardSeizedCallateralsComponent;
  let fixture: ComponentFixture<AuctionLEDCardSeizedCallateralsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionLEDCardSeizedCallateralsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionLEDCardSeizedCallateralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
