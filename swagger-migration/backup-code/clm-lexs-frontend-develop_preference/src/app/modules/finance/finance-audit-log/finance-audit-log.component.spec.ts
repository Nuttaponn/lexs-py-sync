import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceAuditLogComponent } from './finance-audit-log.component';

describe('FinanceAuditLogComponent', () => {
  let component: FinanceAuditLogComponent;
  let fixture: ComponentFixture<FinanceAuditLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinanceAuditLogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceAuditLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
