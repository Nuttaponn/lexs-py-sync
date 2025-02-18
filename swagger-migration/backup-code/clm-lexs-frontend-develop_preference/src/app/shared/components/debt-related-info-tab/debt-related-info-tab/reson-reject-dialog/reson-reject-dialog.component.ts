import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TaskService } from '@app/modules/task/services/task.service';
import { IUploadMultiFile, IUploadMultiInfo } from '@app/shared/models';
import { PersonHeirInfoDto } from '@lexs/lexs-client';
import { DebtRelatedInfoTabService } from '../../debt-related-info-tab.service';

@Component({
  selector: 'app-reson-reject-dialog',
  templateUrl: './reson-reject-dialog.component.html',
  styleUrls: ['./reson-reject-dialog.component.scss'],
})
export class ResonRejectDialogComponent implements OnInit {
  public docColumn = ['documentName', 'uploadDate'];
  public documentUpload: IUploadMultiFile[] = [];
  public uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
    taskId: '',
  };
  public documentError = true;
  public dialogReadonly = true;
  public dataForm!: UntypedFormGroup;
  public isViewMode: boolean = true;
  public heirInformation: PersonHeirInfoDto = {};
  public imageError = false;

  constructor(
    private form: UntypedFormBuilder,
    private taskService: TaskService,
    private debtRelatedInfoTabService: DebtRelatedInfoTabService
  ) {}

  ngOnInit(): void {
    this.dataForm = this.form.group({
      reason: ['', Validators.required],
      documentUpload: ['', Validators.required],
    });

    this.setDataForm();
  }

  dataContext(data: any) {
    this.isViewMode = data.isViewMode;
    this.heirInformation = data.heirInformationObj;

    this.documentUpload = [
      {
        documentTemplate: this.heirInformation.document,
        documentTemplateId: this.heirInformation.document?.documentTemplateId,
        uploadRequired: true,
        imageId: this.heirInformation.document?.imageId || null,
        uploadDate: this.heirInformation.document?.documentDate,
        isUpload: false,
        removeDocument: true,
      },
    ];
  }

  get dataFormMatch() {
    return this.dataForm.controls;
  }

  getFormControl(name: string): any {
    return this.dataForm.get(name);
  }

  setDataForm() {
    if (this.heirInformation) {
      this.dataFormMatch['reason'].setValue(this.heirInformation.reason);

      if (this.heirInformation.document?.imageId)
        this.dataForm.controls['documentUpload'].setValue(this.heirInformation.document);
    }
    if (this.taskService?.taskDetail) {
      this.uploadMultiInfo = {
        cif: this.debtRelatedInfoTabService?.currentLitigation?.customerId || '',
        taskId: this.taskService?.taskDetail?.id?.toString() || '',
        litigationId: this.taskService?.taskDetail?.litigationId || '',
      };
    }
  }

  public async onClose() {
    if (this.dataForm.invalid && !this.isViewMode) {
      this.validateImage();
      this.dataForm.markAllAsTouched();
      this.dataForm.updateValueAndValidity();
      return false;
    } else {
      return true;
    }
  }

  get returnData() {
    return this.dataForm.getRawValue();
  }

  onUploadFileEvent(event: any) {
    if (!event) return;
    this.documentUpload = event;
    this.dataForm.controls['documentUpload'].setValue(event);
  }

  validateImage() {
    if (!this.isViewMode && !this.documentUpload[0].imageId) {
      this.imageError = true;
    }
  }
}
