import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitCancelMatchingDialogComponent } from './submit-cancel-matching-dialog.component';

describe('SubmitCancelMatchingDialogComponent', () => {
  let component: SubmitCancelMatchingDialogComponent;
  let fixture: ComponentFixture<SubmitCancelMatchingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmitCancelMatchingDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitCancelMatchingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
