import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TaskService } from '@app/modules/task/services/task.service';
import { AuctionStatus, DOC_TEMPLATE } from '@app/shared/constant';
import { IUploadMultiFile, IUploadMultiInfo } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { AuctionExpenseInfo } from '@lexs/lexs-client';
import { AuctionService } from '../../auction.service';
import { AuctionPaymentService } from '../service/auction-payment.service';

@Component({
  selector: 'app-auction-increadsed-limit',
  templateUrl: './auction-increadsed-limit.component.html',
  styleUrls: ['./auction-increadsed-limit.component.scss'],
})
export class AuctionIncreadsedLimitComponent implements OnInit {
  paymentDetailFormGroup!: UntypedFormGroup;
  documentUpload: IUploadMultiFile[] = [];
  documentDetailUpload: IUploadMultiFile[] = [];
  documentColumns: string[] = ['documentName', 'uploadDate'];
  documentDetailColumns: string[] = ['documentName', 'uploadDate'];
  uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };
  uploadMultiDetailInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };
  auctionExpenseId: number = 0;

  currentDate: Date | null = new Date();
  minDate: Date | null = new Date();

  isTouched: boolean = false;

  mode: string = '';
  dataViewMode: AuctionExpenseInfo | any | undefined;
  isViewMode: boolean = false;
  isEditMode: boolean = false;

  warningMessage =
    '<ul class="mt-0 mb-0">' +
    '<li> กรณีเข้ามาครั้งแรก โปรด กดปุ่ม “ยืนยันบันทึก” ก่อนทำการอัปโหลดเอกสาร e-Filing </li>' +
    '<li> หากแนบเอกสารใบแจ้งหนี้ และชำระเงินที่ e-Filing แล้วจะไม่สามารถแก้ไข "รายละเอียดค่าใช้จ่ายเพิ่มเติม" และ ลบหรือแก้ไข "ใบแจ้งหนี้" ได้ </li>' +
    '</ul>';

  inputText = '';
  inputCounter = 0;
  uploadSessionId: string | null = null;
  auctionExpenseType: string = '';
  viewType: string = '';

  get canEditValue() {
    return (
      (this.mode === 'ADD' && !this.getControl('isFeePaid')?.value) ||
      (this.mode === 'EDIT' &&
        this.viewType !== 'R2E09-02-3B_PAYMENT_COMPLETE_PENDING_SAVE' &&
        !this.getControl('isFeePaid')?.value)
    );
  }

  constructor(
    private auctionService: AuctionService,
    private auctionPaymentService: AuctionPaymentService,
    private taskService: TaskService,
    private litigationCaseService: LitigationCaseService
  ) {}

  ngOnInit(): void {
    this.initialFormGroup();
    this.documentUpload = [
      {
        documentTemplate: {
          documentName: 'หมายเรียกวางเงินเพิ่ม',
        },
        uploadRequired: true,
        documentTemplateId: DOC_TEMPLATE.LEXSF133,
        viewOnly: true,
        removeDocument: true,
      } as IUploadMultiFile,
    ];
    this.documentDetailUpload = [
      {
        documentTemplate: {
          documentName: 'ใบแจ้งหนี้ค่าใช้จ่ายประกาศขายทอดตลาด',
          documentTemplateId: DOC_TEMPLATE.LEXSF135,
        },
        viewOnly: true,
        uploadRequired: true,
        indexOnly: true,
      } as IUploadMultiFile,
      {
        documentTemplate: {
          documentName: 'ใบเสร็จค่าใช้จ่ายประกาศขายทอดตลาด',
          documentTemplateId: DOC_TEMPLATE.LEXSF136,
        },
        viewOnly: true,
        uploadRequired: true,
        indexOnly: true,
      } as IUploadMultiFile,
    ];

    this.uploadMultiInfo.cif =
      this.taskService.taskDetail.customerId || this.litigationCaseService?.litigationCaseShortDetail?.cifNo || '';
    this.uploadMultiInfo.litigationId = this.auctionService.litigationId?.toString();

    this.paymentDetailFormGroup.get('citationCaseCreatedDate')?.valueChanges.subscribe(() => this.checkDates());

    this.paymentDetailFormGroup.get('citationCaseAssignedDate')?.valueChanges.subscribe(() => this.checkDates());
    this.onInitialViewMode();
    this.auctionPaymentService.isPaymentOrderFormTouched = false;
  }

  get isRequireUploadDocument() {
    return (
      !this.paymentDetailFormGroup.get('auctionExpenseDoc')?.get('uploadSessionId')?.value &&
      this.paymentDetailFormGroup.get('auctionExpenseDoc')?.get('uploadSessionId')?.touched
    );
  }

  onUploadFileContent(event: any): void {
    this.documentUpload = event as IUploadMultiFile[];
    this.documentUpload.map(imageId => {
      if (imageId.imageId) {
        return this.paymentDetailFormGroup.get('auctionExpenseDoc')?.get('uploadSessionId')?.setValue(imageId.imageId);
      } else {
        return this.paymentDetailFormGroup.get('auctionExpenseDoc')?.get('uploadSessionId')?.setValue(null);
      }
    });
  }

  async onUploadFileDetailContent(event: any): Promise<void> {
    console.log('[AuctionIncreadsedLimitComponent][onUploadFileDetailContent]', event);
    const uploadInvoiceData = this.auctionPaymentService.auctionInvoiceDto as any;
    const uploadReceiptData = this.auctionPaymentService.auctionReceiptDto as any;
    this.documentDetailUpload.map((item, _index) => {
      if (
        uploadInvoiceData?.imageId &&
        item.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF135 &&
        event.indexType === 0
      ) {
        item.imageId = uploadInvoiceData.imageId;
        item.uploadDate = uploadInvoiceData.uploadTimestamp;
        item.isUpload = !!event;
        item.active = !event?.isCancel && !!event;
      } else if (
        uploadReceiptData?.imageId &&
        item.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF136 &&
        event.indexType === 1
      ) {
        item.imageId = uploadReceiptData.imageId;
        item.uploadDate = uploadReceiptData.receiptDueDate;
        item.isUpload = event;
        item.active = !event?.isCancel && event;
      }
    });
    this.dataViewMode = await this.auctionService.getAuctionExpenseInfo(this.auctionExpenseId);
  }

  checkDates(): void {
    const createDate = this.paymentDetailFormGroup.get('citationCaseCreatedDate')?.value;
    const assignedDate = this.paymentDetailFormGroup.get('citationCaseAssignedDate')?.value;

    if (createDate && assignedDate && assignedDate < createDate) {
      this.paymentDetailFormGroup.get('citationCaseAssignedDate')?.setErrors({ incorrect: true });
    }
  }

  initialFormGroup(): void {
    this.paymentDetailFormGroup = this.auctionPaymentService.paymentOrderFormGroup;

    this.auctionPaymentService.isPaymentOrderFormTouched = false;

    this.paymentDetailFormGroup.valueChanges.subscribe(() => {
      this.auctionPaymentService.isPaymentOrderFormTouched = true;
    });

    this.auctionPaymentService?.formGroupUpdated?.subscribe((updatedFormGroup: UntypedFormGroup | null) => {
      if (updatedFormGroup) {
        this.auctionPaymentService.paymentOrderFormGroup = updatedFormGroup;
        this.paymentDetailFormGroup = this.auctionPaymentService.paymentOrderFormGroup;
        const auctionExpenseId = this.paymentDetailFormGroup.get('auctionExpenseId')?.value;
        this.auctionExpenseId = auctionExpenseId;
      }
    });
  }

  getControl(name: string) {
    return this.paymentDetailFormGroup.get(name);
  }

  validDatePaymentForm(): void {
    this.paymentDetailFormGroup.get('citationCaseAssignedDate')?.markAsTouched();
    this.paymentDetailFormGroup.get('citationCaseCreatedDate')?.markAsTouched();
    this.paymentDetailFormGroup.get('citationCaseNo')?.markAsTouched();
    this.paymentDetailFormGroup.get('auctionExpenseDoc')?.get('uploadSessionId')?.markAsTouched();
  }

  onInitialViewMode(): void {
    // STATUS = COMPLETE: Full ViewMode (เสร็จสิ้น)
    // STATUS = "R2E09-02-3B_PENDING_SAVE" : Edit Mode (รอบันทึก)
    // STATUS = "R2E09-02-3B_PENDING_PAYMENT" : Edit Mode (รอชำระเงิน)
    // STATUS = "R2E09-02-3B_PAYMENT_COMPLETE_PENDING_SAVE" : ViewMode Except Upload Invoice + Receipt (ชำระเงินสำเร็จรอบันทึกผล)
    this.dataViewMode = this.auctionService.auctionExpenseInfo;
    this.auctionExpenseId = this.dataViewMode?.id;
    this.viewType = this.dataViewMode?.status;
    this.paymentDetailFormGroup.get('auctionExpenseId')?.setValue(this.dataViewMode?.id);
    this.paymentDetailFormGroup.get('auctionExpenseDoc')?.get('uploadSessionId')?.clearValidators();
    this.mode = this.auctionService.mode;
    if (this.mode === 'VIEW') {
      this.isViewMode = true;
      this.auctionExpenseType = this.auctionService.auctionPaymentType || '-';
      this.onSetDocumentViewMode();
    } else if (this.mode === 'EDIT' && this.viewType === AuctionStatus.R2E09_02_3B_PENDING_PAYMENT) {
      this.paymentDetailFormGroup.get('citationCaseNo')?.setValue(this.dataViewMode.citationCaseNo);
      this.paymentDetailFormGroup
        .get('citationCaseCreatedDate')
        ?.setValue(this.dataViewMode.citationCaseCreatedTimestamp);
      this.paymentDetailFormGroup
        .get('citationCaseAssignedDate')
        ?.setValue(this.dataViewMode.citationCaseAssignedTimestamp);
      this.paymentDetailFormGroup.get('reason')?.setValue(this.dataViewMode.reason);
      this.documentUpload = this.documentUpload.map((document, _index) => {
        if (document.documentTemplateId === DOC_TEMPLATE.LEXSF133) {
          const apiDocument = this.dataViewMode?.documents?.find(
            (item: any) => item.documentTemplate.documentTemplateId === DOC_TEMPLATE.LEXSF133
          );
          if (apiDocument) {
            return {
              ...apiDocument,
              documentTemplateId: DOC_TEMPLATE.LEXSF133,
              uploadDate: apiDocument.uploadTimestamp,
              removeDocument: true,
              indexOnly: true,
              uploadRequired: true,
              active: true,
              viewOnly: true,
            };
          }
        }
        return document;
      });
      this.documentDetailUpload.forEach((document, index) => {
        const apiDocument = this.dataViewMode?.documents?.find(
          (item: any) => item.documentTemplate.documentTemplateId === document.documentTemplate?.documentTemplateId
        );
        if (apiDocument) {
          this.documentDetailUpload[index] = {
            ...apiDocument,
            uploadDate: apiDocument.uploadTimestamp,
            indexOnly: true,
            uploadRequired: true,
            active: false,
            viewOnly: true,
          };
        }
      });
    } else if (this.mode === 'EDIT' && this.viewType === AuctionStatus.R2E09_02_3B_PAYMENT_COMPLETE_PENDING_SAVE) {
      this.isViewMode = true;
      this.documentUpload = this.documentUpload.map((document, _index) => {
        if (document.documentTemplateId === DOC_TEMPLATE.LEXSF133) {
          const apiDocument = this.dataViewMode?.documents?.find(
            (item: any) => item.documentTemplate.documentTemplateId === DOC_TEMPLATE.LEXSF133
          );
          if (apiDocument) {
            return {
              ...apiDocument,
              documentTemplateId: DOC_TEMPLATE.LEXSF133,
              uploadDate: apiDocument.uploadTimestamp,
              removeDocument: true,
              indexOnly: true,
              uploadRequired: true,
              active: false,
              viewOnly: true,
            };
          }
        }
        return document;
      });
      this.documentDetailUpload.forEach((document, index) => {
        const apiDocument = this.dataViewMode?.documents?.find(
          (item: any) => item.documentTemplate.documentTemplateId === document.documentTemplate?.documentTemplateId
        );
        if (apiDocument) {
          this.documentDetailUpload[index] = {
            ...apiDocument,
            uploadDate: apiDocument.uploadTimestamp,
            indexOnly: true,
            uploadRequired: true,
            active: true,
            viewOnly: true,
          };
        }
      });
    } else {
      this.documentUpload = this.documentUpload.map((document, _index) => {
        if (document.documentTemplateId === DOC_TEMPLATE.LEXSF133) {
          const apiDocument = this.dataViewMode?.documents?.find(
            (item: any) => item.documentTemplate.documentTemplateId === DOC_TEMPLATE.LEXSF133
          );
          if (apiDocument) {
            return {
              ...apiDocument,
              documentTemplateId: DOC_TEMPLATE.LEXSF133,
              uploadDate: apiDocument.uploadTimestamp,
              removeDocument: true,
              indexOnly: true,
              uploadRequired: true,
              active: false,
              viewOnly: true,
            };
          }
        }
        return document;
      });
      this.documentDetailUpload.forEach((document, index) => {
        const apiDocument = this.dataViewMode?.documents?.find(
          (item: any) => item.documentTemplate.documentTemplateId === document.documentTemplate?.documentTemplateId
        );
        if (apiDocument) {
          this.documentDetailUpload[index] = {
            ...apiDocument,
            uploadDate: apiDocument.uploadTimestamp,
            indexOnly: true,
            uploadRequired: true,
            active: false,
            viewOnly: true,
          };
        }
      });
    }
  }

  onSetDocumentViewMode(): void {
    this.documentUpload = this.documentUpload.map((document, _index) => {
      if (document.documentTemplateId === DOC_TEMPLATE.LEXSF133) {
        const apiDocument = this.dataViewMode.documents.find(
          (item: any) => item.documentTemplate.documentTemplateId === DOC_TEMPLATE.LEXSF133
        );
        if (apiDocument) {
          return {
            ...apiDocument,
            documentTemplateId: DOC_TEMPLATE.LEXSF133,
            uploadDate: apiDocument.uploadTimestamp,
            indexOnly: true,
            uploadRequired: true,
            active: true,
            viewOnly: true,
          };
        }
      }
      return document;
    });

    this.documentDetailUpload.forEach((document, index) => {
      const apiDocument = this.dataViewMode.documents.find(
        (item: any) => item.documentTemplate.documentTemplateId === document.documentTemplate?.documentTemplateId
      );
      if (apiDocument) {
        this.documentDetailUpload[index] = {
          ...apiDocument,
          uploadDate: apiDocument.uploadTimestamp,
          indexOnly: true,
          uploadRequired: true,
          active: true,
          viewOnly: true,
        };
      }
    });
  }
}
