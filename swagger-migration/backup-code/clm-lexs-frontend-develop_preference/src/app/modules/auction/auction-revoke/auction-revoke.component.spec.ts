import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionRevokeComponent } from './auction-revoke.component';

describe('AuctionRevokeComponent', () => {
  let component: AuctionRevokeComponent;
  let fixture: ComponentFixture<AuctionRevokeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionRevokeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionRevokeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
