import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawExcutionDetailComponent } from './withdraw-excution-detail.component';

describe('WithdrawExcutionDetailComponent', () => {
  let component: WithdrawExcutionDetailComponent;
  let fixture: ComponentFixture<WithdrawExcutionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawExcutionDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawExcutionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
