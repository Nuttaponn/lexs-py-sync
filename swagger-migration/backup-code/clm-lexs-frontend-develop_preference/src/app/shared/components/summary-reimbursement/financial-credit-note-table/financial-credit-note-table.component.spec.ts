import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialCreditNoteTableComponent } from './financial-credit-note-table.component';

describe('FinancialCreditNoteTableComponent', () => {
  let component: FinancialCreditNoteTableComponent;
  let fixture: ComponentFixture<FinancialCreditNoteTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialCreditNoteTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialCreditNoteTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
