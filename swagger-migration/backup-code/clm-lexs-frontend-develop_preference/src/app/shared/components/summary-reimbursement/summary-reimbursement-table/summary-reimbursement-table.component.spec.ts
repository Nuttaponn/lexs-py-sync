import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryReimbursementTableComponent } from './summary-reimbursement-table.component';

describe('SummaryReimbursementTableComponent', () => {
  let component: SummaryReimbursementTableComponent;
  let fixture: ComponentFixture<SummaryReimbursementTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SummaryReimbursementTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryReimbursementTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
