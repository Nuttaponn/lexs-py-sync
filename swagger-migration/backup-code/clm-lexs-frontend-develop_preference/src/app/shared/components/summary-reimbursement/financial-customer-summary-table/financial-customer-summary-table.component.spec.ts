import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialCustomerSummaryTableComponent } from './financial-customer-summary-table.component';

describe('FinancialCustomerSummaryTableComponent', () => {
  let component: FinancialCustomerSummaryTableComponent;
  let fixture: ComponentFixture<FinancialCustomerSummaryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialCustomerSummaryTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialCustomerSummaryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
