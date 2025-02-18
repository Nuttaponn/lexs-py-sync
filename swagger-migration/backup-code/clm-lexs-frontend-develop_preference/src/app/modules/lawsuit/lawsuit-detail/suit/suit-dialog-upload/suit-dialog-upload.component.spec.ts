import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadFileContentComponent } from '@app/shared/components/upload-file-content/upload-file-content.component';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { SuitDialogUploadComponent } from './suit-dialog-upload.component';

describe('SuitDialogUploadComponent', () => {
  let component: SuitDialogUploadComponent;
  let fixture: ComponentFixture<SuitDialogUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuitDialogUploadComponent, UploadFileContentComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuitDialogUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
