import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionSeizureDocumentDetailComponent } from './auction-seizure-document-detail.component';

describe('AuctionSeizureDocumentDetailComponent', () => {
  let component: AuctionSeizureDocumentDetailComponent;
  let fixture: ComponentFixture<AuctionSeizureDocumentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionSeizureDocumentDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionSeizureDocumentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
