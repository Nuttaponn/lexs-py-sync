import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AuctionInvoiceDto,
  AuctionReceiptDto,
  ConfirmationFormDto,
  DocumentDto,
  PaymentFormDto,
  SeizureInvoiceDto,
  SeizureReceiptDto,
} from '@lexs/lexs-client';
import {
  IERRORS_UPLOAD,
  IUploadInfo,
  UploadFileContentConfirmationFormDto,
  UploadFileContentPaymentFormDto,
  acceptFile_PDF_JPG,
  maxFileSize,
  taskCode,
} from '../../models';

import { HttpErrorResponse } from '@angular/common/http';
import { AuctionPaymentService } from '@app/modules/auction/auction-advance-payment/service/auction-payment.service';
import { SuitService } from '@app/modules/lawsuit/lawsuit-detail/suit/suit.service';
import { SeizureUploadDialogService } from '@app/modules/seizure-property/dialogs/seizure-upload-dialog/seizure-upload-dialog.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { Utils } from '@app/shared/utils/util';
import { TranslateService } from '@ngx-translate/core';
import { DocumentService } from '../document-preparation/document.service';

@Component({
  selector: 'app-upload-file-content',
  templateUrl: './upload-file-content.component.html',
  styleUrls: ['./upload-file-content.component.scss'],
})
export class UploadFileContentComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;

  @Input() seizureLedId: number = 0;
  @Input() readState: 'payment' | 'confirm' | null = 'payment';
  @Input() title: string = '';
  @Input() upload_title: string = '';
  @Input() taskCode!: taskCode | string;
  @Input() uploadInfo: IUploadInfo = { cif: '', documentTemplateId: '' };
  @Input() isRequired: boolean = false;
  @Input() isSubmited: boolean = false;
  @Input() isDisabledBtnUpload: boolean = false;
  @Input() btnUpload: Array<string> = ['COMMON.BUTTON_UPLOAD', 'COMMON.BUTTON_UPLOAD'];
  @Input() maxFileSize: number = maxFileSize; // MB Size
  @Input() labelAcceptFile: string = '';
  @Input() acceptFile: Array<string> = acceptFile_PDF_JPG;
  @Input() isReadDocument: boolean = false;
  @Input() auctionCaseTypeCode: string = '';

  @Output() uploadSession = new EventEmitter<string | null>();
  @Output() readDocumentEvent = new EventEmitter<PaymentFormDto | UploadFileContentConfirmationFormDto | null>();
  @Output() uploadError = new EventEmitter<HttpErrorResponse | IERRORS_UPLOAD | unknown | null>();

  public exceedFileSize: boolean = false;
  public fileName!: string;
  @Input() isUpload: boolean = false;
  public uploadSessionId!: string | null;

  @Input() paymentForm!: UploadFileContentPaymentFormDto;
  @Input() confirmationForm!: UploadFileContentConfirmationFormDto;
  @Input() seizureUploadForm!: SeizureInvoiceDto;
  @Input() seizureUploadReceiptForm!: SeizureReceiptDto;
  @Input() auctionUploadInvoiceForm!: AuctionInvoiceDto;
  @Input() auctionUploadReceiptForm!: AuctionReceiptDto;
  @Input() invalidAmount: boolean = false;

  @Input() isShowUploadBtn: boolean = true;
  @Input() isBlackTotalAmount = true;
  @Input() imageId: string = '';

  constructor(
    private documentService: DocumentService,
    private suitService: SuitService,
    private notificationService: NotificationService,
    private seizureUploadDialogService: SeizureUploadDialogService,
    private auctionPaymentService: AuctionPaymentService,
    private translate: TranslateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['title']) return;
    if (changes['paymentForm'] || changes['confirmationForm']) {
      this.fileName =
        changes?.['paymentForm']?.currentValue?.fileName ||
        changes?.['confirmationForm']?.currentValue?.confirmImageName ||
        '';
    }
    if (changes['seizureUploadForm']) {
      this.fileName = changes?.['seizureUploadForm']?.currentValue?.imageName;
    }
  }

  ngOnInit(): void {
    this.uploadSession.subscribe((value: string | null) => {
      if (value !== null) {
        this.uploadSessionId = value;
      } else {
        this.uploadSessionId = null;
      }
    });
    if (['INDICTMENT_RECORD'].includes(this.taskCode)) {
      this.fileName = this.paymentForm.fileName || '';
    } else if (['UPLOAD_COURT_FEES_RECEIPT', 'CONFIRM_COURT_FEES_PAYMENT'].includes(this.taskCode)) {
      this.fileName = this.confirmationForm?.confirmImageName || '';
    } else if (['R2E05-03-4', 'R2E09-02-3B'].includes(this.taskCode)) {
      if (!!this.seizureUploadForm) {
        this.fileName = this.seizureUploadForm.imageName || '';
      } else if (!!this.seizureUploadReceiptForm) {
        this.fileName = this.seizureUploadReceiptForm.imageName || '';
      } else if (!!this.auctionUploadInvoiceForm) {
        this.fileName = this.auctionUploadInvoiceForm.imageName || '';
      } else if (!!this.auctionUploadReceiptForm) {
        this.fileName = this.auctionUploadReceiptForm.imageName || '';
      } else {
        this.fileName = '';
      }
    } else {
      this.fileName = '';
    }
  }

  dataContext(data: any): void {
    // for pass data into this component
  }

  ngOnDestroy(): void {
    this.uploadSession.unsubscribe();
  }

  resetInputChange() {
    this.exceedFileSize = true;
    this.fileName = '';
    this.isUpload = false;
    if (!this.isReadDocument) {
      this.uploadSession.emit(null);
    } else {
      this.readDocumentEvent.emit(null);
    }
  }

  async onInputChange(event: Event) {
    const element = event.target as HTMLInputElement;
    const fileList = element?.files || null;
    if (fileList) {
      const file = this.documentService.validateFileType(fileList[0]);
      if (Utils.validateFileSize(file.size, this.maxFileSize)) {
        if (!this.acceptFile.includes(file.type)) {
          this.resetInputChange();
          this.notificationService.openSnackbarError(this.translate.instant('UPLOAD_FILE.ERROR_FILE_TYPE_INVALID'));
        } else {
          this.exceedFileSize = false;
          this.fileName = file.name;
          if (!this.isReadDocument) {
            const _uploadSessionId = await this.uploadDocument(file);
            this.isUpload = _uploadSessionId ? true : false;
            this.uploadSession.emit(_uploadSessionId);
          } else {
            const resposnse = await this.readDocument(file);
            if (resposnse) {
              this.isUpload = true;
              this.exceedFileSize = false;
              this.readDocumentEvent.emit({
                ...resposnse,
                fileName: this.fileName,
              });
            } else {
              this.exceedFileSize = true;
              this.fileName = '';
              this.isUpload = false;
              this.readDocumentEvent.emit(null);
            }
          }
        }
      } else {
        this.resetInputChange();
        this.notificationService.openSnackbarError(
          this.translate.instant('UPLOAD_FILE.ERROR_FILE_SIZE_EXCEED', {
            SIZE_EXCEED: this.maxFileSize.toString(),
          })
        );
      }
    }
    element.value = '';
  }

  onUploadDocument() {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.click();
  }

  async uploadDocument(_file: File) {
    try {
      const response = await this.documentService.uploadDocument(
        this.uploadInfo.cif,
        this.uploadInfo.documentTemplateId,
        _file,
        this.uploadInfo?.litigationId
      );
      return response ? response.uploadSessionId : null;
    } catch (error) {
      return null;
    }
  }

  async readDocument(_file: File): Promise<PaymentFormDto | ConfirmationFormDto | null> {
    try {
      const taskIdNum = Number(this.uploadInfo.taskId);
      if (Number.isNaN(taskIdNum)) {
        return null;
      }
      if (this.isReadDocument && this.taskCode === 'INDICTMENT_RECORD') {
        this.paymentForm = await this.suitService.readPaymentForm(taskIdNum, _file);
        return this.paymentForm;
      } else if (this.taskCode === 'CONFIRM_COURT_FEES_PAYMENT') {
        this.confirmationForm = await this.suitService.readConfirmationForm(taskIdNum, _file);
        this.isBlackTotalAmount = this.confirmationForm?.notification?.code !== 'F001';
        return this.confirmationForm;
      } else if (this.taskCode === taskCode.R2E05_03_4) {
        if (this.readState === 'payment') {
          this.seizureUploadForm = await this.seizureUploadDialogService.uploadSeizureFeeInvoice(
            this.seizureLedId,
            _file
          );
          this.title = 'UPLOAD_FILE.TITLE_PAYMENT_NOTICE';
          return this.seizureUploadForm;
        } else {
          this.seizureUploadReceiptForm = await this.seizureUploadDialogService.uploadSeizureFeeReceipt(
            this.seizureLedId,
            _file
          );
          this.title = 'UPLOAD_FILE.TITLE_PAYMENT_NOTICE';
          this.imageId = this.seizureUploadReceiptForm.imageId || '';
          return this.seizureUploadReceiptForm;
        }
      } else if (this.taskCode === taskCode.R2E09_02_3B) {
        if (this.readState === 'payment') {
          this.auctionUploadInvoiceForm = await this.auctionPaymentService.uploadAuctionExpenseInvoice(
            this.seizureLedId,
            _file
          );
          this.imageId = this.auctionUploadInvoiceForm.imageId || '';
          return this.auctionUploadInvoiceForm;
        } else {
          this.auctionUploadReceiptForm = await this.auctionPaymentService.uploadAuctionExpenseReceipt(
            this.seizureLedId,
            _file
          );
          this.title = 'UPLOAD_FILE.TITLE_PAYMENT_NOTICE';
          this.imageId = this.auctionUploadReceiptForm.imageId || '';
          return this.auctionUploadReceiptForm;
        }
      }
      return null;
    } catch (err: HttpErrorResponse | any) {
      if (err.error.errors[0].code === 'I005') {
        this.notificationService.openSnackbarError(
          this.translate.instant('UPLOAD_FILE.ERROR_FILE_SIZE_EXCEED', {
            SIZE_EXCEED: this.maxFileSize.toString(),
          })
        );
      }
      this.uploadError.emit(err?.error?.errors);
      return null;
    }
  }

  async onViewDocument(imageId: string, fileName: string) {
    const _imageId = imageId || this.seizureUploadForm.imageId || '';
    const response: any = await this.documentService.getDocument(_imageId, DocumentDto.ImageSourceEnum.Lexs);
    if (!response) return;
    this.documentService.openPdf(response, `${fileName}.${response?.type.split('/')[1]}`);
  }
}
