import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitConfirmBeforeDialogConfirmUploadComponent } from './suit-confirm-before-dialog-confirm-upload.component';

describe('SuitConfirmBeforeDialogConfirmUploadComponent', () => {
  let component: SuitConfirmBeforeDialogConfirmUploadComponent;
  let fixture: ComponentFixture<SuitConfirmBeforeDialogConfirmUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuitConfirmBeforeDialogConfirmUploadComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuitConfirmBeforeDialogConfirmUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
