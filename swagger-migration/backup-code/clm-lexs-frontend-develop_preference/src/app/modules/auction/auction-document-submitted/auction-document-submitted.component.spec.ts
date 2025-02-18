import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionDocumentSubmittedComponent } from './auction-document-submitted.component';

describe('AuctionDocumentSubmittedComponent', () => {
  let component: AuctionDocumentSubmittedComponent;
  let fixture: ComponentFixture<AuctionDocumentSubmittedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionDocumentSubmittedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionDocumentSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
