import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionSeizureDocumentComponent } from './auction-seizure-document.component';

describe('AuctionSeizureDocumentComponent', () => {
  let component: AuctionSeizureDocumentComponent;
  let fixture: ComponentFixture<AuctionSeizureDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionSeizureDocumentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionSeizureDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
