import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { AuctionService } from '@app/modules/auction/auction.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { AuctionStatus, DOC_TEMPLATE } from '@app/shared/constant';
import { IUploadMultiFile, IUploadMultiInfo } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { AuctionExpenseInfo } from '@lexs/lexs-client';
import { AuctionPaymentService } from '../service/auction-payment.service';

@Component({
  selector: 'app-auction-officer-order',
  templateUrl: './auction-officer-order.component.html',
  styleUrls: ['./auction-officer-order.component.scss'],
})
export class AuctionOfficerOrderComponent implements OnInit {
  paymentOrderFormGroup!: UntypedFormGroup;
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

  warningMessage =
    '<ul class="mt-0 mb-0">' +
    '<li> กรณีเข้ามาครั้งแรก โปรด กดปุ่ม “ยืนยันบันทึก” ก่อนทำการอัปโหลดเอกสาร e-Filing </li>' +
    '<li> หากแนบเอกสารใบแจ้งหนี้ และชำระเงินที่ e-Filing แล้วจะไม่สามารถแก้ไข "รายละเอียดค่าใช้จ่ายเพิ่มเติม" และ ลบหรือแก้ไข "ใบแจ้งหนี้" ได้ </li>' +
    '</ul>';

  mode: string = '';
  dataViewMode: AuctionExpenseInfo | any | undefined;
  isViewMode: boolean = false;
  isEditMode: boolean = false;

  uploadSessionId: string | null = null;

  currentDate: Date | null = new Date();
  minDate: Date | null = new Date();

  auctionExpenseType: string = '';
  viewType: string = '';

  get isRequireUploadDocument() {
    return (
      !this.paymentOrderFormGroup.get('auctionExpenseDoc')?.get('uploadSessionId')?.value &&
      this.paymentOrderFormGroup.get('auctionExpenseDoc')?.get('uploadSessionId')?.touched
    );
  }

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
    public auctionPaymentService: AuctionPaymentService,
    private taskService: TaskService,
    private litigationCaseService: LitigationCaseService
  ) {}

  ngOnInit(): void {
    this.initialFormGroup();
    this.currentDate = new Date();
    this.minDate = new Date(0);
    this.documentUpload = [
      {
        documentTemplate: {
          documentName: 'คำสั่งเจ้าพนักงานบังคับคดี',
        },
        documentTemplateId: DOC_TEMPLATE.LEXSF134,
        uploadRequired: true,
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
        uploadRequired: true,
        indexOnly: true,
      } as IUploadMultiFile,
      {
        documentTemplate: {
          documentName: 'ใบเสร็จค่าใช้จ่ายประกาศขายทอดตลาด',
          documentTemplateId: DOC_TEMPLATE.LEXSF136,
        },
        uploadRequired: true,
        indexOnly: true,
      } as IUploadMultiFile,
    ];
    this.uploadMultiInfo.cif =
      this.taskService.taskDetail.customerId || this.litigationCaseService?.litigationCaseShortDetail?.cifNo || '';
    this.uploadMultiInfo.litigationId = this.auctionService.litigationId?.toString();
    this.onInitialViewMode();
    this.auctionPaymentService.isPaymentOrderFormTouched = false;
  }

  onUploadFileContent(event: any): void {
    this.documentUpload = event as IUploadMultiFile[];
    this.documentUpload.map(imageId => {
      if (imageId.imageId) {
        return this.paymentOrderFormGroup.get('auctionExpenseDoc')?.get('uploadSessionId')?.setValue(imageId.imageId);
      } else {
        return this.paymentOrderFormGroup.get('auctionExpenseDoc')?.get('uploadSessionId')?.setValue(null);
      }
    });
  }

  async onUploadFileDetailContent(event: any): Promise<void> {
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

  initialFormGroup(): void {
    this.paymentOrderFormGroup = this.auctionPaymentService.paymentOrderFormGroup;

    this.auctionPaymentService.isPaymentOrderFormTouched = false;

    this.paymentOrderFormGroup.valueChanges.subscribe(() => {
      this.auctionPaymentService.isPaymentOrderFormTouched = true;
    });

    this.auctionPaymentService.formGroupUpdated.subscribe((updateFormGroup: UntypedFormGroup | null) => {
      if (updateFormGroup) {
        this.auctionPaymentService.paymentOrderFormGroup = updateFormGroup;
        this.paymentOrderFormGroup = this.auctionPaymentService.paymentOrderFormGroup;
        const auctionExpenseId = this.paymentOrderFormGroup.get('auctionExpenseId')?.value;
        this.auctionExpenseId = auctionExpenseId;
      }
    });
  }

  getControl(name: string) {
    return this.paymentOrderFormGroup.get(name);
  }

  validDatePaymentForm(): void {
    this.paymentOrderFormGroup.get('commandTimestamp')?.markAsTouched();
    this.paymentOrderFormGroup.get('auctionExpenseDoc')?.get('uploadSessionId')?.markAsTouched();
  }

  onInitialViewMode(): void {
    // STATUS = COMPLETE: Full ViewMode (เสร็จสิ้น)
    // STATUS = "R2E09-02-3B_PENDING_SAVE" : Edit Mode (รอบันทึก)
    // STATUS = "R2E09-02-3B_PENDING_PAYMENT" : Edit Mode (รอชำระเงิน)
    // STATUS = "R2E09-02-3B_PAYMENT_COMPLETE_PENDING_SAVE" : ViewMode Except Upload Invoice + Receipt (ชำระเงินสำเร็จรอบันทึกผล)
    this.dataViewMode = this.auctionService.auctionExpenseInfo;
    this.auctionExpenseId = this.dataViewMode?.id;
    this.viewType = this.dataViewMode?.status;
    this.paymentOrderFormGroup.get('auctionExpenseId')?.setValue(this.dataViewMode?.id);
    this.paymentOrderFormGroup.get('auctionExpenseDoc')?.get('uploadSessionId')?.clearValidators();
    this.mode = this.auctionService.mode;
    if (this.mode === 'VIEW') {
      this.isViewMode = true;
      this.auctionExpenseType = this.auctionService.auctionPaymentType || '-';
      this.onSetDocumentViewMode();
    } else if (this.mode === 'EDIT' && this.viewType === AuctionStatus.R2E09_02_3B_PENDING_PAYMENT) {
      this.paymentOrderFormGroup.get('commandTimestamp')?.setValue(this.dataViewMode.commandTimestamp);
      this.paymentOrderFormGroup.get('reason')?.setValue(this.dataViewMode.reason);
      this.documentUpload = this.documentUpload.map((document, _index) => {
        if (document.documentTemplateId === DOC_TEMPLATE.LEXSF134) {
          const apiDocument = this.dataViewMode.documents.find(
            (item: any) => item.documentTemplate.documentTemplateId === DOC_TEMPLATE.LEXSF134
          );
          if (apiDocument) {
            return {
              ...apiDocument,
              documentTemplateId: DOC_TEMPLATE.LEXSF134,
              uploadDate: apiDocument.uploadTimestamp,
              indexOnly: true,
              uploadRequired: true,
              removeDocument: true,
              active: true,
              viewOnly: false,
            };
          }
        }
        return document;
      });
      this.documentDetailUpload.forEach((document, index) => {
        const apiDocument = this.dataViewMode?.documents.find(
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
        if (document.documentTemplateId === DOC_TEMPLATE.LEXSF134) {
          const apiDocument = this.dataViewMode.documents.find(
            (item: any) => item.documentTemplate.documentTemplateId === DOC_TEMPLATE.LEXSF134
          );
          if (apiDocument) {
            return {
              ...apiDocument,
              documentTemplateId: DOC_TEMPLATE.LEXSF134,
              uploadDate: apiDocument.uploadTimestamp,
              indexOnly: true,
              uploadRequired: true,
              removeDocument: true,
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
        if (document.documentTemplateId === DOC_TEMPLATE.LEXSF134) {
          const apiDocument = this.dataViewMode?.documents.find(
            (item: any) => item.documentTemplate.documentTemplateId === DOC_TEMPLATE.LEXSF134
          );
          if (apiDocument) {
            return {
              ...apiDocument,
              documentTemplateId: DOC_TEMPLATE.LEXSF134,
              uploadDate: apiDocument.uploadTimestamp,
              indexOnly: true,
              uploadRequired: true,
              removeDocument: true,
              active: false,
              viewOnly: true,
            };
          }
        }
        return document;
      });
      this.documentDetailUpload.forEach((document, index) => {
        const apiDocument = this.dataViewMode?.documents.find(
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
      if (document.documentTemplateId === DOC_TEMPLATE.LEXSF134) {
        const apiDocument = this.dataViewMode.documents.find(
          (item: any) => item.documentTemplate.documentTemplateId === DOC_TEMPLATE.LEXSF134
        );
        if (apiDocument) {
          return {
            ...apiDocument,
            documentTemplateId: DOC_TEMPLATE.LEXSF134,
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
