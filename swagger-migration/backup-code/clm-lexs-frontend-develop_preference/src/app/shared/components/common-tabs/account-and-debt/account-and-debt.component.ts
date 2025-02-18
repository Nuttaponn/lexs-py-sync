import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { AccountDto, LitigationDetailDto, LitigationDto, MeLexsUserDto, NameValuePair } from '@lexs/lexs-client';
import { RouterService } from '@shared/services/router.service';
import { DialogOptions, DropDownConfig, SimpleSelectOption } from '@spig/core';
import { DebtSummaryDataSource } from './account-and-debt.model';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { SearchConditionRequest } from '@app/shared/components/search-controller/search-controller.model';
import { LexsUserPermissionCodes } from '@app/shared/models';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { SessionService } from '@app/shared/services/session.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonTabsService } from '../common-tabs.service';
import { AddSubAccountComponent } from './add-sub-account/add-sub-account.component';

interface IExtendAccountDto extends AccountDto {
  totalDebt?: number;
  newSubAccount?: boolean;
}
@Component({
  selector: 'app-account-and-debt',
  templateUrl: './account-and-debt.component.html',
  styleUrls: ['./account-and-debt.component.scss'],
})
export class AccountAndDebtComponent implements OnInit, OnChanges {
  public litigationDetailDto!: LitigationDetailDto;
  public isBtnSubAccount: boolean = false;
  @ViewChild(MatTable) table!: MatTable<any>;
  public accounts: IExtendAccountDto[] = [];

  public accountAndDebtColumns: string[] = [
    'no',
    'accountNo',
    'billNo',
    'dpd',
    'cfinal',
    'loanType', // code + name
    'outstandingBalance',
    'expiryDate',
    'branchName',
    'responseUnitName',
    'tdrInfo',
    'litigationStatus', // lookup master data
  ];
  public displayedTotalColumns = [
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'summaryAllLabel',
    'summaryAll',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooter',
    'emptyFooterElevationRightStaking',
  ];
  public summaryAll = 0;
  public debtSummaryDataSource: DebtSummaryDataSource[] = [];
  public debtSummaryColumns: string[] = ['debtPayload', 'accountDebt', 'badDebt'];

  public lawsuitStatusConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    searchPlaceHolder: '',
  };
  public lawsuitStatusOptions: SimpleSelectOption[] = [{ text: 'ทุกสถานะคดีความ', value: 'ALL_LAWSUIT_STATUS' }];

  public tempLawsuitStatusOptions: SimpleSelectOption[] = [];
  public lawsuitStatusCtrl: UntypedFormControl = new UntypedFormControl();
  public lastPaidDate: string = '';

  private selection = new SelectionModel<LitigationDto>(true, []);
  constructor(
    private routerService: RouterService,
    private translateService: TranslateService,
    private masterDataService: MasterDataService,
    private lawsuitService: LawsuitService,
    private notificationService: NotificationService,
    private sessionService: SessionService,
    private commonTabsService: CommonTabsService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(value => {
      if (value && value['isBtnSubAccount']) {
        this.isBtnSubAccount = value['isBtnSubAccount'];
      }
    });
  }

  private currentUser!: MeLexsUserDto;
  public isShowLayout = false;

  async ngOnInit(): Promise<void> {
    this.litigationDetailDto = this.lawsuitService.currentLitigation;
    const legalStatusDto = await this.masterDataService.legalStatus();
    legalStatusDto.legalStatus?.forEach((obj: NameValuePair) => {
      const opt: SimpleSelectOption = {
        text: obj.name ?? '',
        value: obj.value ?? '',
      };
      this.lawsuitStatusOptions.push(opt);
    });

    this.initPage();
    this.currentUser = this.sessionService.currentUser as MeLexsUserDto;

    const accountObj = this.accounts
      ?.filter(obj => obj.lastPaidDate)
      .reduce((a, b) => {
        return new Date(String(a.lastPaidDate || null)) > new Date(String(b.lastPaidDate || null)) ? a : b;
      }, {});
    this.lastPaidDate = String(accountObj?.lastPaidDate || '');
    this.isShowLayout = true;
  }

  ngOnChanges(): void {
    this.initPage();
  }

  initPage() {
    this.lawsuitStatusOptions = this.lawsuitStatusOptions.concat(this.tempLawsuitStatusOptions);

    this.lawsuitStatusCtrl.setValue(this.lawsuitStatusOptions[0].value);
    this.accounts = this.mapExtendAccountDto();
    this.summaryAll = this.litigationDetailDto?.accountInfo?.summaryAll ?? 0.0;
    this.debtSummaryDataSource = this.convertDebtSummaryToDatasource();
  }

  mapExtendAccountDto(): IExtendAccountDto[] {
    if (!!this.litigationDetailDto?.accountInfo?.accounts) {
      return this.litigationDetailDto?.accountInfo?.accounts.map(x => {
        return {
          ...x,
          totalDebt: this.sumTotalDebt(x),
        };
      });
    }
    return [];
  }

  filterLawsuitStatus(event: any) {
    if (this.lawsuitStatusCtrl.value === 'ALL_LAWSUIT_STATUS') {
      this.accounts = this.litigationDetailDto.accountInfo?.accounts || [];
    } else {
      this.accounts = this.litigationDetailDto.accountInfo?.accounts || [];

      const option = this.lawsuitStatusOptions.find(
        (item: SimpleSelectOption) => item.value === this.lawsuitStatusCtrl.value
      );
      this.accounts = this.accounts.filter((ac: AccountDto) => ac.litigationStatus === option?.text);
    }
  }

  convertDebtSummaryToDatasource(): DebtSummaryDataSource[] {
    return [
      {
        debtPayload: 'LAWSUIT.DEBT_SUMMARY_NAME_ROW_1',
        accountDebt: this.litigationDetailDto?.accountInfo?.totalOutstandingPrincipal ?? 0.0,
        badDebt: this.litigationDetailDto?.accountInfo?.totalBadOutstandingPrincipal ?? 0.0,
      },
      {
        debtPayload: 'LAWSUIT.DEBT_SUMMARY_NAME_ROW_2',
        accountDebt: this.litigationDetailDto?.accountInfo?.totalOutstandingAccruedInterest ?? 0.0,
        badDebt: this.litigationDetailDto?.accountInfo?.totalBadOutstandingAccruedInterest ?? 0.0,
      },
      {
        debtPayload: 'LAWSUIT.DEBT_SUMMARY_NAME_ROW_3',
        accountDebt: this.litigationDetailDto?.accountInfo?.totalInterestNonBook ?? 0.0,
        badDebt: this.litigationDetailDto?.accountInfo?.totalBadInterestNonBook ?? 0.0,
      },
      {
        debtPayload: 'LAWSUIT.DEBT_SUMMARY_NAME_ROW_4',
        accountDebt: this.litigationDetailDto?.accountInfo?.totalLateChargeAmount ?? 0.0,
        badDebt: this.litigationDetailDto?.accountInfo?.totalBadLateChargeAmount ?? 0.0,
      },
      {
        debtPayload: 'LAWSUIT.DEBT_SUMMARY_NAME_ROW_5',
        accountDebt: this.litigationDetailDto?.accountInfo?.summaryDebt ?? 0.0,
        badDebt: this.litigationDetailDto?.accountInfo?.summaryBadDebt ?? 0.0,
      },
    ];
  }

  onClickAccountDetail(accountIndex: number) {
    // set current accountDetail
    this.lawsuitService.currentAccountDetail = this.accounts[accountIndex];

    this.routerService.navigateTo(`/main/lawsuit/detail/account-detail`, {
      typeEnum: SearchConditionRequest.TypeEnum.BY_LAWSUIT,
    });
  }

  async modalAddSubAccount(accountList: AccountDto[]): Promise<any> {
    const myContext = {
      icontents: this.selection.selected,
      accountList,
    };
    const dialogSetting: DialogOptions = {
      component: AddSubAccountComponent,
      title: 'CUSTOMER.ADD_SUB_ACCOUNT',
      iconName: 'icon-Plus',
      rightButtonLabel: 'COMMON.BUTTON_SAVE',
      buttonIconName: 'icon-save-primary',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      context: myContext,
      panelCssClasses: ['no-padding'],
      backButtonLabel: '',
      contentCssClasses: [''],
      disableRightButton: accountList.length > 0 ? false : true,
    };

    return await this.notificationService.showCustomDialog(dialogSetting);
  }
  async onClickBtnAddSubAccount() {
    // Verify if any 'case' in LitigationDetail already has 'red Case no' or not
    if (this.litigationDetailDto?.cases?.some(x => !!x.redCaseNo)) {
      const resultAccountList = await this.lawsuitService.listAvailableSubAccounts(
        this.litigationDetailDto?.litigationId!
      );
      const result: AccountDto[] = await this.modalAddSubAccount(resultAccountList);
      if (result) {
        try {
          const body = {
            accountIds: result.map((account: AccountDto) => {
              return account?.accountId;
            }),
          };
          await this.lawsuitService.updateSubAccounts(this.litigationDetailDto?.litigationId!, body);
          const mgs = `${this.translateService.instant(
            'CUSTOMER.ACCOUNTS_AND_DEBTS_HAVE_BEEN_SUBMITTED_FOR_APPROVAL'
          )}`;
          this.notificationService.openSnackbarSuccess(mgs);
          const countOldSubAccount: number = this.accounts?.length + 1;
          const subAccounts = result.map(x => {
            return {
              ...x,
              newSubAccount: true,
              totalDebt: this.sumTotalDebt(x),
            };
          });

          this.accounts = this.accounts.concat(subAccounts);
          const countNewSubAccount: number = this.accounts?.length;
          const summaryResult = result
            .map((data: any) => +data?.outstandingBalance)
            .reduce((partialSum: any, a: any) => partialSum + a, 0);
          this.summaryAll = +summaryResult + +this.summaryAll;
          this.debtSummaryDataSource = this.convertDebtSummaryToDatasource();
          this.commonTabsService.accountDebtBanner.next(
            `${this.translateService.instant(
              'LAWSUIT.ACC_DETAIL.ACCOUNT_AND_DEBT_INFORMATION_NO'
            )} ${countOldSubAccount} ${countOldSubAccount < countNewSubAccount ? '- ' + countNewSubAccount : ''}`
          );
        } catch (error: any) {
          this.notificationService.openSnackbarError(
            error?.error?.errors[0]?.description ??
              this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR')
          );
        }
        this.selection.clear();
      }
    } else {
      await this.notificationService.alertDialog(
        'CUSTOMER.ADD_SUB_ACCOUNT_HEADER_FAIL',
        'CUSTOMER.ADD_SUB_ACCOUNT_DETAIL_FAIL'
      );
    }
  }

  get subAccountValidate(): boolean {
    return this.currentUser?.permissions?.includes(LexsUserPermissionCodes.LAWSUIT_ADD_SUB_ACCOUNT) ?? false;
  }

  sumTotalDebt(element: AccountDto) {
    return (
      Number(element.outstandingBalance ?? 0) +
      Number(element.outstandingAccruedInterest ?? 0) +
      Number(element.interestNonBook ?? 0) +
      Number(element.lateChargeAmount ?? 0)
    );
  }

  onRouteProfileDirect() {
    this.routerService.navigateTo('/main/customer/profile-direct', {
      litigationId: this.litigationDetailDto.litigationId,
      cifNo: this.litigationDetailDto.customerId,
    });
  }
}
