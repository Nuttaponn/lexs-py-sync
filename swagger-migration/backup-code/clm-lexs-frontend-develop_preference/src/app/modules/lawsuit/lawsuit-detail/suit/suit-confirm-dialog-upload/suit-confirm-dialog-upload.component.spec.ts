import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { UploadFileContentComponent } from '@app/shared/components/upload-file-content/upload-file-content.component';
import { UploadMultiFileContentComponent } from '@app/shared/components/upload-multi-file-content/upload-multi-file-content.component';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { SuitConfirmDialogUploadComponent } from './suit-confirm-dialog-upload.component';

describe('SuitConfirmDialogUploadComponent', () => {
  let component: SuitConfirmDialogUploadComponent;
  let fixture: ComponentFixture<SuitConfirmDialogUploadComponent>;
  const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuitConfirmDialogUploadComponent, UploadMultiFileContentComponent, UploadFileContentComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, { provide: UntypedFormBuilder, useValue: formBuilder }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuitConfirmDialogUploadComponent);
    component = fixture.componentInstance;
    component.remark = formBuilder.control(null, Validators.required);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
