import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IUploadMultiFile, IUploadMultiInfo, TMode, taskCode } from '@app/shared/models';
import { DialogOptions, DropDownConfig, SimpleSelectOption } from '@spig/core';
import { NotificationService } from '@shared/services/notification.service';
import { AuctionExpendTimeDialogComponent } from '@shared/components/auciton-payment-result/auction-expend-time-dialog/auction-expend-time-dialog.component';
import { DocumentService } from '@shared/components/document-preparation/document.service';
import { TaskService } from '@modules/task/services/task.service';
import { DOC_TEMPLATE } from '@app/shared/constant';
import { AuctionDetailItemPaymentResultService } from '@app/modules/auction/auction-detail-item-payment-result/auction-detail-item-payment-result.service';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { DocumentDto } from '@lexs/lexs-client';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-auciton-payment-result',
  templateUrl: './auciton-payment-result.component.html',
  styleUrls: ['./auciton-payment-result.component.scss'],
})
export class AucitonPaymentResultComponent implements OnInit {
  public extendTimeColumn = ['index', 'dulyDate', 'saveDate', 'extendDoc'];
  public extendTimeR2E9050112AColumn = ['index', 'dulyDate', 'saveDate', 'extendDoc'];
  @Input() form!: UntypedFormGroup;
  @Input() data: any | undefined;
  @Input() extendTimeList!: any[];
  @Input() isViewMode: boolean = false;
  @Input() isFromDateDetail: boolean = false;
  @Input() defaultExpanded = false;
  @Input() trackingRound = 1;

  public TRACKING_RESULT = {
    PAYMENT_EXTEND: 'PAYMENT_EXTEND',
    PENDING_CANCEL_PAYMENT: 'PENDING_CANCEL_PAYMENT',
    PAYMENT_COMPLETE: 'PAYMENT_COMPLETE',
    NOT_PAYMENT: 'NOT_PAYMENT',
  };

  // public customerId = '';
  // public litigationId = '';
  public documentColumns: string[] = ['documentName', 'uploadDate'];
  // public dataColumns: string[] = ['INDEX', 'FINAL_EXTEND_DATE', 'RECORD_DATE', 'DOCUMENT'];
  public uploadMultiInfo: IUploadMultiInfo = { cif: '', litigationId: '' };
  public documentUpload: IUploadMultiFile[] = [];
  public mode!: TMode;
  public dropDownOption: SimpleSelectOption[] = [
    { value: this.TRACKING_RESULT.PAYMENT_EXTEND, text: 'ขอขยายระยะเวลาวางเงิน' },
    { value: this.TRACKING_RESULT.PENDING_CANCEL_PAYMENT, text: 'อยู่ระหว่างร้องเพิกถอนการขาย' },
    { value: this.TRACKING_RESULT.PAYMENT_COMPLETE, text: 'ชำระแล้ว' },
    { value: this.TRACKING_RESULT.NOT_PAYMENT, text: 'ผู้ซื้อไม่วางเงิน' },
  ];
  public ddlConfig: DropDownConfig = {
    disableSelect: false,
    displayWith: 'text',
    valueField: 'value',
    iconName: '',
    labelPlaceHolder: 'ผลการติดตาม',
  };
  public isOpened: boolean = false;
  public taskCode: string = '';
  private originalDocument: any[] = [];
  public _extendTimeListView: MatTableDataSource<any> = new MatTableDataSource<any>();

  identify(index: number, item: any) {
    return item.uploadSessionId;
  }
  constructor(
    private notificationService: NotificationService,
    private documentService: DocumentService,
    private taskService: TaskService,
    private auctionDetailItemPaymentResultService: AuctionDetailItemPaymentResultService,
    private litigationCaseService: LitigationCaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('extendTimeList :: ', this.extendTimeList);
    this.isOpened = this.defaultExpanded;
    if (this.isViewMode) {
      this.taskCode = taskCode.R2E09_05_01_12A;
    } else {
      this.taskCode = this.isFromDateDetail ? taskCode.R2E09_05_01_12A : '';
      this.extendTimeR2E9050112AColumn = this.isFromDateDetail
        ? this.extendTimeR2E9050112AColumn.concat(['action'])
        : this.extendTimeR2E9050112AColumn;
    }
    this.mode = this.isViewMode ? 'VIEW' : 'EDIT';
    if (this.isViewMode || this.taskCode === taskCode.R2E09_05_01_12A) {
      let dataDoc = this.form.get('externalPaymentTrackingDocuments')?.value;
      this.originalDocument = [...dataDoc];
      this.initDocumentUpload(dataDoc);
      this.onRadioChang();
      if (this.extendTimeList && this.extendTimeList.length > 0) {
        this._extendTimeListView.data = [];
        const docs = this.extendTimeList.map(it => {
          return {
            extendExpiredTimestamp: it?.extendExpiredTimestamp,
            extendRecordTimestamp: it?.extendRecordTimestamp,
            uploadSessionId: it?.extendDocument?.imageId,
          };
        });
        this._extendTimeListView.data = docs;
        this.form.get('extendInfos')?.setValue([]);
        this.form.get('extendInfos')?.setValue([...docs]);
      }
    }
  }

  private initDocumentUpload(dataDoc: any) {
    this.documentUpload =
      dataDoc && dataDoc.length > 0
        ? dataDoc.map((m: any) => {
            return {
              ...m,
              imageId: m.imageId,
              documentTemplate: m.documentTemplate,
              documentTemplateId: m.documentTemplate?.documentTemplateId,
              uploadDate: m.uploadTimestamp,
              uploadRequired: m.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF142,
              indexOnly: true,
              active: true,
              removeDocument: true,
            } as IUploadMultiFile;
          })
        : [];
    this.uploadMultiInfo = {
      cif: this.taskService.taskDetail?.customerId
        ? this.taskService.taskDetail.customerId
        : this.litigationCaseService.litigationCaseShortDetail?.cifNo || '',
      litigationId: this.taskService.taskDetail.litigationId,
    };
  }

  onDDLChange() {
    if (this.form.controls['paymentTrackingResult'].value) {
      this.onRadioChang();
    }
  }

  getControl(name: string): UntypedFormControl {
    return this.form?.get(name) as UntypedFormControl;
  }

  get paymentTrackingLabel() {
    const paymentTrackingVal = this.form.get('paymentTrackingResult')?.value || '';
    return this.dropDownOption.find(row => row.value === paymentTrackingVal)?.text || '-';
  }

  onRadioChang() {
    this.form.get('paymentTrackingResult')?.valueChanges.subscribe(val => {
      if (val === this.TRACKING_RESULT.NOT_PAYMENT) {
        this.form.get('notPayReason')?.addValidators([Validators.required]);
        this.form.get('externalPaymentTrackingDocuments')?.clearValidators();
        this.form.get('paymentCompleteTimestamp')?.clearValidators();
      } else if (val === this.TRACKING_RESULT.PAYMENT_COMPLETE) {
        this.form.get('notPayReason')?.removeValidators([Validators.required]);
        this.form
          .get('externalPaymentTrackingDocuments')
          ?.addValidators([this.auctionDetailItemPaymentResultService.uploadedDocumentValidator()]);
        this.form.get('notPayReason')?.reset();
      } else if (val === this.TRACKING_RESULT.PAYMENT_EXTEND && this.trackingRound === 3) {
        this.form.get('paymentTrackingResult')?.setErrors({ maxExtend: true });
      } else {
        this.form.get('notPayReason')?.removeValidators([Validators.required]);
        this.form.get('notPayReason')?.reset();
        this.form.get('externalPaymentTrackingDocuments')?.clearValidators();
      }
      this.form.get('notPayReason')?.updateValueAndValidity();
      this.form.get('externalPaymentTrackingDocuments')?.updateValueAndValidity();
      this.form.get('paymentCompleteTimestamp')?.updateValueAndValidity();
      this.form.get('externalPaymentTrackingDocuments')?.reset(this.documentUpload);

      if (val !== this.TRACKING_RESULT.PAYMENT_COMPLETE) {
        this.initDocumentUpload(this.originalDocument);
        this.form?.get('paymentCompleteTimestamp')?.reset();
      }
      if (val !== this.TRACKING_RESULT.PAYMENT_EXTEND) {
        this.extendTimeList = [];
        this.form.get('extendInfos')?.reset();
      }
    });
  }

  uploadFileEvent(event: any) {
    if (!event) return;
    this.documentUpload = event;
    this.form.get('externalPaymentTrackingDocuments')?.setValue(event);
  }

  async uploadDocument(_file: File, documentTemplateId: string) {
    try {
      const response = await this.documentService.uploadDocument(
        this.uploadMultiInfo.cif || '',
        documentTemplateId,
        _file,
        this.uploadMultiInfo.litigationId || ''
      );
      return response ? response.uploadSessionId : null;
    } catch (error: any) {
      return null;
    }
  }

  async saveExtendTime(data: any = null) {
    const context = {
      file: data?.file,
      extendExpiredTimestamp: data?.extendExpiredTimestamp || this.form.get('extendExpiredTimestamp')?.value,
    };
    let optionsDialog: DialogOptions = {
      title: 'AUCTION_DETAIL.AUCTION_PAYMENT.SAVE_DEADLINE_FOR_REQ_EXTENSION',
      component: AuctionExpendTimeDialogComponent,
      iconName: 'icon-save-primary',
      iconClass: 'icon-xmedium',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'AUCTION_DETAIL.AUCTION_PAYMENT.BUTTON_PAYMENT_EXTEND',
      buttonIconName: 'icon-Selected',
      rightButtonClass: 'primary',
      autoFocus: false,
      cancelEvent: true,
      type: 'xlarge',
      autoWidth: true,
      context: context,
    };
    const res = await this.notificationService.showCustomDialog(optionsDialog);
    if (res.isSuccess) {
      if (this.trackingRound > 1) {
        if (this._extendTimeListView.data.length === this.trackingRound) {
          this._extendTimeListView.data.pop();
        }
      } else {
        this._extendTimeListView.data = [];
      }

      this._extendTimeListView.data.push({
        extendExpiredTimestamp: res.extendExpiredTimestamp,
        extendRecordTimestamp: new Date(),
        file: res.file,
        ...res.uploaded,
      });
      this._extendTimeListView = new MatTableDataSource<any>(this._extendTimeListView.data);
      this.form.get('extendInfos')?.setValue([]);
      this.form.get('extendInfos')?.setValue([...this._extendTimeListView.data]);
      this.cdr.detectChanges();
    }
  }

  async onViewDocument(ele: any) {
    console.log('onViewDocument :: ', ele);
    const fileName = ele.imageName;
    let res: any = await this.documentService.getDocument(ele?.uploadSessionId, DocumentDto.ImageSourceEnum.Lexs);
    this.documentService.openPdf(res, `${fileName}.${res?.type.split('/')[1]}`);
  }

  get documentTouched() {
    return (
      this.form.get('externalPaymentTrackingDocuments') && this.form.get('externalPaymentTrackingDocuments')?.touched
    );
  }

  get documentErrors() {
    return this.form.get('externalPaymentTrackingDocuments')
      ? this.form.get('externalPaymentTrackingDocuments')?.hasError('uploadedDocumentCompletedError') || null
      : null;
  }
}
