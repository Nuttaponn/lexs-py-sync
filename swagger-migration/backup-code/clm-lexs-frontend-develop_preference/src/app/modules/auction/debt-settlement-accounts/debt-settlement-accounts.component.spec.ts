import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtSettlementAccountsComponent } from './debt-settlement-accounts.component';

describe('DebtSettlementAccountsComponent', () => {
  let component: DebtSettlementAccountsComponent;
  let fixture: ComponentFixture<DebtSettlementAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DebtSettlementAccountsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtSettlementAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
