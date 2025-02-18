import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionRevokeTableComponent } from './auction-revoke-table.component';

describe('AuctionRevokeTableComponent', () => {
  let component: AuctionRevokeTableComponent;
  let fixture: ComponentFixture<AuctionRevokeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionRevokeTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionRevokeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
