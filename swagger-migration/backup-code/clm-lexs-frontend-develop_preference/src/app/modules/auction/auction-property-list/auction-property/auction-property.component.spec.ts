import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionPropertyComponent } from './auction-property.component';

describe('AuctionPropertyComponent', () => {
  let component: AuctionPropertyComponent;
  let fixture: ComponentFixture<AuctionPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionPropertyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
