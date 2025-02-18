import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawExcutionResultComponent } from './withdraw-excution-result.component';

describe('WithdrawExcutionResultComponent', () => {
  let component: WithdrawExcutionResultComponent;
  let fixture: ComponentFixture<WithdrawExcutionResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawExcutionResultComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawExcutionResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
