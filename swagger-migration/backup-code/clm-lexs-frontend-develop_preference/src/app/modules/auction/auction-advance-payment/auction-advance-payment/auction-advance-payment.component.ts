import { AuctionPaymentService } from '@app/modules/auction/auction-advance-payment/service/auction-payment.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { AuctionService } from '../../auction.service';
import { DEFAULT_DOCUMENT_UPLOAD, DEFAULT_UPLOAD_MULTI_INFO, VIEW_TYPE } from '../interface/auction-efiling.model';
import { IUploadMultiFile, IUploadMultiInfo, TMode } from '@app/shared/models';
import { AuctionExpenseNonEFilingInvoiceDto, DocumentDto } from '@lexs/lexs-client';

@Component({
  selector: 'app-auction-advance-payment',
  templateUrl: './auction-advance-payment.component.html',
  styleUrls: ['./auction-advance-payment.component.scss'],
})
export class AuctionAdvancePaymentComponent implements OnInit {
  selectedPaymentOptionsValue: UntypedFormControl = new UntypedFormControl(null);
  onUploadImageId: UntypedFormControl = this.auctionPaymentService.onTest;
  isPaymentDetailOpened: boolean = true;

  isViewMode: boolean = false;
  mode!: TMode;

  dataUploadNonEFiling: AuctionExpenseNonEFilingInvoiceDto | undefined;
  status = '';

  VIEW_TYPE = VIEW_TYPE;

  documentUpload: IUploadMultiFile[] = [];
  uploadMultiInfo: IUploadMultiInfo = DEFAULT_UPLOAD_MULTI_INFO;
  documentColumns: string[] = ['documentName', 'uploadDate'];

  constructor(
    public auctionService: AuctionService,
    private auctionPaymentService: AuctionPaymentService
  ) {}

  ngOnInit(): void {
    this.setDropdownValue();
    this.onSetDocumentTemplate();
    this.onSetStatus();
    this.onInitialViewMode();
  }

  setDropdownValue(): void {
    this.selectedPaymentOptionsValue.setValue(this.auctionService.auctionPaymentType);
  }

  onSetStatus(): void {
    this.status = this.auctionService.auctionExpenseInfo?.status || '';
  }

  initialDocumentTemplate(): void {
    this.documentUpload = [...DEFAULT_DOCUMENT_UPLOAD];
  }

  onSetDocumentTemplate(): void {
    this.dataUploadNonEFiling = this.auctionPaymentService.auctionExpenseNonEFilingInvoice;
    this.documentUpload = [
      {
        documentTemplate: {
          documentName: this.dataUploadNonEFiling?.receiptDocumentDto?.documentTemplate?.documentName,
        },
        uploadRequired: true,
        documentTemplateId: this.dataUploadNonEFiling?.receiptDocumentDto?.documentTemplate?.documentTemplateId,
      } as IUploadMultiFile,
    ];

    this.uploadMultiInfo.cif = this.dataUploadNonEFiling?.receiptDocumentDto?.customerId || '';
    this.uploadMultiInfo.litigationId = this.dataUploadNonEFiling?.receiptDocumentDto?.litigationCaseId?.toString();
  }

  onCheckContentAndStatus(): boolean {
    const validStatus = [
      'R2E35-02-E09-01-7A_PENDING_RECEIPT_UPLOAD',
      'R2E35-02-E09-02-7B_PENDING_RECEIPT_VERIFICATION',
      'R2E35-02-E09-02-7B_PENDING_RECEIPT_UPDATE',
      'COMPLETE',
    ];
    const validComponents = ['SUMMON_FOR_SURCHARGE_CASHIER_CHEQUE', 'WRIT_OF_EXECUTE_CASHIER_CHEQUE'];

    return validStatus.includes(this.status) && validComponents.includes(this.selectedPaymentOptionsValue.value);
  }

  onUploadFileContent(event: any): void {
    let documentDto: DocumentDto = {
      ...this.dataUploadNonEFiling?.receiptDocumentDto,
    };
    this.documentUpload = event as IUploadMultiFile[];
    this.documentUpload.map(imageId => {
      if (imageId.imageId) {
        documentDto.imageId = imageId.imageId;
        this.onUploadImageId.setValue(imageId.imageId);
        this.auctionPaymentService.onTest.setValue(imageId.imageId);
        this.auctionPaymentService.changeImageId(documentDto);
        this.auctionPaymentService.auctionExpenseNonEFilingInvoice.receiptDocumentDto = documentDto;
      } else {
        this.auctionPaymentService.changeImageId(null);
        this.auctionPaymentService.onTest.setValue(null);
        this.onUploadImageId.setValue(null);
        if (this.auctionPaymentService.auctionExpenseNonEFilingInvoice.receiptDocumentDto?.imageId !== undefined) {
          this.auctionPaymentService.auctionExpenseNonEFilingInvoice.receiptDocumentDto.imageId = undefined;
        }
      }
    });
  }

  onInitialViewMode(): void {
    if (this.auctionService.mode === TMode.VIEW) {
      this.isViewMode = true;
      this.onInitialDocumentReject();
    } else if (this.auctionService.mode === TMode.EDIT) {
      if (this.status === 'R2E35-02-E09-02-7B_PENDING_RECEIPT_VERIFICATION') {
        this.isViewMode = true;
      }
      this.onInitialDocumentReject();
    }
  }

  onInitialDocumentReject(): void {
    const apiResponse: DocumentDto = {
      ...this.dataUploadNonEFiling?.receiptDocumentDto,
    };
    this.documentUpload = this.documentUpload.map((document, _index) => {
      if (document.imageId !== null) {
        document.removeDocument = true;
        this.onUploadImageId.setValue(document.imageId);
        return { ...document, ...apiResponse };
      }
      return document;
    });
  }

  get isEmptyLabelAcceptFile() {
    const ctrlUploadInvalid = this.onUploadImageId.touched && this.onUploadImageId.invalid;
    const statusPedingViewAcc = this.status === VIEW_TYPE.UPLOAD_RECEIPT_PENDING_VIEW_ACCESS;
    const statusInvalid =
      (this.auctionService.mode === TMode.VIEW && this.status === VIEW_TYPE.UPLOAD_RECEIPT_REJECT_VIEW_ACCESS) ||
      this.status === VIEW_TYPE.COMPLETE;
    return ctrlUploadInvalid || statusPedingViewAcc || statusInvalid;
  }
}
