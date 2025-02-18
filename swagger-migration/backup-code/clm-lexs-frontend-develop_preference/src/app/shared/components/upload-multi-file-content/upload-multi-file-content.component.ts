import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { AuctionPaymentEfilingComponent } from '@app/modules/auction/auction-advance-payment/auction-payment-efiling/auction-payment-efiling.component';
import { AuctionReceiptEfilingComponent } from '@app/modules/auction/auction-advance-payment/auction-receipt-efiling/auction-receipt-efiling.component';
import { AuctionPaymentService } from '@app/modules/auction/auction-advance-payment/service/auction-payment.service';
import { AuctionService } from '@app/modules/auction/auction.service';
import { CourtService } from '@app/modules/court/court.service';
import { DefermentService } from '@app/modules/deferment/deferment.service';
import { SuitService } from '@app/modules/lawsuit/lawsuit-detail/suit/suit.service';
import { LegalExecutionWithdrawConfirmationDialogComponent } from '@app/modules/withdrawn-seizure-property/legal-execution-office-info/dialog/legal-execution-withdraw-confirmation-dialog/legal-execution-withdraw-confirmation-dialog.component';
import { WithdrawnSeizurePropertyService } from '@app/modules/withdrawn-seizure-property/withdrawn-seizure-property.service';
import { DOC_TEMPLATE, eFiling3_COJ } from '@app/shared/constant';
import {
  BlobType,
  DatePickerChange,
  FileType,
  FileTypeMapper,
  IERRORS_UPLOAD,
  IUploadMultiFile,
  IUploadMultiInfo,
  TMode,
  acceptFile_EXCEL_SHEET,
  acceptFile_PDF_JPG,
  maxFileSize,
  taskCode,
} from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { Utils } from '@app/shared/utils/util';
import { AuctionBiddingResultsRequest, ConfirmationFormDto, DocumentDto, ReceiptFormDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { EFilingToReceiptDialogComponent } from '../common-dialogs/e-filing-to-receipt-dialog/e-filing-to-receipt-dialog.component';
import { CommitmentAccountSelectComponent } from '../document-preparation/commitment-account-select/commitment-account-select.component';
import { DocSelectionComponent } from '../document-preparation/doc-selection/doc-selection.component';
import { DocumentAccountService } from '../document-preparation/document-account.service';
import { DocumentService } from '../document-preparation/document.service';
import { DisplayCommitment } from '../document-preparation/interface/document';
import { DialogOptions } from '@spig/core';
import { NewAuctionService } from '@app/modules/auction/auction-add/new-auction.service';

@Component({
  selector: 'app-upload-multi-file-content',
  templateUrl: './upload-multi-file-content.component.html',
  styleUrls: ['./upload-multi-file-content.component.scss'],
})
export class UploadMultiFileContentComponent implements OnInit {
  public isUpload: boolean = false;
  public _column: Array<string> = ['no', 'command'];
  public exceedFileSize: boolean = false;

  public confirmationForm!: ConfirmationFormDto;
  public contractList = [DOC_TEMPLATE.LEXSD016];
  public ignoreDownloadDoc = [
    DOC_TEMPLATE.LEXSD016,
    DOC_TEMPLATE.LEXSF114,
    DOC_TEMPLATE.LEXSF115,
    DOC_TEMPLATE.LEXSD006,
    DOC_TEMPLATE.LEXSD005,
    DOC_TEMPLATE.LEXSD016,
    DOC_TEMPLATE.LEXSF133,
    DOC_TEMPLATE.LEXSF134,
    DOC_TEMPLATE.LEXSF135,
    DOC_TEMPLATE.LEXSF136,
    DOC_TEMPLATE.LEXSD059,
  ];
  public docTemplate = DOC_TEMPLATE;

  private ERROR_CODE_FILE_TYPE_F015 = 'F015';
  private ERROR_CODE_FILE_TYPE_D025 = 'D025';
  public isErrorFiletypeOrFileSize = false;

  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;

  @Input() mode: TMode = 'EDIT';
  @Input() uploadMultiInfo!: IUploadMultiInfo;
  @Input() isSubmited: boolean = false;
  @Input() list: IUploadMultiFile[] = [];
  @Input() isAdvance: boolean = false;
  @Input() useUploadBasicFunc: boolean = false;
  @Input()
  set column(val: Array<string>) {
    this._column = [...[this._column[0]], ...val, ...[this._column[1]]];
  }
  @Input() btnUpload: Array<string> = ['COMMON.BUTTON_UPLOAD', 'COMMON.BUTTON_UPLOAD'];
  @Input() maxFileSize: number = maxFileSize; // MB Size
  @Input() acceptFile: Array<string> = acceptFile_PDF_JPG;
  @Input() labelAcceptFile: string = 'COMMON.UPLOAD_FILE_SUPPORT';
  @Input() taskCode!: taskCode;
  @Input() isReadDocument: boolean = false;
  @Input() readonly: boolean = false;
  @Input() isAsset: boolean = false;
  @Input() isPreference: boolean = false;
  // uploadFor - Possible values: 'DEFERMENT', 'COURT_TRIAL', 'DEFERMENT_STATEMENT', 'ANNOUNCEMENT_INTERFACE'
  @Input() uploadFor: string = '';
  @Input() auctionExpenseId!: number;

  @Input() isUploadReadReceiptForm: boolean = false; // LEX2-3276

  @Input() validateCifBeforeUpload: boolean = false; // LEX2-42046
  @Input() errorLabelCifBeforeUpload: string = ''; // LEX2-42046

  @Input() auctionPaymentType!: string; // LEX2-497 Validate PaymentType

  @Output() uploadFileEvent = new EventEmitter<IUploadMultiFile[] | null>();
  @Output() uploadContract = new EventEmitter<IUploadMultiFile[] | null>();
  @Output() uploadCommitment = new EventEmitter<IUploadMultiFile[] | null>();
  @Output() readDocumentEvent = new EventEmitter<ConfirmationFormDto[] | null>();
  @Output() uploadError = new EventEmitter<HttpErrorResponse | IERRORS_UPLOAD | unknown | null>(); // LEX2-3276 handle error code from BE
  @Output() validatePaymentForm = new EventEmitter<void>(); // LEX2-497 Validate PaymentForm ***Unique***
  @Output() onChangInputEvent = new EventEmitter<IUploadMultiFile>();
  @Output() onSuspendAuctionEndDateChangeEvent = new EventEmitter<DatePickerChange>();

  private dialogCtrl = new UntypedFormControl(true, Validators.requiredTrue);

  constructor(
    private documentService: DocumentService,
    private suitService: SuitService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private courtService: CourtService,
    private withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService,
    private defermentService: DefermentService,
    private documentAccountService: DocumentAccountService,
    private auctionPaymentService: AuctionPaymentService,
    private auctionService: AuctionService,
    private newAuctionService: NewAuctionService,
  ) {}

  ngOnInit(): void {
    // put optional documents after mandatory documents
    if (this.list?.length > 0) {
      this.list.sort((a, b) => (a.uploadRequired === b.uploadRequired ? 0 : a.uploadRequired ? -1 : 1));
    }
  }

  get displayedColumns() {
    return this.readonly ? this._column.slice(0, -1) : this._column;
  }

  isOptionalDocument(documentTemplateId: string) {
    return documentTemplateId && [DOC_TEMPLATE.LEXSF112].includes(documentTemplateId);
  }

  onUploadDocument(_index: number, documentTemplateId: string = '') {
    if (this.validateCifBeforeUpload) {
      if (!this.uploadMultiInfo.cif) {
        this.notificationService.alertDialog(
          'ไม่สามารถ upload ได้',
          this.errorLabelCifBeforeUpload
        );
        return
      }
    }
    let fileInput = this.fileUpload.nativeElement;
    if (documentTemplateId === DOC_TEMPLATE.LEXSF009) {
      (fileInput as HTMLInputElement).accept = acceptFile_EXCEL_SHEET.toString();
    } else {
      (fileInput as HTMLInputElement).accept = acceptFile_PDF_JPG.toString();
    }
    const multipleUpload = this.list.filter(f => f.multipleUpload) || [];
    fileInput.onchange = async (event: Event) => {
      const element = event.target as HTMLInputElement;
      const fileList = element?.files || [];
      for (let index = 0; index < fileList.length; index++) {
        const file = this.documentService.validateFileType(fileList[index]);
        if (Utils.validateFileSize(file.size)) {
          this.exceedFileSize = false;
          this.isErrorFiletypeOrFileSize = false;
          if (!this.isReadDocument) {
            const uploadRes = await this.uploadDocument(file, documentTemplateId);
            if (!uploadRes) return;
            if (this.list[_index]?.multipleUpload && !this.list[_index].imageId) {
              let oldList = Utils.deepClone(this.list);
              let newList: any = {
                ...this.list[_index],
                active: false,
              };
              oldList.splice(_index + 1, 0, newList);
              this.list = oldList;
            }
            this.list[_index].imageId = uploadRes;
            this.list[_index].isUpload = this.list[_index].imageId ? true : false;
            this.list[_index].uploadDate = this.list[_index].imageId ? new Date().toDateString() : '';
            this.list[_index].documentDate = this.list[_index].imageId ? new Date().toISOString() : '';
            const hasFileList = this.list.filter(it => !it.multipleUpload || (it.multipleUpload && it.imageId));
            const multipleList = this.list.filter(it => it.multipleUpload && !it.imageId);
            this.list = [...hasFileList, ...multipleList];
            if (documentTemplateId === DOC_TEMPLATE.LEXSF009 && this.list[_index].imageId) {
              this.notificationService.openSnackbarSuccess(this.translate.instant('UPLOAD_FILE.MSG_SUCCESS_UPLOAD'));
            } else {
              this.notificationService.openSnackbarSuccess(this.translate.instant('DOC_PREP.UPLOAD_SUCCESS'));
            }
            this.uploadFileEvent.emit(this.list);
          } else {
            if (this.isUploadReadReceiptForm) {
              try {
                const res: ReceiptFormDto = await this.suitService.readReceiptForm(
                  Number(this.uploadMultiInfo.taskId ?? '-1'),
                  this.list[_index].uploadFlag || 'PAYMENT',
                  file
                );
                const documentDetailList = res.documentDetailList;
                if (documentDetailList && documentDetailList?.length > 0) {
                  this.list[_index].imageId = documentDetailList[0]?.imageId || '';
                  this.list[_index].isUpload = true;
                  this.list[_index].uploadDate = this.list[_index].imageId ? new Date().toDateString() : '';
                  this.list[_index].documentDate = this.list[_index].imageId ? new Date().toISOString() : '';
                  this.uploadFileEvent.emit(this.list);
                } else {
                  this.list[_index].imageId = '';
                  this.list[_index].isUpload = false;
                  this.list[_index].uploadDate = '';
                  this.list[_index].documentDate = '';
                  this.uploadFileEvent.emit(this.list);
                }
              } catch (err: any) {
                this.uploadError.emit(err?.error?.errors);
              }
            } else {
              const resposnse = await this.readDocument(file);
              if (resposnse) {
                this.list[_index].imageId = resposnse.confirmImageId;
                this.list[_index].isUpload = true;
                this.list[_index].uploadDate = this.list[_index].imageId ? new Date().toDateString() : '';
                this.list[_index].documentDate = this.list[_index].imageId ? new Date().toISOString() : '';
                this.uploadFileEvent.emit(this.list);
              } else {
                this.list[_index].imageId = '';
                this.list[_index].isUpload = false;
                this.list[_index].uploadDate = '';
                this.list[_index].documentDate = '';
                this.uploadFileEvent.emit(this.list);
              }
            }
          }
        } else {
          this.exceedFileSize = true;
          this.isErrorFiletypeOrFileSize = true;
          this.list[_index].imageId = '';
          this.list[_index].isUpload = false;
          this.list[_index].uploadDate = '';
          this.list[_index].documentDate = '';
          this.uploadFileEvent.emit(this.list);
          this.notificationService.openSnackbarError(
            this.translate.instant('UPLOAD_FILE.ERROR_FILE_SIZE_EXCEED', {
              SIZE_EXCEED: this.maxFileSize.toString(),
            })
          );
        }
      }
      element.value = '';
    };
    fileInput.click();
  }

  async uploadDocument(_file: File, documentTemplateId: string) {
    try {
      let response: any;
      if (this.mode === 'VIEW' && documentTemplateId === DOC_TEMPLATE.LEXSF112) {
        // spacific api for upload document, in casse view mode
        const _withdrawSeizureId = Number(this.uploadMultiInfo.withdrawSeizureId);
        const _withdrawSeizuresLedId = Number(this.uploadMultiInfo.withdrawSeizuresLedId);
        response = await this.withdrawnSeizurePropertyService.postUploadDocumentSubrogation(
          _withdrawSeizureId,
          _withdrawSeizuresLedId,
          _file
        );
      } else if (this.useUploadBasicFunc) {
        //   LEXSF311 LEXSF061 LEXSF105 LEXSF137
        response = await this.documentService.uploadBasicDocument(
          documentTemplateId,
          _file,
        );
      } else if ([DOC_TEMPLATE.LEXSF137, DOC_TEMPLATE.LEXSF138].includes(documentTemplateId)) {
        const _documentGroup = documentTemplateId === DOC_TEMPLATE.LEXSF137 ? 'AUCREFRESULT' : 'AUCBIDRESULT';
        if (this.uploadMultiInfo.aucRef) {
          const _aucRef = this.uploadMultiInfo.aucRef || 0;
          if (!this.validateAndHandleFile(_file)) {
            return null;
          }

          response = await this.newAuctionService.documentUpload(
            _aucRef, documentTemplateId, _documentGroup, _file);
        } else {
          const _auctionBiddingId = this.uploadMultiInfo.auctionBiddingId || '';
          response = await this.auctionService.postBiddingsDocumentsUpload(
            _auctionBiddingId,
            _file,
            _documentGroup,
            documentTemplateId
          );
        }
      } else if ([DOC_TEMPLATE.LEXSF139, DOC_TEMPLATE.LEXSF140].includes(documentTemplateId)) {
        const _auctionBiddingId = this.uploadMultiInfo.auctionBiddingId || '';
        const _aucBiddingDeedGroupId = this.uploadMultiInfo.aucBiddingDeedGroupId || 0;
        const _documentGroup =
          documentTemplateId === DOC_TEMPLATE.LEXSF139 ? 'AUCDEEDGROUPRESULT' : 'AUCDEEDGROUPRETURN';
        response = await this.auctionService.postBiddingsDeedGroupsDocumentsUpload(
          _aucBiddingDeedGroupId,
          _auctionBiddingId,
          _file,
          _documentGroup,
          documentTemplateId
        );
      } else {
        response = await this.documentService.uploadDocument(
          this.uploadMultiInfo.cif || '',
          documentTemplateId,
          _file,
          this.uploadMultiInfo.litigationId || ''
        );
      }
      if (this.useUploadBasicFunc) {
        return response ? response.uploadSessionId : null;
      } else if([DOC_TEMPLATE.LEXSF137, DOC_TEMPLATE.LEXSF138, DOC_TEMPLATE.LEXSF139, DOC_TEMPLATE.LEXSF140].includes(
        documentTemplateId
      )
      ) {
        response.uploadSessionId = response.imageId;
        return response ? response.uploadSessionId : null;
      } else {
        return response ? response.uploadSessionId : null;
      }
    } catch (error: any) {
      const codes = error?.error?.errors?.map((it: any) => it.code);
      if (
        error?.error?.code === this.ERROR_CODE_FILE_TYPE_F015 ||
        (codes && (codes.includes(this.ERROR_CODE_FILE_TYPE_D025) || codes.includes(this.ERROR_CODE_FILE_TYPE_F015)))
      ) {
        this.isErrorFiletypeOrFileSize = true;
      }
      return null;
    }
  }

  async readDocument(_file: File): Promise<ConfirmationFormDto | null> {
    try {
      const taskIdNum = Number(this.uploadMultiInfo.taskId);
      if (Number.isNaN(taskIdNum)) {
        return null;
      }
      if (this.isReadDocument && this.taskCode === 'CONFIRM_COURT_FEES_PAYMENT') {
        this.confirmationForm = await this.suitService.readConfirmationForm(taskIdNum, _file);
        return this.confirmationForm;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  onRemoveDocument(_index: number, isRemoveSub: boolean = true) {
    if (
      this.uploadFor === 'AUCTION_OWNERSHIP' &&
      this.list[_index]?.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF196
    ) {
      this.list[_index].params = 'remove';
      this.uploadFileEvent.emit(this.list);
      return;
    }

    if (!isRemoveSub) {
      this.list = this.list.filter((m: any, key: number) => {
        if (m?.documentTemplate?.documentTemplateId === this.list[_index]?.documentTemplateId) {
          if (m.isSubContract) {
            return false;
          } else {
            m.imageId = '';
            m.isUpload = false;
            m.uploadDate = '';
            m.documentDate = '';
            m.total = 0;
          }
        }
        return true;
      });
    } else {
      if (this.list[_index].multipleUpload) {
        this.list = this.list.filter((f, idex) => idex !== _index);
      } else {
        this.list[_index].imageId = '';
        this.list[_index].isUpload = false;
        this.list[_index].uploadDate = '';
        this.list[_index].documentDate = '';
      }
    }

    this.uploadFileEvent.emit(this.list);
  }

  async onDownloadDocument(_index: number, _response: any) {
    if (this.list[_index].imageId === undefined || this.list[_index].imageId === '') {
      return;
    }
    if (_response) {
      const { type } = _response;
      Utils.saveAsStrToBlobFile(_response, this.list[_index].documentTemplate?.documentName || 'file' + type, type);
    } else {
      const response: any = await this.documentService.getDocument(
        this.list[_index].imageId || '',
        DocumentDto.ImageSourceEnum.Lexs
      );
      const { type } = response;
      Utils.saveAsStrToBlobFile(response, this.list[_index].documentTemplate?.documentName || 'file' + type, type);
    }
  }

  async onViewDocument(_index: number) {
    if (this.list[_index].imageId === undefined || this.list[_index].imageId === '') {
      return;
    }
    const searchType = this.list[_index].documentTemplate?.searchType || 'LEXS';
    const imageSourceEnum = this.list[_index].imageSource as DocumentDto.ImageSourceEnum;
    let imageSource = searchType === 'RLS' ? DocumentDto.ImageSourceEnum.Imp : DocumentDto.ImageSourceEnum.Lexs;
    if (imageSourceEnum) {
      imageSource = imageSourceEnum;
    }
    const response: any =
      !!this.list[_index].imageId &&
      (await this.documentService.getDocument(this.list[_index].imageId || '', imageSource));
    if (!response) {
      return;
    } else {
      let { type } = response;
      if (![BlobType.OCTET_STREAM, BlobType.PDF, BlobType.JPEG, BlobType.JPG].includes(type)) {
        await this.onDownloadDocument(_index, response);
      } else {
        const fileName = this.list[_index].documentTemplate?.documentName ?? 'doc';
        this.documentService.openPdf(response, `${fileName}.${response?.type.split('/')[1]}`);
      }
    }
  }

  onCheck(element: any) {
    element.active = !element.active;
    element.imageId = '';
    element.isUpload = false;
    element.uploadDate = '';
    element.documentDate = '';
    if (this.contractList.includes(element.documentTemplateId) && !element.active) {
      let contactIndex = this.list.findIndex(
        (f: any) => f.documentTemplateId && this.contractList.includes(f?.documentTemplateId)
      );
      this.list = this.list.filter((f: any, index: number) => {
        let isValid = f?.documentTemplateId && !this.contractList.includes(f?.documentTemplateId);
        if (isValid || (!isValid && index === contactIndex)) {
          f.total = 0;
          return true;
        }
        return false;
      });
    }
    this.list.forEach(it => {
      if (it.multipleUpload && it.documentTemplateId !== element.documentTemplateId && !it.imageId) {
        it.active = false;
      }
    });
    this.onChangInputEvent.emit(element);
    this.uploadFileEvent.emit(this.list);
  }
  onUploadDocContract(element: any) {
    let res = this.dialog.open(DocSelectionComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        ...element,
        type: 'Deferment',
        allowUpload: true,
        allowMultiple: true,
        maxFileSize: this.maxFileSize,
      },
    });

    res.afterClosed().subscribe((i: any) => {
      if (!i) {
        this.uploadContract.emit();
      }
    });
  }

  onUploadCommitmentAcc(element: any) {
    let accounts = this.defermentService.deferment?.commitmentAccounts as DisplayCommitment[];
    accounts.forEach(e => (e.accountTypeDesc = this.documentAccountService.getAccountTypeName(e.accountType) || ''));
    let res = this.dialog.open(CommitmentAccountSelectComponent, {
      width: '840px',
      disableClose: true,
      autoFocus: true,
      data: {
        uploadFor: 'DEFERMENT',
        element,
        accounts: accounts,
        contract: {
          subDocumentPrefix: element?.documentTemplate.documentName,
          documentEditText: 'เลือกวงเงิน',
        },
      },
    });
    res.afterClosed().subscribe(i => {
      if (!i) {
        this.uploadCommitment.emit();
      }
    });
  }

  async onUploadAdvancePayment(index: number): Promise<void> {
    let componentUpload;
    let title;
    let buttonText;
    let paymentForm = this.auctionPaymentService.paymentOrderFormGroup;
    const dataForm = await this.auctionService.getAuctionExpenseInfo(this.auctionExpenseId);
    const dataType = paymentForm.get('auctionExpenseType')?.value;
    const litigationId = paymentForm.get('litigationId')?.value;
    const paymentHeader = 'UPLOAD_FILE.TITLE_ADVANCE_PAYMENT_HEADER';
    const receiptHeader = 'UPLOAD_FILE.TITLE_ADVANCE_RECEIPT_HEADER';
    const paymentButton = 'COMMON.BUTTON_CONFIRM_PAYMENT';
    const receiptButton = 'COMMON.BUTTON_CONFIRM_UPLOAD';
    if (index === 0) {
      if (this.auctionExpenseId && this.auctionExpenseId !== 0) {
        componentUpload = AuctionPaymentEfilingComponent;
        title = paymentHeader;
        buttonText = paymentButton;
        if (dataType === 'SUMMON_FOR_SURCHARGE_E_FILING') {
          paymentForm?.get('auctionExpenseDoc')?.get('uploadSessionId')?.setValidators(Validators.required);
          paymentForm?.get('citationCaseAssignedDate')?.setValidators(Validators.required);
          paymentForm?.get('citationCaseCreatedDate')?.setValidators(Validators.required);
          paymentForm?.get('citationCaseNo')?.setValidators(Validators.required);
          paymentForm?.get('commandTimestamp')?.clearValidators();
        } else if (dataType === 'WRIT_OF_EXECUTE_E_FILING') {
          paymentForm?.get('auctionExpenseDoc')?.get('uploadSessionId')?.setValidators(Validators.required);
          paymentForm?.get('citationCaseAssignedDate')?.clearValidators();
          paymentForm?.get('citationCaseCreatedDate')?.clearValidators();
          paymentForm?.get('citationCaseNo')?.clearValidators();
          paymentForm?.get('commandTimestamp')?.setValidators(Validators.required);
        }
        paymentForm.updateValueAndValidity();
        if (!paymentForm.valid) {
          this.validatePaymentForm.emit();
          return;
        }
      } else {
        this.notificationService.showCustomDialog({
          component: LegalExecutionWithdrawConfirmationDialogComponent,
          title: 'UPLOAD_FILE.ERROR_UPLOAD_AUCTION_INVOICES',
          rightButtonLabel: 'COMMON.BUTTON_ACKNOWLEDGE',
          buttonIconName: 'icon-Selected',
          iconName: 'icon-Dismiss-Fill',
          iconClass: 'large fill-red',
          context: {
            onCheck: 'auctionReceipt',
          },
        });
        return;
      }
    } else if (index === 1) {
      if (this.list[0].imageId && dataForm.isFeePaid) {
        componentUpload = AuctionReceiptEfilingComponent;
        title = receiptHeader;
        buttonText = receiptButton;
      } else {
        this.notificationService.alertDialog(
          'EXCEPTION_CONFIG.TITLE_ERROR_UPLOAD',
          'UPLOAD_FILE.ERROR_UPLOAD_AUCTION_RECEIPT_EFILING'
        );
        return;
      }
    }

    if (!componentUpload) {
      return;
    }

    return await this.notificationService
      .showCustomDialog({
        component: componentUpload,
        title: title,
        iconName: 'icon-Check',
        rightButtonLabel: buttonText,
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        buttonIconName:
          buttonText === 'COMMON.BUTTON_CONFIRM_PAYMENT' ? 'icon-Selected' : 'icon-Checkmark-Circle-Regular',
        cancelEvent: true,
        context: {
          auctionExpenseId: this.auctionExpenseId,
          onCheck: 'auctionReceipt',
          formControl: this.dialogCtrl,
        },
      })
      .then(async response => {
        this.uploadFileEvent.emit({ ...response, indexType: index });
        if (!!response === true && !response.isCancel && index === 0) {
          await this.notificationService
            .showCustomDialog({
              component: EFilingToReceiptDialogComponent,
              title: 'UPLOAD_FILE.SUCCESS_UPLOAD_AUCTION_EFILING',
              iconName: 'icon-Product-Selected',
              iconClass: 'icon-medium fill-krungthai-green',
              rightButtonLabel: 'LAWSUIT.SUIT.BTN_UPLOAD_CONFIRMED_DOC',
              optionBtnLabel: 'COMMON.LINK_TO_E_FILING_SITE',
              optionBtnIcon: 'icon-Expand',
              optionBtnClass: 'option-btn-blue',
              buttonIconName: 'icon-Arrow-Upload',
              backButtonLabel: 'ทำภายหลัง',
              contentCssClasses: ['no-padding'],
              cancelEvent: true,
              autoFocus: false,
            })
            .then(async response => {
              if (!!response?.isBack) {
                this.notificationService.closeAll();
              } else if (!!response?.isOption) {
                window.open(eFiling3_COJ, '_blank');
              } else {
                await this.notificationService
                  .showCustomDialog({
                    component: AuctionReceiptEfilingComponent,
                    title: 'อัปโหลดใบเสร็จค่าใช้จ่ายประกาศขายทอดตลาด',
                    iconName: 'icon-Check',
                    rightButtonLabel: 'COMMON.BUTTON_CONFIRM_UPLOAD',
                    leftButtonLabel: 'COMMON.BUTTON_CANCEL',
                    buttonIconName: 'icon-Checkmark-Circle-Regular',
                    cancelEvent: true,
                    context: {
                      auctionExpenseId: this.auctionExpenseId,
                      formControl: this.dialogCtrl,
                    },
                  })
                  .then(response => {
                    this.uploadFileEvent.emit({ ...response, indexType: 1 });
                  });
              }
            });
        } else if (!!response?.isCancel) {
          if (!!!this.dialogCtrl.value) {
            this.dialogCtrl.setValue(true);
            this.dialogCtrl.updateValueAndValidity();
          }
          this.checkErrorCode();
          return Promise.reject('User has cancelled');
        }
        const apiReload = await this.auctionService.getAuctionExpenseInfo(this.auctionExpenseId);
        this.auctionPaymentService.paymentOrderFormGroup = this.auctionPaymentService.getPaymentDetailFormGroupWithApi(
          apiReload,
          litigationId
        );
        this.auctionPaymentService.formGroupUpdated.next(this.auctionPaymentService.paymentOrderFormGroup);
      });
  }

  checkErrorCode(): void {
    const response = this.auctionPaymentService.retrieveEFilingError();
    if (response['errorCode'] === 'F034') {
      this.auctionService.getAuctionExpenseInfo(this.auctionExpenseId).then(response => {
        this.auctionPaymentService?.paymentOrderFormGroup?.get('status')?.setValue(response.status);
      });
      const documentList = this.list.find(item => item.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF135);
      if (documentList) {
        this.onRemoveDocument(0);
      }
    }
  }

  async onUploadAuctionResult(_index: number, element: any) {
    this.auctionService.auctionSubmitResultPerCollateralForm.markAllAsTouched();
    if (
      this.auctionService.auctionSubmitResultPerCollateralForm.valid &&
      this.auctionService.itemActionCode === 'UPDATE'
    ) {
      const isSubmit = this.auctionService.submitResultStatus;
      const optionsDialog: DialogOptions = {
        rightButtonLabel: 'COMMON.BUTTON_CONFIRM_UPLOAD_DOC',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        rightButtonClass: 'primary',
        iconName: 'icon-Error',
        buttonIconName: 'icon-Selected',
      };
      if (!isSubmit) {
        const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
          'UPLOAD_FILE.TITLE_CONFIRM_UPLOAD_DOCUMENT',
          'UPLOAD_FILE.WARNING_UPLOAD_AUCTION_DOCUMENT',
          optionsDialog
        );
        if (!res) return;
      }
      const auctionBiddingId = this.uploadMultiInfo.auctionBiddingId || '';
      const deedGroupId = this.auctionService.auctionBidingInfoCollateralSelected?.deedGroupId || 0;
      const rawFormData = this.auctionService.auctionSubmitResultPerCollateralForm.getRawValue();
      const _bidDates = this.auctionService.auctionBidingInfoResponse?.bidDates?.map(it => it.bidDate) as string[];
      const payload: AuctionBiddingResultsRequest = {
        aucBiddingResults: [
          {
            aucResult: rawFormData.aucResult,
            buyerName: rawFormData.buyerName,
            buyerType: rawFormData.buyerType,
            cancelBidDates: rawFormData.aucResult === 'CANCEL' ? _bidDates : [],
            cancelReasonType: rawFormData.cancelReasonType,
            deedGroupId: deedGroupId,
            remark: rawFormData.remark,
            soldPrice: rawFormData.soldPrice,
            unsoldObjectBuyer: rawFormData.unsoldObjectBuyer,
            unsoldObjectDissident: rawFormData.unsoldObjectDissident,
            unsoldObjectHighestBidder: rawFormData.unsoldObjectHighestBidder,
            unsoldObjectPrice: rawFormData.unsoldObjectPrice,
            unsoldReasonType: rawFormData.unsoldReasonType,
          },
        ],
      };

      if (!isSubmit) {
        const response = await this.auctionService.postAuctionBiddingResult(auctionBiddingId, payload);
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('UPLOAD_FILE.MSG_SUCCESS_AUCTION_BIDDING_RESULT', {
            INDEX: this.auctionService.auctionBidingInfoCollateralSelected?.fsubbidnum,
          })
        );
        const listRes = response.updateAucBiddingResults || [];
        if (response && listRes.length > 0) {
          const aucBiddingDeedGroupId = listRes[0].aucBiddingDeedGroupId;
          this.uploadMultiInfo.aucBiddingDeedGroupId = aucBiddingDeedGroupId;
        }
        this.auctionService.submitResultStatus = true;
        this.auctionService.auctionSubmitResultPerCollateralForm.markAsUntouched();
        this.auctionService.triggerUpdateActionBar.next(true);
      }
      this.onUploadDocument(_index, element.documentTemplateId);
      this.auctionService.auctionSubmitResultPerCollateralForm.markAsUntouched();
    } else if (this.auctionService.itemActionCode !== 'UPDATE') {
      this.onUploadDocument(_index, element.documentTemplateId);
      this.auctionService.auctionSubmitResultPerCollateralForm.markAsUntouched();
    }
  }

  async onDownloadConclusionDocument(_index: number) {
    const docTemplateId = this.list[_index].documentTemplate?.documentTemplateId;
    if (docTemplateId === DOC_TEMPLATE.LEXSF056 || docTemplateId === DOC_TEMPLATE.LEXSF055) {
      const response = await this.courtService.downloadConclusionDocument(
        this.list[_index].params['litigationCaseId'] || -1
      );
      const _fileType = FileTypeMapper.get(response.contentType || '');
      this.documentService.downloadDocumentFromByteArray(response, 'สรุปประเด็น', _fileType as FileType);
      if (this.list[_index].generateFile && this.list[_index]?.generateFile?.isAllow) {
        this.list[_index].generateFile = {
          isAllow: this.list[_index]?.generateFile?.isAllow,
          isDownload: !this.list[_index].generateFile?.isDownload ? true : this.list[_index].generateFile?.isDownload,
        };
      }
    }
  }

  onSuspendAuctionEndDateChange(value: string, index: number) {
    const transformDate = moment(value).format('YYYY-MM-DD');
    this.onSuspendAuctionEndDateChangeEvent.emit({ dateValue: transformDate, index });
  }

  getOtherCollateralId(collateralIds: string[]): string {
    let newCollIds = (Utils.deepClone(collateralIds) as string[]).slice(1);
    return newCollIds.join('<br>');
  }

  private isAcceptFile(file: File): boolean {
    const fileType = file.type;
    return this.acceptFile.includes(fileType);
  }

  private validateAndHandleFile(file: File, text = 'EXECUTION_WARRANT.CONCLUDE_CALCULATE_DEBT.UPLOAD_FAIL'): boolean {
    if (!this.isAcceptFile(file)) {
      this.notificationService.openSnackbarError(
        this.translate.instant(text)
      );
      return false;
    }
    return true;
  }
}
