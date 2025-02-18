import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DebtSummaryDataSource } from '@app/shared/components/common-tabs/account-and-debt/account-and-debt.model';
import { CollateralStatusAlternate } from '@app/shared/constant';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { CollType, CollateralDto, LitigationDetailDto, NameValuePair } from '@lexs/lexs-client';
import { DropDownConfig } from '@spig/core';

@Component({
  selector: 'app-deferment-detail-sub',
  templateUrl: './deferment-detail-sub.component.html',
  styleUrls: ['./deferment-detail-sub.component.scss'],
})
export class DefermentDetailSubComponent implements OnInit {
  @Input() litigationDetailDto!: LitigationDetailDto;

  constructor(private masterDataService: MasterDataService) {}
  private configDropdown: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    labelPlaceHolder: 'AUCTION_LED_CARD.DEFERMENT_DEBT.ALL_COLLATERAL_STATUS',
  };
  isOpened: boolean[] = [];
  debtSummaryDataSource: DebtSummaryDataSource[] = [];
  public debtSummaryColumns: string[] = ['debtPayload', 'accountDebt', 'badDebt'];
  public statusDropdownConfig: DropDownConfig = this.configDropdown;
  public statusOptions: NameValuePair[] = [];
  statusForm: UntypedFormGroup = new UntypedFormGroup({});

  public collateralsByType: { [key: string]: CollateralDto[] } = {};
  public filteredCollateralsByType: { [key: string]: CollateralDto[] } = {};
  public collateralTypes: CollType[] = [];
  public calculatedCollateralTypes: string[] = [];

  public CIFSubColumns: string[] = [
    'no',
    'collateralId',
    'collateralSubTypeDesc',
    'documentNo',
    'totalAppraisalValue',
    'appraisalDate',
    'ownerName',
    'insurancePolicyNumber',
    'botCode',
    'calculatedCollateralStatus',
  ];

  async ngOnInit(): Promise<void> {
    this.statusOptions = CollateralStatusAlternate;

    this.debtSummaryDataSource = this.convertDebtSummaryToDatasource();
    this.collateralTypes = (await this.masterDataService.collateralType()).collateralType || [];
    this.initCollateralInfo();
  }

  initCollateralInfo() {
    let list =
      this.litigationDetailDto?.collateralInfo?.collaterals?.filter(
        e => e.calculatedCollateralStatus?.toUpperCase() !== 'RELEASED'
      ) || [];
    list.forEach(col => {
      if (this.collateralsByType[col.collateralTypeDesc || '']) {
        this.collateralsByType[col.collateralTypeDesc || ''].push(col);
      } else {
        this.collateralsByType[col.collateralTypeDesc || ''] = [col];
      }
    });
    this.isOpened = new Array(Object.keys(this.collateralsByType).length).fill(true);
    this.calculatedCollateralTypes = Object.keys(this.collateralsByType);
    this.filteredCollateralsByType = { ...this.collateralsByType };
  }

  onStatusSelect(collateralType: string, value: string) {
    if (value !== 'ALL') {
      this.filteredCollateralsByType[collateralType] = this.collateralsByType[collateralType].filter(
        c => c.calculatedCollateralStatus?.toUpperCase() === value.toUpperCase()
      );
    } else {
      this.filteredCollateralsByType[collateralType] = [...this.collateralsByType[collateralType]];
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
}
