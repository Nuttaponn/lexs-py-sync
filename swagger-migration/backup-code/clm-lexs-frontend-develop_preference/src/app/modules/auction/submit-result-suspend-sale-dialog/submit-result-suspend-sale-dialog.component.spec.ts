import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitResultSuspendSaleDialogComponent } from './submit-result-suspend-sale-dialog.component';

describe('SubmitResultSuspendSaleDialogComponent', () => {
  let component: SubmitResultSuspendSaleDialogComponent;
  let fixture: ComponentFixture<SubmitResultSuspendSaleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmitResultSuspendSaleDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitResultSuspendSaleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
