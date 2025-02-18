import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionResultInfoComponent } from './auction-result-info.component';

describe('AuctionResultInfoComponent', () => {
  let component: AuctionResultInfoComponent;
  let fixture: ComponentFixture<AuctionResultInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionResultInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionResultInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
