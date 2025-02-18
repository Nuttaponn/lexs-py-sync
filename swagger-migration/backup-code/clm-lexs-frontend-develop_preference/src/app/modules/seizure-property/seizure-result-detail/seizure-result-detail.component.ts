import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '@app/modules/task/services/task.service';
import { EFilingToReceiptDialogComponent } from '@app/shared/components/common-dialogs/e-filing-to-receipt-dialog/e-filing-to-receipt-dialog.component';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { PageEvent, PaginatorComponent } from '@app/shared/components/paginator/paginator.component';
import {
  CollateralStatus,
  DEFAULT_DROPDOWN_CONFIG,
  DOC_TEMPLATE,
  EFilingCategory,
  EFilingOptionCategory,
  EFilingPaymentMethod,
  EFilingPaymentMethodDesc,
  ERROR_CODE,
  NoneEFilingCategory,
  SeizureLedTypes,
  eFiling3_COJ,
} from '@app/shared/constant';
import {
  ActionBar,
  CanComponentDeactivate,
  IUploadMultiFile,
  Mode,
  acceptFile_PDF_JPG,
  maxFileSize,
  taskCode,
} from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { coerceString, compare } from '@app/shared/utils';
import { getFileSizeMB } from '@app/shared/utils/file-size-mb';
import {
  CollateralId,
  DocumentDto,
  DocumentReqOriginalChannelRequest,
  PostSeizureInfoRequest,
  SeizureCollateralInfo,
  SeizureCollateralsRequest,
  SeizureDocumentTemplate,
  SeizureLedsInfo,
  SeizureMoveRequest,
  SeizureNonEFillingInvoiceDto,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { BuddhistEraPipe, DialogOptions, DropDownConfig, PaginatorActionConfig, SimpleSelectOption } from '@spig/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import {
  AddLegalExecutionDepartmentComponent,
  AddNewCollateralComponent,
  ReasonComponent,
  SeizureUploadDialogComponent,
  SeizureUploadDialogReceiptComponent,
} from '../dialogs';
import {
  AddLegalExecutionDepartmentContext,
  AddLegalExecutionDepartmentResult,
  CollateralColumns,
  DocumentColumns,
  ICollateralMTable,
  IDocumentMTable,
  NonMortgageColumns,
  ReceiptColumn,
  SeizureSupportTypeEnum,
  reasonOption,
} from '../models';
import { ISeizureResultDetailSnapshot } from '../resolvers';
import { SeizurePropertyService } from '../seizure-property.service';
import { SeizureUploadDialogService } from '../dialogs/seizure-upload-dialog/seizure-upload-dialog.service';
import { DocumentListDialogComponent } from '@app/shared/components/common-dialogs/document-list-dialog/document-list-dialog.component';

export interface IOfficeSelection extends SimpleSelectOption {
  ledRefNo?: string;
  ledRefNoDate?: string;
  ledRefNoEditable?: boolean;
}

type CustomPage = {
  data: any[];
  pageSize: number;
};

@Component({
  templateUrl: './seizure-result-detail.component.html',
  styleUrls: ['./seizure-result-detail.component.scss'],
  selector: 'app-seizure-result-detail',
})
export class SeizureResultDetailComponent implements OnInit, CanComponentDeactivate {
  public actionBar: ActionBar = {
    hasSave: false,
    hasPrimary: true,
    hasCancel: false,
    hasReject: false,
    primaryText: 'ยืนยันบันทึก',
    primaryIcon: 'icon-save-primary',
  };
  public documentSource = new MatTableDataSource<IDocumentMTable>([]);
  public collateralsSource = new MatTableDataSource<ICollateralMTable>([]);
  public seizureLedsDTO: SeizureLedsInfo = {};
  public dropdownNoIconConfig: DropDownConfig = { ...DEFAULT_DROPDOWN_CONFIG };
  public dropdownConfig: DropDownConfig = { ...DEFAULT_DROPDOWN_CONFIG, iconName: 'icon-Filter', defaultValue: 'ALL' };
  public form: UntypedFormGroup = new UntypedFormGroup({});
  public docColumns = [...DocumentColumns];
  public snapshotData!: ISeizureResultDetailSnapshot;
  public collateralColumns = [...CollateralColumns];
  public ledHeader: string = '';
  public acceptFileList: string[] = acceptFile_PDF_JPG;
  public lawyerOptions: SimpleSelectOption[] = [];
  public collateralTypeOptions: SimpleSelectOption[] = [];
  public collateralStatusOptions: SimpleSelectOption[] = [];
  public collateralStatusConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    searchWith: 'text',
    labelPlaceHolder: 'สถานะหลักประกัน(LEXS)',
    defaultValue: 'ALL',
  };
  public sortingOptions = [
    { text: 'เลขที่หลักประกัน: จากน้อยไปมาก', value: '1' },
    { text: 'เลขที่หลักประกัน: จากมากไปน้อย', value: '2' },
  ];
  public sortingNonMotgageOptions = [
    { text: 'เลขที่เอกสารสิทธิ์: จากน้อยไปมาก', value: '1' },
    { text: 'เลขที่เอกสารสิทธิ์: จากมากไปน้อย', value: '2' },
  ];
  public sortingConfig: DropDownConfig = { iconName: 'icon-Sorting', searchPlaceHolder: '' };
  public executionOffice: IOfficeSelection[] = [];
  public documentUploadOrder: Array<string> = [];
  public minDate: Date | null = new Date();
  public maxDate: Date | null = new Date();
  public minLedRefNoDate: Date = new Date();
  public selection = new SelectionModel<ICollateralMTable>(true, []);
  public showCollateralSelection = false;
  public selectCollateralTypeControl = new UntypedFormControl('ALL');
  public selectCollateralStatusControl = new UntypedFormControl('ALL');
  public selectSortControl = new UntypedFormControl('1');
  public showTopWarningBanner = true;
  public showWaningUploadDocument = true;
  public paginatorConfig: PaginatorActionConfig = {
    previousLabel: 'previousLabel',
    totalPages: 100,
  };

  public isInvalidFile!: boolean;
  public sendChannel?: DocumentReqOriginalChannelRequest.ChannelEnum = undefined;
  public currentTime = moment(moment().toDate(), 'HH:mm');
  public startTime = moment(moment('23:00p', 'HH:mm a'));
  public endTime = moment(moment('08:00a', 'HH:mm a').add(1, 'day'));
  public dialogCtrl = new UntypedFormControl(true, Validators.requiredTrue);
  private isCompletedDoc108 = false;
  public receipt: SeizureNonEFillingInvoiceDto | null = null;
  public receiptSource = new MatTableDataSource<any>([]);
  public receiptColumn = [...ReceiptColumn];
  public colPageData: CustomPage = {
    data: [],
    pageSize: 10,
  };

  @ViewChild('file_uploader', { static: false }) fileUpload!: ElementRef;
  @ViewChild('colPaginator', { static: false }) colPaginator!: PaginatorComponent;

  isOpened = true;

  get showReceiptSection() {
    return (
      !this.eFiling &&
      [
        'RECEIPT_VERIFICATION_COMPLETED',
        'PENDING_RECEIPT_UPLOAD',
        'PENDING_RECEIPT_VERIFICATION',
        'PENDING_RECEIPT_UPDATE',
      ].includes(this.seizureLedsDTO.status || '')
    );
  }

  public warningMessageBanner = 'SEIZURE_PROPERTY.WARNING_MSG_BANNER_E05_10_5';
  constructor(
    private route: ActivatedRoute,
    private datePipe: BuddhistEraPipe,
    private routerService: RouterService,
    private notificationService: NotificationService,
    private seizurePropertyService: SeizurePropertyService,
    private fb: UntypedFormBuilder,
    private masterDataService: MasterDataService,
    private documentService: DocumentService,
    private taskService: TaskService,
    private translate: TranslateService,
    private logger: LoggerService,
    private seizureUploadDialogService: SeizureUploadDialogService,
    private pdfService: DocumentService
  ) {}

  get seizureLedForm() {
    return this.form.get('seizureLed') as UntypedFormGroup;
  }

  get ledRefForm() {
    return this.form.get('ledRefNo') as UntypedFormGroup;
  }

  get documentForm() {
    return this.form.get('uploadDocuments') as UntypedFormControl;
  }

  get collateralForm() {
    return this.form.get('collateralStatus') as UntypedFormControl;
  }

  get seizureTimestampControl() {
    return this.form.get('ledRefNo.seizureTimestamp') as UntypedFormControl;
  }

  get rawValue() {
    return this.form.getRawValue();
  }

  get feePaidTimestamp() {
    if (this.seizureLedsDTO.feePaidTimestamp) {
      return this.datePipe.transform(this.seizureLedsDTO.feePaidTimestamp, 'DD/MM/YYYY');
    }
    return '-';
  }

  get seizureId() {
    return this.route.snapshot.paramMap.get('seizureId') || this.route.snapshot.queryParamMap.get('seizureId') || '';
  }

  get seizureLedId() {
    return (
      this.route.snapshot.paramMap.get('seizureLedId') || this.route.snapshot.queryParamMap.get('seizureLedId') || ''
    );
  }

  get paymentMethod() {
    return (
      this.route.snapshot.paramMap.get('paymentMethod') || this.route.snapshot.queryParamMap.get('paymentMethod') || ''
    );
  }

  get isViewOnly() {
    return (
      this.route.snapshot.queryParamMap.get('mode') === Mode.VIEW ||
      // If there' no mode parameter, always treat it as view mode
      this.route.snapshot.queryParamMap.get('mode') === null ||
      // If all fields are disabled, then go to view mode
      this.form.disabled
    );
  }

  get isEditOnly() {
    return this.route.snapshot.queryParamMap.get('mode') === Mode.EDIT;
  }

  get isSaveLedRefNo() {
    return this.seizureLedsDTO.ledRefNoDate ? true : false;
  }

  get eFiling() {
    return this.seizureLedsDTO.paymentMethod === EFilingPaymentMethodDesc.E_FILING;
  }

  get isNonMortgage() {
    return (
      this.route.snapshot.queryParamMap.get('supportType') === SeizureSupportTypeEnum.NON_MORTGAGE ||
      [taskCode.R2E05_10_5].includes(this.taskService.taskDetail.taskCode as taskCode)
    );
  }

  ngOnInit(): void {
    this.getCollateralLEDs();
    this.initCollateralForm();
    this.loadDocumentTable();
    this.loadCollateralTable();
    this.loadReceiptTable();
    this.loadFormState();
    this.getLawyerList();
    this.getExecutionOffices();
    this.getCollateralTypes();
    this.getCollateralStaus();
    this.sortCollateral();
  }

  sortCollateral() {
    if (this.isNonMortgage) {
      this.sortByDocumentNo('1');
    } else {
      this.sort('1');
    }
  }

  getLawyerFullName(id: any) {
    const findLawyer = this.lawyerOptions.find(i => i.value === id);
    return findLawyer ? findLawyer.text.toString() : '-';
  }

  getCollateralStaus() {
    const options = [...CollateralStatus];
    this.collateralStatusOptions = options.map(it => ({
      text: coerceString(it.name),
      value: coerceString(it.value),
    }));
  }

  markAsViewMode() {
    this.form.disable();
    this.disableActionBar();
    this.disableUploadDocument();
    this.disableCollateralSelection();
    this.disableUploadReceipt();
    if (this.isNonMortgage) {
      const _NonMortgageColumns = NonMortgageColumns.filter(it => !['assetDocuments', 'action'].includes(it));
      if (this.eFiling) {
        if (!this.seizureLedsDTO.isFeePaid) {
          this.collateralColumns = [..._NonMortgageColumns, 'assetDocuments'];
        } else {
          this.collateralColumns = [..._NonMortgageColumns, 'seizureStatus', 'assetDocuments'];
        }
      } else {
        const nonEfilingCompleted = [
          'COMPLETED',
          'PENDING_RECEIPT_UPLOAD',
          'PENDING_RECEIPT_VERIFICATION',
          'RECEIPT_VERIFICATION_COMPLETED',
          'PENDING_RECEIPT_UPDATE',
        ];
        const isStatusCompleted =
          this.seizureLedsDTO.status && nonEfilingCompleted.includes(this.seizureLedsDTO.status);
        this.collateralColumns = isStatusCompleted
          ? [..._NonMortgageColumns, 'seizureStatus', 'assetDocuments']
          : [..._NonMortgageColumns, 'assetDocuments'];
      }
    } else {
      this.collateralColumns = [...this.collateralColumns, 'seizureStatus'];
    }
    this.showTopWarningBanner = false;
  }

  async reloadInfo() {
    const seizureId = this.seizureId;
    const seizureLedId = this.seizureLedId;

    const result = await this.seizurePropertyService.getCollateralLEDById(seizureId);
    const collateralDetail = result;
    const seizureLedsDTO = collateralDetail.seizureLedsInfoList?.find(it => it.id?.toString() == seizureLedId);
    const unMappedCollaterals = collateralDetail.unMappedCollaterals || [];
    if (!seizureLedsDTO) {
      throw new Error("Can't find seizureLedId");
    }
    this.seizureLedsDTO = seizureLedsDTO;
    this.snapshotData.seizureLedsDTO = seizureLedsDTO;
    this.snapshotData.unMappedCollaterals = unMappedCollaterals;
    this.loadCollateralTable();
    this.loadDocumentTable();
    return this.loadFormState();
  }

  async getCollateralTypes() {
    const result = await this.masterDataService.getCollateralTypeOptions(['97', '98']);
    this.collateralTypeOptions = [...result].map(
      it =>
        ({
          text: coerceString(it.collateralTypeDesc),
          value: it.collateralTypeCode,
        }) as SimpleSelectOption
    );
  }

  getExecutionOffices() {
    this.executionOffice = this.snapshotData.executionOffices.map(it => ({
      text: it.ledName || 'UNKNOW',
      value: it.ledId || '-1',
      ledRefNoDate: it.ledRefNoDate,
      ledRefNo: it.ledRefNo,
      ledRefNoEditable: it.ledRefNoEditable,
    }));
  }

  onSelectOfficeOption(value: number) {
    const option = this.executionOffice.find(it => it.value === value);

    if (!option) {
      return;
    }

    const ledRefNoDate = option.ledRefNoDate || '';
    const ledRefNo = option.ledRefNo || '';
    const ledRefNoEditable = option.ledRefNoEditable || false;

    if (ledRefNoDate || ledRefNo || ledRefNoEditable) {
      this.ledRefForm.patchValue({ ledRefNoEditable, ledRefNoDate, ledRefNo });
      this.loadFormState();
    } else {
      const ledRefNoControl = this.ledRefForm.controls['ledRefNo'];
      const ledRefNoDateControl = this.ledRefForm.controls['ledRefNoDate'];
      ledRefNoControl.reset();
      ledRefNoDateControl.reset();
      ledRefNoDateControl.enable();
    }
  }

  getLawyerList() {
    this.lawyerOptions = this.snapshotData.lawyerList.map(it => {
      return {
        text: `${it.userId} - ${it.title} ${it.name} ${it.surname}`,
        value: it.userId || '',
      };
    });
  }

  initCollateralForm() {
    const val = this.seizureLedsDTO;
    const snap = this.snapshotData;
    this.form = this.fb.group({
      seizureLed: this.fb.group({
        ledName: [val.ledId],
        seizureLedType: [val.seizureLedType],
        civilCourtNo: [snap.civilCourtNo],
        civilCourtName: [snap.civilCourtName],
      }),
      ledRefNo: this.fb.group({
        ledRefNo: [val.ledRefNo, Validators.required],
        ledRefNoDate: [val.ledRefNoDate, Validators.required],
        ledRefNoEditable: [val.ledRefNoEditable],
        ledRefOffice: [this.translate.instant('COMMON.MAIN_BRANCE_KTB_OFFICE_CODE_NAME')],
        onSiteLawyerId: [val.onsiteLawyerId],
        seizureTimestamp: [{ value: val.seizureTimestamp, disabled: true }],
      }),
      feePaidTimestamp: [val.feePaidTimestamp],
      uploadDocuments: [true],
      collateralStatus: [true],
    });
  }

  loadFormState() {
    const isPaid = this.seizureLedsDTO.isFeePaid;
    const ledRefValue = this.ledRefForm.getRawValue();
    const ledRefNoDate = ledRefValue.ledRefNoDate;
    const taskCompleted = this.seizureLedsDTO.status === 'COMPLETED';
    const seizureLedType = ledRefValue.seizureLedType;
    const eFiling = this.eFiling;
    const isAllDocumentUploaded = (this.seizureLedsDTO.documents || [])
      .filter(it => it.documentTemplate?.optional == false)
      .every(it => !!it.imageId);

    if (this.isViewOnly || taskCompleted) {
      this.markAsViewMode();
      return;
    }

    if (eFiling === false && isAllDocumentUploaded) {
      this.seizureLedForm.disable();
      this.ledRefForm.disable();
      this.enableCollateralSelection();
    }

    if (isPaid === true) {
      this.seizureLedForm.disable();
      this.ledRefForm.disable();
      this.enableCollateralSelection();
    }

    if (isPaid === true || eFiling === false) {
      this.enableSeizureTimestamp();
    }

    if (ledRefNoDate) {
      this.ledRefForm.controls['ledRefNoDate'].disable();
      this.showTopWarningBanner = false;
    }

    if (seizureLedType === SeizureLedTypes.MAIN_ADDITIONAL) {
      this.seizureLedForm.controls['ledName'].disable();
    }
  }

  enableCollateralSelection() {
    const _NonMortgageColumns = NonMortgageColumns.filter(it => !['assetDocuments', 'action'].includes(it));
    this.collateralColumns = this.isNonMortgage
      ? ['select', ..._NonMortgageColumns, 'seizureStatus', 'assetDocuments']
      : ['select', ...CollateralColumns, 'seizureStatus'];
    this.collateralColumns = this.collateralColumns.filter(filed => filed !== 'action');
    this.showCollateralSelection = true;
  }

  disableActionBar() {
    this.actionBar.hasPrimary = false;
  }

  disableUploadDocument() {
    this.showWaningUploadDocument = false;
    this.docColumns = this.docColumns.filter(feild => feild !== 'documentAction');
  }

  disableCollateralSelection() {
    this.showCollateralSelection = false;
    this.collateralColumns = this.collateralColumns.filter(
      filed => filed !== 'action' && filed !== 'select' && filed !== 'seizureStatus'
    );
  }

  getCollateralLEDs() {
    // Get data result from resolver
    if (!this.route.snapshot.data['data']) {
      throw new Error('seizureLedsDTO is empty');
    }

    this.snapshotData = <ISeizureResultDetailSnapshot>this.route.snapshot.data['data'];
    this.seizureLedsDTO = this.snapshotData.seizureLedsDTO;
    this.ledHeader = `SEIZURE_OFFICE_TYPE_TITLE.${this.seizureLedsDTO.seizureLedType}`;
    this.receipt = this.snapshotData.receipt || { receiptDocumentDto: {} };
  }

  loadDocumentTable() {
    const documents = this.seizureLedsDTO.documents || [];
    const isFeePaid = this.seizureLedsDTO.isFeePaid || false;
    const sendChannelEnum = DocumentReqOriginalChannelRequest.ChannelEnum;

    this.documentUploadOrder = documents.map(it => it.documentTemplate?.documentTemplateId || '');
    this.documentSource.data = documents.map((it: any, index: number) => {
      const documentTemplate = <SeizureDocumentTemplate>it.documentTemplate || {};
      const templateId = it.documentTemplate.documentTemplateId;
      const uploaded = it.imageId ? true : false;
      const date = this.datePipe.transform(it.documentDate, 'DD/MM/YYYY');
      const nonEfilingReUploadable =
        !this.eFiling &&
        [DOC_TEMPLATE.LEXSF116, DOC_TEMPLATE.LEXSF129].includes(templateId) &&
        !!!documents.find(i => i.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF117)?.imageId;
      const isDocReUploadable = [DOC_TEMPLATE.LEXSF105, DOC_TEMPLATE.LEXSF117, DOC_TEMPLATE.LEXSF107].includes(
        templateId
      );
      const isForceReuploadLEXSF129 =
        [DOC_TEMPLATE.LEXSF129].includes(templateId) && isFeePaid === false && this.eFiling;
      const reuploadable =
        isDocReUploadable ||
        nonEfilingReUploadable ||
        (it.uploadType === 'INVOICE' && isFeePaid === false) ||
        isForceReuploadLEXSF129;
      const sendChannelDisplay =
        templateId === DOC_TEMPLATE.LEXSF108 ? this.sendChannel || it.sendChannel || sendChannelEnum.Post : '';
      const optionalDocument = coerceBooleanProperty(documentTemplate.optional);

      if (templateId === DOC_TEMPLATE.LEXSF108) {
        this.isCompletedDoc108 = uploaded;
        this.sendChannel = sendChannelDisplay;
      }

      const document: IDocumentMTable = {
        refs: it,
        documentTemplate: documentTemplate,
        optional: optionalDocument,
        orderNumber: coerceString(index + 1),
        documentName: coerceString(documentTemplate?.documentName),
        documentDate: coerceString(date),
        docType: coerceString(it.uploadType, 'DIRECT_UPLOAD'),
        action: {
          uploaded: uploaded,
          hidden: optionalDocument === true && uploaded === false,
          reuploadable: reuploadable,
          disabled: uploaded && reuploadable === false,
          colorClass: !uploaded ? 'primary' : 'link',
          deletable: optionalDocument,
        },
        sendChannel: {
          display: {
            checkbox: this.isViewOnly === false && sendChannelDisplay,
            label: this.isViewOnly === true && sendChannelDisplay === sendChannelEnum.Post,
          },
          checked: sendChannelDisplay === sendChannelEnum.Post,
          disabled: false,
        },
      };

      return document;
    });
  }

  toggleDocumentOptional(element: IDocumentMTable) {
    element.refs.active = !element.refs.active;
    element.action.hidden = !element.refs.active;
  }

  loadCollateralTable() {
    const collatetals = this.seizureLedsDTO.collaterals || [];
    this.collateralsSource.data = [];
    if (this.isNonMortgage) {
      const _NonMortgageColumns = NonMortgageColumns.filter(it => !['assetDocuments', 'action'].includes(it));
      if (!this.seizureLedsDTO.isFeePaid) {
        this.collateralColumns = [..._NonMortgageColumns, 'assetDocuments', 'action'];
      } else {
        this.collateralColumns = [..._NonMortgageColumns, 'seizureStatus', 'assetDocuments'];
      }
    } else {
      this.collateralColumns = [...this.collateralColumns];
    }
    this.collateralsSource.data = collatetals.map((row, index) => {
      const actionable = this.seizureLedsDTO.isFeePaid === true ? false : true;
      const collateralCaseLexsStatus = <string>row.collateralCaseLexStatus || 'PLEDGE';
      const seizureStatus = this._getSeizureStatus(row.seizureResultFlag);
      if (this.isNonMortgage) {
        return this.mamppingAsset(index, row, seizureStatus, collateralCaseLexsStatus, actionable);
      } else {
        return this.mamppingCollaterals(index, row, seizureStatus, collateralCaseLexsStatus, actionable);
      }
    });

    // Init slice 0 to 10
    this.collateralsSource.filteredData = [...this.collateralsSource.data].slice(0, this.colPageData.pageSize);
    this.colPageData.data = [...this.collateralsSource.data];

    // Apply filter
    this.collateralsSource.filterPredicate = (data: ICollateralMTable, filter: string) => {
      const condition = JSON.parse(filter);
      const status = !condition.collateralStatus || condition.collateralStatus === data.collateralCaseLexsStatus;
      const type = !condition.collateralType || condition.collateralType === data.collateralType;
      return status && type;
    };
  }

  private mamppingCollaterals(
    index: number,
    row: SeizureCollateralInfo,
    seizureStatus: string,
    collateralCaseLexsStatus: string,
    actionable: boolean
  ): ICollateralMTable {
    return <ICollateralMTable>{
      orderNumber: '' + (index + 1),
      collateralId: row.collateralId,
      collateralType: coerceString(row.collateralType, ''),
      remark: coerceString(row.seizureFailedRemarks, ''),
      reason: coerceString(row.seizureFailedReason, ''),
      collateralTypeDesc: row.collateralTypeDesc,
      collateralSubTypeDesc: row.collateralSubTypeDesc,
      documentNo: row.documentNo,
      seizureStatus: seizureStatus,
      collateralDetails: row.collateralDetails,
      ownerId: coerceString(row.ownerFullName),
      totalAppraisalValue: coerceString(coerceNumberProperty(row.totalAppraisalValue)),
      collateralCmsStatus: coerceString(row.collateralCmsStatus).toUpperCase(),
      collateralCaseLexsStatus: `${collateralCaseLexsStatus}`,
      action: {
        deletable: actionable,
        editable: actionable,
        viewable: this.isViewOnly ? true : false,
      },
    };
  }

  private mamppingAsset(
    index: number,
    row: SeizureCollateralInfo,
    seizureStatus: string,
    collateralCaseLexsStatus: string,
    actionable: boolean
  ): ICollateralMTable {
    return <ICollateralMTable>{
      orderNumber: '' + (index + 1),
      collateralId: row.assetId || '',
      collateralType: coerceString(row.assetType, ''),
      remark: coerceString(row.seizureFailedRemarks, ''),
      reason: coerceString(row.seizureFailedReason, ''),
      collateralTypeDesc: row.assetTypeDesc,
      collateralSubTypeDesc: row.assetSubTypeDesc,
      documentNo: row.documentNo,
      seizureStatus: seizureStatus,
      collateralDetails: row.collateralDetails,
      ownerId: coerceString(row.ownerFullName),
      totalAppraisalValue: coerceString(coerceNumberProperty(row.totalAppraisalValue)),
      collateralCmsStatus: coerceString(row.collateralCmsStatus).toUpperCase(),
      collateralCaseLexsStatus: `${collateralCaseLexsStatus}`,
      assentRlsStatus: row.assentRlsStatus,
      obligationStatus: row.obligationStatus,
      assetDocuments: row.assetDocuments,
      action: {
        deletable: actionable,
        editable: actionable,
        viewable: this.isViewOnly ? true : false,
      },
    };
  }

  onBack() {
    this.routerService.back();
  }

  async onUploadDocument(element: IDocumentMTable) {
    if (!this.seizureLedsDTO.collaterals) {
      const title = 'EXCEPTION_CONFIG.TITLE_ERROR_UPLOAD';
      const msg = `ไม่สามารถลบหรือแก้ไขทรัพย์ได้ เนื่องจากต้องมีทรัพย์อย่างน้อย 1 รายการต่อสำนักงานบังคับคดี`;
      return this.notificationService.alertDialog(title, msg, 'COMMON.BUTTON_ACKNOWLEDGE');
    }

    const warningMsg = this.isRequirePrevNonPledgeDocumentSP8(element);
    if (warningMsg) {
      const title = 'EXCEPTION_CONFIG.TITLE_ERROR_UPLOAD';
      const msg = warningMsg;
      return this.notificationService.alertDialog(title, msg, 'COMMON.BUTTON_ACKNOWLEDGE');
    }

    switch (element.docType) {
      case 'INVOICE':
        this.seizureUploadDialogService.seizureInvoiceDto = await this.seizureUploadDialogService.getInvoice(
          Number(this.seizureLedsDTO.id)
        );
        this.logger.info('seizureInvoiceDto :: ', this.seizureUploadDialogService.seizureInvoiceDto);
        await this.onUploadInvoice();
        break;
      case 'DIRECT_UPLOAD':
        this.onDirectUpload(element);
        break;
      case 'RECEIPT':
        this.onUploadReceipt();
        break;
    }

    return;
  }

  /**
   * Remove document
   * @param element
   * @returns
   */
  async onDeleteDocument(element: IDocumentMTable) {
    const documentTemplateId = coerceString(element.documentTemplate.documentTemplateId);
    const seizureLedId = coerceNumberProperty(this.seizureLedsDTO.id);
    return this.seizurePropertyService
      .deleteDocument(documentTemplateId, seizureLedId)
      .then(() => this.documentForm.markAsDirty())
      .then(async () => await this.reloadInfo())
      .then(() => this.toast('ลบเอกสารสำเร็จ'));
  }

  onUploadReceipt() {
    return this.showSeizureUploadReceipt();
  }

  /**
   * Check the current document requires prevoius document to be uploaded.
   * @param element
   * @returns
   */
  isRequirePrevDocument(element: IDocumentMTable): string {
    if (!!element.optional) return '';
    const documentId = element.documentTemplate.documentTemplateId;
    const allDocuments = this.seizureLedsDTO.documents || [];
    const documentOrder = [...this.documentUploadOrder];
    const targetDocumentIndex = this.documentUploadOrder.findIndex(it => it === documentId);
    const requireLedRefNo = this.ledRefForm.get('ledRefNo')?.value ? false : true;
    const isEFiling = this.eFiling;
    // Allow for first document in list
    if (targetDocumentIndex === 0) {
      return '';
    }

    let index = 0;

    while (documentOrder.length > 0) {
      const documentTemplateId = documentOrder.shift() || '';
      const document = allDocuments.find(it => it.documentTemplate?.documentTemplateId === documentTemplateId);
      const isUploaded = document?.imageId ? true : false;
      const reuploadable = document?.reuploadable;
      const isOptional = !!document?.documentTemplate?.optional;

      // กรณีที่เคยอัพโหลดแล้ว อัพโหลดซ้ำ
      if (isUploaded && reuploadable && index === targetDocumentIndex) {
        return '';
      }

      if (isUploaded) {
        index++;
        continue;
      }

      if (!document) {
        return '';
      }

      if (isEFiling) {
        // กรณีอัปโหลด (1)  (2) แต่ยังไม่ระบุเลขที่เก็บ
        if (index > 1 && requireLedRefNo) {
          return 'กรุณาอัปโหลดเอกสารข้อ (1) และ (2) และ ระบุเลขที่เก็บก่อน';
        }

        if (index === targetDocumentIndex) {
          if (targetDocumentIndex === 3 && !!!this.seizureLedsDTO.isFeePaid) {
            return 'กรุณาอัปโหลดเอกสารข้อ <span class="bold">(3) ใบแจ้งหนี้ค่าธรรมเนียมยึดทรัพย์</span> และชำระให้เสร็จสิ้น ก่อน';
          }
          return '';
        }

        // กรณียังไม่อัปโหลด (1)  (2)  จะแสดง msg  “กรุณาอัปโหลดเอกสารข้อ (1) และ (2) และ ระบุเลขที่เก็บก่อน“
        if (index === 0 || index === 1) {
          return 'กรุณาอัปโหลดเอกสารข้อ (1) และ (2) และ ระบุเลขที่เก็บก่อน';
        }
      }

      if (index === targetDocumentIndex) {
        return '';
      }

      // กรณีอัปโหลด (1)  (2) แล้ว  แต่ยังไม่อัปโหลด (3)  จะแสดง msg  “กรุณาอัปโหลดเอกสารข้อ (3) ใบแจ้งหนี้ค่าธรรมเนียมยึดทรัพย์ ก่อน“
      const docIndex = index + 1;
      const documentName = document.documentTemplate?.documentName || '';
      return !isOptional ? `กรุณาอัปโหลดเอกสารข้อ (${docIndex}) ${documentName} ก่อน` : '';
    }

    return '';
  }

  /**
   * Check the current document requires prevoius document to be uploaded.
   * @param element
   * @returns
   */
  isRequirePrevNonPledgeDocument(element: IDocumentMTable): string {
    if (!!element.optional) return '';
    const documentId = element.documentTemplate.documentTemplateId;
    const allDocuments = this.seizureLedsDTO.documents || [];
    const documentOrder = [...this.documentUploadOrder];
    const targetDocumentIndex = this.documentUploadOrder.findIndex(it => it === documentId);
    const requireLedRefNo = this.ledRefForm.get('ledRefNo')?.value ? false : true;
    const isEFiling = this.eFiling;

    // Allow for first document in list
    if (
      ([0, 1, 2].includes(targetDocumentIndex) && isEFiling) ||
      ([0, 1].includes(targetDocumentIndex) && !isEFiling)
    ) {
      return '';
    }

    let index = 0;

    while (documentOrder.length > 0) {
      const documentTemplateId = documentOrder.shift() || '';
      const document = allDocuments.find(it => it.documentTemplate?.documentTemplateId === documentTemplateId);
      const isUploaded = document?.imageId ? true : false;
      const reuploadable = document?.reuploadable;
      const isOptional = !!document?.documentTemplate?.optional;

      // กรณีที่เคยอัพโหลดแล้ว อัพโหลดซ้ำ
      if (isUploaded && reuploadable && index === targetDocumentIndex) {
        return '';
      }

      if (isUploaded) {
        index++;
        continue;
      }

      if (!document) {
        return '';
      }

      if (isEFiling) {
        // กรณีอัปโหลด (1),(2) และ (3) แต่ยังไม่ระบุเลขที่เก็บ
        if ((index > 2 && requireLedRefNo) || (index === 0 && requireLedRefNo)) {
          return 'กรุณาอัปโหลดเอกสารข้อ (1),(2) และ (3) และระบุเลขเก็บก่อน';
        }

        // กรณียังไม่อัปโหลด (1)  (2)  จะแสดง msg  “กรุณาอัปโหลดเอกสารข้อ (1) และ (2) และ ระบุเลขที่เก็บก่อน“
        if (index < 3 && [3, 4, 5].includes(targetDocumentIndex)) {
          return 'กรุณาอัปโหลดเอกสารข้อ (1),(2) และ (3) ก่อน';
        }

        if (index <= targetDocumentIndex && targetDocumentIndex > 3) {
          if ([4, 5].includes(targetDocumentIndex) && !!!this.seizureLedsDTO.isFeePaid) {
            return 'กรุณาอัปโหลดเอกสารข้อ <span class="bold">(4) ใบแจ้งหนี้ค่าธรรมเนียมยึดทรัพย์</span> และชำระให้เสร็จสิ้น ก่อน';
          }
          return '';
        }
      } else {
        if (index < 1 && [2].includes(targetDocumentIndex) && requireLedRefNo) {
          return 'กรุณาอัปโหลดเอกสารข้อ (1) และ (2) และระบุเลขเก็บก่อน';
        }

        if (index < 1 && [2].includes(targetDocumentIndex)) {
          return 'กรุณาอัปโหลดเอกสารข้อ (1) และ (2) ก่อน';
        }
      }

      if (index === targetDocumentIndex) {
        return '';
      }

      // กรณีอัปโหลด (1)  (2) แล้ว  แต่ยังไม่อัปโหลด (3)  จะแสดง msg  “กรุณาอัปโหลดเอกสารข้อ (3) ใบแจ้งหนี้ค่าธรรมเนียมยึดทรัพย์ ก่อน“
      const docIndex = index + 1;
      const documentName = document.documentTemplate?.documentName || '';
      return !isOptional ? `กรุณาอัปโหลดเอกสารข้อ (${docIndex}) ${documentName} ก่อน` : '';
    }

    return '';
  }

  isRequirePrevNonPledgeDocumentSP8(element: IDocumentMTable): string {
    if (!!element.optional) return '';
    const documentId = element.documentTemplate.documentTemplateId;
    const allDocuments = this.seizureLedsDTO.documents || [];
    const documentOrder = [...this.documentUploadOrder];
    const targetDocumentIndex = this.documentUploadOrder.findIndex(it => it === documentId);
    const requireLedRefNo = this.ledRefForm.get('ledRefNo')?.value ? false : true;
    const isEFiling = this.eFiling;
    let index = 0;
    while (documentOrder.length > 0) {
      const documentTemplateId = documentOrder.shift() || '';
      const document = allDocuments.find(it => it.documentTemplate?.documentTemplateId === documentTemplateId);
      const isUploaded = document?.imageId ? true : false;
      const reuploadable = document?.reuploadable;

      // กรณีที่เคยอัพโหลดแล้ว อัพโหลดซ้ำ
      if (isUploaded && reuploadable && index === targetDocumentIndex) {
        return '';
      }

      if (isUploaded) {
        index++;
        continue;
      }

      if (!document) {
        return '';
      }

      if (isEFiling) {
        //  กรณียังไม่อัปโหลด 1 แล้วไปกดอัปโหลด 2,3,4,5,6
        if (index === 0 && [1, 2, 3, 4, 5].includes(targetDocumentIndex)) {
          return 'กรุณาอัปโหลดเอกสารข้อ (1) และระบุเลขเก็บก่อน';
        }
        //กรณีอัปโหลด 1 ยังไม่อัปโหลด 2 แล้วไปกดอัปโหลด 3,4,5,6
        if (index === 1 && [2, 3, 4, 5].includes(targetDocumentIndex)) {
          return 'กรุณาอัปโหลดเอกสารข้อ (2) และชำระเงินให้เสร็จสิ้นก่อน';
        }
      } else {
        if (index <= 1 && [2].includes(targetDocumentIndex) && requireLedRefNo) {
          return 'กรุณาอัปโหลดเอกสารข้อ (1) และ (2) และระบุเลขเก็บก่อน';
        }

        if (index <= 1 && [2].includes(targetDocumentIndex)) {
          return 'กรุณาอัปโหลดเอกสารข้อ (1) และ (2) ก่อน';
        }
      }

      if (index === targetDocumentIndex || index > 1) {
        return '';
      }
    }

    return '';
  }

  onDirectUpload(element: IDocumentMTable) {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.rowData = element;
    return fileInput.click();
  }

  async onUploadFile(event: Event) {
    let element = event.target as HTMLInputElement;
    let document = <IDocumentMTable>(<any>element)['rowData'];

    if (
      document.documentTemplate.documentTemplateId === DOC_TEMPLATE.LEXSF120 ||
      document.documentTemplate.documentTemplateId === DOC_TEMPLATE.LEXSF119
    ) {
      element.accept = this.acceptFileList.filter(i => i === 'application/pdf').toString();
    } else {
      element.accept = this.acceptFileList.toString();
    }

    const fileList = element?.files || null;
    this.isInvalidFile = false;

    try {
      if (fileList) {
        const rowData = <IDocumentMTable>(<any>element)['rowData'];
        const file = fileList[0];
        const fileSizeMb = getFileSizeMB(file.size);
        const documentTemplateId = coerceString(rowData.documentTemplate.documentTemplateId);
        const seizureLedId = coerceString(this.seizureLedsDTO.id);

        // Check file size to maximum size
        if (fileSizeMb >= maxFileSize) {
          throw new TypeError(`ไม่สามารถอัปโหลดเอกสารที่มีขนาดเกิน ${maxFileSize}(MB)/ไฟล์`);
        }

        // Check file type
        if (
          document.documentTemplate.documentTemplateId === DOC_TEMPLATE.LEXSF120 ||
          document.documentTemplate.documentTemplateId === DOC_TEMPLATE.LEXSF119
        ) {
          if ('application/pdf' !== file.type) {
            throw new TypeError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_F015'));
          }
        } else {
          if (!this.acceptFileList.includes(file.type)) {
            throw new TypeError(this.translate.instant('EXCEPTION_CONFIG.MESSAGE_F015'));
          }
        }

        const isLedRefNoNotCurrently =
          !!this.ledRefForm.get('ledRefNo')?.value &&
          !!this.seizureLedsDTO.ledRefNo &&
          this.ledRefForm.get('ledRefNo')?.value !== this.seizureLedsDTO.ledRefNo;
        // Upload image and update document object
        if (isLedRefNoNotCurrently) {
          await this.alertLedRefNoDialogError();
        } else {
          const isNotFoundLedRefNo = !!!this.ledRefForm.get('ledRefNo')?.value && !!!this.seizureLedsDTO.ledRefNo;
          await this.seizurePropertyService
            .directUpload(documentTemplateId, seizureLedId, file, isNotFoundLedRefNo)
            .then(() => this.documentForm.markAsDirty())
            .then(() => this.reloadInfo())
            .then(() => this.toast('อัปโหลดเอกสารสำเร็จ'))
            .then(() => (element.value = ''))
            .catch(async (error: HttpErrorResponse) => {
              // ledRefNo is not found
              this.logger.catchError(error, this.ledRefForm.get('ledRefNo')?.value, this.seizureLedsDTO.ledRefNo);
              if (isNotFoundLedRefNo) await this.alertLedRefNoDialogError();
            });
        }
      }
    } catch (error: unknown) {
      if (error instanceof TypeError) {
        this.toast(error.message, 'error');
        this.isInvalidFile = true;
        element.value = '';
      }
    }
  }

  async alertLedRefNoDialogError() {
    return await this.notificationService.alertDialog(
      'ไม่สามารถอัปโหลดได้',
      'กรุณากดปุ่ม ‘ยืนยันบันทึก’ ที่สำนักงานบังคับคดี<br>เพื่อบันทึกเลขที่เก็บก่อน และเมื่อบันทึกแล้ว<br>จะไม่สามารถกลับมาแก้ไขได้<br><br>เมื่อกดปุ่ม ‘ยืนยันบันทึก’ แล้ว โปรดกลับมาทำรายการอัปโหลดเอกสารใหม่อีกครั้ง'
    );
  }

  /**
   * เลือกทรัพท์เพื่อบันทึกลงในสำนักงานบังคับคดี
   * @returns
   */
  async onAddCollateral() {
    const unMappedCollateral = this.snapshotData.unMappedCollaterals.filter(i => {
      if (this.paymentMethod === 'NON-E-FILING') {
        if (this.isNonMortgage) {
          return (
            i.assetType &&
            (NoneEFilingCategory.includes(i.assetType?.toString() || '') ||
              EFilingOptionCategory.includes(i.assetType?.toString() || ''))
          );
        } else {
          return (
            i.collateralType &&
            (NoneEFilingCategory.includes(i.collateralType) || EFilingOptionCategory.includes(i.collateralType))
          );
        }
      } else if (this.paymentMethod === 'E-FILING') {
        if (this.isNonMortgage) {
          return (
            i.assetType &&
            (EFilingCategory.includes(i.assetType?.toString() || '') ||
              EFilingOptionCategory.includes(i.assetType?.toString() || ''))
          );
        } else {
          return (
            i.collateralType &&
            (EFilingCategory.includes(i.collateralType) || EFilingOptionCategory.includes(i.collateralType))
          );
        }
      } else {
        if (this.isNonMortgage) {
          return i.assetType && EFilingOptionCategory.includes(i.assetType?.toString() || '');
        } else {
          return i.collateralType && EFilingOptionCategory.includes(i.collateralType);
        }
      }
    });

    if (unMappedCollateral.length === 0) {
      const title = `ไม่มีทรัพท์ให้ระบุสำนักงานบังคับคดี`;
      const msg = `ไม่มีทรัพท์ให้ระบุสำนักงานบังคับคดีแล้ว`;
      return this.notificationService.alertDialog(title, msg, 'COMMON.BUTTON_ACKNOWLEDGE');
    }

    return this.notificationService
      .showCustomDialog({
        title: `เลือกทรัพย์เพื่อบันทึกลงในสำนักงานบังคับคดี`,
        context: { unMappedCollateral: unMappedCollateral, isNonMortgage: this.isNonMortgage },
        component: AddNewCollateralComponent,
        iconName: 'icon-Plus',
        type: 'large',
        autoWidth: false,
        panelCssClasses: ['custom-dialog-large'],
        rightButtonLabel: 'COMMON.BUTTON_CONFIRM',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      })
      .then(async (collateral: Array<SeizureCollateralInfo> = []) => {
        if (collateral.length) {
          // call API to add legal execution to table
          const seizureId = coerceString(this.snapshotData.seizureLedsDTO.seizureId);
          const ledId = coerceString(this.snapshotData.seizureLedsDTO.ledId);
          let collaterals: Array<CollateralId> = [];
          if (this.isNonMortgage) {
            collaterals = collateral.map(it => {
              if (['6', '9'].includes(it.assetType || '')) {
                return {
                  assetId: Number(it.collateralId),
                  paymentMethod:
                    this.seizureLedsDTO.paymentMethod === 'E-FILING'
                      ? EFilingPaymentMethod.E_FILING
                      : EFilingPaymentMethod.NONE_E_FILING,
                } as CollateralId;
              } else {
                return {
                  assetId: Number(it.collateralId),
                  paymentMethod: EFilingCategory.includes(it.assetType || '')
                    ? EFilingPaymentMethod.E_FILING
                    : EFilingPaymentMethod.NONE_E_FILING,
                } as CollateralId;
              }
            });
          } else {
            collaterals = collateral.map(it => {
              if (['6', '9'].includes(it.assetType || '')) {
                return {
                  collateralId: coerceString(it.collateralId),
                  paymentMethod:
                    this.seizureLedsDTO.paymentMethod === 'E-FILING'
                      ? EFilingPaymentMethod.E_FILING
                      : EFilingPaymentMethod.NONE_E_FILING,
                } as CollateralId;
              } else {
                return {
                  collateralId: coerceString(it.collateralId),
                  paymentMethod: EFilingCategory.includes(it.collateralType || '')
                    ? EFilingPaymentMethod.E_FILING
                    : EFilingPaymentMethod.NONE_E_FILING,
                } as CollateralId;
              }
            });
          }

          await this.seizurePropertyService.addCollateral(seizureId, ledId, {
            collaterals: collaterals,
          } as SeizureCollateralsRequest);
          return Promise.resolve();
        }

        return Promise.reject('User unselelect new collateral');
      })
      .then(() => this.toast(`บันทึกทรัพย์สำเร็จแล้ว`))
      .then(() => this.collateralForm.markAsDirty())
      .then(() => this.reloadInfo());
  }

  async onUploadInvoice(): Promise<void> {
    const seizureUploadDialogConfig: DialogOptions = {
      component: SeizureUploadDialogComponent,
      title: 'บันทึกใบแจ้งการชำระเงินค่าธรรมเนียมตั้งเรื่องยึดทรัพย์',
      iconName: 'icon-Check',
      rightButtonLabel: 'ยืนยันชำระเงิน',
      buttonIconName: 'icon-Selected',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      context: {
        seizureLedId: coerceString(this.seizureLedsDTO.id),
        ledRefNo: this.ledRefForm.get('ledRefNo')?.value,
        ledRefNoDate: this.ledRefForm.get('ledRefNoDate')?.value,
        formControl: this.dialogCtrl,
      },
      cancelEvent: true,
      // disableRightButton: this.outOfPaymentTime || this.dialogCtrl.invalid,
    };

    await this.showSeizureUploadDialog(seizureUploadDialogConfig)
      .then(async response => {
        if (response && response.error) {
          await this.notificationService.alertDialog('ไม่สามารถอัปโหลดใบแจ้งการชำระเงินได้', response.error.message);
          return Promise.reject(response.error);
        } else if (!!response?.isCancel) {
          if (!!!this.dialogCtrl.value) {
            this.dialogCtrl.setValue(true);
            this.dialogCtrl.updateValueAndValidity();
          }
          // return Promise.reject('User has cancelled');
          return Promise.resolve();
        } else {
          return await this.showSeizureUploadEFiling().then(async ef => {
            if (!!ef?.isBack) {
              return Promise.resolve();
            } else if (!!ef?.isOption) {
              window.open(eFiling3_COJ, '_blank');
              return Promise.resolve();
            } else {
              return await this.showSeizureUploadReceipt();
            }
          });
        }
      })
      .then(() => this.documentForm.markAsDirty())
      .then(async () => {
        await this.reloadInfo();
      });
  }

  async showSeizureUploadDialog(config: DialogOptions) {
    return await this.notificationService.showCustomDialog(config);
  }

  async showSeizureUploadEFiling() {
    const dialogSetting: DialogOptions = {
      component: EFilingToReceiptDialogComponent,
      title: 'ชำระค่าธรรมเนียมตั้งเรื่องยึดทรัพย์เรียบร้อย',
      iconName: 'icon-Product-Selected',
      iconClass: 'icon-medium fill-krungthai-green',
      rightButtonLabel: 'LAWSUIT.SUIT.BTN_UPLOAD_CONFIRMED_DOC',
      optionBtnLabel: 'COMMON.LINK_TO_E_FILING_SITE',
      optionBtnIcon: 'icon-Expand',
      optionBtnClass: 'option-btn-blue',
      buttonIconName: 'icon-Arrow-Upload',
      backButtonLabel: 'ทำภายหลัง',
      backIconName: '',
      contentCssClasses: ['no-padding'],
      cancelEvent: true,
      autoFocus: false,
    };
    return this.notificationService.showCustomDialog(dialogSetting);
  }

  async showSeizureUploadReceipt(): Promise<void> {
    const seizureReceiptUploadConfig: DialogOptions = {
      component: SeizureUploadDialogReceiptComponent,
      title: 'อัปโหลดใบเสร็จรับเงิน',
      iconName: 'icon-Check',
      rightButtonLabel: 'COMMON.BUTTON_CONFIRM_UPLOAD_DOC',
      buttonIconName: 'icon-Checkmark-Circle-Regular',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      context: {
        seizureLedId: coerceString(this.seizureLedsDTO.id),
        formControl: this.dialogCtrl,
      },
      cancelEvent: true,
      disableRightButton: this.dialogCtrl.invalid,
    };

    return this.notificationService
      .showCustomDialog(seizureReceiptUploadConfig)
      .then(() => this.documentForm.markAsDirty())
      .then(() => this.reloadInfo());
  }

  refreshOrder(data: ICollateralMTable[]) {
    return data.map((d, i: number) => {
      d.orderNumber = (i + 1).toString();
      return { ...d };
    });
  }

  applyFilter(event: string) {
    // Reset Page to first page
    if (this.colPageData) {
      this.colPaginator?.firstPage();
    }
    const collateralType = coerceString(this.selectCollateralTypeControl.value, 'ALL');
    const collateralStatus = coerceString(this.selectCollateralStatusControl.value, 'ALL');
    this.collateralsSource.filter = JSON.stringify({
      collateralType: collateralType === 'ALL' ? null : collateralType,
      collateralStatus: collateralStatus === 'ALL' ? null : collateralStatus,
    });

    this.refreshOrder(this.collateralsSource.filteredData);
    // Update pagination
    this.colPageData.data = [...this.collateralsSource.filteredData];

    // Update table
    this.collateralsSource.filteredData = [...this.colPageData.data].slice(0, this.colPageData.pageSize);
  }

  sort(event: '1' | '2') {
    const isASC = event === '1';
    let data = [...this.collateralsSource.data];
    this.collateralsSource.data = data.sort((prev, cur) => {
      return compare(prev.collateralId, cur.collateralId, isASC);
    });
    this.applyFilter('');
  }

  sortByDocumentNo(event: '1' | '2') {
    const isASC = event === '1';
    let data = [...this.collateralsSource.data];
    this.collateralsSource.data = data.sort((prev, cur) => {
      return compare(prev.documentNo, cur.documentNo, isASC);
    });
    this.applyFilter('');
  }

  async onDeleteCollateral(element: ICollateralMTable) {
    if (this.seizureLedsDTO.seizureLedType !== SeizureLedTypes.MAIN && this.seizureLedsDTO.collaterals?.length === 1) {
      const title = `ไม่สามารถลบหรือแก้ไขทรัพย์ได้`;
      const msg = `ไม่สามารถลบหรือแก้ไขทรัพย์ได้ เนื่องจากต้องมีทรัพย์อย่างน้อย 1 รายการต่อสำนักงานบังคับคดี`;
      return this.notificationService.alertDialog(title, msg, 'COMMON.BUTTON_ACKNOWLEDGE');
    }

    const seizureLedId = coerceString(this.seizureLedsDTO.id);
    return this.notificationService
      .confirmRemoveLeftAlignedDialog(`ยืนยันลบทรัพย์`, `ต้องการยืนยันลบทรัพย์ที่เลือกออกจากสำนักงานบังคับคดีหรือไม่`, {
        rightButtonLabel: 'ยืนยันลบทรัพย์',
      })
      .then(async ok => {
        if (ok) {
          return await this.seizurePropertyService.removeCollateral(seizureLedId, element.collateralId);
        }

        return Promise.reject('User did not confirm for deletion');
      })
      .then(() => this.toast('ลบทรัพย์จากสำนักงานบังคับคดีแล้ว'))
      .then(() => this.collateralForm.markAsDirty())
      .then(() => this.reloadInfo());
  }

  async onEditCollateral(element: ICollateralMTable) {
    if (this.seizureLedsDTO.seizureLedType !== SeizureLedTypes.MAIN && this.seizureLedsDTO.collaterals?.length === 1) {
      const title = `ไม่สามารถลบหรือแก้ไขทรัพย์ได้`;
      const msg = `ไม่สามารถลบหรือแก้ไขทรัพย์ได้ เนื่องจากต้องมีทรัพย์อย่างน้อย 1 รายการต่อสำนักงานบังคับคดี`;
      return this.notificationService.alertDialog(title, msg, 'COMMON.BUTTON_ACKNOWLEDGE');
    }

    const seizureId = coerceString(this.seizureLedsDTO.seizureId);
    const seizureLedId = coerceString(this.seizureLedsDTO.id);
    const isForceSelectEFiling =
      EFilingCategory.includes(element.collateralType) || NoneEFilingCategory.includes(element.collateralType) || false;
    const selectedEFiling = isForceSelectEFiling
      ? EFilingCategory.includes(element.collateralType)
        ? EFilingPaymentMethod.E_FILING
        : EFilingPaymentMethod.NONE_E_FILING
      : null;
    let officeName = '';
    const context: AddLegalExecutionDepartmentContext = {
      offices: this.executionOffice.filter(i => i.value !== this.seizureLedsDTO.ledId),
      selectedEFiling: selectedEFiling,
      forceSelectEFiling: isForceSelectEFiling,
      selectedOffice: coerceNumberProperty(this.seizureLedsDTO.ledId),
    };

    return this.notificationService
      .showCustomDialog({
        context: context,
        component: AddLegalExecutionDepartmentComponent,
        type: 'large',
        autoWidth: false,
        panelCssClasses: ['custom-dialog-large'],
        title: `ย้ายเลขที่เอกสารสิทธิ์ ${element.documentNo} ไปที่สำนักงานบังคับคดี`,
        iconName: 'icon-Plus',
        rightButtonLabel: 'COMMON.BUTTON_CONFIRM',
        buttonIconName: 'icon-save-primary',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      })
      .then(async ({ selectedOffice }: AddLegalExecutionDepartmentResult) => {
        if (selectedOffice) {
          officeName = selectedOffice.text;
          let seizureMoveRequest: SeizureMoveRequest = {
            seizureLedId: Number(seizureLedId),
            newLedId: Number(coerceString(selectedOffice.value)),
          };
          if (this.isNonMortgage) {
            seizureMoveRequest = { ...seizureMoveRequest, assetId: Number(element.collateralId) };
          } else {
            seizureMoveRequest = { ...seizureMoveRequest, collateralId: element.collateralId };
          }

          return await this.seizurePropertyService.moveCollateral(seizureId, seizureMoveRequest);
        }

        return Promise.reject('User unselect office');
      })
      .then(() => this.toast(`ย้ายทรัพย์ ${element.documentNo} ไปยัง${officeName}แล้ว`))
      .then(() => this.collateralForm.markAsDirty())
      .then(() => this.reloadInfo());
  }

  onViewDetail(element: ICollateralMTable) {
    this.logger.info('onViewDetail :: ', element);
  }

  toast(msg: string, type: 'success' | 'error' = 'success') {
    return type == 'success'
      ? this.notificationService.openSnackbarSuccess(msg)
      : this.notificationService.openSnackbarError(msg);
  }

  async onSave() {
    let title = '';
    let msg = '';
    let officeName = '';
    let allCompleted = this.isAllMandatoryCompleted();

    // Check RefNo, Ref date are defined.
    if (this.ledRefForm.invalid) {
      this.ledRefForm.markAllAsTouched();
      this.ledRefForm.updateValueAndValidity();
    }

    if (allCompleted) {
      title = `ยืนยันบันทึกข้อมูล`;
      officeName = coerceString(this.seizureLedsDTO.ledName);
      msg = `ยืนยันบันทึกข้อมูลผลการยึดทรัพย์และเอกสารทั้งหมดของ<b>\n${officeName}</b> ครบถ้วนแล้ว\nและกดปุ่ม ‘ยืนยันบันทึกสำเร็จ’ เพื่อยืนยืนข้อมูล โดยข้อมูลที่ยืนยันบันทึกสำเร็จแล้วจะไม่สามารถกลับมาแก้ไขได้`;
    } else {
      // mandatory not completed
      title = 'มีข้อมูลที่ยังบันทึกไม่ครบถ้วน';
      msg =
        'มีเอกสารและผลการบันทึกทรัพย์ที่ยังบันทึกไม่ครบถ้วน โปรดกดปุ่ม\n"ยืนยันบันทึก" เพื่อบันทึกข้อมูล และกรุณากลับมาบันทึกต่อในภายหลัง';
    }
    await this.notificationService
      .warningDialog(title, msg, allCompleted ? 'ยืนยันบันทึกสำเร็จ' : 'ยืนยันบันทึก', 'icon-save-primary')
      .then(async ok => {
        if (ok) {
          try {
            await this.save();
            // refresh call taskDetail in case SeizureLED
            this.taskService.taskDetail = await this.taskService.inquiryTaskDetails(
              this.taskService.taskDetail.id || 0
            );
            this.logger.info('TASK DETAIL UPDATE STATUS :: ', this.taskService.taskDetail.statusName);
            this.form.markAsPristine();
            await this.reloadInfo();
            if (allCompleted) {
              this.onBack();
            }
          } catch (error) {
            this.seizurePropertyService.handleSaveError(error as HttpErrorResponse);
          }
        }
        return Promise.reject('User is cancelled the action');
      });
  }

  isAllMandatoryCompleted() {
    const eFiling = this.eFiling;
    const isRefNoSaved = !!this.seizureLedsDTO.ledRefNo;
    const isRefDateSaved = !!this.seizureLedsDTO.ledRefNoDate;
    const isFeePaid = eFiling ? this.seizureLedsDTO.isFeePaid : true;
    const isAllDocumentUploaded = (this.seizureLedsDTO.documents || [])
      .filter(it => it.documentTemplate?.optional === false)
      .every(it => !!it.imageId);
    const isAllCollateralCompleted = this.seizureLedsDTO.collaterals?.every(
      it => it.seizureResultFlag === true || it.seizureResultFlag === false
    );
    const seizureTimestampSaved =
      this.seizureLedsDTO.seizureTimestamp || this.seizureTimestampControl.value ? true : false;
    return (
      isRefNoSaved &&
      isRefDateSaved &&
      isAllDocumentUploaded &&
      isFeePaid &&
      isAllCollateralCompleted &&
      seizureTimestampSaved
    );
  }

  async save() {
    const val = this.form.getRawValue();
    const officeName = this.seizureLedsDTO.ledName;
    const seizureLedId = coerceString(this.seizureLedsDTO.id);
    const saveSuccessMsg = `${officeName} ยืนยันบันทึกสำเร็จแล้ว`;
    const seizureTimestamp = val.ledRefNo.seizureTimestamp ? val.ledRefNo.seizureTimestamp : undefined;
    const saveReq: PostSeizureInfoRequest = {
      newLedId: coerceNumberProperty(val.seizureLed.ledName),
      ledRefNo: !!val.ledRefNo.ledRefNo ? val.ledRefNo.ledRefNo : undefined,
      ledRefNoDate: val.ledRefNo.ledRefNoDate ? coerceString(val.ledRefNo.ledRefNoDate) : undefined,
      onsiteLawyerId: coerceString(val.ledRefNo.onSiteLawyerId),
      seizureTimestamp: seizureTimestamp,
    };

    await this.seizurePropertyService.saveSeizureLED(seizureLedId, saveReq);
    this.toast(saveSuccessMsg);
    this.form.markAsUntouched();
    if (this.isCompletedDoc108 && this.sendChannel) {
      const channel: DocumentReqOriginalChannelRequest = { channel: this.sendChannel };
      await this.seizurePropertyService.sendChannelSeizure(coerceString(this.seizureLedsDTO.id), channel);
    }
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    if (this.form.touched) {
      return this.notificationService
        .warningDialog(
          'มีข้อมูลที่ยังไม่ได้บันทึก',
          'มีการแก้ไขข้อมูลที่ยังไม่ได้ถูกบันทึก<br/>กรุณากด “ยืนยันบันทึก” ก่อน เพื่อย้อนกลับ',
          'COMMON.BUTTON_CONFIRM_SAVE',
          'icon-save-primary'
        )
        .then(async ok => {
          // CASE ok = true
          if (ok) {
            this.logger.info('SAVE AND BACK');
            try {
              await this.save();
              return true;
            } catch (error) {
              this.seizurePropertyService.handleSaveError(error as HttpErrorResponse);
              return false;
            }
          }
          // CASE ok = false
          return false;
        });
      // .then(() => this.form.markAsPristine())
      // .then(() => true);
    }

    return true;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.collateralsSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.collateralsSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ICollateralMTable): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.orderNumber + 1}`;
  }

  get successCount() {
    return this.collateralsSource.filteredData.length === 0
      ? 0
      : this.collateralsSource.filteredData.filter(it => it.seizureStatus === 'COMPLETED').length;
  }

  get failedCount() {
    return this.collateralsSource.filteredData.length === 0
      ? 0
      : this.collateralsSource.filteredData.filter(it => it.seizureStatus === 'FAILED').length;
  }

  /**
   * กดปุ่มคำสั่ง
   */
  onOrder() {
    if (this.selection.selected.length == 0) {
      const title = 'ไม่มีทรัพย์ให้ระบุ';
      const msg = 'กรุณาเลือกทรัพย์ในตารางพื่อระบุผลการยึดทรัพย์';
      return this.notificationService.alertDialog(title, msg, 'COMMON.BUTTON_ACKNOWLEDGE', 'icon-Check-Square');
    }

    return true;
  }

  /** คำสั่ง > เลือกยึดสำเร็จ */
  async onMarkSomeAsSuccess() {
    const selected = this.selection.selected;
    const seizureLedId = this.seizureLedId;
    let collateralIds = selected.map(it => it.collateralId);
    const someSelectedFailed = selected.some(it => it.seizureStatus === 'FAILED');
    const allSelectedSucces = selected.every(it => it.seizureStatus === 'COMPLETED');

    this.logger.info('onMarkSomeAsSuccess :: ', selected);

    if (selected.length === 0) {
      return;
    }

    const fillterSelectedPending = selected.filter(it => it.seizureStatus === 'PENDING').length;
    const fillterSelectedCompleted = selected.filter(it => it.seizureStatus === 'COMPLETED').length;
    const fillterSelectedFailed = selected.filter(it => it.seizureStatus === 'FAILED').length;
    const selectedPendingSuccesFailed =
      selected.length > 1 &&
      ((fillterSelectedPending > 0 && fillterSelectedCompleted > 0 && fillterSelectedFailed > 0) ||
        (fillterSelectedCompleted > 0 && fillterSelectedFailed > 0) ||
        (fillterSelectedPending > 0 && fillterSelectedFailed > 0));

    if (selectedPendingSuccesFailed) {
      // select item > 1 && มี PENDING / COMPLETED / FAILED ใน selected list
      const ok = await this.notificationService.confirm(
        `ยืนยันบันทึกยึดทรัพย์สำเร็จ ทั้งหมด ${selected.length}/${this.collateralsSource.data.length} รายการ`,
        `เนื่องจากทรัพย์ถูกบันทึกว่ายึดไม่สำเร็จ ${fillterSelectedFailed} รายการ<br>ต้องการแก้ไขเป็นยึดสำเร็จหรือไม่`,
        {
          rightButtonLabel: 'ยืนยันยึดสำเร็จ',
          leftButtonLabel: fillterSelectedPending === 0 ? 'COMMON.BUTTON_CANCEL' : 'เลือกเฉพาะทรัพย์ที่ยังไม่บันทึก',
          leftButtonClass: fillterSelectedPending === 0 ? 'long-button' : 'long-button stroked-border-gray',
          type: 'min_xsmall',
        }
      );

      if (fillterSelectedPending === 0 && !ok) {
        return;
      }
      if (fillterSelectedPending > 0 && !!!ok) {
        collateralIds = selected.filter(it => it.seizureStatus === 'PENDING').map(it => it.collateralId);
      }
    }

    if (allSelectedSucces) {
      // all selected are already marked success
      return await this.notificationService.alertDialog(
        'ทรัพย์บันทึกว่ายึดทรัพย์สำเร็จแล้ว',
        'ทรัพย์ถูกบันทึกว่ายึดสำเร็จเรียบร้อยแล้ว',
        'COMMON.BUTTON_ACKNOWLEDGE',
        'icon-Check-Square'
      );
    }

    // เลือกแค่ Failed no Pending
    if (someSelectedFailed && fillterSelectedPending === 0 && fillterSelectedCompleted === 0) {
      const ok = await this.notificationService.warningDialog(
        'ยืนยันบันทึกยึดทรัพย์สำเร็จ',
        'เนื่องจากทรัพย์ที่ถูกบันทึกว่ายึดไม่สำเร็จ<br>ต้องการแก้ไขเป็นยึดสำเร็จหรือไม่',
        'ยืนยันยึดสำเร็จ',
        'icon-Check-Square'
      );

      if (!ok) {
        return;
      }
    }
    return await this.seizurePropertyService
      .saveSeizureLedsCollaterals(seizureLedId, 'SUCCESS', collateralIds, false, undefined, '', this.isNonMortgage)
      .then(() => this.selection.clear())
      .then(() => this.collateralForm.markAsDirty())
      .then(() => this.toast('บันทึกผลยึดทรัพย์สำเร็จแล้ว'))
      .then(async () => await this.reloadInfo());
  }

  /**
   * เลือกยึดไม่สำเร็จ
   */
  async onMarkSomeAsFailed() {
    const selected = this.selection.selected;
    const seizureLedId = this.seizureLedId;
    let collateralIds = selected.map(it => it.collateralId);
    const someSelectedSuccess = selected.some(it => it.seizureStatus === 'COMPLETED');
    const allSelectedFailed = selected.every(it => it.seizureStatus === 'FAILED');
    let reasonId: number | undefined = undefined;
    let remark = '';

    this.logger.info('onMarkSomeAsFailed :: ', selected);

    if (selected.length === 0) {
      return;
    }

    const fillterSelectedPending = selected.filter(it => it.seizureStatus === 'PENDING').length;
    const fillterSelectedCompleted = selected.filter(it => it.seizureStatus === 'COMPLETED').length;
    const fillterSelectedFailed = selected.filter(it => it.seizureStatus === 'FAILED').length;
    const selectedPendingSuccess = selected.length > 1 && fillterSelectedPending > 0 && fillterSelectedCompleted > 0;
    const selectedPendingFailed = selected.length > 1 && fillterSelectedPending > 0 && fillterSelectedFailed > 0;

    if (allSelectedFailed) {
      // all selected are failed
      return this.notificationService.alertDialog(
        'ทรัพย์บันทึกว่ายึดทรัพย์ไม่สำเร็จแล้ว',
        'ทรัพย์ถูกบันทึกว่ายึดไม่สำเร็จเรียบร้อยแล้ว',
        'COMMON.BUTTON_ACKNOWLEDGE',
        'icon-Check-Square'
      );
    }

    // เลือกแค่ Success no Pending
    if (someSelectedSuccess && fillterSelectedPending === 0) {
      const ok = await this.notificationService.warningDialog(
        'ยืนยันบันทึกยึดทรัพย์ไม่สำเร็จ',
        `เนื่องจากทรัพย์ถูกบันทึกว่ายึดสำเร็จ ${fillterSelectedCompleted} รายการ<br>ต้องการแก้ไขเป็นยึดไม่สำเร็จหรือไม่`,
        'ยืนยันยึดไม่สำเร็จ',
        'icon-Check-Square'
      );
      if (!ok) {
        return;
      }
    }

    // เลือก Pending & Failed
    if (selectedPendingFailed) {
      const ok = await this.notificationService.confirm(
        `ยืนยันบันทึกยึดทรัพย์ไม่สำเร็จ ทั้งหมด ${selected.length}/${this.collateralsSource.data.length} รายการ`,
        `เนื่องจากทรัพย์ถูกบันทึกว่ายึดไม่สำเร็จ ${fillterSelectedFailed} รายการ<br>ต้องการแก้ไขเป็นยึดไม่สำเร็จหรือไม่`,
        {
          rightButtonLabel: 'ยืนยันยึดไม่สำเร็จ',
          leftButtonLabel: fillterSelectedPending === 0 ? 'COMMON.BUTTON_CANCEL' : 'เลือกเฉพาะทรัพย์ที่ยังไม่บันทึก',
          leftButtonClass: fillterSelectedPending === 0 ? 'long-button' : 'long-button stroked-border-gray',
          type: 'min_xsmall',
        }
      );
      if (fillterSelectedPending === 0 && !ok) {
        return;
      }
      if (fillterSelectedPending > 0 && !!!ok) {
        collateralIds = selected.filter(it => it.seizureStatus === 'PENDING').map(it => it.collateralId);
      }
    }

    // เลือก Pending & Success
    let isSelectSelectedPendingOnly = false;
    if (selectedPendingSuccess) {
      const ok = await this.notificationService.confirm(
        `ยืนยันบันทึกยึดทรัพย์ไม่สำเร็จ ทั้งหมด ${selected.length}/${this.collateralsSource.data.length} รายการ`,
        `เนื่องจากทรัพย์ถูกบันทึกว่ายึดสำเร็จ ${fillterSelectedCompleted} รายการ<br>ต้องการแก้ไขเป็นยึดไม่สำเร็จหรือไม่`,
        {
          rightButtonLabel: 'ยืนยันยึดไม่สำเร็จ',
          leftButtonLabel: fillterSelectedPending === 0 ? 'COMMON.BUTTON_CANCEL' : 'เลือกเฉพาะทรัพย์ที่ยังไม่บันทึก',
          leftButtonClass: fillterSelectedPending === 0 ? 'long-button' : 'long-button stroked-border-gray',
          type: 'min_xsmall',
        }
      );
      if (fillterSelectedPending === 0 && !ok) {
        return;
      }
      if (fillterSelectedPending > 0 && !!!ok) {
        collateralIds = selected.filter(it => it.seizureStatus === 'PENDING').map(it => it.collateralId);
        isSelectSelectedPendingOnly = true;
      }
    }

    // Provide reason to reject
    const result = await this.notificationService.showCustomDialog({
      component: ReasonComponent,
      title: `เหตุผลยึดทรัพย์ไม่สำเร็จ ทั้งหมด ${
        isSelectSelectedPendingOnly ? collateralIds.length : selected.length
      }/${this.collateralsSource.data.length} รายการ`,
      type: 'large',
      autoWidth: false,
      hideIcon: true,
      panelCssClasses: ['custom-dialog-large'],
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'COMMON.BUTTON_SAVE',
      buttonIconName: 'icon-save-primary',
    });

    if (!result) {
      return;
    }

    reasonId = result.reason;
    remark = result.remark;
    return await this.seizurePropertyService
      .saveSeizureLedsCollaterals(seizureLedId, 'FAILED', collateralIds, false, reasonId, remark, this.isNonMortgage)
      .then(() => this.selection.clear())
      .then(() => this.collateralForm.markAsDirty())
      .then(() => this.toast('บันทึกผลยึดทรัพย์สำเร็จแล้ว'))
      .then(async () => await this.reloadInfo());
  }

  /**
   * เลือกยึดสำเร็จทั้งหมด
   * @returns
   */
  async markAllAsSuccess() {
    const selected = this.collateralsSource.data;
    const allSelectedSuccess = selected.every(it => it.seizureStatus === 'COMPLETED');
    const allSelectedPending = selected.every(it => it.seizureStatus === 'PENDING');
    const seizureLedId = this.seizureLedId;
    let colaterals: string[] = [];
    let isSelectSelectedPendingOnly = false;

    this.logger.info('markAllAsSuccess :: ', selected);

    if (selected.length === 0) {
      return;
    } else {
      // select all for each seizureStatus
      // All Pending
      if (allSelectedPending) {
        const ok = await this.notificationService.warningDialog(
          'ยืนยันยึดทรัพย์สำเร็จทั้งหมด',
          `ต้องการยืนยัน “ยึดทรัพย์สำเร็จทุกรายการ” ทั้งหมด ${selected.length}/${this.collateralsSource.data.length} รายการ หรือไม่`,
          'ยืนยัน'
        );
        if (!ok) {
          return;
        }
      } else if (allSelectedSuccess) {
        // All Success
        return this.notificationService.alertDialog(
          'ทรัพย์บันทึกว่ายึดทรัพย์สำเร็จแล้ว',
          'ทรัพย์ถูกบันทึกว่ายึดสำเร็จเรียบร้อยแล้ว',
          'COMMON.BUTTON_ACKNOWLEDGE',
          'icon-Check-Square'
        );
      } else {
        const fillterSelectedPending = selected.filter(it => it.seizureStatus === 'PENDING').length;
        const ok = await this.notificationService.confirm(
          'ยืนยันบันทึกยึดทรัพย์สำเร็จทั้งหมด',
          'เนื่องจากมีบางทรัพย์ที่ถูกบันทึกว่ายึดไม่สำเร็จ<br>ต้องการแก้ไขเป็นยึดสำเร็จทั้งหมดหรือไม่',
          {
            rightButtonLabel: 'ยืนยันยึดสำเร็จทั้งหมด',
            leftButtonLabel: fillterSelectedPending === 0 ? 'COMMON.BUTTON_CANCEL' : 'เลือกเฉพาะทรัพย์ที่ยังไม่บันทึก',
            leftButtonClass: fillterSelectedPending === 0 ? 'long-button' : 'long-button stroked-border-gray',
            type: 'min_xsmall',
          }
        );
        if (fillterSelectedPending === 0 && !ok) {
          return;
        }
        if (fillterSelectedPending > 0 && !!!ok) {
          colaterals = selected.filter(it => it.seizureStatus === 'PENDING').map(it => it.collateralId);
          isSelectSelectedPendingOnly = true;
        }
      }
    }

    if (this.isNonMortgage && !isSelectSelectedPendingOnly) {
      colaterals = selected.map(it => it.collateralId);
    }

    return await this.seizurePropertyService
      .saveSeizureLedsCollaterals(
        seizureLedId,
        'SUCCESS',
        colaterals,
        !isSelectSelectedPendingOnly,
        undefined,
        '',
        this.isNonMortgage
      )
      .then(() => this.selection.clear())
      .then(() => this.collateralForm.markAsDirty())
      .then(() => this.toast('บันทึกผลยึดทรัพย์สำเร็จแล้ว'))
      .then(async () => await this.reloadInfo());
  }

  /**
   * เลือกยึดไม่สำเร็จทั้งหมด
   * @returns
   */
  async markAllAsFaild() {
    const selected = this.collateralsSource.data;
    const allSelectedFailed = selected.every(it => it.seizureStatus === 'FAILED');
    const allSelectedPending = selected.every(it => it.seizureStatus === 'PENDING');
    const total = this.collateralsSource.data.length;
    const seizureLedId = this.seizureLedId;
    let reasonId: number | undefined = undefined;
    let remark = '';
    let colaterals: string[] = [];
    let isSelectSelectedPendingOnly = false;

    this.logger.info('markAllAsFaild :: ', selected);

    if (selected.length === 0) {
      return;
    } else {
      // select all for each seizureStatus
      // All Pending
      if (allSelectedPending) {
        const ok = await this.notificationService.warningDialog(
          'ยืนยันยึดทรัพย์ไม่สำเร็จทั้งหมด',
          `ต้องการยืนยัน “ยึดทรัพย์ไม่สำเร็จทุกรายการ” ทั้งหมด ${selected.length}/${this.collateralsSource.data.length} รายการ หรือไม่`,
          'ยืนยัน'
        );
        if (!ok) {
          return;
        }
      } else if (allSelectedFailed) {
        return this.notificationService.alertDialog(
          'ทรัพย์บันทึกว่ายึดทรัพย์ไม่สำเร็จแล้ว',
          'ทรัพย์ถูกบันทึกว่ายึดไม่สำเร็จเรียบร้อยแล้ว',
          'COMMON.BUTTON_ACKNOWLEDGE',
          'icon-Check-Square'
        );
      } else {
        const fillterSelectedPending = selected.filter(it => it.seizureStatus === 'PENDING').length;
        const ok = await this.notificationService.confirm(
          'ยืนยันบันทึกยึดทรัพย์ไม่สำเร็จทั้งหมด',
          'เนื่องจากมีบางทรัพย์ที่ถูกบันทึกว่ายึดสำเร็จ<br>ต้องการแก้ไขเป็นยึดไม่สำเร็จทั้งหมดหรือไม่',
          {
            rightButtonLabel: 'ยืนยันยึดไม่สำเร็จทั้งหมด',
            leftButtonLabel: fillterSelectedPending === 0 ? 'COMMON.BUTTON_CANCEL' : 'เลือกเฉพาะทรัพย์ที่ยังไม่บันทึก',
            leftButtonClass: fillterSelectedPending === 0 ? 'long-button' : 'long-button stroked-border-gray',
            type: 'min_xsmall',
          }
        );

        if (fillterSelectedPending === 0 && !ok) {
          return;
        }
        if (fillterSelectedPending > 0 && !!!ok) {
          colaterals = selected.filter(it => it.seizureStatus === 'PENDING').map(it => it.collateralId);
          isSelectSelectedPendingOnly = true;
        }
      }
    }

    // Provide reason to reject
    const result = await this.notificationService.showCustomDialog({
      component: ReasonComponent,
      title: `เหตุผลยึดทรัพย์ไม่สำเร็จ ทั้งหมด ${
        isSelectSelectedPendingOnly ? colaterals.length : selected.length
      }/${total} รายการ`,
      type: 'large',
      autoWidth: false,
      panelCssClasses: ['custom-dialog-large'],
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'COMMON.BUTTON_SAVE',
      buttonIconName: 'icon-save-primary',
    });

    if (!result) {
      return;
    }

    reasonId = result.reason;
    remark = result.remark;

    if (this.isNonMortgage && !isSelectSelectedPendingOnly) {
      colaterals = selected.map(it => it.collateralId);
    }

    return await this.seizurePropertyService
      .saveSeizureLedsCollaterals(
        seizureLedId,
        'FAILED',
        colaterals,
        !isSelectSelectedPendingOnly,
        reasonId,
        remark,
        this.isNonMortgage
      )
      .then(() => this.selection.clear())
      .then(() => this.collateralForm.markAsDirty())
      .then(() => this.toast('บันทึกผลยึดทรัพย์สำเร็จแล้ว'))
      .then(async () => await this.reloadInfo());
  }

  getReasonTooltip(id: any) {
    return reasonOption.find(i => i.value === id)?.text || '';
  }

  /**
   * กดไอคอน Reason ในตารางทรัพย์ภายใต้บังคับคดี
   * @param element
   * @returns
   */
  onSelectReasonIcon(element: ICollateralMTable) {
    if (element.seizureStatus === 'FAILED') {
      // all selected are pending, show reason dialog
      const reason = element.reason;
      const remark = element.remark;
      const seizureLedId = this.seizureLedId;
      const collateralId = element.collateralId;
      let title = `เหตุผลยึดทรัพย์ไม่สำเร็จ ทรัพย์ ${element.collateralId}`;
      if (this.isNonMortgage) {
        const title = `เหตุผลยึดทรัพย์ไม่สำเร็จ ทรัพย์ ${element.documentNo}`;
      }

      return this.notificationService
        .showCustomDialog({
          component: ReasonComponent,
          title: title,
          type: 'large',
          autoWidth: false,
          panelCssClasses: ['custom-dialog-large'],
          leftButtonLabel: 'COMMON.BUTTON_CANCEL',
          rightButtonLabel: 'COMMON.BUTTON_SAVE',
          buttonIconName: 'icon-save-primary',
          context: { reason, remark },
        })
        .then(result => {
          if (!result) {
            return Promise.reject('User has cancelled');
          }

          element.remark = result.remark;
          element.reason = result.reason;

          return {
            reasonId: result.reason,
            remark: result.remark,
          };
        })
        .then(({ reasonId, remark }) =>
          this.seizurePropertyService.saveSeizureLedsCollaterals(
            seizureLedId,
            'FAILED',
            [collateralId],
            false,
            reasonId,
            remark,
            this.isNonMortgage
          )
        )
        .then(() => this.toast('บันทึกผลยึดทรัพย์แล้ว'))
        .then(() => this.collateralForm.markAsDirty())
        .then(() => this.selection.clear())
        .then(() => this.reloadInfo());
    }

    return;
  }

  async onDownloadDocument(ele: any) {
    const response: any = await this.documentService.getDocument(ele.imageId || '', ele.imageSource);
    if (!response) return;
    this.documentService.openPdf(response, ele.imageName);
  }

  onPaging(e: PageEvent) {
    this.collateralsSource.filteredData = this.colPageData.data.slice(e.startLabel ? e.startLabel - 1 : 0, e.fromLabel);
  }

  toggleSendChannel(element: any) {
    this.sendChannel = element.target.checked
      ? DocumentReqOriginalChannelRequest.ChannelEnum.Post
      : DocumentReqOriginalChannelRequest.ChannelEnum.Self;
  }

  /**
   * Get seizure status base on flag = bool | undefined
   * @param flag
   * @returns
   */
  private _getSeizureStatus(flag: boolean | null | undefined): 'PENDING' | 'COMPLETED' | 'FAILED' {
    if (flag === undefined || flag === null) return 'PENDING';
    if (flag === true) return 'COMPLETED';
    if (flag === false) return 'FAILED';
    return 'PENDING';
  }

  enableSeizureTimestamp() {
    if (!this.seizureLedsDTO.paymentMethod) return;
    if (this.eFiling && !this.seizureLedsDTO.isFeePaid) return;
    if (this.eFiling && !this.seizureLedsDTO.feePaidTimestamp) return;

    const eFilingPaymentMethod = this.seizureLedsDTO.paymentMethod;
    const allDocumentUploaded = this.seizureLedsDTO.documents
      ?.filter(i => !!!i.documentTemplate?.optional)
      ?.every(it => !!it.imageId);
    const control = this.seizureTimestampControl;
    const value = control.value || null;
    const today = new Date();

    if (!allDocumentUploaded) {
      return;
    }

    if (eFilingPaymentMethod === EFilingPaymentMethodDesc.E_FILING && this.seizureLedsDTO.feePaidTimestamp) {
      this.minDate = new Date(this.seizureLedsDTO.feePaidTimestamp);
      this.maxDate = today;
    }

    if (eFilingPaymentMethod === EFilingPaymentMethodDesc.NONE_E_FILING) {
      this.minDate = null;
      this.maxDate = today;
    }

    control.enable();
    control.setValidators(Validators.required);
    control.updateValueAndValidity();
    control.reset(value);
  }

  loadReceiptTable() {
    if (this.receipt && this.seizureLedsDTO.paymentMethod === EFilingPaymentMethodDesc.NONE_E_FILING) {
      const document = this.receipt.receiptDocumentDto;
      this.receipt.amount = this.receipt.amount || 0;
      this.receiptSource.data = [
        {
          orderNumber: 1,
          documentName: document?.documentTemplate?.documentName,
          receiveDate: document?.documentDate,
          action: {
            uploaded: document?.imageId ? true : false,
            deletable: document?.imageId ? true : false,
            hidden: false,
            disabled: false,
          },
          imageId: document?.imageId,
        },
      ];
    }
  }

  disableUploadReceipt() {
    this.receiptColumn = this.receiptColumn.filter(feild => feild !== 'action');
  }

  async onDownload(ele: any) {
    if (ele.action.uploaded) {
      const imageId = ele.imageId;
      const response = await this.pdfService.getDocument(imageId, DocumentDto.ImageSourceEnum.Lexs);
      this.pdfService.openPdf(response, ele.documentName);
    }
  }

  async onClickAssetDocuments(element: any) {
    const documentList: IUploadMultiFile[] = (element.assetDocuments ?? []).map((dto: any) => {
      return {
        ...dto,
        uploadDate: dto.uploadTimestamp,
      } as IUploadMultiFile;
    });

    const context = {
      documentList,
    };
    await this.notificationService.showCustomDialog({
      component: DocumentListDialogComponent,
      type: 'large',
      iconName: 'icon-Document-Text',
      title: 'AUCTION_DETAIL.AUCTION_PAYMENT.DOCUMENT_LIST',
      rightButtonLabel: 'COMMON.BUTTON_ACKNOWLEDGE',
      buttonIconName: 'icon-Selected',
      context: context,
      autoWidth: false,
    });
  }
}
