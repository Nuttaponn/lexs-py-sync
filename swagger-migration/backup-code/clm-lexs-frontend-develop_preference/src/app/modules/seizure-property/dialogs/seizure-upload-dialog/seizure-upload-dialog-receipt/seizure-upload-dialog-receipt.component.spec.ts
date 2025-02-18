import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeizureUploadDialogReceiptComponent } from './seizure-upload-dialog-receipt.component';

describe('SeizureUploadDialogReceiptComponent', () => {
  let component: SeizureUploadDialogReceiptComponent;
  let fixture: ComponentFixture<SeizureUploadDialogReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeizureUploadDialogReceiptComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeizureUploadDialogReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
