import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptDetailKcorpComponent } from './receipt-detail-kcorp.component';

describe('RefundDetailComponent', () => {
  let component: ReceiptDetailKcorpComponent;
  let fixture: ComponentFixture<ReceiptDetailKcorpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceiptDetailKcorpComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptDetailKcorpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
