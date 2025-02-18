import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { BatchDataDto, TaskStatusValue } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig, DropdownComponent, ExtendNameValuePair, NameValuePair } from '@spig/core';
import moment from 'moment';
import {
  AdvanceSearchConditionRequest,
  ExpenseSearchConditionRequest,
  ProfileDirectSearchConditionRequest,
  ReceiptKcorpSearchConditionRequest,
  ReceiptSearchConditionRequest,
  SearchConditionRequest,
  SearchTemplate,
  SummaryReimburseType1SearchConditionRequest,
  SummaryReimburseType2SearchConditionRequest,
} from './search-controller.model';
import { SearchControllerService } from './search-controller.service';

@Component({
  selector: 'app-search-controller',
  templateUrl: './search-controller.component.html',
  styleUrls: ['./search-controller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchControllerComponent implements OnInit {
  @ViewChild('responseUnitRef', { static: false }) responseUnitRef?: ElementRef;

  @Input() template: SearchTemplate = 'NORMAL';

  @Input() searchType: SearchConditionRequest.TypeEnum = 'BY_TASK';
  @Input() searchPlaceholderOverride: string | undefined;
  @Input() advancedSearchButtonTextOverride: string | undefined;

  public _condition!: SearchConditionRequest | any;
  @Input()
  set condition(value: SearchConditionRequest | any) {
    this._condition = value;
  }

  @Input() isAdvance: boolean = false;

  @Input()
  set reload(value: boolean) {
    if (!!value && this.searchCtrl) {
      this.resetSearchControl();
      this.setDefaultSearch();
    }
  }

  @Output() searchEvent = new EventEmitter<SearchConditionRequest | any>();

  private defaultConfig: DropDownConfig = {
    defaultValue: 'N/A',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
  };

  /** search control */
  public searchCtrl!: UntypedFormGroup;
  public searchMode: SearchConditionRequest.ModeEnum = 'LIST';
  public placeholder: string = 'SEARCH_CONTROL.PLACEHOLDER_ADDITIONAL';
  public placeholderText: string = 'SEARCH_CONTROL.PLACEHOLDER_ADDITIONAL';

  /** normal search */
  public statusConfig: DropDownConfig = this.defaultConfig;
  public legalStatusConfig: DropDownConfig = this.defaultConfig;
  public statusOptions: NameValuePair[] | TaskStatusValue[] = [];
  public legalStatusOptions: NameValuePair[] = [];
  public typesConfig: DropDownConfig = {
    defaultValue: 'N/A',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
  };
  public typesOptions: NameValuePair[] = [];
  public lawyerConfig: DropDownConfig = this.defaultConfig;
  public lawyerOptions: NameValuePair[] = [];
  public amdUnitConfig: DropDownConfig = this.defaultConfig;
  public amdUnitOptions: NameValuePair[] = this.searchControllerService.amdUnitOptions;
  public ledConfig: DropDownConfig = this.defaultConfig;
  public ledOptions: NameValuePair[] = [];

  /* collateral search */
  public collateralTypeConfig: DropDownConfig = {
    defaultValue: 'N/A',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_COLLATERAL_TYPES',
  };
  public collateralTypeOptions: NameValuePair[] = this.searchControllerService.collateralTypeOptions;

  public collateralSubTypeConfig: DropDownConfig = {
    defaultValue: 'N/A',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_COLLATERAL_SUB_TYPES',
  };
  public collateralSubTypeOptions: NameValuePair[] = this.searchControllerService.collateralSubTypeOptions;

  /** financial search */
  public expenseNoConfig: DropDownConfig = {
    defaultValue: 'N/A',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_EXPENSE_NO',
  };
  public expenseNoOptions: NameValuePair[] = this.searchControllerService.expenseNoOptions;

  public expenseStatusConfig: DropDownConfig = {
    defaultValue: 'N/A',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_EXPENSE_STATUS',
  };
  public expenseStatusOptions: NameValuePair[] = this.searchControllerService.expenseStatusOptions;

  public advancePaymentNoConfig: DropDownConfig = {
    defaultValue: 'N/A',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_ADVANCE_PAYMENT_NO',
  };
  @Input() advancePaymentNoOptions: NameValuePair[] = [];

  public advancePaymentStatusConfig: DropDownConfig = {
    defaultValue: 'N/A',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_EXPENSE_STATUS',
  };
  public advancePaymentStatusOptions: NameValuePair[] = this.advancePaymentNoOptions.map(item => {
    if (item.value !== 'N/A') item.name = item.value;
    return item;
  });

  public userMultiConfig: DropDownConfig = {
    isMultiple: true,
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_USER',
  };
  public userMultiOptions: NameValuePair[] = this.searchControllerService.userOptions.filter(i => i.value !== 'N/A');
  public userConfig: DropDownConfig = {
    defaultValue: 'N/A',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_USER',
  };
  public userOptions: NameValuePair[] = this.searchControllerService.userOptions;
  public makerOptions: NameValuePair[] = this.searchControllerService.makerOptions;

  public makerConfig: DropDownConfig = {
    defaultValue: 'N/A',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_MAKERS',
  };

  public receiptNoConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_RECEIPT_NO',
  };
  @Input() receiptNoOptions: NameValuePair[] = [];

  public receiptTypeConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_RECEIPT_TYPE',
  };
  public receiptTypeOptions: NameValuePair[] = this.searchControllerService.receiptTypeOptions;

  public receiptStatusConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_RECEIPT_STATUS',
  };
  @Input() receiptStatusOptions: NameValuePair[] = [];

  public kcorpWashAccountConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_RECEIPT_NO',
  };
  public kcorpWashAccountOptions: NameValuePair[] = this.searchControllerService.washAccountOptions;

  public kcorpTransferStatusConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_RECEIPT_TYPE',
  };
  public kcorpTransferStatusOptions: NameValuePair[] = this.searchControllerService.transferStatusOptions;

  /* summary reimbursement configs & options */
  public expenseStepTypeConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_CASE_TYPE',
  };
  public expenseStepTypeOptions: NameValuePair[] = this.searchControllerService.expenseStepTypeOptions;

  public financialObjectTypeConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_TRANSACTION_TYPE',
  };
  public financialObjectTypeOptions: NameValuePair[] = this.searchControllerService.financialObjectTypeOptions;

  @ViewChild('financialAccountTypeDropdown') financialAccountTypeDropdown!: DropdownComponent;
  public financialAccountTypeConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    isMultiple: true,
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_ACCOUNT_TYPE',
  };
  public financialAccountTypeOptions: NameValuePair[] = this.searchControllerService.financialAccountTypeOptions;

  public financialAccountCodeConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_ACCOUNT_CODE',
  };
  public financialAccountCodeOptions: NameValuePair[] = this.searchControllerService.financialAccountCodeOptions;

  public lgIdConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'COMMON.LABEL_LG_ID',
  };
  @Input() lgIdOptions: NameValuePair[] = [];

  public financialAccountTypeExpenseConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    isMultiple: true,
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_ACCOUNT_TYPE_EXPENSE',
  };
  public financialAccountTypeExpenseOptions: NameValuePair[] =
    this.searchControllerService.financialAccountTypeExpenseOptions;

  /* profile direct search */
  public accountDataTypeConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_ACCOUNT_DATA_TYPE',
  };
  @Input() accountDataTypeOptions!: NameValuePair[];

  public accountNoConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.LABEL_ALL_ACCOUNT_NO',
  };
  @Input() accountNoOptions!: ExtendNameValuePair[];
  @Input() accountNoOutstandingOptions!: ExtendNameValuePair[];
  @Input() enableLookUpBtn: boolean = true;

  /** advance search */
  public lgStatusConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.PLACEHOLDER_LG_STATUS',
  };
  public lgStatusOptions: NameValuePair[] = this.searchControllerService.lgStatusOptions;

  public caseStatusConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.PLACEHOLDER_CASE_STATUS',
  };
  public caseStatusOptions: NameValuePair[] = this.searchControllerService.caseStatusOptions;

  public searchScopeConfig: DropDownConfig = {
    defaultValue: 'N/A',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.PLACEHOLDER_SEARCH_SCOPE',
  };
  public searchScopeOptions: NameValuePair[] = this.searchControllerService.searchScopeOptions;

  public responseUnitConfig: DropDownConfig = {
    defaultValue: 'N/A',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.PLACEHOLDER_RESPONSE_UNIT',
  };
  public responseUnitOptions: NameValuePair[] = this.searchControllerService.responseUnitOptions;
  public responseUnitOptionsAdvanced: NameValuePair[] = [...this.searchControllerService.responseUnitOptions];

  public orgCodeConfig: DropDownConfig = {
    defaultValue: 'N/A',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.PLACEHOLDER_ORG_CODE',
  };
  public orgCodeOptions: NameValuePair[] = this.searchControllerService.orgCodeOptions;

  public loanTypeConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.PLACEHOLDER_LOAD_TYPE',
  };
  public loanTypeOptions: NameValuePair[] = this.searchControllerService.loanTypeOptions;

  public debtorConfig: DropDownConfig = {
    defaultValue: 'N/A',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.PLACEHOLDER_DEBTOR',
  };
  public debtorOptions: NameValuePair[] = this.searchControllerService.debtorOptions;

  public samFlagConfig: DropDownConfig = {
    defaultValue: 'N/A',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.PLACEHOLDER_SAM_FLAG',
  };
  public samFlagOptions: NameValuePair[] = this.searchControllerService.samFlagOptions;

  public tamcFlagConfig: DropDownConfig = {
    defaultValue: 'N/A',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.PLACEHOLDER_TAMC_FLAG',
  };
  public tamcFlagOptions: NameValuePair[] = this.searchControllerService.tamcFlagOptions;

  public writeOffStatusConfig: DropDownConfig = {
    defaultValue: 'N/A',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.PLACEHOLDER_WRITEOFF_STATUS',
  };
  public writeOffStatusOptions: NameValuePair[] = this.searchControllerService.writeOffStatusOptions;

  public debtTransferToConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.PLACEHOLDER_DEBT_TRANSFER_TO',
  };
  public debtTransferToOptions: NameValuePair[] = this.searchControllerService.debtTransferToOptions;

  public caseCreatorConfig: DropDownConfig = {
    defaultValue: 'APPROVER',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.PLACEHOLDER_CASE_CREATOR',
  };
  public caseCreatorOptions: NameValuePair[] = this.searchControllerService.caseCreatorOptions;

  public courtConfig: DropDownConfig = {
    defaultValue: 'N/A',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'SEARCH_CONTROL.PLACEHOLDER_COURT',
  };
  public courtOptions: NameValuePair[] = this.searchControllerService.courtOptions;

  public currentDate: Date = new Date();

  private readonly isRestrictedDateRange: boolean = true;
  public minStratDateProfileDirect: Date | null = this.isRestrictedDateRange
    ? moment().subtract(1, 'years').toDate()
    : null;
  public maxStratDateProfileDirect: Date | null = this.isRestrictedDateRange ? moment().toDate() : null;
  public minEndDateProfileDirect: Date | null = this.isRestrictedDateRange
    ? moment().subtract(1, 'years').toDate()
    : null;
  public maxEndDateProfileDirect: Date | null = this.isRestrictedDateRange ? moment().toDate() : null;
  private isAccountOD: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private searchControllerService: SearchControllerService,
    private masterDataService: MasterDataService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    /** init search options */
    //edited later
    switch (this.searchType) {
      case 'BY_TASK':
        this.statusOptions = this.searchControllerService.taskStatusOptions;
        this.typesOptions = this.searchControllerService.typesOptions;
        this.placeholderText = 'SEARCH_CONTROL.PLACEHOLDER_ADDITIONAL_TASK';
        break;
      case 'BY_CUSTOMER':
        this.statusOptions = this.searchControllerService.customerStatusOptions;
        break;
      case 'BY_LAWSUIT':
        this.legalStatusOptions = this.searchControllerService.legalStatusOptions;
        /* เอา lawyer เฉพาะ name ที่ขึ้นต้นด้วย 'K' หรือ 'k' */
        this.lawyerOptions = this.searchControllerService.lawyerOptions;
        break;
      case 'BY_LAWSUIT_LED':
        this.legalStatusOptions = this.searchControllerService.legalStatusOptions;
        this.ledOptions = this.searchControllerService.ledOptions;
        this.placeholderText = 'SEARCH_CONTROL.PLACEHOLDER_ADDITIONAL_LAWSUIT_LED';
        break;
      case 'BY_FINANCE_EXPENSE':
        this.expenseNoOptions = this.searchControllerService.expenseNoOptions;
        this.expenseStatusOptions = this.searchControllerService.expenseStatusOptions;
        this.userOptions = this.searchControllerService.userOptions;
        this.placeholderText = 'SEARCH_CONTROL.PLACEHOLDER_ADDITIONAL_FINANCIAL';
        break;
      case 'BY_FINANCE_DASHBOARD':
        this.legalStatusOptions = this.searchControllerService.legalStatusOptions;
        this.searchControllerService.expenseStatusOptions[0].name = this.translate.instant(
          'SEARCH_CONTROL.LABEL_ALL_EXPENSE_STATUS_DASHBOARD'
        );
        this.expenseStatusOptions = this.searchControllerService.expenseStatusOptions;
        this.makerOptions = this.searchControllerService.makerOptions;
        this.makerOptions.push({
          name: 'System',
          value: 'System',
        });
        this.placeholderText = 'SEARCH_CONTROL.PLACEHOLDER_ADDITIONAL_FINANCIAL_DASHBOARD';
        break;
      case 'BY_FINANCE_RECEIPT':
        this.placeholderText = 'SEARCH_CONTROL.PLACEHOLDER_ADDITIONAL_FINANCIAL_RECEIPT';
        break;
      case 'BY_FINANCE_ADVANCE':
        this.advancePaymentStatusOptions = this.searchControllerService.advancePaymentStatusOptions;
        this.userOptions = this.searchControllerService.userOptions;
        break;
      case 'BY_COLLATERAL':
        this.legalStatusOptions = this.searchControllerService.legalStatusOptions;
        this.placeholderText = 'SEARCH_CONTROL.PLACEHOLDER_ADDITIONAL_LAWSUIT_LED';
    }
    /** init search control */
    this.searchCtrl = this.initSearchControl(this._condition);
    // BY_FINANCE_RECEIPT
    this.searchType === 'BY_FINANCE_RECEIPT' &&
      this.searchCtrl.get('beginCreateDate')?.valueChanges.subscribe(value => value && this.onSearch());
    this.searchType === 'BY_FINANCE_RECEIPT' &&
      this.searchCtrl.get('endCreateDate')?.valueChanges.subscribe(value => value && this.onSearch());
    // BY_FINANCE_RECEIPT
    this.searchType === 'BY_FINANCE_RECEIPT_KCORP' &&
      this.searchCtrl.get('beginTransferMonth')?.valueChanges.subscribe(value => value && this.onSearch());
    this.searchType === 'BY_FINANCE_RECEIPT_KCORP' &&
      this.searchCtrl.get('endTransferMonth')?.valueChanges.subscribe(value => value && this.onSearch());

    /* search placeholder override: for search controllers that are basically the same, just
    a with different placeholder */
    if (this.searchPlaceholderOverride) this.placeholderText = this.searchPlaceholderOverride;
    this.placeholder = this.placeholderText;

    /** Override response unit placeholder and first option in advanced search */
    this.responseUnitOptionsAdvanced = (
      [
        {
          name: this.translate.instant('SEARCH_CONTROL.PLACEHOLDER_RESPONSE_UNIT'),
          value: undefined,
        },
      ] as NameValuePair[]
    ).concat(this.responseUnitOptionsAdvanced.slice(1, this.responseUnitOptionsAdvanced.length));
  }

  resetSearchControl(ignoreNames?: string[]) {
    const controlNames = [
      'accountNo',
      'billNo',
      'blackCaseId',
      'caseCreator',
      'caseStatus',
      'citizenId',
      'court',
      'customerId',
      'customerName',
      'customerSurname',
      'debtTransferTo',
      'debtor',
      'kbdId',
      'litigationCloseStatus',
      'litigationId',
      'loanType',
      'orgCode',
      'ownerId',
      'redCaseId',
      'roomNo',
      'samFlag',
      'searchMode',
      'searchScope',
      'searchString',
      'sortBy',
      'sortOrder',
      'tab',
      'tamcFlag',
      'writeOffStatus',
    ];
    for (const element of controlNames) {
      if (ignoreNames && !ignoreNames.includes(element)) {
        if (element === 'sortBy') {
          this.searchCtrl.get(element)?.setValue(['customerId']);
        } else if (element === 'searchMode') {
          this.searchCtrl.get(element)?.setValue(SearchConditionRequest.ModeEnum.List);
        } else if (element === 'sortOrder') {
          this.searchCtrl.get(element)?.setValue('ASC');
        } else if (element === 'tab') {
          this.searchCtrl.get(element)?.setValue('USER');
        } else if (['loanType', 'debtTransferTo'].includes(element)) {
          this.searchCtrl.get(element)?.setValue(null);
        } else {
          this.searchCtrl.get(element)?.setValue('');
        }
        this.searchCtrl.get(element)?.updateValueAndValidity();
      }
    }
  }

  // edited later
  initSearchControl(
    condition?:
      | SearchConditionRequest
      | ExpenseSearchConditionRequest
      | ReceiptSearchConditionRequest
      | ReceiptKcorpSearchConditionRequest
      | AdvanceSearchConditionRequest
      | SummaryReimburseType1SearchConditionRequest
      | SummaryReimburseType2SearchConditionRequest
      | SummaryReimburseType1SearchConditionRequest
  ) {
    if (this.template === 'FINANCE_EXPENSE') {
      return this.fb.group({
        expenseNo: (condition as ExpenseSearchConditionRequest)?.expenseNo || 'N/A',
        expenseStatus: (condition as ExpenseSearchConditionRequest)?.expenseStatus || 'N/A',
        assigneeId: (condition as ExpenseSearchConditionRequest)?.assigneeId || [],
        searchString: [(condition as ExpenseSearchConditionRequest)?.searchString || null, Validators.minLength(3)],
        successPaymentDate: (condition as any)?.successPaymentDate || null,
      });
    } else if (this.template === 'FINANCE_RECEIPT') {
      return this.fb.group({
        receiveNo: (condition as ReceiptSearchConditionRequest)?.receiveNo || 'N/A',
        receiveStatus: (condition as ReceiptSearchConditionRequest)?.receiveStatus || 'N/A',
        receiveType: (condition as ReceiptSearchConditionRequest)?.receiveType || 'N/A',
        searchString: [(condition as ReceiptSearchConditionRequest)?.searchString || null, Validators.minLength(3)],
        beginCreateDate: (condition as ReceiptSearchConditionRequest)?.beginCreateDate || null,
        endCreateDate: (condition as ReceiptSearchConditionRequest)?.endCreateDate || null,
      });
    } else if (this.template === 'FINANCE_DASHBOARD') {
      return this.fb.group({
        expenseStatus: (condition as ExpenseSearchConditionRequest)?.expenseStatus || 'N/A',
        assigneeId: (condition as ExpenseSearchConditionRequest)?.assigneeId || 'N/A',
        litigationStatus:
          (condition as ExpenseSearchConditionRequest)?.litigationStatus ||
          (this.legalStatusOptions?.length > 0 ? this.legalStatusOptions[0].value : []),
        searchString: [(condition as ExpenseSearchConditionRequest)?.searchString || null, Validators.minLength(3)],
      });
    } else if (this.template === 'FINANCE_RECEIPT_KCORP') {
      return this.fb.group({
        washAccountNo: (condition as ReceiptKcorpSearchConditionRequest)?.washAccountNo || 'N/A',
        transferStatus: (condition as ReceiptKcorpSearchConditionRequest)?.transferStatus || 'N/A',
        referenceNo: [(condition as ReceiptKcorpSearchConditionRequest)?.referenceNo || null, Validators.minLength(3)],
        beginTransferMonth: (condition as ReceiptKcorpSearchConditionRequest)?.beginTransferMonth || null,
        endTransferMonth: (condition as ReceiptKcorpSearchConditionRequest)?.endTransferMonth || null,
      });
    } else if (this.template === 'FINANCE_ADVANCE') {
      return this.fb.group({
        advnancePaymentNo: (condition as AdvanceSearchConditionRequest)?.advnancePaymentNo || 'N/A',
        advancePaymentStatus: (condition as AdvanceSearchConditionRequest)?.advancePaymentStatus || 'N/A',
        user: (condition as AdvanceSearchConditionRequest)?.user || 'N/A',
        searchString: [(condition as AdvanceSearchConditionRequest)?.searchString || null, Validators.minLength(3)],
      });
    } else if (this.template === 'SUMMARY_REIMBURSE_TYPE_1') {
      const tempCondition: SummaryReimburseType1SearchConditionRequest =
        condition as SummaryReimburseType1SearchConditionRequest;
      return this.fb.group(
        {
          caseType: tempCondition?.caseType || 'N/A',
          financialObjectType: tempCondition?.financialObjectType || 'N/A',
          financialAccountType: tempCondition?.financialAccountType || [],
          financialAccountCode: tempCondition?.financialAccountCode || 'N/A',
          startDate: tempCondition?.startDate || null,
          endDate: tempCondition?.endDate || null,
          minAmount: tempCondition?.minAmount || null,
          maxAmount: tempCondition?.maxAmount || null,
        },
        {
          validators: [
            this.endDateValidator(),
            this.startDateValidator(),
            this.maxAmountValidator(),
            this.minAmountValidator(),
          ],
        }
      );
    } else if (this.template === 'SUMMARY_REIMBURSE_TYPE_2') {
      const tempCondition: SummaryReimburseType2SearchConditionRequest =
        condition as SummaryReimburseType2SearchConditionRequest;
      return this.fb.group({
        lgId: tempCondition?.lgId || 'N/A',
        financialAccountTypeExpense: tempCondition?.financialAccountTypeExpense || [],
        financialAccountCode: tempCondition?.financialAccountCode || 'N/A',
      });
    } else if (this.template === 'PROFILE_DIRECT_TYPE_1') {
      const tempCondition: ProfileDirectSearchConditionRequest = condition as ProfileDirectSearchConditionRequest;
      return this.fb.group(
        {
          accountDataType: [tempCondition.accountDataType || null, Validators.required],
          accountNo: [tempCondition.accountNo || null, Validators.required],
          startDate: [tempCondition?.startDate || null, Validators.required],
          endDate: [tempCondition?.endDate || null, Validators.required],
        },
        {
          validators: [
            this.endDateValidator('startDate', 'endDate', true),
            this.startDateValidator('startDate', 'endDate', true),
          ],
        }
      );
    } else {
      return this.fb.group({
        accountNo: (condition as SearchConditionRequest)?.accountNo || null,
        amdUnit:
          (condition as SearchConditionRequest)?.amdUnit ||
          (this.amdUnitOptions?.length > 0 ? this.amdUnitOptions[0].value : []),
        billNo: (condition as SearchConditionRequest)?.billNo || null,
        blackCaseId: (condition as SearchConditionRequest)?.blackCaseId || null,
        caseCreator: (condition as SearchConditionRequest)?.caseCreator || null,
        caseStatus:
          (condition as SearchConditionRequest)?.caseStatus ||
          (this.statusOptions?.length > 0 ? this.statusOptions[0].value : []),
        citizenId: (condition as SearchConditionRequest)?.citizenId || null,
        collateralTypeCode: (condition as SearchConditionRequest)?.collateralTypeCode || 'N/A',
        collateralSubTypeCode: (condition as SearchConditionRequest)?.collateralSubTypeCode || 'N/A',
        court: (condition as SearchConditionRequest)?.court || null,
        customerId: (condition as SearchConditionRequest)?.customerId || null,
        customerName: (condition as SearchConditionRequest)?.customerName || null,
        customerStatus:
          (condition as SearchConditionRequest)?.customerStatus ||
          (this.statusOptions?.length > 0 ? this.statusOptions[0].value : []),
        customerSurname: (condition as SearchConditionRequest)?.customerSurname || null,
        debtTransferTo: (condition as SearchConditionRequest)?.debtTransferTo || null,
        debtor: (condition as SearchConditionRequest)?.debtor || null,
        samFlag: (condition as SearchConditionRequest)?.samFlag || null,
        kbdId: (condition as SearchConditionRequest)?.kbdId || null,
        litigationCloseStatus: (condition as SearchConditionRequest)?.litigationCloseStatus || null,
        litigationId: (condition as SearchConditionRequest)?.litigationId || null,
        loanType: (condition as SearchConditionRequest)?.loanType || null,
        orgCode: (condition as SearchConditionRequest)?.orgCode || null,
        ownerId: (condition as SearchConditionRequest)?.ownerId || null,
        redCaseId: (condition as SearchConditionRequest)?.redCaseId || null,
        responseUnit:
          (condition as SearchConditionRequest)?.responseUnit ||
          (this.responseUnitOptions?.length > 0 ? this.responseUnitOptions[0].value : []),
        roomNo: (condition as SearchConditionRequest)?.roomNo || null,
        searchMode: (condition as SearchConditionRequest)?.searchMode || SearchConditionRequest.ModeEnum.List,
        searchScope: (condition as SearchConditionRequest)?.searchScope || null,
        searchString: (condition as SearchConditionRequest)?.searchString || null,
        tamcFlag: (condition as SearchConditionRequest)?.tamcFlag || null,
        taskStatus:
          (condition as SearchConditionRequest)?.taskStatus ||
          (this.statusOptions?.length > 0 ? this.statusOptions[0].value : []),
        taskType:
          (condition as SearchConditionRequest)?.taskType ||
          (this.typesOptions?.length > 0 ? this.typesOptions[0]?.value : []),
        ledId:
          (condition as SearchConditionRequest)?.ledId ||
          (this.ledOptions?.length > 0 ? this.ledOptions[0]?.value : undefined),
        writeOffStatus: (condition as SearchConditionRequest)?.writeOffStatus || null,
        legalStatus:
          (condition as SearchConditionRequest)?.legalStatus ||
          (this.legalStatusOptions?.length > 0 ? this.legalStatusOptions[0].value : []),
        lawyer:
          (condition as SearchConditionRequest)?.lawyer ||
          (this.lawyerOptions?.length > 0 ? this.lawyerOptions[0].value : []),
      });
    }
  }

  initAdvancedSelector() {
    const controlNames = [
      'caseStatus',
      'searchScope',
      'responseUnit',
      'orgCode',
      'debtor',
      'samFlag',
      'tamcFlag',
      'writeOffStatus',
      'caseCreator',
      'court',
      'taskType',
    ];
    for (let index = 0; index < controlNames.length; index++) {
      const element = controlNames[index];
      !this.searchCtrl.get(element)?.value && this.searchCtrl.get(element)?.setValue('N/A');
      this.searchCtrl.get(element)?.updateValueAndValidity();
    }
  }
  // edited later
  setDefaultSearch() {
    switch (this.searchType) {
      case 'BY_TASK':
        this.searchCtrl?.get('taskStatus')?.setValue(this.statusOptions[0].value);
        this.searchCtrl?.get('taskType')?.setValue(this.typesOptions[0].value);
        break;
      case 'BY_CUSTOMER':
        this.searchCtrl?.get('customerStatus')?.setValue(this.statusOptions[0].value);
        break;
      case 'BY_LAWSUIT':
        this.searchCtrl?.get('legalStatus')?.setValue(this.legalStatusOptions[0].value);
        this.searchCtrl?.get('lawyer')?.setValue(this.lawyerOptions[0].value);
        break;
      case 'BY_LAWSUIT_LED':
        this.searchCtrl?.get('legalStatus')?.setValue(this.legalStatusOptions[0].value);
        break;
      case 'BY_FINANCE_EXPENSE':
        this.searchCtrl?.get('expenseNo')?.setValue(this.expenseNoOptions[0].value);
        this.searchCtrl?.get('expenseStatus')?.setValue(this.expenseStatusOptions[0].value);
        this.searchCtrl?.get('user')?.setValue(this.userOptions[0].value);
        break;
      case 'BY_FINANCE_DASHBOARD':
        this.searchCtrl?.get('litigationStatus')?.setValue(this.legalStatusOptions[0].value);
        this.searchCtrl?.get('expenseNo')?.setValue(this.expenseNoOptions[0].value);
        this.searchCtrl?.get('expenseStatus')?.setValue(this.expenseStatusOptions[0].value);
        this.searchCtrl?.get('assigneeId')?.setValue(this.makerOptions[0].value);
        break;
      case 'BY_FINANCE_ADVANCE':
        this.searchCtrl?.get('advnancePaymentNo')?.setValue(this.expenseNoOptions[0].value);
        this.searchCtrl?.get('advancePaymentStatus')?.setValue(this.expenseStatusOptions[0].value);
        this.searchCtrl?.get('user')?.setValue(this.userOptions[0].value);
        break;
      case 'BY_COLLATERAL':
        this.searchCtrl?.get('legalStatus')?.setValue(this.legalStatusOptions[0].value);
        this.searchCtrl?.get('collateralTypeCode')?.setValue(this.collateralTypeOptions[0].value);
        this.searchCtrl?.get('collateralSubTypeCode')?.setValue(this.collateralSubTypeOptions[0].value);
    }
    this.searchCtrl.get('searchString')?.setValue('');
    this.searchCtrl.get('searchString')?.markAsPristine();
    this.searchCtrl.get('amdUnit')?.setValue(this.amdUnitOptions[0].value);
    this.searchCtrl.get('responseUnit')?.setValue(this.responseUnitOptions[0].value);
    this.searchCtrl.updateValueAndValidity();
  }

  onKeyup(event: KeyboardEvent) {
    (event.code === 'Enter' || event.code === 'NumpadEnter') && this.onSearch();
  }

  //edited later
  async onSelectedOption(_selectedBy?: string) {
    this.searchCtrl.get('searchMode')?.setValue(SearchConditionRequest.ModeEnum.Basic);
    if (this.searchType === 'BY_TASK') {
      const _taskStatus = this.searchCtrl.get('taskStatus')?.value.split('|');
      const _taskType = this.searchCtrl.get('taskType')?.value;
      switch (_selectedBy) {
        case 'TASK_STATUS':
          this.searchCtrl.get('taskType')?.setValue(_taskStatus[1] ? _taskStatus[1] : _taskType);
          break;
        case 'TASK_TYPE':
          this.searchCtrl.get('taskStatus')?.setValue('N/A');
          break;
      }
    } else if (['BY_REIMBURSE_TYPE_1', 'BY_REIMBURSE_TYPE_2'].includes(this.searchType)) {
      switch (_selectedBy) {
        case 'FINANCIAL_OBJECT_TYPE':
          try {
            this.searchCtrl.get('financialAccountType')?.setValue([]);
            this.searchCtrl.get('financialAccountType')?.updateValueAndValidity();
            this.financialAccountTypeDropdown?.clearSearchInput();

            let financialObjectTypeVal = this.searchCtrl.get('financialObjectType')?.value;
            financialObjectTypeVal =
              !financialObjectTypeVal || financialObjectTypeVal === 'N/A' ? '' : financialObjectTypeVal;
            const res = await this.masterDataService.financialAccountType(financialObjectTypeVal);
            this.financialAccountTypeOptions = [...(res.financialAccountTypeDto || [])];
          } catch (error) {
            console.log('FINANCIAL_OBJECT_TYPE error => ', error);
          }
          break;
      }
    } else if ('PROFILE_DIRECT_1' === _selectedBy) {
      !!this.searchCtrl.get('accountNo')?.value ? this.searchCtrl.get('accountNo')?.setValue(null) : undefined;
    } else if ('PROFILE_DIRECT_2' === _selectedBy) {
      if (this.searchType === 'BY_PROFILE_DIRECT_TYPE_1') return;

      !!this.searchCtrl.get('startDate')?.value ? this.searchCtrl.get('startDate')?.setValue(null) : undefined;
      !!this.searchCtrl.get('endDate')?.value ? this.searchCtrl.get('endDate')?.setValue(null) : undefined;

      this.isAccountOD = !!this.accountNoOptions?.find(dto => {
        return dto.value === this.searchCtrl.get('accountNo')?.value && dto.condition1 === 'OD';
      });

      /*
      - Account History - O/D(OD) -> max 3 months from past 3 months to currentDate.
      - Interest change summary - O/D(OD) -> max 1 months from past month to currentDate.
      - Statement -> from the past to currentDate (Range is NO-LIMIT).
      - Default -> select any day up to the current day, but within a range of not more than 1 year.
      */
      if (this.searchCtrl.get('accountDataType')?.value === BatchDataDto.ProfileDirectTypeEnum.Statement) {
        this.isAccountOD = false; // No considering O/D
        this.minStratDateProfileDirect = null;
        this.minEndDateProfileDirect = null;
      } else if (this.isAccountOD) {
        const accountDataType = this.searchCtrl.get('accountDataType')?.value;
        const monthsToSubtract = accountDataType === 'ACCOUNT_HISTORY' ? 3 : 1;

        this.minStratDateProfileDirect = moment().subtract(monthsToSubtract, 'months').toDate();
        this.minEndDateProfileDirect = moment().subtract(monthsToSubtract, 'months').toDate();
      } else {
        this.minStratDateProfileDirect = moment().subtract(1, 'years').toDate();
        this.minEndDateProfileDirect = moment().subtract(1, 'years').toDate();
      }
      this.maxStratDateProfileDirect = moment().toDate();
      this.maxEndDateProfileDirect = moment().toDate();
      return;
    }
    this.onSearch();
  }

  //edited later
  onSearch() {
    this.searchCtrl.markAllAsTouched();
    this.searchCtrl.updateValueAndValidity();

    const rawValue = this.searchCtrl.getRawValue();
    if (this.searchType === 'BY_FINANCE_EXPENSE' || this.searchType === 'BY_FINANCE_DASHBOARD') {
      const result: ExpenseSearchConditionRequest = rawValue;
      const assigneeId = result.assigneeId as any;
      let newAssigneeIdValue;
      if (!Array.isArray(assigneeId)) {
        newAssigneeIdValue =
          assigneeId && assigneeId !== 'N/A' ? ([assigneeId] as Array<any>) : undefined; /** single */
      } else {
        newAssigneeIdValue = assigneeId?.map((item: NameValuePair) => item.value) || []; /** multi */
      }
      result.assigneeId = newAssigneeIdValue;
      if (this.searchType === 'BY_FINANCE_EXPENSE' && this._condition.tab === 'CLOSED' && result?.successPaymentDate) {
        result.successPaymentDate = moment(result?.successPaymentDate).format('YYYY-MM-DD') || undefined;
      }
      if (this.searchType === 'BY_FINANCE_DASHBOARD') {
        result.createdBy = result.assigneeId;
        result.assigneeId = undefined;
      }
      this.searchCtrl.valid && this.searchEvent.emit(result);
    } else if (this.searchType === 'BY_FINANCE_RECEIPT') {
      const result: ReceiptSearchConditionRequest = rawValue;
      this.searchCtrl.valid && this.searchEvent.emit(result);
    } else if (this.searchType === 'BY_FINANCE_RECEIPT_KCORP') {
      const result: ReceiptKcorpSearchConditionRequest = rawValue;
      this.searchCtrl.valid && this.searchEvent.emit(result);
    } else if (this.searchType === 'BY_FINANCE_ADVANCE') {
      const result: AdvanceSearchConditionRequest =
        this.searchCtrl.get('user')?.value === 'N/A' ? { ...this.searchCtrl.getRawValue(), user: null } : rawValue;
      this.searchCtrl.valid && this.searchEvent.emit(result);
    } else if (this.searchType === 'BY_REIMBURSE_TYPE_1') {
      if (this.searchCtrl?.valid) {
        const result: SummaryReimburseType1SearchConditionRequest = rawValue;
        this.searchEvent.emit(result);
      }
    } else if (this.searchType === 'BY_REIMBURSE_TYPE_2') {
      const result: SummaryReimburseType2SearchConditionRequest = rawValue;
      this.searchEvent.emit(result);
    } else if (['BY_PROFILE_DIRECT_TYPE_1', 'BY_PROFILE_DIRECT_TYPE_2'].includes(this.searchType)) {
      const result: ProfileDirectSearchConditionRequest = rawValue;
      switch (this.searchType) {
        case 'BY_PROFILE_DIRECT_TYPE_1':
          switch (this.searchCtrl.get('accountDataType')?.value) {
            case BatchDataDto.ProfileDirectTypeEnum.AccountList:
              this.searchEvent.emit(result);
              break;
            case BatchDataDto.ProfileDirectTypeEnum.AccountOverview:
            case BatchDataDto.ProfileDirectTypeEnum.OutstandingReport:
              this.searchCtrl.get('accountNo')?.valid && this.searchEvent.emit(result);
              break;
          }
          break;
        case 'BY_PROFILE_DIRECT_TYPE_2':
          this.searchCtrl.valid && this.searchEvent.emit(result);
          break;
        case 'BY_PROFILE_DIRECT_TYPE_3':
          this.searchCtrl.valid && this.searchEvent.emit(result);
          break;
      }
    } else {
      if (this.searchCtrl.get('searchString')?.value) {
        this.searchCtrl.get('searchMode')?.setValue(SearchConditionRequest.ModeEnum.Basic);
        this.searchCtrl.get('searchMode')?.updateValueAndValidity();
      }
      const _searchMode = this.searchCtrl.get('searchMode')?.value;
      this.clearValidation(_searchMode);
      this.setValidation(_searchMode);
      const result: SearchConditionRequest = this.searchCtrl.getRawValue();

      if (this.searchType === 'BY_LAWSUIT_LED') {
        result.ledId = result.ledId !== 'N/A' ? result.ledId : undefined;
      }
      result.debtTransferTo = this.searchCtrl.get('debtTransferTo')?.value
        ? [this.searchCtrl.get('debtTransferTo')?.value]
        : undefined;
      result.loanType = this.searchCtrl.get('loanType')?.value ? [this.searchCtrl.get('loanType')?.value] : undefined;

      switch (result.searchMode) {
        case SearchConditionRequest.ModeEnum.List:
          this.searchEvent.emit(result);
          break;
        case SearchConditionRequest.ModeEnum.Basic:
          this.searchCtrl.valid && this.searchEvent.emit(result);
          break;
        case SearchConditionRequest.ModeEnum.Advance:
          this.searchCtrl.valid && this.searchEvent.emit(result);
          break;
      }
    }
  }

  setValidation(mode?: SearchConditionRequest.ModeEnum) {
    switch (mode) {
      case SearchConditionRequest.ModeEnum.Basic:
        this.searchCtrl.get('searchString')?.setValidators(Validators.minLength(3));
        this.searchCtrl.get('searchString')?.updateValueAndValidity();
        break;
      case SearchConditionRequest.ModeEnum.Advance:
        const advanceElement = [
          'litigationId',
          'customerId',
          'customerName',
          'customerSurname',
          'citizenId',
          'blackCaseId',
          'redCaseId',
          'accountNo',
          'billNo',
          'kbdId',
          'ownerId',
          'roomNo',
        ];
        for (let index = 0; index < advanceElement.length; index++) {
          const element = advanceElement[index];
          this.searchCtrl.get(element)?.setValidators(Validators.minLength(3));
          this.searchCtrl.get(element)?.updateValueAndValidity();
        }
        break;
    }
  }

  clearValidation(mode?: SearchConditionRequest.ModeEnum) {
    switch (mode) {
      case SearchConditionRequest.ModeEnum.Basic:
        const advanceElement = [
          'litigationId',
          'customerId',
          'customerName',
          'customerSurname',
          'citizenId',
          'blackCaseId',
          'redCaseId',
          'accountNo',
          'billNo',
          'kbdId',
          'ownerId',
          'roomNo',
        ];
        for (let index = 0; index < advanceElement.length; index++) {
          const element = advanceElement[index];
          this.searchCtrl.get(element)?.clearValidators();
          this.searchCtrl.get(element)?.updateValueAndValidity();
        }
        break;
      case SearchConditionRequest.ModeEnum.Advance:
        this.searchCtrl.get('searchString')?.clearValidators();
        this.searchCtrl.get('searchString')?.updateValueAndValidity();
        break;
    }
  }

  onAdvancedSearch() {
    // UAT Feedback Remove logic clear data for Advance Search
    this.searchCtrl.get('searchMode')?.setValue(SearchConditionRequest.ModeEnum.Advance);
    this.searchCtrl.get('searchString')?.setValue('');
  }

  onCancel() {
    // UAT Feedback Remove logic clear data for Advance Search
    this.searchCtrl.get('searchMode')?.setValue(SearchConditionRequest.ModeEnum.List);
    this.searchCtrl.get('searchString')?.setValue('');
  }

  onResetSearch() {
    this.resetSearchControl(['sortBy', 'searchMode', 'sortOrder', 'tab']);
    this.onSearch();
  }

  // End date validator
  endDateValidator(minDate: string = 'startDate', maxDate: string = 'endDate', isRequired: boolean = false) {
    return (group: UntypedFormGroup) => {
      const startDate = group.controls[minDate].value;
      const endDate = group.controls[maxDate].value;

      if (isRequired && !endDate) {
        group.controls[maxDate]?.setErrors({ required: true });
      } else if (startDate && endDate && startDate > endDate) {
        group.controls[maxDate].setErrors({ endDateBeforeStartDate: true });
      } else {
        group.controls[maxDate].setErrors(null);
      }
    };
  }

  // Start date validator
  startDateValidator(minDate: string = 'startDate', maxDate: string = 'endDate', isRequired: boolean = false) {
    return (group: UntypedFormGroup) => {
      const startDate = group.controls[minDate].value;
      const endDate = group.controls[maxDate].value;
      if (isRequired && !startDate) {
        group.controls[minDate]?.setErrors({ required: true });
      } else if (endDate && startDate && startDate > endDate) {
        group.controls[minDate].setErrors({ startDateAfterEndDate: true });
      } else {
        group.controls[minDate].setErrors(null);
      }
    };
  }

  // Handle start date change
  // event: MatDatepickerInputEvent<Date>
  onStartDateChange(minDate: string = 'startDate', maxDate: string = 'endDate') {
    const startDateControl = this.searchCtrl.get(minDate);
    const endDateControl = this.searchCtrl.get(maxDate);
    const startDate = startDateControl?.value;
    const endDate = endDateControl?.value;
    if (endDate && startDate && startDate > endDate) {
      startDateControl?.setErrors({ startDateAfterEndDate: true });
    } else {
      startDateControl?.setErrors(null);
      endDateControl?.setErrors(null);
    }
    startDateControl?.updateValueAndValidity();
    endDateControl?.updateValueAndValidity();
  }

  // case select end date
  onSetMinProfileDirectStartDate(e: any) {
    if (
      this.isAccountOD ||
      this.searchCtrl.get('accountDataType')?.value === BatchDataDto.ProfileDirectTypeEnum.Statement
    )
      return;

    this.minStratDateProfileDirect = moment(this.searchCtrl.get('endDate')?.value).subtract(1, 'years').toDate();
    this.maxStratDateProfileDirect = moment(this.searchCtrl.get('endDate')?.value).toDate();

    const currentDate = moment().toDate();
    if (this.isRestrictedDateRange && currentDate < this.maxStratDateProfileDirect) {
      this.maxStratDateProfileDirect = currentDate;
    }
  }

  // case select start date
  onSetMaxProfileDirectEndDate(e: Event): void {
    this.minEndDateProfileDirect = this.searchCtrl.get('startDate')?.value;

    if (
      this.isAccountOD ||
      this.searchCtrl.get('accountDataType')?.value === BatchDataDto.ProfileDirectTypeEnum.Statement
    ) {
      return;
    }

    this.maxEndDateProfileDirect = moment(this.searchCtrl.get('startDate')?.value).add(1, 'years').toDate();
    const currentDate = moment().toDate();

    if (this.isRestrictedDateRange && currentDate < this.maxEndDateProfileDirect) {
      this.maxEndDateProfileDirect = currentDate;
    }
  }

  // Handle end date change
  // event: MatDatepickerInputEvent<Date>
  onEndDateChange(minDate: string = 'startDate', maxDate: string = 'endDate') {
    const startDateControl = this.searchCtrl.get(minDate);
    const endDateControl = this.searchCtrl.get(maxDate);
    const startDate = startDateControl?.value;
    const endDate = endDateControl?.value;
    if (startDate && endDate && startDate > endDate) {
      endDateControl?.setErrors({ endDateBeforeStartDate: true });
    } else {
      endDateControl?.setErrors(null);
      startDateControl?.setErrors(null);
    }
    startDateControl?.updateValueAndValidity();
    endDateControl?.updateValueAndValidity();
  }

  // Max amount validator
  maxAmountValidator(minAmount: string = 'minAmount', maxAmount: string = 'maxAmount') {
    return (group: UntypedFormGroup) => {
      const minAmountVal = group.controls[minAmount].value;
      const maxAmountVal = group.controls[maxAmount].value;
      if (minAmountVal && maxAmountVal && minAmountVal > maxAmountVal) {
        group.controls[maxAmount].setErrors({ invalidMaxAmount: true });
      } else {
        group.controls[maxAmount].setErrors(null);
      }
    };
  }

  // Min amount validator
  minAmountValidator(minAmount: string = 'minAmount', maxAmount: string = 'maxAmount') {
    return (group: UntypedFormGroup) => {
      const minAmountVal = group.controls[minAmount].value;
      const maxAmountVal = group.controls[maxAmount].value;
      if (maxAmountVal && minAmountVal && minAmountVal > maxAmountVal) {
        group.controls[minAmount].setErrors({ invalidMinAmount: true });
      } else {
        group.controls[minAmount].setErrors(null);
      }
    };
  }

  // Handle min amount change // TODO: function not using on component
  // onMinAmountChange(minAmount: string = 'minAmount', maxAmount: string = 'maxAmount') {
  //   const minAmountControl = this.searchCtrl.get(minAmount);
  //   const maxAmountControl = this.searchCtrl.get(maxAmount);
  //   const minAmountVal = minAmountControl?.value;
  //   const maxAmountVal = maxAmountControl?.value;
  //   if (maxAmountVal && minAmountVal && minAmountVal > maxAmountVal) {
  //     minAmountControl?.setErrors({ invalidMinAmount: true });
  //   } else {
  //     minAmountControl?.setErrors(null);
  //     maxAmountControl?.setErrors(null);
  //   }
  //   minAmountControl?.updateValueAndValidity();
  // }

  // Handle max amount change // TODO: function not using on component
  // onMaxAmountChange(minAmount: string = 'minAmount', maxAmount: string = 'maxAmount') {
  //   const minAmountControl = this.searchCtrl.get(minAmount);
  //   const maxAmountControl = this.searchCtrl.get(maxAmount);
  //   const minAmountVal = minAmountControl?.value;
  //   const maxAmountVal = maxAmountControl?.value;
  //   if (minAmountVal && maxAmountVal && minAmountVal > maxAmountVal) {
  //     maxAmountControl?.setErrors({ invalidMaxAmount: true });
  //   } else {
  //     maxAmountControl?.setErrors(null);
  //     minAmountControl?.setErrors(null);
  //   }
  //   maxAmountControl?.updateValueAndValidity();
  // }
}
