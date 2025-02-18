import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  AmountFormDto,
  UploadFileAmountTableV2Component,
} from '@app/modules/lawsuit/lawsuit-detail/suit/upload-file-amount-table-v2/upload-file-amount-table-v2.component';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { DOC_TEMPLATE } from '@app/shared/constant';
import { ActionBar, IUploadMultiFile, IUploadMultiInfo, statusCode, taskCode } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import {
  LitigationCaseDto,
  LitigationCaseSubCaseDocumentsDto,
  LitigationCaseSubCaseDto,
  LitigationDocumentDto,
  PayCourtFeeDto,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { SuitService } from '../suit.service';

@Component({
  selector: 'app-court-fee-form',
  templateUrl: './court-fee-form.component.html',
  styleUrls: ['./court-fee-form.component.scss'],
})
export class CourtFeeFormComponent implements OnInit {
  public actionBar: ActionBar = {
    hasCancel: true,
    hasSave: false,
    hasReject: false,
    hasPrimary: true,
    saveText: 'COMMON.BUTTON_SAVE',
    primaryIcon: 'icon-save-primary',
  };
  /* ################### INITIAL INPUTS ######################### */
  litigationCaseDto!: LitigationCaseDto;
  litigationCaseSubCaseDto!: LitigationCaseSubCaseDto;
  litigationCaseSubCaseDocuments: LitigationCaseSubCaseDocumentsDto[] = [];
  coupleDeliveryFeeDocuments: LitigationCaseSubCaseDocumentsDto[] = [];

  convertedDocs: IUploadMultiFile[] = [];
  convertedDeliveryFeeDocs!: IUploadMultiFile[];
  outputIUploadMultiFile!: IUploadMultiFile[];
  public docColumn = ['documentName'];
  public docViewColumn = ['documentName', 'uploadDate'];
  labelAcceptFile = this.translate.instant('LAWSUIT.COURT_FEE_FORM.LABEL_ACCEPT_FILE');

  isViewMode: boolean = false;
  // litigationId: string | null = null;

  /* taskCode กับ statusCode ใช้สำหรับใช้เป็นเงื่อนไข แต่ละ Designed UI เท่านั้น */
  public statusCode!: statusCode | null;
  public taskCode!: taskCode | null;

  /* attr for custom upload-table */
  uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };

  /* form attrs */
  // dataForm: FormGroup = this.fb.group({});
  dataForm!: UntypedFormGroup;
  getControl(name: string) {
    return this.dataForm.get(name);
  }

  /* added attr for LEX2-3276 */
  isUploadError: boolean = false;
  uploadBussinessErr!: string | null;
  subMessageUploadBussinessErr: string[] = [];
  isSuccessForm: boolean = false;
  isCivilCase: boolean = false;
  isUploadReadReceiptForm: boolean = false;
  litigationDocumentDtos: LitigationDocumentDto[] = [];
  taskId!: number;
  lgId!: string;
  payCourtFeeDto!: PayCourtFeeDto;
  isCallReadDocument: boolean = false;

  @ViewChild(UploadFileAmountTableV2Component) UploadFileAmountTableV2Component: any;

  constructor(
    public fb: UntypedFormBuilder,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private routerService: RouterService,
    private sessionService: SessionService,
    private suitService: SuitService,
    private taskService: TaskService,
    private lawsuitService: LawsuitService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initPage();
  }

  async initPage() {
    this.litigationCaseDto = this.suitService.litigationCaseDetail;
    this.uploadMultiInfo = {
      cif: this.taskService?.taskDetail?.customerId || this.lawsuitService?.currentLitigation?.customerId || '',
      taskId: this.taskService?.taskDetail?.id?.toString(),
      litigationId: this.litigationCaseDto?.litigationId,
    };

    this.litigationCaseSubCaseDto =
      this.litigationCaseDto?.litigationCaseSubCase?.find(dto => dto.statusSubCase !== 'FINISH') ?? {};

    this.litigationCaseSubCaseDocuments = this.litigationCaseSubCaseDto?.litigationCaseSubCaseDocuments ?? [];
    this.convertedDocs = (this.litigationCaseSubCaseDocuments ?? []).map(dto => this.convertSubCaseDocToDoc(dto));
    // this.litigationId = !this.statusCode ? this.litigationCaseDto?.litigationId ?? null : null;

    this.statusCode = this.suitService.statusCodeFromTask as statusCode | null;
    this.taskCode = this.suitService.taskCodeFromTask;
    this.isViewMode = !this.statusCode || !this.taskCode || this.statusCode === 'PENDING_APPROVAL';

    this.dataForm = this.suitService.generateCourtFeeForm(
      { ...this.litigationCaseDto },
      { ...this.litigationCaseSubCaseDto }
    );

    this.coupleDeliveryFeeDocuments = [
      ...(this.litigationCaseSubCaseDto.coupleDeliveryFeeDocuments ?? []),
    ]; /* documentId is the same in array */

    // if ((this.convertedDeliveryFeeDocs ?? []).length === 0) throw new Error("ConvertedDeliveryFeeDocs can't be zero length");
    this.convertedDeliveryFeeDocs = (this.coupleDeliveryFeeDocuments ?? []).map(dto =>
      this.convertSubCaseDocToDoc(dto)
    );

    // Enhance LEX2-3276
    this.isCivilCase = this.litigationCaseDto?.courtLevel === 'CIVIL';
    this.isCallReadDocument = this.isCivilCase;
    this.labelAcceptFile = this.isCivilCase
      ? this.translate.instant('DOC_PREP.SUPPORT_PDF_ONLY')
      : this.translate.instant('LAWSUIT.COURT_FEE_FORM.LABEL_ACCEPT_FILE');
    this.taskId = this.taskService?.taskDetail?.id ?? -1;
    this.lgId = this.taskService?.taskDetail?.litigationId ?? '-';

    if (this.isCivilCase) {
      this.isUploadReadReceiptForm = this.isCivilCase;
      const financialId = this.litigationCaseDto.financialId ?? -1;
      this.payCourtFeeDto = await this.suitService.getPayCourtFee(financialId);

      this.litigationDocumentDtos = this.payCourtFeeDto.litigationDocumentDto || [];
      if (this.suitService.payCourtFeeReceiptRequest) {
        const docReqList = this.suitService.payCourtFeeReceiptRequest.documentRequestList;
        for (let i in this.litigationDocumentDtos) {
          const matchedDto = (docReqList || []).find(
            dto => dto.documentTemplateId === this.litigationDocumentDtos[i].documentTemplateId
          );
          if (matchedDto) {
            this.litigationDocumentDtos[i].imageId = matchedDto.imageId || '';
          }
        }
      }
      /* this code can be removed, if this.suitService.payCourtFeeReceiptRequest is always reset after exit from this 'Form page' */
      // if (this.suitService.payCourtFeeReceiptRequest) {
      //   const reqDocs = this.suitService.payCourtFeeReceiptRequest.documentRequestList || [];
      //   for (let i in this.litigationDocumentDtos) {
      //     const result = reqDocs.find(dto => dto.documentId === this.litigationDocumentDtos[i].documentId);
      //     if (result) {
      //       this.litigationDocumentDtos[i] = {
      //         ...this.litigationDocumentDtos[i],
      //         ...result
      //       }
      //     }
      //   }
      // }
      this.convertedDocs = this.litigationDocumentDtos.map(dto => this.convertLgDocToDoc(dto));

      this.actionBar.saveText = 'COMMON.CONFIRM_UPLOAD_RECEIPT';
      this.actionBar.primaryIcon = 'icon-Checkmark-Circle-Regular';
    }
  }

  private convertSubCaseDocToDoc(litigationCaseSubCaseDocument: LitigationCaseSubCaseDocumentsDto): IUploadMultiFile {
    return {
      documentTemplateId: litigationCaseSubCaseDocument.documentTemplateId,
      documentTemplate: litigationCaseSubCaseDocument.documentTemplate,
      imageId: litigationCaseSubCaseDocument.imageId,
      uploadDate: litigationCaseSubCaseDocument.documentDate,
      isUpload: false, //this.isDocViewMode
      removeDocument: true,
      uploadRequired: !litigationCaseSubCaseDocument.documentTemplate?.optional,
      coupleDeliveryFee: litigationCaseSubCaseDocument.coupleDeliveryFee,
    };
  }

  private convertLgDocToDoc(litigationCaseSubCaseDocument: LitigationDocumentDto): IUploadMultiFile {
    return {
      documentTemplateId: litigationCaseSubCaseDocument.documentTemplateId,
      documentTemplate: litigationCaseSubCaseDocument.documentTemplate,
      imageId: litigationCaseSubCaseDocument.imageId,
      uploadDate: litigationCaseSubCaseDocument.documentDate,
      isUpload: false, //this.isDocViewMode
      removeDocument: true,
      uploadRequired: !litigationCaseSubCaseDocument.documentTemplate?.optional,
      uploadFlag: litigationCaseSubCaseDocument?.documentTemplateId === DOC_TEMPLATE.LEXSF096 ? 'RECEIPT' : 'PAYMENT',
    };
  }

  onUploadFileEvent(event: IUploadMultiFile[] | null) {
    if (this.isCivilCase) {
      this.uploadBussinessErr = this.translate.instant('LAWSUIT.COURT_FEE_FORM.WARN_MSG_CIVIL_BANNER');
      this.isUploadError = false;
    }
    if (!event) return;
    this.outputIUploadMultiFile = event;
  }

  formIsValid() {
    if (this.taskCode === 'UPLOAD_COURT_FEES_RECEIPT') {
      if (!!this.litigationDocumentDtos.find(dto => (dto.imageId ?? '') === '' && !dto?.documentTemplate?.optional)) {
        if (!this.outputIUploadMultiFile) return false;
        if (this.outputIUploadMultiFile.some(it => it.documentTemplate?.optional !== true && !!!it.imageId)) {
          return false;
        }
      } else {
        // ถ้า docs ของเก่า(litigationCaseSubCaseDocuments) imageId ทุกตัว -> ไปเช็ค outputIUploadMultiFile imageId ว่าเป็น null หรือ imageId ครบ
        if (!!this.outputIUploadMultiFile) {
          if (this.outputIUploadMultiFile.some(it => it.documentTemplate?.optional !== true && !!!it.imageId)) {
            return false;
          }
        }
      }
      return true;
    }

    // validate docs
    // ถ้า docs ของเก่า(litigationCaseSubCaseDocuments) มีตัวนึงที่ไม่มี imageId -> ไปเช็ค outputIUploadMultiFile imageId ว่ามาครบมั้ย
    if (
      !!this.litigationCaseSubCaseDocuments.find(dto => (dto.imageId ?? '') === '' && !dto?.documentTemplate?.optional)
    ) {
      if (!this.outputIUploadMultiFile) return false;
      if (this.outputIUploadMultiFile.some(it => it.documentTemplate?.optional !== true && !!!it.imageId)) {
        return false;
      }
    } else {
      // ถ้า docs ของเก่า(litigationCaseSubCaseDocuments) imageId ทุกตัว -> ไปเช็ค outputIUploadMultiFile imageId ว่าเป็น null หรือ imageId ครบ
      if (!!this.outputIUploadMultiFile) {
        if (this.outputIUploadMultiFile.some(it => it.documentTemplate?.optional !== true && !!!it.imageId)) {
          return false;
        }
      }
    }

    // validate form
    let courtFee = this.dataForm.get('courtFee')?.valid;

    return courtFee;
  }

  outputAmountFormDtos: AmountFormDto[] | null = null;
  onFeeDocumentChange(event: AmountFormDto[]) {
    this.outputAmountFormDtos = event;
  }

  async save() {
    const isFormAmountValid = this.UploadFileAmountTableV2Component?.isValidForm();
    console.log('on Save ::', { isFormAmountValid });
    this.dataForm.markAllAsTouched();
    this.dataForm.updateValueAndValidity();

    if (this.isCivilCase && this.formIsValid()) {
      /* set documents */
      if (!!this.outputIUploadMultiFile) {
        for (let i in this.outputIUploadMultiFile) {
          this.litigationDocumentDtos[i] = {
            ...this.litigationDocumentDtos[i],
            imageId: this.outputIUploadMultiFile[i].imageId ?? '',
          };
        }
      }

      this.suitService.payCourtFeeReceiptRequest = this.suitService.convertPayCourtFeeDtoToPayCourtFeeReceiptRequest(
        this.payCourtFeeDto,
        this.litigationDocumentDtos
      );
      // await this.suitService.updateReceipt(this.taskId, this.suitService.payCourtFeeReceiptRequest);
      // this.notificationService.openSnackbarSuccess(
      //   `${this.translate.instant('COMMON.LABEL_LG_ID')}: ${this.lgId} ${this.translate.instant('LAWSUIT.SUIT.UPLOAD_COURT_FEES_RECEIPT_SUB_SAVED_0')}`);
      // this.isSuccessForm = true;

      this.back();
    } else if (this.formIsValid() && isFormAmountValid) {
      this.dataForm.markAsPristine();
      /* set fields */
      this.litigationCaseSubCaseDto.courtFee = this.dataForm.get('courtFee')?.value;
      this.litigationCaseSubCaseDto.documentFee = this.dataForm.get('documentFee')?.value;

      /* set documents */
      if (!!this.outputIUploadMultiFile) {
        for (let i in this.outputIUploadMultiFile) {
          this.litigationCaseSubCaseDocuments[i] = {
            ...this.litigationCaseSubCaseDocuments[i],
            imageId: this.outputIUploadMultiFile[i].imageId ?? '',
          };
        }
        this.litigationCaseSubCaseDto.litigationCaseSubCaseDocuments = [...this.litigationCaseSubCaseDocuments];
      }

      /* set AmountDocs */
      if (this.outputAmountFormDtos) {
        // const tempFeeDocs = this.convertedDeliveryFeeDocs;
        let tempSavedFeeDocs = [];
        for (let dto of this.outputAmountFormDtos) {
          if (!!dto.imageId) {
            let templateFeeDoc = this.coupleDeliveryFeeDocuments[0];
            templateFeeDoc = {
              ...templateFeeDoc,
              imageId: dto.imageId ?? '',
              coupleDeliveryFee: dto.amount,
            };
            tempSavedFeeDocs.push({ ...templateFeeDoc });
          }
        }
        this.litigationCaseSubCaseDto.coupleDeliveryFeeDocuments = [...tempSavedFeeDocs];
      }

      this.litigationCaseSubCaseDto.courtFeeStatus = 'PAY_SUCCESS';

      this.suitService.updateLitigationCaseDetail = {
        ...this.litigationCaseDto,
        litigationCaseSubCase: [this.litigationCaseSubCaseDto],
      };

      this.suitService.hasEdit = true;

      this.isSuccessForm = true;
      this.notificationService.openSnackbarSuccess(
        `${this.translate.instant(`LAWSUIT.SUIT_EFILING_FORM.SUCCESS_MSG_SAVE.${this.statusCode}_${this.taskCode}`)}`
      );
      this.back();
    }
  }

  cancel() {
    this.back();
  }

  back() {
    this.routerService.back();
  }

  async canDeactivate() {
    if (this.isSuccessForm || (!!!this.dataForm.dirty && !this.outputAmountFormDtos)) {
      return true;
    }
    return await this.sessionService.confirmExitWithoutSave();
  }

  onUploadError(errors: any) {
    this.subMessageUploadBussinessErr = [];
    this.uploadBussinessErr = null;

    console.log('errors ::', errors);
    if (errors?.length > 0) {
      console.error('onUploadError >> ', errors[0]);
      this.isUploadError = true;

      this.uploadBussinessErr = this.translate.instant('LAWSUIT.SUIT_CODE.' + errors[0].code);
    }
  }
}
