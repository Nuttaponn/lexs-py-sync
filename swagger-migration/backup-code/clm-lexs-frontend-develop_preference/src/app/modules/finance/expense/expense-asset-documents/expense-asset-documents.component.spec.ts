import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseAssetDocumentsComponent } from './expense-asset-documents.component';

describe('ExpenseAssetDocumentsComponent', () => {
  let component: ExpenseAssetDocumentsComponent;
  let fixture: ComponentFixture<ExpenseAssetDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpenseAssetDocumentsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseAssetDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
