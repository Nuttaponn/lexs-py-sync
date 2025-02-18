import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionDownloadExpenseReportComponent } from './section-download-expense-report.component';

describe('SectionDownloadExpenseReportComponent', () => {
  let component: SectionDownloadExpenseReportComponent;
  let fixture: ComponentFixture<SectionDownloadExpenseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionDownloadExpenseReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionDownloadExpenseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
