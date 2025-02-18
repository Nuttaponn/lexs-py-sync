import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionPropertyDetailComponent } from './auction-property-detail.component';

describe('PropertyDetailComponent', () => {
  let component: AuctionPropertyDetailComponent;
  let fixture: ComponentFixture<AuctionPropertyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionPropertyDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionPropertyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
