import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EFilingToReceiptDialogComponent } from './e-filing-to-receipt-dialog.component';

describe('EFilingToReceiptDialogComponent', () => {
  let component: EFilingToReceiptDialogComponent;
  let fixture: ComponentFixture<EFilingToReceiptDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EFilingToReceiptDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EFilingToReceiptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
