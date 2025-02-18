import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionProcessingDocumentComponent } from './auction-processing-document.component';

describe('AuctionProcessingDocumentComponent', () => {
  let component: AuctionProcessingDocumentComponent;
  let fixture: ComponentFixture<AuctionProcessingDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionProcessingDocumentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionProcessingDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
