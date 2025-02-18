import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionPropertyListComponent } from './auction-property-list.component';

describe('PropertyListComponent', () => {
  let component: AuctionPropertyListComponent;
  let fixture: ComponentFixture<AuctionPropertyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionPropertyListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionPropertyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
