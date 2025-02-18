import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionFeeDialogComponent } from './execution-fee-dialog.component';

describe('ExecutionFeeDialogComponent', () => {
  let component: ExecutionFeeDialogComponent;
  let fixture: ComponentFixture<ExecutionFeeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExecutionFeeDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionFeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
