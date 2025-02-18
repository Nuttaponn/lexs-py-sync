import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageEmptyComponent } from '@app/shared/components/message-empty/message-empty.component';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { AccountAndDebtComponent } from './account-and-debt.component';

describe('AccountAndDebtComponent', () => {
  let component: AccountAndDebtComponent;
  let fixture: ComponentFixture<AccountAndDebtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountAndDebtComponent, MessageEmptyComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAndDebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
