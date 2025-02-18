import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtSettlementAccountsDetailComponent } from './debt-settlement-accounts-detail.component';

describe('DebtSettlementAccountsDetailComponent', () => {
  let component: DebtSettlementAccountsDetailComponent;
  let fixture: ComponentFixture<DebtSettlementAccountsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DebtSettlementAccountsDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtSettlementAccountsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
