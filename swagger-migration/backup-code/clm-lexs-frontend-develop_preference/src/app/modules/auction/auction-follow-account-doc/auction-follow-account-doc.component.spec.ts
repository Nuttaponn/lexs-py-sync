import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionFollowAccountDocComponent } from './auction-follow-account-doc.component';

describe('AuctionFollowAccountDocComponent', () => {
  let component: AuctionFollowAccountDocComponent;
  let fixture: ComponentFixture<AuctionFollowAccountDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionFollowAccountDocComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionFollowAccountDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
