import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionPropertyListTableComponent } from './auction-property-list-table.component';

describe('PropertyListTableComponent', () => {
  let component: AuctionPropertyListTableComponent;
  let fixture: ComponentFixture<AuctionPropertyListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionPropertyListTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionPropertyListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
