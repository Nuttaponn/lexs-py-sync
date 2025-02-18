import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefermentDebtSummaryComponent } from './deferment-debt-summary.component';

describe('DefermentDebtSummaryComponent', () => {
  let component: DefermentDebtSummaryComponent;
  let fixture: ComponentFixture<DefermentDebtSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefermentDebtSummaryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefermentDebtSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
