import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { taskCode } from '@app/shared/models';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { NameValuePair } from '@lexs/lexs-client';

@Component({
  selector: 'app-reject-original-copy-dialog',
  templateUrl: './reject-original-copy-dialog.component.html',
  styleUrls: ['./reject-original-copy-dialog.component.scss'],
})
export class RejectOriginalCopyDialogComponent implements OnInit {
  form!: UntypedFormGroup;
  bannerOption: any = {
    type: 'fail',
    icon: 'icon-Error',
    message: 'กรุณาพิมพ์ใบนำส่งคืนต้นฉบับ และนำส่งพร้อมกับต้นฉบับคืนให้หน่วยงานต้นทาง',
  };
  type: 'DOC_OVER' | 'NORMAL' = 'NORMAL';
  mode: 'EDIT' | null = null;
  content = {
    documentName: '',
    pageCount: 0,
    rejectedRemarks: '',
    rejectedReasonId: '',
  };
  public config = { labelPlaceHolder: 'กรุณาระบุเหตุผลยกเลิกรายการ', displayWith: 'name', valueField: 'value' };
  reasonOption: NameValuePair[] = [];
  receiveCancelReasonOtion: NameValuePair[] = [
    {
      name: 'ผิดฉบับ',
      value: '1',
    },
    {
      name: 'เอกสารไม่ครบ',
      value: '2',
    },
  ];
  public taskCode!: taskCode;

  constructor(
    private fb: UntypedFormBuilder,
    private masterDataService: MasterDataService
  ) {}

  async ngOnInit(): Promise<any> {
    this.initData();
    await this.initOptions();
  }

  initData() {
    this.form = this.fb.group({
      rejectedReasonId: [this.content?.rejectedReasonId || ''],
      rejectedRemarks: [this.content?.rejectedRemarks || ''],
      documentName: [this.content?.documentName || ''],
      pageCount: [this.content?.pageCount || ''],
    });
    if (this.type == 'NORMAL') {
      this.form.get('rejectedReasonId')?.addValidators(Validators.required);
      this.form.get('rejectedRemarks')?.addValidators(Validators.required);
    }
    if (this.type == 'DOC_OVER') {
      this.form.get('documentName')?.addValidators(Validators.required);
      this.form.get('pageCount')?.addValidators(Validators.required);
    }

    this.form.updateValueAndValidity();
  }

  async initOptions() {
    switch (this.taskCode) {
      case 'RECEIPT_ORIGINAL_DOCUMENT':
      case 'RECEIPT_REJECT_ORIGINAL_DOCUMENT':
        this.reasonOption = await this.masterDataService.rejectOriginalDocumentReason();
        break;

      default:
        this.reasonOption = this.receiveCancelReasonOtion;
        break;
    }
  }

  dataContext(data: any) {
    this.type = data.type;
    this.content = data.content;
    this.mode = data.mode;
    this.taskCode = data.taskCode;
  }

  onSelectedOption(value: any) {
    if (value === '1' || value === '3') {
      this.form.get('documentName')?.setValidators(Validators.required);
      this.form.get('pageCount')?.setValidators(Validators.required);
    } else {
      this.form.get('documentName')?.clearValidators();
      this.form.get('pageCount')?.clearValidators();
    }
    this.form.get('documentName')?.updateValueAndValidity();
    this.form.get('pageCount')?.updateValueAndValidity();
  }

  get returnData() {
    return {
      documentName: this.form.value.documentName,
      pageCount: this.form.value.pageCount,
      rejectedRemarks: this.form.value.rejectedRemarks,
      rejectedReasonId: this.form.value.rejectedReasonId,
    };
  }

  getControl(ctrName: string) {
    return this.form?.get(ctrName);
  }

  public async onClose(): Promise<boolean> {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.valid) return true;

    return false;
  }
}
