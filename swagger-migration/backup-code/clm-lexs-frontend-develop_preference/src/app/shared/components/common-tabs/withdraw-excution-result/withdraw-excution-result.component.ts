import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { TaskService } from '@app/modules/task/services/task.service';
import { IUploadMultiFile, IUploadMultiInfo, TMode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { WithdrawWritOfExecResponse } from '@lexs/lexs-client';
@Component({
  selector: 'app-withdraw-excution-result',
  templateUrl: './withdraw-excution-result.component.html',
  styleUrls: ['./withdraw-excution-result.component.scss'],
})
export class WithdrawExcutionResultComponent implements OnInit {
  @Input() mode: TMode = 'VIEW';
  @Input() data!: WithdrawWritOfExecResponse;
  @Input() dataForm!: UntypedFormGroup;

  public isOpened: boolean = true;
  public docColumns: string[] = ['documentName', 'uploadDate'];
  public withdrawWritOfExecDocument: IUploadMultiFile[] = [];
  public imageError: boolean = false;
  public uploadMultiInfo: IUploadMultiInfo = {
    cif: this.litigationCaseService.litigationCaseShortDetail.cifNo || '',
    taskId: this.taskService?.taskDetail?.id?.toString() || '',
    litigationId: this.taskService?.taskDetail?.litigationId || '',
  };
  public today: Date = new Date();

  get isViewMode(): boolean {
    return this.mode == 'VIEW' ? true : false;
  }

  constructor(
    private taskService: TaskService,
    private litigationCaseService: LitigationCaseService
  ) {}

  ngOnInit() {
    this.withdrawWritOfExecDocument = [
      {
        documentTemplate: this.data?.withdrawWritOfExecDocument?.documentTemplate,
        documentTemplateId: this.data?.withdrawWritOfExecDocument?.documentTemplate?.documentTemplateId,
        imageId: this.data?.withdrawWritOfExecDocument?.imageId || null,
        uploadDate: this.data?.withdrawWritOfExecDocument?.uploadTimestamp,
        isUpload: false,
        uploadRequired: true,
        viewOnly: true,
      },
    ];

    if (this.mode === 'EDIT') {
      //init form

      this.dataForm.controls['withdrawWritOfExecDatetime'].setValue(this.data?.withdrawWritOfExecDatetime);
      this.dataForm.controls['withdrawWritOfExecResult'].setValue(this.data?.withdrawWritOfExecResult);
      this.dataForm.controls['withdrawWritOfExecRemark'].setValue(this.data?.withdrawWritOfExecRemark);
      this.dataForm.controls['returnAmount'].setValue(this.data?.returnAmount);
      this.dataForm.controls['uploadSessionId'].setValue(this.data?.withdrawWritOfExecDocument?.imageId);
      this.dataForm.controls['withdrawWritOfExecDocument'].setValue(this.withdrawWritOfExecDocument);
    }
  }

  getControl(name: string) {
    return this.dataForm?.get(name);
  }

  uploadDocument(event: any) {
    if (!event) return;
    this.withdrawWritOfExecDocument = event;
    this.dataForm.controls['withdrawWritOfExecDocument'].setValue(event);
    this.dataForm.controls['uploadSessionId'].setValue(this.withdrawWritOfExecDocument[0].imageId);
  }

  handleRadioChange(data: string) {
    if (data == 'U') {
      this.dataForm.get('withdrawWritOfExecRemark')?.setValidators(Validators.required);
      this.dataForm.get('withdrawWritOfExecRemark')?.updateValueAndValidity();
    } else {
      this.dataForm.get('withdrawWritOfExecRemark')?.clearValidators();
      this.dataForm.get('withdrawWritOfExecRemark')?.updateValueAndValidity();
      this.dataForm.get('withdrawWritOfExecRemark')?.setValue('');
    }
  }
}
