import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalExecutionOfficeWithdrawUnsuccessComponent } from './legal-execution-office-withdraw-unsuccess.component';

describe('LegalExecutionOfficeWithdrawUnsuccessComponent', () => {
  let component: LegalExecutionOfficeWithdrawUnsuccessComponent;
  let fixture: ComponentFixture<LegalExecutionOfficeWithdrawUnsuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LegalExecutionOfficeWithdrawUnsuccessComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalExecutionOfficeWithdrawUnsuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
