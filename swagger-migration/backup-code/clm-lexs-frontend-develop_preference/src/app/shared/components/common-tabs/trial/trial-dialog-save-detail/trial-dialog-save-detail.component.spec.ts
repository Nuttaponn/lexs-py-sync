import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialDialogSaveDetailComponent } from './trial-dialog-save-detail.component';

describe('TrialDialogSaveDetailComponent', () => {
  let component: TrialDialogSaveDetailComponent;
  let fixture: ComponentFixture<TrialDialogSaveDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrialDialogSaveDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialDialogSaveDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
