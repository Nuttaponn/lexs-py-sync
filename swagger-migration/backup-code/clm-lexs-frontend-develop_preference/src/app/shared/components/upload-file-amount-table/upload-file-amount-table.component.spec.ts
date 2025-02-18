import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileAmountTableComponent } from './upload-file-amount-table.component';

describe('UploadFileAmountTableComponent', () => {
  let component: UploadFileAmountTableComponent;
  let fixture: ComponentFixture<UploadFileAmountTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadFileAmountTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileAmountTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
