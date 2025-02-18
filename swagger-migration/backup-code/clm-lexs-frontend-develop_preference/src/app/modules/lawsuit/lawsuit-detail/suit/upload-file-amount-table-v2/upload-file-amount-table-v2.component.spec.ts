import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileAmountTableV2Component } from './upload-file-amount-table-v2.component';

describe('UploadFileAmountTableV2Component', () => {
  let component: UploadFileAmountTableV2Component;
  let fixture: ComponentFixture<UploadFileAmountTableV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadFileAmountTableV2Component],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileAmountTableV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
