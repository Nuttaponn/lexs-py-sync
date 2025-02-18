import { AfterViewChecked, Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { CustomerService } from '@app/modules/customer/customer.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { RouterService } from '@app/shared/services/router.service';
import { AccountDto, AccountInfo, NameValuePair } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';
import { SearchConditionRequest } from '../../search-controller/search-controller.model';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
})
export class AccountInfoComponent implements OnInit, AfterViewChecked {
  @ViewChild(MatTable) table!: MatTable<any>;

  private _accountInfo: AccountInfo = this.customerService.customerDetail?.accountInfo || {};
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('accountInfo')
  public set accountInfo(object: AccountInfo) {
    this._accountInfo = { ...object } || this.customerService.customerDetail.accountInfo;
  }
  public get accountInfo(): AccountInfo {
    return this._accountInfo;
  }

  public accounts: Array<AccountDto> = [];
  public debtSummaryDataSource: Array<any> = [];
  public debtSummaryColumns: string[] = ['debtPayload', 'accountDebt', 'badDebt'];
  public liabilityInfoColumns: string[] = [
    'no',
    'accountNo',
    'billNo',
    'dayPastDue',
    'cFlag',
    'loanType',
    'loanSummaryAmount',
    'expiryDate',
    'branchName',
    'responseUnitName',
    'tdrInfo',
    'litigationId',
    'litigationStatus',
  ];
  public selectedCaseStatus: UntypedFormControl = new UntypedFormControl('');
  public dropDownFilterOption: SimpleSelectOption[] = [];
  public dropDownFilterConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'text',
    valueField: 'value',
    searchPlaceHolder: '',
  };
  public defaultDropdownItem: SimpleSelectOption[] = [
    { text: this.translateService.instant('CUSTOMER.LIABILITY.FILTER_ALL_CASE_STATUS'), value: 'ALL' },
  ];
  public dateWarning = this.translateService.instant('CUSTOMER.LIABILITY.DATE_WARNING');
  public lastPaidDate: string = '';
  constructor(
    private masterDataService: MasterDataService,
    private routerService: RouterService,
    private translateService: TranslateService,
    private customerService: CustomerService,
    private taskService: TaskService
  ) {}

  async ngOnInit(): Promise<void> {
    this.accountInfo = this.accountInfo;
    let legalStatus: NameValuePair[] = (await this.masterDataService.legalStatus()).legalStatus || [];
    this.dropDownFilterOption = legalStatus?.map(res => {
      return {
        text: res.name,
        value: res.name,
      } as SimpleSelectOption;
    });
    this.dropDownFilterOption = [...this.defaultDropdownItem, ...this.dropDownFilterOption];
    this.selectedCaseStatus.setValue(this.dropDownFilterOption[0].value);
    this.accounts = this.accountInfo.accounts || [];
    this.debtSummaryDataSource = this.convertDebtSummaryToDatasource();

    const accountObj = this.accounts
      ?.filter(obj => obj.lastPaidDate)
      .reduce((a, b) => {
        return new Date(String(a.lastPaidDate || null)) > new Date(String(b.lastPaidDate || null)) ? a : b;
      }, {});
    this.lastPaidDate = String(accountObj?.lastPaidDate || '');
  }

  ngAfterViewChecked(): void {
    if (this.table) {
      this.table.updateStickyColumnStyles();
    }
  }

  convertDebtSummaryToDatasource() {
    return [
      {
        debtPayload: 'LAWSUIT.DEBT_SUMMARY_NAME_ROW_1',
        accountDebt: this.accountInfo?.totalOutstandingPrincipal ?? 0.0,
        badDebt: this.accountInfo?.totalBadOutstandingPrincipal ?? 0.0,
      },
      {
        debtPayload: 'LAWSUIT.DEBT_SUMMARY_NAME_ROW_2',
        accountDebt: this.accountInfo?.totalOutstandingAccruedInterest ?? 0.0,
        badDebt: this.accountInfo?.totalBadOutstandingAccruedInterest ?? 0.0,
      },
      {
        debtPayload: 'LAWSUIT.DEBT_SUMMARY_NAME_ROW_3',
        accountDebt: this.accountInfo?.totalInterestNonBook ?? 0.0,
        badDebt: this.accountInfo?.totalBadInterestNonBook ?? 0.0,
      },
      {
        debtPayload: 'LAWSUIT.DEBT_SUMMARY_NAME_ROW_4',
        accountDebt: this.accountInfo?.totalLateChargeAmount ?? 0.0,
        badDebt: this.accountInfo?.totalBadLateChargeAmount ?? 0.0,
      },
      {
        debtPayload: 'LAWSUIT.DEBT_SUMMARY_NAME_ROW_5',
        accountDebt: this.accountInfo?.summaryDebt ?? 0.0,
        badDebt: this.accountInfo?.summaryBadDebt ?? 0.0,
      },
    ];
  }

  onClickAccountDetail(accountIndex: number) {
    this.taskService.isNotClearCurrentTab = true;
    this.customerService.isNotClearCurrentTab = true;
    // set current accountDetail
    this.customerService.currentAccountDetail = this.accounts[accountIndex];

    this.routerService.navigateTo(`/main/customer/detail/account-detail`, {
      typeEnum: SearchConditionRequest.TypeEnum.BY_CUSTOMER,
      customerId: this.customerService.customerDetail.customerId,
    });
  }

  filterCaseStatus() {
    if (this.selectedCaseStatus.value === 'ALL') {
      this.accounts = this.accountInfo.accounts || [];
    } else {
      this.accounts = this.accountInfo.accounts
        ? this.accountInfo.accounts.filter(it => it['litigationStatus'] === this.selectedCaseStatus.value)
        : [];
    }
  }

  getLoanSummary(
    outstandingBalance: string,
    outstandingAccruedInterest: string,
    interestNonBook: string,
    lateChargeAmount: string
  ) {
    return (
      parseFloat(outstandingBalance) +
      parseFloat(outstandingAccruedInterest) +
      parseFloat(interestNonBook) +
      parseFloat(lateChargeAmount)
    );
  }

  gotoLawsuitDetail(element: AccountDto) {
    this.routerService.navigateTo('/main/lawsuit/detail', {
      lgId: element.litigationId,
    });
  }

  onRouteProfileDirect() {
    this.customerService.tempCustomerId =
      this.customerService?.customerDetail?.customerId || this.customerService.tempCustomerId;
    this.routerService.navigateTo('/main/customer/profile-direct', {
      cifNo: this.customerService.tempCustomerId,
    });
  }
}
