import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgModel, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SuitService } from '@app/modules/lawsuit/lawsuit-detail/suit/suit.service';
import { WithdrawnSeizurePropertyService } from '@app/modules/withdrawn-seizure-property/withdrawn-seizure-property.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import {
  IUploadMultiFile,
  IUploadMultiInfo,
  TMode,
  acceptFile_PDF_JPG,
  maxFileSize,
  taskCode,
} from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils/util';
import {
  CollateralsAssetDto,
  ConfirmationFormDto,
  DocumentDto,
  ExpenseDocumentDto,
  ExpenseTransactionDto,
  ExpenseTransactionRequest,
  TaskDetailDto,
  WithdrawSeizureResponse,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { ExpenseService } from '../../services/expense.service';
import { AddPaymentListDialogComponent } from '../add-payment-list-dialog/add-payment-list-dialog.component';
import { ExpenseWithdrawalInfoDialogComponent } from '../expense-withdrawal-info-dialog/expense-withdrawal-info-dialog.component';

export interface IExpenseDocument extends ExpenseDocumentDto {
  isUpload: boolean;
  uploadDate?: string;
  transactionId?: number;
}
@Component({
  selector: 'app-expense-detail-view',
  templateUrl: './expense-detail-view.component.html',
  styleUrls: ['./expense-detail-view.component.scss'],
})
export class ExpenseDetailViewComponent implements OnInit, OnDestroy {
  private control: UntypedFormGroup = this.initForm();
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  @ViewChild('DEBTAMOUNTModel') DEBTAMOUNTModel!: NgModel;
  @Input() dataForm!: UntypedFormGroup;
  public title!: string;
  public titleIcon!: string;
  public DEBTAMOUNT!: number;
  public datapass: ExpenseTransactionDto = {};
  public datatax: ExpenseTransactionDto = {};
  public cif: any;
  public taskDetail: TaskDetailDto = {};
  public taskCode!: taskCode;
  public flowType!: string;
  public isOpened1 = false;
  public dataSource: IExpenseDocument[] = [];
  public displayedColumns: string[] = ['no', 'documentTemplate', 'uploadUserId', 'subjectTo', 'documentDate'];
  public actionBar!: any;
  @Input() isReadDocument: boolean = false;
  public flagsave: boolean = false;
  public flagautopass: boolean = false;
  public submitted: boolean = false;
  public exceedFileSize: boolean = false;
  public list: IUploadMultiFile[] = [];
  @Input() maxFileSize: number = maxFileSize; // MB Size
  @Output() uploadFileEvent = new EventEmitter<IUploadMultiFile[] | null>();
  @Input() uploadMultiInfo!: IUploadMultiInfo;
  public confirmationForm!: ConfirmationFormDto;
  @Input() acceptFile: Array<string> = acceptFile_PDF_JPG;
  @Input() readonly: boolean = false;
  @Input() uploadFor: string = '';
  public mode: TMode = TMode.VIEW;
  public MODE = TMode;
  public currentTransaction: ExpenseTransactionDto | undefined;
  private transactionIndex!: number;
  private transactionId!: number;
  public isShowTaxInfo: boolean = true;
  public isAutoPay?: boolean;
  public expenseGroup?: number;
  private transactionIdList?: string;
  public litigationDetailList: ExpenseTransactionDto[] = [];
  public sumLitigationDetailList?: number;
  private withdrawSeizureId!: number;
  public stepCode?: string;
  public withdrawSeizureResponse: WithdrawSeizureResponse = {};
  private isOnRequest: boolean = false;
  public isShowWithdrawInfo = false;

  constructor(
    public fb: UntypedFormBuilder,
    private translate: TranslateService,
    private routerService: RouterService,
    private route: ActivatedRoute,
    private expenseService: ExpenseService,
    private notificationService: NotificationService,
    private documentService: DocumentService,
    private suitService: SuitService,
    private sessionService: SessionService,
    private withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService
  ) {}

  get isCaseExecutionSeizureAsset(): boolean {
    return this.expenseService.isCaseExecutionSeizureAsset(
      this.datatax?.stepCode || '',
      this.datatax?.stepSubCode || ''
    );
  }

  public formgroup: UntypedFormGroup = this.initForm();
  public expenseAssetFormGroup: UntypedFormGroup = this.fb.group({
    assetsCheckDate: [undefined, Validators.required],
    actualLed: [undefined, Validators.required],
    seizureDateLedId: [undefined, Validators.required],
    collaterals: [[], Validators.required],
    led: [undefined, []],
    documents: [[], Validators.required],
  });
  async ngOnInit() {
    this.flagsave = false;
    this.mode = this.route.snapshot.queryParams['mode'] || TMode.VIEW;
    this.transactionIndex = this.route.snapshot.queryParams['transactionIndex'];
    this.transactionId = this.route.snapshot.queryParams['transactionId'];
    this.isAutoPay = this.route.snapshot.queryParams['isAutoPay'] === 'true';
    this.expenseGroup = Number(this.route.snapshot.queryParams['expenseGroup']);
    this.transactionIdList = this.route.snapshot.queryParams['transactionIdList'];
    this.withdrawSeizureId = this.route.snapshot.queryParams['withdrawSeizureId'];
    this.stepCode = this.route.snapshot.queryParams['stepCode'];
    this.isOnRequest = !!this.route.snapshot.queryParams['isOnRequest'];
    if (this.withdrawSeizureId) {
      this.withdrawSeizureResponse = await this.withdrawnSeizurePropertyService.getWithdrawSeizures(
        this.withdrawSeizureId
      );
    }
    this.initActionBar();

    if (this.mode === TMode.ADD || (this.mode === TMode.EDIT && !this.transactionId)) {
      if (this.transactionIndex && this.expenseService.expenseTransactionList) {
        const transaction = this.expenseService.expenseTransactionList[this.transactionIndex];
        this.currentTransaction = transaction;
        this.datapass = { ...transaction };
        this.datatax = { ...transaction };
        this.DEBTAMOUNT = Number(transaction?.fieldValue);
        this.dataSource = transaction.expenseDocumentDtoList as IExpenseDocument[];
        // check for show/hide tax info
        if (this.datapass.whtRate === undefined) {
          this.datapass.whtRate = 0;
        }
        this.isShowTaxInfo = Number(this.datapass?.whtRate) !== 0 && this.datapass?.whtRate !== null;
      } else {
        await this.getData(
          this.route.snapshot.queryParams['expenseRateId'],
          this.route.snapshot.queryParams['litigationId'],
          this.route.snapshot.queryParams['litigationCaseId']
        );
      }
    } else {
      //[MVP2 SP 3] add condition stepCode === 'EXECUTION' :: access page : expense-detail, lawsuit-detail
      if (this.transactionId && (this.expenseGroup !== 1 || this.stepCode === 'EXECUTION')) {
        await this.getLitigationDetail(Number(this.transactionId));
        if (this.expenseService.expenseTransactionList && this.transactionIndex) {
          this.currentTransaction = {
            ...this.datatax,
            ...this.expenseService.expenseTransactionList[this.transactionIndex],
            expenseDocumentDtoList:
              this.expenseService.expenseTransactionList[this.transactionIndex]?.expenseDocumentDtoList ||
              this.datatax.expenseDocumentDtoList,
          };
        } else {
          this.currentTransaction = {
            ...this.datatax,
          };
        }
        if (this.stepCode !== 'EXECUTION') {
          // PROSECUTION
          if (this.transactionIndex && this.expenseService.expenseTransactionList) {
            const transaction = this.expenseService.expenseTransactionList?.[this.transactionIndex];
            this.datatax = {
              ...this.datatax,
              ...this.expenseService.expenseTransactionList[this.transactionIndex],
              expenseDocumentDtoList:
                this.expenseService.expenseTransactionList[this.transactionIndex]?.expenseDocumentDtoList ||
                this.datatax.expenseDocumentDtoList,
            };
            this.DEBTAMOUNT = Number(transaction?.fieldValue || 0);
            this.dataSource =
              this.datatax.expenseDocumentDtoList?.map(doc => ({
                ...doc,
                isUpload: doc.imageId ? true : false,
                uploadDate: doc.documentDate,
                transactionId: this.expenseService.expenseTransactionList?.[this.transactionIndex]?.id,
              })) || [];
          }
        }
      }
      if (this.expenseGroup === 1) {
        await this.getLitigationDetailList();
      }
    }
    if (this.mode === TMode.ADD || this.mode === TMode.EDIT) {
      if (this.isAutoPay) {
        this.displayedColumns = ['no', 'documentTemplate', 'uploadUserId', 'subjectTo', 'documentDate', 'active'];
      } else {
        if (this.dataSource.every(item => item.objectType !== 'EXPENSE')) {
          this.displayedColumns = ['no', 'documentTemplate', 'uploadUserId', 'subjectTo', 'documentDate', 'delete'];
        } else {
          this.displayedColumns = [
            'no',
            'documentTemplate',
            'uploadUserId',
            'subjectTo',
            'documentDate',
            'delete',
            'active',
          ];
        }
      }
    }
    // this.initForm();
    this.initLayoutDisplay();
  }

  ngOnDestroy(): void {
    this.expenseService.litigationDetailList = [];
    this.expenseService.litigationDetailListStore = [];
  }

  initLayoutDisplay() {
    this.isShowWithdrawInfo = this.stepCode === 'PROSECUTION' || this.isOnRequest;
  }

  initActionBar() {
    this.title =
      this.mode === TMode.ADD ? 'เพิ่มรายการ' : this.mode === TMode.EDIT ? 'แก้ไขรายการเบิก' : 'รายการจ่ายเงิน';
    this.titleIcon = this.mode === TMode.ADD ? 'icon-Plus' : 'icon-Edit';
    this.actionBar = {
      hasCancel: false,
      disabledCancelButton: false,
      cancelButtonText: 'COMMON.BUTTON_CANCEL',
      hasSave: false,
      saveText: 'COMMON.BUTTON_SAVE_DARFT',
      hasReject: false,
      hasPrimary: this.mode === TMode.ADD || this.mode === TMode.EDIT,
      primaryText: this.mode === TMode.EDIT ? 'บันทึก' : 'เพิ่มรายการเบิกจ่าย',
      primaryIcon: this.mode === TMode.EDIT ? 'icon-save-primary' : 'icon-Plus',
    };
  }
  async getLitigationDetail(expenseTransactionId: number) {
    const litigationDetail = await this.expenseService.getLitigationDetail(expenseTransactionId);
    this.datapass = { ...litigationDetail };
    this.datatax = { ...litigationDetail };
    this.DEBTAMOUNT = Number(litigationDetail?.fieldValue);
    this.dataSource = litigationDetail.expenseDocumentDtoList as IExpenseDocument[];
    // check for show/hide tax info
    if (this.datapass.whtRate === undefined) {
      this.datapass.whtRate = 0;
    }
    this.isShowTaxInfo = Number(this.datapass?.whtRate) !== 0 && this.datapass?.whtRate !== null;
    this.cif = litigationDetail.customerId;
  }

  async getLitigationDetailList() {
    if (this.expenseService.litigationDetailListStore && this.expenseService.litigationDetailListStore.length === 0) {
      this.expenseService.litigationDetailListStore = await this.expenseService.getLitigationDetailList(
        this.transactionIdList || ''
      );
      this.expenseService.litigationDetailList = JSON.parse(
        JSON.stringify(this.expenseService.litigationDetailListStore)
      );
    }
    this.litigationDetailList = this.expenseService.litigationDetailList;
    this.datapass = { ...this.litigationDetailList[0] };
    this.isShowTaxInfo = Number(this.datapass?.whtRate) !== 0 && this.datapass?.whtRate !== null;
    let documentList: IExpenseDocument[] = [];
    this.litigationDetailList.forEach(e => {
      e.expenseDocumentDtoList?.forEach(f => {
        let document: IExpenseDocument = {
          ...(f as IExpenseDocument),
          transactionId: e.id,
        };
        if (!documentList.map(g => g.documentId).includes(f.documentId)) {
          documentList.push(document);
        }
      });
    });
    this.dataSource = documentList;
    this.sumLitigationDetailList = this.litigationDetailList
      ?.map(t => t?.expenseAmount)
      ?.reduce((acc?: number, value?: number) => Number(acc || 0) + Number(value || 0), 0);
  }

  onUploadDocument(_index: number, documentTemplateId: string = '', litigationId: string = '') {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.onchange = async (event: Event) => {
      const element = event.target as HTMLInputElement;
      const fileList = element?.files || [];
      for (let index = 0; index < fileList.length; index++) {
        const file = this.documentService.validateFileType(fileList[index]);
        if (Utils.validateFileSize(file.size)) {
          this.exceedFileSize = false;
          if (!this.isReadDocument) {
            if (this.expenseGroup === 1) {
              const _list = this.litigationDetailList.find(i => i.lgId === litigationId);
              this.cif = _list?.customerId;
            }
            this.dataSource[_index].imageId = (await this.uploadDocument(file, documentTemplateId, litigationId)) || '';
            this.dataSource[_index].isUpload = this.dataSource[_index].imageId ? true : false;
            this.dataSource[_index].uploadDate = this.dataSource[_index].imageId ? new Date().toDateString() : '';
            this.dataSource[_index].documentDate = this.dataSource[_index].imageId ? new Date().toISOString() : '';
            this.dataSource[_index].uploadUserId = this.dataSource[_index].imageId
              ? this.sessionService.currentUser?.userId
              : '-';
            this.dataSource[_index].subjectTo = this.dataSource[_index].imageId
              ? this.sessionService.currentUser?.factionName
              : '-';
            if (this.isAutoPay === true) {
              this.expenseService.hasEdit = true;
              const indexTransaction = this.litigationDetailList.findIndex(
                e => e.id === this.dataSource[_index].transactionId
              );
              this.litigationDetailList[indexTransaction].expenseDocumentDtoList?.forEach((e, i) => {
                if (e.documentId === this.dataSource[_index].documentId) {
                  this.litigationDetailList[indexTransaction].expenseDocumentDtoList![i] = {
                    ...e,
                    ...this.dataSource[_index],
                  };
                }
              });
            }
            this.datatax.expenseDocumentDtoList = this.dataSource;
          } else {
            const resposnse = await this.readDocument(file);
            if (resposnse) {
              this.dataSource[_index].imageId = resposnse.confirmImageId;
              this.dataSource[_index].isUpload = true;
              this.dataSource[_index].uploadDate = this.dataSource[_index].imageId ? new Date().toDateString() : '';
              this.dataSource[_index].documentDate = this.dataSource[_index].imageId ? new Date().toISOString() : '';
              this.dataSource[_index].uploadUserId = this.dataSource[_index].imageId
                ? this.sessionService.currentUser?.userId
                : '-';
              this.dataSource[_index].subjectTo = this.dataSource[_index].imageId
                ? this.sessionService.currentUser?.factionName
                : '-';
            } else {
              this.dataSource[_index].imageId = '';
              this.dataSource[_index].isUpload = false;
              this.dataSource[_index].uploadDate = '';
              this.dataSource[_index].documentDate = '';
              this.dataSource[_index].uploadUserId = '-';
              this.dataSource[_index].subjectTo = '-';
            }
            this.datatax.expenseDocumentDtoList = this.dataSource;
          }
        } else {
          this.exceedFileSize = true;
          this.dataSource[_index].imageId = '';
          this.dataSource[_index].isUpload = false;
          this.dataSource[_index].uploadDate = '';
          this.dataSource[_index].documentDate = '';
          this.dataSource[_index].uploadUserId = '-';
          this.dataSource[_index].subjectTo = '-';
          this.notificationService.openSnackbarError(
            this.translate.instant('UPLOAD_FILE.ERROR_FILE_SIZE_EXCEED', { SIZE_EXCEED: this.maxFileSize.toString() })
          );
          this.datatax.expenseDocumentDtoList = this.dataSource;
        }
      }
      element.value = '';
    };
    fileInput.click();
  }

  async uploadDocument(_file: File, documentTemplateId: string, litigationId: string) {
    try {
      const response = await this.documentService.uploadDocument(
        this.cif || '',
        documentTemplateId,
        _file,
        litigationId || ''
      );
      return response ? response.uploadSessionId : null;
    } catch (error) {
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
    if (!isRemoveSub) {
      this.dataSource = this.dataSource.filter((m: any, key: number) => {
        if (m?.documentTemplate?.documentTemplateId === this.dataSource[_index]?.documentTemplateId) {
          if (m.isSubContract) {
            return false;
          } else {
            m.imageId = '';
            m.isUpload = false;
            m.uploadDate = '';
            m.documentDate = '';
            m.uploadUserId = '';
            m.subjectTo = '';
            m.total = 0;
          }
        }
        return true;
      });
    } else {
      this.dataSource[_index].imageId = '';
      this.dataSource[_index].isUpload = false;
      this.dataSource[_index].uploadDate = '';
      this.dataSource[_index].documentDate = '';
      this.dataSource[_index].uploadUserId = '';
      this.dataSource[_index].subjectTo = '';
    }

    // this.uploadFileEvent.emit(this.dataSource);
  }

  async onDownloadDocument(data: IExpenseDocument) {
    const response: any = await this.documentService.getDocument(
      data.imageId || '',
      data.imageSource || DocumentDto.ImageSourceEnum.Lexs
    );
    const { type } = response;
    Utils.saveAsStrToBlobFile(response, data.documentTemplate?.documentName || 'file' + type, type);
  }
  async getData(expenseRateId: string, litigationId: string, litigationCaseId: number) {
    const res = await this.expenseService.getInitialLitigationDetail(expenseRateId, litigationId, litigationCaseId);
    if (res.fieldName === undefined) {
      this.flagautopass = true;
      this.DEBTAMOUNT = res.expenseAmount || 0;
      this.callcalculate();
    } else {
      this.flagautopass = false;
    }
    this.cif = res.customerId;
    this.datapass = res;
    this.dataSource = (res.expenseDocumentDtoList as IExpenseDocument[]) || [];
    // check for show/hide tax info
    if (this.datapass.whtRate === undefined) {
      this.datapass.whtRate = 0;
    }
    this.isShowTaxInfo = Number(this.datapass?.whtRate) !== 0 && this.datapass?.whtRate !== null;
  }
  async addPaymentList() {
    const result = await this.notificationService.showCustomDialog({
      component: AddPaymentListDialogComponent,
      type: 'small',
      iconName: 'icon-Plus',
      title: 'FINANCE.ADD_PAYMENT_LIST_DIALOG.TITLE',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'COMMON.BUTTON_CONTINUE2',
      buttonIconName: 'icon-Arrow-Right',
      context: { mode: this.mode },
    });
    if (result) {
      this.DEBTAMOUNT = 0;
      this.datapass = {};
      this.datatax = {};
      this.getData(this.route.snapshot.queryParams['expenseRateId'], result?.litigationId, result?.litigationCaseId);
    }
  }
  initForm() {
    return this.fb.group({});
  }
  getControl(name: string) {
    return this.control.get(name);
  }

  async callcalculate() {
    //if (this.DEBTAMOUNTModel.invalid) return;
    let request = {
      expenseRateId: this.route.snapshot.queryParams['expenseRateId'] || this.datapass.expenseRateId,
      fieldValue: this.DEBTAMOUNT,
    };
    const res = await this.expenseService.getExpenseTaxDetail(request);
    this.datatax = {
      ...this.datapass,
      fieldValue: this.DEBTAMOUNT,
      expenseDocumentDtoList: this.dataSource,
      ...res,
    };
  }

  async editWithdrawalInfo() {
    const result = await this.notificationService.showCustomDialog({
      component: ExpenseWithdrawalInfoDialogComponent,
      type: 'small',
      iconName: 'icon-Edit',
      title: 'FINANCE.EXPENSE_WITHDRAWAL_INFO_DIALOG.TITLE',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'FINANCE.EXPENSE_WITHDRAWAL_INFO_DIALOG.BUTTON_REMOVE_CONFIRM',
      buttonIconName: 'icon-Checkmark-Circle-Regular',
      context: {
        stepSubCode: this.datapass?.stepSubCode,
        litigationDetailList: this.litigationDetailList,
        sumLitigationDetailList: this.sumLitigationDetailList,
      },
    });
    if (result) {
      this.litigationDetailList = result?.litigationDetailList;
      this.notificationService.openSnackbarSuccess(
        this.translate.instant('FINANCE.EXPENSE_WITHDRAWAL_INFO_DIALOG.MESSAGE_SECCESS_EDIT_WITHDRAWAL_INFO')
      );
    }
  }

  private createCollateralRequest(
    oldCollaterals: CollateralsAssetDto[],
    newCollaterals: CollateralsAssetDto[],
    transactionId: number
  ) {
    // add update flags to collaterals
    if (transactionId) {
      const combinedCollaterals: CollateralsAssetDto[] = [];
      oldCollaterals.forEach(c => {
        if (!newCollaterals.includes(c)) {
          combinedCollaterals.push({
            ...c,
            updateFlag: 'D',
          });
        }
      });
      newCollaterals.forEach(c => {
        if (!oldCollaterals.includes(c)) {
          combinedCollaterals.push({
            ...c,
            updateFlag: 'A',
          });
        }
      });
      return combinedCollaterals;
    } else {
      return newCollaterals.map(c => ({
        ...c,
        updateFlag: 'A',
      }));
    }
  }

  async onBack(isSubmit: boolean) {
    const diffList = this.compareDiff();
    console.log('🚀 ~ file: expense-detail-view.component.ts:478 ~ diffList:', diffList);

    if (!isSubmit && !diffList) {
      const confirm = await this.confirmExitWithoutSaving();
      if (!confirm) return;
    }
    this.expenseService.isFromDetail = true;

    if (!isSubmit) {
      if (!this.expenseService.hasEdit) {
        this.expenseService.litigationDetailList = this.expenseService.litigationDetailListStore || [];
      }
    } else {
      this.expenseService.litigationDetailList = this.litigationDetailList;
    }
    if (!isSubmit && !diffList) this.expenseService.hasEdit = false;
    console.log('this.expenseService.hasEdit :: ', this.expenseService.hasEdit);
    this.routerService.back();
  }

  async confirmExitWithoutSaving() {
    if (this.dataForm?.dirty || this.expenseAssetFormGroup.dirty || this.expenseService.hasEdit) {
      let confirm = await this.sessionService.confirmExitWithoutSave();
      if (!confirm) {
        return false;
      }
    }
    return true;
  }

  compareDiff() {
    const _isDiffLength = this.litigationDetailList.length !== this.expenseService.litigationDetailListStore.length;
    let _isDiff = false;
    this.litigationDetailList.forEach((e: ExpenseTransactionDto, index: number) => {
      if (
        e.expenseDocumentDtoList?.length !==
        this.expenseService.litigationDetailListStore[index].expenseDocumentDtoList?.length
      ) {
        _isDiff = true;
        return;
      } else {
        e.expenseDocumentDtoList?.forEach((subEle: ExpenseDocumentDto) => {
          if (
            !this.expenseService.litigationDetailListStore[index].expenseDocumentDtoList?.every(
              i => i.documentDate === subEle.documentDate
            )
          ) {
            _isDiff = true;
            return;
          }
        });
      }
    });
    return _isDiffLength || _isDiff;
  }

  onCancel() {
    this.onBack(false);
  }

  onSubmit() {
    this.submitted = true;
    this.flagsave = true;
    if (!this.isCaseExecutionSeizureAsset) {
      if (this.flagautopass === false) {
        this.DEBTAMOUNTModel?.control?.updateValueAndValidity();
        this.DEBTAMOUNTModel?.control?.markAsTouched();
        if (Object.keys(this.datatax).length === 0 && this.DEBTAMOUNT !== undefined) {
          this.callcalculate();
        }
        if (this.isShowWithdrawInfo) {
          this.flagsave = this.flagsave && this.DEBTAMOUNTModel?.control?.valid;
        }
      }
      // validate documents
      this.dataSource.forEach(child => {
        if (child.required === true && (child.imageId === undefined || child.imageId === '')) {
          this.flagsave = false;
        }
      });
    } else {
      if (!this.expenseAssetFormGroup.valid) {
        this.expenseAssetFormGroup.markAllAsTouched();
        this.flagsave = false;
      } else {
        // validate documents
        const documents = this.expenseAssetFormGroup.controls['documents'].value as IExpenseDocument[];
        for (let i = 0; i < documents.length; i++) {
          if (documents[i].required && documents[i].editableFlag && !documents[i].imageId) {
            this.flagsave = false;
            break;
          }
        }
      }
    }

    if (this.flagsave === true) {
      if (this.isCaseExecutionSeizureAsset) {
        const led = this.expenseAssetFormGroup.controls['led'].value;
        const ledId = this.expenseAssetFormGroup.controls['seizureDateLedId'].value; /** value is the id */
        this.datatax = {
          ...this.datatax,
          assetInspectionDate: this.expenseAssetFormGroup.controls['assetsCheckDate'].value,
          seizureId: led.seizureId,
          seizureLedId: ledId,
          propertyType: led.propertyType,
          mainLed: led.mainLed,
          actualLed: led.actualLed,
          paymentDate: led.paymentDate,
          paymentMethod: led.paymentMethod,
          orderId: this.route.snapshot.queryParams['orderId'],
          objectId: ledId,
          objectType: this.route.snapshot.queryParams['seizureObjectType'],
        };
        this.datatax = {
          ...this.datatax,
          collaterals: this.expenseAssetFormGroup.controls['collaterals'].value,
          expenseDocumentDtoList: this.expenseAssetFormGroup.controls['documents'].value,
        };
      }

      if (!!this.transactionId) {
        let oldCollaterals: ExpenseTransactionDto[] = [];
        if (this.currentTransaction) {
          oldCollaterals = this.currentTransaction.collaterals || [];
        }
        if (!!this.expenseService.expenseTransactionRequest) {
          const findIndex = this.expenseService.expenseTransactionRequest.findIndex(
            e => e.id === Number(this.transactionId)
          );
          if (findIndex > -1) {
            const collaterals = this.createCollateralRequest(
              oldCollaterals,
              this.datatax.collaterals || [],
              this.transactionId
            );
            this.expenseService.expenseTransactionRequest[findIndex] = this.expenseService.mapExpenseTransaction(
              {
                ...this.datatax,
                collaterals,
              },
              'U',
              undefined,
              this.isCaseExecutionSeizureAsset
            );
          } else {
            const collaterals = this.createCollateralRequest([], this.datatax.collaterals || [], this.transactionId);
            this.expenseService.expenseTransactionRequest.push(
              this.expenseService.mapExpenseTransaction(
                { ...this.datatax, collaterals },
                'U',
                undefined,
                this.isCaseExecutionSeizureAsset
              )
            );
          }
        } else {
          const collaterals = this.createCollateralRequest(
            oldCollaterals,
            this.datatax.collaterals || [],
            this.transactionId
          );
          let transaction: ExpenseTransactionRequest = this.expenseService.mapExpenseTransaction(
            { ...this.datatax, collaterals },
            'U',
            undefined,
            this.isCaseExecutionSeizureAsset
          );
          this.expenseService.expenseTransactionRequest = [transaction];
        }
        this.expenseService.expenseTransactionList![this.transactionIndex] = this.datatax;
        if (this.isAutoPay === true) {
          let transactionRequest: ExpenseTransactionRequest[] = [];
          this.litigationDetailList.forEach(e => {
            transactionRequest.push(
              this.expenseService.mapExpenseTransaction(e, 'U', undefined, this.isCaseExecutionSeizureAsset)
            );
          });
          this.expenseService.expenseTransactionRequest = transactionRequest;
          this.notificationService.openSnackbarSuccess(
            this.translate.instant('FINANCE.EXPENSE_WITHDRAWAL_INFO_DIALOG.MESSAGE_SECCESS_EDIT_EXPENSE_INFO')
          );
        }
      } else if (!!this.transactionIndex) {
        if (!!this.expenseService.expenseTransactionList) {
          this.expenseService.expenseTransactionList[this.transactionIndex] = this.datatax;
        } else {
          this.expenseService.expenseTransactionList = [this.datatax];
        }
        if (!!this.expenseService.expenseTransactionRequest) {
          const filterTransactionRequest = this.expenseService.expenseTransactionRequest.filter(
            e => e.updateFlag === 'A'
          );
          const filterOtherTransaction = this.expenseService.expenseTransactionRequest.filter(
            e => e.updateFlag !== 'A'
          );
          let indexReq =
            Number(this.transactionIndex) -
            (this.expenseService.expenseTransactionList.length - filterTransactionRequest.length);
          const collaterals = this.createCollateralRequest([], this.datatax.collaterals || [], this.transactionId);
          filterTransactionRequest[indexReq] = this.expenseService.mapExpenseTransaction(
            { ...this.datatax, collaterals },
            'A',
            this.route.snapshot.queryParams['orderId'],
            this.isCaseExecutionSeizureAsset
          );
          this.expenseService.expenseTransactionRequest = [...filterOtherTransaction, ...filterTransactionRequest];
        } else {
          const collaterals = this.createCollateralRequest([], this.datatax.collaterals || [], this.transactionId);
          this.expenseService.expenseTransactionRequest = [
            this.expenseService.mapExpenseTransaction(
              { ...this.datatax, collaterals },
              'A',
              this.route.snapshot.queryParams['orderId'],
              this.isCaseExecutionSeizureAsset
            ),
          ];
        }
      } else {
        this.expenseService.expenseTransactionList?.push(this.datatax);
        if (this.expenseService.expenseTransactionRequest === null) {
          this.expenseService.expenseTransactionRequest = [];
        }
        const collaterals = this.createCollateralRequest([], this.datatax.collaterals || [], this.transactionId);
        this.expenseService.expenseTransactionRequest?.push(
          this.expenseService.mapExpenseTransaction(
            { ...this.datatax, collaterals },
            'A',
            this.route.snapshot.queryParams['orderId'],
            this.isCaseExecutionSeizureAsset
          )
        );
      }

      // Toas success after lgId has been added.
      const lgId = this.datapass.lgId || this.datatax.lgId || '';
      this.toast(`เพิ่มรายการเบิกจ่าย LGID ${lgId} แล้ว`);

      // Back to main form
      this.onBack(true);
    }
  }

  toast(msg: string, type: 'success' | 'error' = 'success') {
    return type == 'success'
      ? this.notificationService.openSnackbarSuccess(msg)
      : this.notificationService.openSnackbarError(msg);
  }
}
