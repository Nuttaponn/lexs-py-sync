import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionBarComponent } from '@app/shared/components/action-bar/action-bar.component';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';
import { BuddhistEraPipe, NumberDecimalPipe } from '@spig/core';

import { AccountDetailComponent } from './account-detail.component';

describe('AccountDetailComponent', () => {
  let component: AccountDetailComponent;
  let fixture: ComponentFixture<AccountDetailComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountDetailComponent, ActionBarComponent, BuddhistEraPipe, NumberDecimalPipe],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
