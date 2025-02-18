import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionReceiptUploadComponent } from './execution-receipt-upload.component';

describe('ExecutionReceiptUploadComponent', () => {
  let component: ExecutionReceiptUploadComponent;
  let fixture: ComponentFixture<ExecutionReceiptUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExecutionReceiptUploadComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionReceiptUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
