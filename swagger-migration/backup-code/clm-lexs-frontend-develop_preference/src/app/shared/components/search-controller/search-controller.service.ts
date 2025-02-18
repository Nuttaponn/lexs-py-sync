import { Injectable } from '@angular/core';
import { UserService } from '@app/modules/user/user.service';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { NameValuePair } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class SearchControllerService {
  /** For Finance Search */
  private _expenseNoOptions: NameValuePair[] = [];
  public get expenseNoOptions(): NameValuePair[] {
    return this._expenseNoOptions;
  }
  private set expenseNoOptions(value: NameValuePair[]) {
    const defaultValue: NameValuePair[] = [
      {
        name: this.translate.instant('SEARCH_CONTROL.LABEL_ALL_EXPENSE_NO'),
        value: 'N/A',
      },
    ];
    this._expenseNoOptions = [...defaultValue, ...(value || [])];
  }

  private _expenseStatusOptions: NameValuePair[] = [];
  public get expenseStatusOptions(): NameValuePair[] {
    return this._expenseStatusOptions;
  }
  private set expenseStatusOptions(value: NameValuePair[]) {
    this._expenseStatusOptions =
      this._expenseStatusOptions.length === 0
        ? (
            [
              { name: this.translate.instant('SEARCH_CONTROL.LABEL_ALL_EXPENSE_STATUS'), value: 'N/A' },
            ] as NameValuePair[]
          ).concat(value)
        : this._expenseStatusOptions;
  }

  private _receiptNoOptions: NameValuePair[] = [];
  public get receiptNoOptions(): NameValuePair[] {
    return this._receiptNoOptions;
  }
  private set receiptNoOptions(value: NameValuePair[]) {
    this._receiptNoOptions =
      this._receiptNoOptions.length === 0
        ? (
            [{ name: this.translate.instant('SEARCH_CONTROL.LABEL_ALL_RECEIPT_NO'), value: 'N/A' }] as NameValuePair[]
          ).concat(value)
        : this._receiptNoOptions;
  }
  // TODO: should be mapping by BE slide
  private receiptStatusMapper = new Map<string, string>([
    ['001', 'DRAFT'],
    ['002', 'PENDING_APPROVE'],
    ['003', 'PENDING_EDIT'],
    ['004', 'PENDING_DOWNLOAD'],
    ['005', 'RECORD_NO_SUCCESS'],
    ['006', 'COMPLETED'],
    ['007', 'COMPLETED_SYSTEM'],
    ['008', 'CANCEL_RECORD'],
    ['009', 'PENDING_NO_SUCCESS'],
  ]);
  private _receiptStatusOptions: NameValuePair[] = [];
  public get receiptStatusOptions(): NameValuePair[] {
    return this._receiptStatusOptions;
  }
  private set receiptStatusOptions(value: NameValuePair[]) {
    const mapValue = value.map(item => {
      item.value = this.receiptStatusMapper.get(item.value || '');
      return item;
    });
    this._receiptStatusOptions =
      this._receiptStatusOptions.length === 0
        ? (
            [
              { name: this.translate.instant('SEARCH_CONTROL.LABEL_ALL_RECEIPT_STATUS'), value: 'N/A' },
            ] as NameValuePair[]
          ).concat(mapValue)
        : this._receiptStatusOptions;
  }

  private _receiptTypeOptions: NameValuePair[] = [];
  public get receiptTypeOptions(): NameValuePair[] {
    return this._receiptTypeOptions;
  }
  // TODO: should be mapping by BE slide
  private receiptTypeMapper = new Map<string, string>([
    ['01', 'INTER_OFFICE'],
    ['02', 'SUSPENSE'],
    ['03', 'SUSPENSE_COURT'],
  ]);
  private set receiptTypeOptions(value: NameValuePair[]) {
    const mapValue = value.map(item => {
      item.value = this.receiptTypeMapper.get(item.value || '');
      return item;
    });
    this._receiptTypeOptions =
      this._receiptTypeOptions.length === 0
        ? (
            [{ name: this.translate.instant('SEARCH_CONTROL.LABEL_ALL_RECEIPT_TYPE'), value: 'N/A' }] as NameValuePair[]
          ).concat(mapValue)
        : this._receiptTypeOptions;
  }

  private _washAccountOptions: NameValuePair[] = [];
  public get washAccountOptions(): NameValuePair[] {
    return this._washAccountOptions;
  }
  private set washAccountOptions(value: NameValuePair[]) {
    this._washAccountOptions =
      this._washAccountOptions.length === 0
        ? ([{ name: 'Wash Account', value: 'N/A' }] as NameValuePair[]).concat(value)
        : this._washAccountOptions;
  }

  private _transferStatusOptions: NameValuePair[] = [];
  public get transferStatusOptions(): NameValuePair[] {
    return this._transferStatusOptions;
  }
  private set transferStatusOptions(value: NameValuePair[]) {
    this._transferStatusOptions =
      this._transferStatusOptions.length === 0
        ? ([{ name: 'สถานะการทำรายการ', value: 'N/A' }] as NameValuePair[]).concat(value)
        : this._transferStatusOptions;
  }

  private _advancePaymentStatusOptions: NameValuePair[] = [];
  public get advancePaymentStatusOptions(): NameValuePair[] {
    return this._advancePaymentStatusOptions;
  }
  private set advancePaymentStatusOptions(value: NameValuePair[]) {
    this._advancePaymentStatusOptions =
      this._advancePaymentStatusOptions.length === 0
        ? (
            [
              { name: this.translate.instant('SEARCH_CONTROL.LABEL_ALL_EXPENSE_STATUS'), value: 'N/A' },
            ] as NameValuePair[]
          ).concat(value)
        : this._advancePaymentStatusOptions;
  }

  private _userOptions: NameValuePair[] = [];
  public get userOptions(): NameValuePair[] {
    return this._userOptions;
  }
  private set userOptions(value: NameValuePair[]) {
    this._userOptions =
      this._userOptions.length === 0
        ? ([{ name: this.translate.instant('SEARCH_CONTROL.LABEL_ALL_USER'), value: 'N/A' }] as NameValuePair[]).concat(
            value
          )
        : this._userOptions;
  }
  private _makerOptions: NameValuePair[] = [];
  public get makerOptions(): NameValuePair[] {
    return this._makerOptions;
  }
  private set makerOptions(value: NameValuePair[]) {
    this._makerOptions =
      this._makerOptions.length === 0
        ? (
            [{ name: this.translate.instant('SEARCH_CONTROL.LABEL_ALL_MAKERS'), value: 'N/A' }] as NameValuePair[]
          ).concat(value)
        : this._makerOptions;
  }
  /** For Search */
  private _responseUnitOptions: NameValuePair[] = [];
  public get responseUnitOptions(): NameValuePair[] {
    return this._responseUnitOptions;
  }
  private set responseUnitOptions(value: NameValuePair[]) {
    this._responseUnitOptions =
      this._responseUnitOptions.length === 0
        ? (
            [
              { name: this.translate.instant('SEARCH_CONTROL.LABEL_ALL_RESPONSE_UNIT'), value: 'N/A' },
            ] as NameValuePair[]
          ).concat(value)
        : this._responseUnitOptions;
  }

  private _amdUnitOptions: NameValuePair[] = [];
  public get amdUnitOptions(): NameValuePair[] {
    return this._amdUnitOptions;
  }
  private set amdUnitOptions(value: NameValuePair[]) {
    this._amdUnitOptions =
      this._amdUnitOptions.length === 0
        ? (
            [{ name: this.translate.instant('SEARCH_CONTROL.LABEL_ALL_AMD_UNIT'), value: 'N/A' }] as NameValuePair[]
          ).concat(value)
        : this._amdUnitOptions;
  }

  private _lgStatusOptions: NameValuePair[] = [];
  public get lgStatusOptions(): NameValuePair[] {
    return this._lgStatusOptions;
  }
  private set lgStatusOptions(value: NameValuePair[]) {
    this._lgStatusOptions = this._lgStatusOptions.length === 0 ? value : this._lgStatusOptions;
  }

  private _caseStatusOptions: NameValuePair[] = [];
  public get caseStatusOptions(): NameValuePair[] {
    return this._caseStatusOptions;
  }
  private set caseStatusOptions(value: NameValuePair[]) {
    this._caseStatusOptions = this._caseStatusOptions.length === 0 ? value : this._caseStatusOptions;
  }

  private _searchScopeOptions: NameValuePair[] = [];
  public get searchScopeOptions(): NameValuePair[] {
    return this._searchScopeOptions;
  }
  private set searchScopeOptions(value: NameValuePair[]) {
    this._searchScopeOptions =
      this._searchScopeOptions.length === 0
        ? (
            [{ name: this.translate.instant('SEARCH_CONTROL.LABEL_SEARCH_SCOPE'), value: 'N/A' }] as NameValuePair[]
          ).concat(value)
        : this._searchScopeOptions;
  }

  private _orgCodeOptions: NameValuePair[] = [];
  public get orgCodeOptions(): NameValuePair[] {
    return this._orgCodeOptions;
  }
  private set orgCodeOptions(value: NameValuePair[]) {
    this._orgCodeOptions =
      this._orgCodeOptions.length === 0
        ? ([{ name: this.translate.instant('SEARCH_CONTROL.LABEL_ORG_CODE'), value: 'N/A' }] as NameValuePair[]).concat(
            value
          )
        : this._orgCodeOptions;
  }

  private _loanTypeOptions: NameValuePair[] = [];
  public get loanTypeOptions(): NameValuePair[] {
    return this._loanTypeOptions;
  }
  private set loanTypeOptions(value: NameValuePair[]) {
    this._loanTypeOptions = this._loanTypeOptions.length === 0 ? value : this._loanTypeOptions;
  }

  private _debtorOptions: NameValuePair[] = [];
  public get debtorOptions(): NameValuePair[] {
    return this._debtorOptions;
  }
  private set debtorOptions(value: NameValuePair[]) {
    this._debtorOptions =
      this._debtorOptions.length === 0
        ? ([{ name: this.translate.instant('SEARCH_CONTROL.LABEL_DEBTOR'), value: 'N/A' }] as NameValuePair[]).concat(
            value
          )
        : this._debtorOptions;
  }

  private _samFlagOptions: NameValuePair[] = [];
  public get samFlagOptions(): NameValuePair[] {
    return this._samFlagOptions;
  }
  private set samFlagOptions(value: NameValuePair[]) {
    this._samFlagOptions =
      this._samFlagOptions.length === 0
        ? ([{ name: this.translate.instant('SEARCH_CONTROL.LABEL_SAM_FLAG'), value: 'N/A' }] as NameValuePair[]).concat(
            value
          )
        : this._samFlagOptions;
  }

  private _tamcFlagOptions: NameValuePair[] = [];
  public get tamcFlagOptions(): NameValuePair[] {
    return this._tamcFlagOptions;
  }
  private set tamcFlagOptions(value: NameValuePair[]) {
    this._tamcFlagOptions =
      this._tamcFlagOptions.length === 0
        ? (
            [{ name: this.translate.instant('SEARCH_CONTROL.LABEL_TAMC_FLAG'), value: 'N/A' }] as NameValuePair[]
          ).concat(value)
        : this._tamcFlagOptions;
  }

  private _writeOffStatusOptions: NameValuePair[] = [];
  public get writeOffStatusOptions(): NameValuePair[] {
    return this._writeOffStatusOptions;
  }
  private set writeOffStatusOptions(value: NameValuePair[]) {
    this._writeOffStatusOptions =
      this._writeOffStatusOptions.length === 0
        ? (
            [{ name: this.translate.instant('SEARCH_CONTROL.LABEL_WRITEOFF_STATUS'), value: 'N/A' }] as NameValuePair[]
          ).concat(value)
        : this._writeOffStatusOptions;
  }

  private _debtTransferToOptions: NameValuePair[] = [];
  public get debtTransferToOptions(): NameValuePair[] {
    return this._debtTransferToOptions;
  }
  private set debtTransferToOptions(value: NameValuePair[]) {
    this._debtTransferToOptions = this._debtTransferToOptions.length === 0 ? value : this._debtTransferToOptions;
  }

  private _caseCreatorOptions: NameValuePair[] = [];
  public get caseCreatorOptions(): NameValuePair[] {
    return this._caseCreatorOptions;
  }
  private set caseCreatorOptions(value: NameValuePair[]) {
    this._caseCreatorOptions = this._caseCreatorOptions.length === 0 ? value : this._caseCreatorOptions;
  }

  private _courtOptions: NameValuePair[] = [];
  public get courtOptions(): NameValuePair[] {
    return this._courtOptions;
  }
  private set courtOptions(value: NameValuePair[]) {
    this._courtOptions =
      this._courtOptions.length === 0
        ? ([{ name: this.translate.instant('COMMON.LABEL_COURT'), value: 'N/A' }] as NameValuePair[]).concat(value)
        : this._courtOptions;
  }

  // For Task
  private _taskStatusOptions: NameValuePair[] = [];
  public get taskStatusOptions(): NameValuePair[] {
    if (this._taskStatusOptions.length === 0) {
      const _map =
        this.masterDataService.advanceOptions.taskStatus?.taskStatus?.map(el => {
          return {
            name: el.name,
            type: el.type,
            value: el.value + (el.type ? '|' + el.type : ''),
          };
        }) || [];
      this._taskStatusOptions = (
        [{ name: this.translate.instant('SEARCH_CONTROL.LABEL_ALL_TASKS'), value: 'N/A' }] as NameValuePair[]
      ).concat(_map);
      return this._taskStatusOptions;
    }
    return this._taskStatusOptions;
  }
  private set taskStatusOptions(value: NameValuePair[]) {
    this._taskStatusOptions = value;
  }

  private _typesOptions: NameValuePair[] = [];
  public get typesOptions(): NameValuePair[] {
    if (this._typesOptions.length === 0) {
      this._typesOptions = (
        [{ name: this.translate.instant('SEARCH_CONTROL.LABEL_ALL_TYPES'), value: 'N/A' }] as NameValuePair[]
      ).concat(this.masterDataService.advanceOptions.taskType?.taskType || []);
      return this._typesOptions;
    }
    return this._typesOptions;
  }
  private set typesOptions(value: NameValuePair[]) {
    this._typesOptions = value;
  }

  private _collateralTypeOptions: NameValuePair[] = [];
  public get collateralTypeOptions(): NameValuePair[] {
    if (this._collateralTypeOptions[0].value !== 'N/A') {
      this._collateralTypeOptions = (
        [{ name: this.translate.instant('SEARCH_CONTROL.LABEL_ALL_COLLATERAL_TYPES'), value: 'N/A' }] as NameValuePair[]
      ).concat(this._collateralTypeOptions);
    }
    return this._collateralTypeOptions;
  }
  private set collateralTypeOptions(value: NameValuePair[]) {
    this._collateralTypeOptions = value;
  }

  private _collateralSubTypeOptions: NameValuePair[] = [];
  public get collateralSubTypeOptions(): NameValuePair[] {
    if (this._collateralSubTypeOptions[0].value !== 'N/A') {
      this._collateralSubTypeOptions = (
        [
          { name: this.translate.instant('SEARCH_CONTROL.LABEL_ALL_COLLATERAL_SUB_TYPES'), value: 'N/A' },
        ] as NameValuePair[]
      ).concat(this._collateralSubTypeOptions);
    }
    return this._collateralSubTypeOptions;
  }
  private set collateralSubTypeOptions(value: NameValuePair[]) {
    this._collateralSubTypeOptions = value;
  }

  // For Customer
  private _customerStatusOptions: NameValuePair[] = [];
  public get customerStatusOptions(): NameValuePair[] {
    return this._customerStatusOptions.length === 0
      ? (
          [
            { name: this.translate.instant('SEARCH_CONTROL.LABEL_ALL_CUSTOMER_STATUS'), value: 'N/A' },
          ] as NameValuePair[]
        ).concat(this.masterDataService.advanceOptions.customerStatus?.customerStatus || [])
      : this._customerStatusOptions;
  }
  private set customerStatusOptions(value: NameValuePair[]) {
    this._customerStatusOptions = value;
  }

  // For Lawsuit
  private _legalStatusOptions: NameValuePair[] = [];
  public get legalStatusOptions(): NameValuePair[] {
    return this._legalStatusOptions.length === 0
      ? (
          [{ name: this.translate.instant('SEARCH_CONTROL.LABEL_ALL_LAWSUIT_STATUS'), value: 'N/A' }] as NameValuePair[]
        ).concat(this.masterDataService.advanceOptions.legalStatus?.legalStatus || [])
      : this._legalStatusOptions;
  }
  private set legalStatusOptions(value: NameValuePair[]) {
    this._legalStatusOptions = value;
  }

  // For summary reimbursement
  private _financialObjectTypeOptions: NameValuePair[] = [];
  public get financialObjectTypeOptions(): NameValuePair[] {
    return this._financialObjectTypeOptions;
  }
  private set financialObjectTypeOptions(value: NameValuePair[]) {
    this._financialObjectTypeOptions =
      this._financialObjectTypeOptions.length === 0
        ? (
            [
              { name: this.translate.instant('SEARCH_CONTROL.PLACEHOLDER_TRANSACTION_TYPE'), value: 'N/A' },
            ] as NameValuePair[]
          ).concat(value)
        : this._financialObjectTypeOptions;
  }

  private _financialAccountTypeOptions: NameValuePair[] = []; // รายการ
  public get financialAccountTypeOptions(): NameValuePair[] {
    return this._financialAccountTypeOptions;
  }
  private set financialAccountTypeOptions(value: NameValuePair[]) {
    this._financialAccountTypeOptions =
      this._financialAccountTypeOptions.length === 0 ? value : this._financialAccountTypeOptions;
  }

  // private _caseTypeOptions: NameValuePair[] = [];
  // public get caseTypeOptions(): NameValuePair[] {
  //   return this._caseTypeOptions;
  // }
  // private set caseTypeOptions(value: NameValuePair[]) {
  //   this._caseTypeOptions = this._caseTypeOptions.length === 0 ? ([{ name: this.translate.instant("SEARCH_CONTROL.PLACEHOLDER_CASE_TYPE"), value: 'N/A' }] as NameValuePair[]).concat(value) : this._caseTypeOptions;
  // }
  private _expenseStepTypeOptions: NameValuePair[] = [];
  public get expenseStepTypeOptions(): NameValuePair[] {
    return this._expenseStepTypeOptions;
  }
  private set expenseStepTypeOptions(value: NameValuePair[]) {
    this._expenseStepTypeOptions =
      this._expenseStepTypeOptions.length === 0
        ? (
            [{ name: this.translate.instant('SEARCH_CONTROL.PLACEHOLDER_CASE_TYPE'), value: 'N/A' }] as NameValuePair[]
          ).concat(value)
        : this._expenseStepTypeOptions;
  }

  private _financialAccountCodeOptions: NameValuePair[] = [];
  public get financialAccountCodeOptions(): NameValuePair[] {
    return this._financialAccountCodeOptions;
  }
  private set financialAccountCodeOptions(value: NameValuePair[]) {
    this._financialAccountCodeOptions =
      this._financialAccountCodeOptions.length === 0
        ? (
            [
              { name: this.translate.instant('SEARCH_CONTROL.PLACEHOLDER_ACCOUNT_CODE'), value: 'N/A' },
            ] as NameValuePair[]
          ).concat(value)
        : this._financialAccountCodeOptions;
  }

  private _financialAccountTypeExpenseOptions: NameValuePair[] = []; // รายการ
  public get financialAccountTypeExpenseOptions(): NameValuePair[] {
    return this._financialAccountTypeExpenseOptions;
  }
  private set financialAccountTypeExpenseOptions(value: NameValuePair[]) {
    this._financialAccountTypeExpenseOptions =
      this._financialAccountTypeExpenseOptions.length === 0 ? value : this._financialAccountTypeExpenseOptions;
  }

  private _lawyerOptions: NameValuePair[] = [];
  public get lawyerOptions(): NameValuePair[] {
    if (this._lawyerOptions.length === 0) {
      const _doneBy: NameValuePair[] = this.masterDataService.advanceOptions.doneBy?.doneBy || [];

      // sort by name
      _doneBy.sort((a, b) => {
        const aName = a.name?.split('-')[1];
        const bName = b.name?.split('-')[1];
        return aName?.localeCompare(bName || '') || 0;
      });

      this._lawyerOptions = (
        [{ name: this.translate.instant('SEARCH_CONTROL.LABEL_ALL_LAWYER'), value: 'N/A' }] as NameValuePair[]
      ).concat(_doneBy?.filter((obj: NameValuePair) => obj.value?.toUpperCase().startsWith('K')) ?? []);
      return this._lawyerOptions;
    }
    return this._lawyerOptions;
  }
  private set lawyerOptions(value: NameValuePair[]) {
    this._lawyerOptions = value;
  }

  private _ledOptions: NameValuePair[] = [];
  public get ledOptions(): NameValuePair[] {
    return this._ledOptions;
  }
  private set ledOptions(value: NameValuePair[]) {
    this._ledOptions =
      this._ledOptions.length === 0
        ? (
            [{ name: this.translate.instant('SEARCH_CONTROL.PLACEHOLDER_LED'), value: 'N/A' }] as NameValuePair[]
          ).concat(value)
        : this._ledOptions;
  }

  constructor(
    private translate: TranslateService,
    private masterDataService: MasterDataService,
    private userService: UserService
  ) {}

  async initOptionsList() {
    this.responseUnitOptions = this.masterDataService.advanceOptions.bcOrg?.ktbOrg || [];
    this.amdUnitOptions = this.masterDataService.advanceOptions.amdOrg?.ktbOrg || [];
    this.lgStatusOptions = this.masterDataService.advanceOptions.litigationCloseStatus?.litigationCloseStatus || [];
    this.caseStatusOptions = this.masterDataService.advanceOptions.legalStatus?.legalStatus || [];
    this.searchScopeOptions = this.masterDataService.advanceOptions.scope?.scope || [];
    this.orgCodeOptions = this.masterDataService.advanceOptions.ktbOrg?.ktbOrg || [];
    this.loanTypeOptions = this.masterDataService.advanceOptions.loanType?.loanType || [];
    this.debtorOptions = this.masterDataService.advanceOptions.debtor?.debtor || [];
    this.samFlagOptions = this.masterDataService.advanceOptions.samFlag?.samFlag || [];
    this.tamcFlagOptions = this.masterDataService.advanceOptions.tamcFlag?.tamcFlag || [];
    this.writeOffStatusOptions = this.masterDataService.advanceOptions.writeOffStatus?.writeOffStatus || [];
    this.debtTransferToOptions = this.masterDataService.advanceOptions.debtTransferTo?.debtTransferTo || [];
    this.caseCreatorOptions = this.masterDataService.advanceOptions.caseCreator?.caseCreator || [];
    this.courtOptions = this.masterDataService.advanceOptions.court?.court || [];
    this.collateralTypeOptions =
      (await this.masterDataService.collateralType()).collateralType?.map(c => ({
        name: c.collateralTypeDesc,
        value: c.collateralTypeCode,
      })) || [];
    this.collateralSubTypeOptions =
      (await this.masterDataService.collateralSubType()).collateralSubType?.map(c => ({
        name: c.collateralSubTypeDesc,
        value: c.collateralSubTypeCode,
      })) || [];
    this.ledOptions =
      (await this.masterDataService.led()).leds?.map(l => ({
        name: l.ledName,
        value: l.ledId?.toString(),
      })) || [];
  }

  async initFinanceExpenseList() {
    this.expenseNoOptions =
      this.masterDataService.expenseOptions.expenseNoOptions?.expenseNo?.map(item => {
        return { name: item, value: item } as NameValuePair;
      }) || [];
    this.expenseStatusOptions =
      this.masterDataService.expenseOptions.expenseStatusOptions?.expenseStatus?.map(es => ({
        name: es.value,
        value: es.name,
      })) || [];
    this.userOptions = this.userService.allUserOptions.map(item => {
      return {
        name: `${item.userId}-${item.name} ${item.surname}`,
        value: item.userId,
      } as NameValuePair;
    });
    this.makerOptions = [...this.userOptions].slice(1, this.userOptions.length);
  }

  async initFinanceReceiptList() {
    this.receiptStatusOptions = this.masterDataService.receiptOptions.receiveStatusOptions?.receiveStatus || [];
    this.receiptTypeOptions = this.masterDataService.receiptOptions.receiveTypeOptions?.receiveType || [];
    // for kcorp
    this.washAccountOptions =
      this.masterDataService.receiptOptions.washAccountOptions?.washAccountNo?.map(item => {
        return { name: item, value: item } as NameValuePair;
      }) || [];
    this.transferStatusOptions = this.masterDataService.receiptOptions.transferStatusOptions?.kcorpTransferStatus || [];
  }

  async initFinanceAdvancePaymentList() {
    this.advancePaymentStatusOptions =
      this.masterDataService.advancePaymentOptions.advancePaymentStatusOptions?.advancePaymentStatus || [];
    this.userOptions = this.userService.allUserOptions.map(item => {
      return {
        name: `${item.userId}-${item.name} ${item.surname}`,
        value: item.userId,
      } as NameValuePair;
    });
  }

  async initSummaryRiembursementList() {
    this.expenseStepTypeOptions = (
      this.masterDataService?.summaryRiemburstmentSearchOption?.expenseStepTypes || []
    ).map(dto => {
      return { name: dto.financialSummaryName, value: dto.stepCode };
    });
    this.financialObjectTypeOptions =
      this.masterDataService.summaryRiemburstmentSearchOption?.financialObjectTypeDto?.financialObjectType || [];
    this.financialAccountTypeOptions =
      this.masterDataService.summaryRiemburstmentSearchOption?.financialAccountTypeDto?.financialAccountTypeDto || [];
    this.financialAccountCodeOptions =
      this.masterDataService.summaryRiemburstmentSearchOption?.financialAccountCodeDto?.financialAccountCodeDto || [];
    this.financialAccountTypeExpenseOptions =
      this.masterDataService.summaryRiemburstmentSearchOption?.financialAccountTypeExpenseDto
        ?.financialAccountTypeDto || [];
  }
}
