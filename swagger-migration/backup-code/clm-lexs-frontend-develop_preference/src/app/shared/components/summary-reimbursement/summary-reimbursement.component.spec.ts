import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryReimbursementComponent } from './summary-reimbursement.component';

describe('SummaryReimbursementComponent', () => {
  let component: SummaryReimbursementComponent;
  let fixture: ComponentFixture<SummaryReimbursementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SummaryReimbursementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryReimbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
