import { Component, OnInit } from '@angular/core';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { Utils } from '@app/shared/utils/util';
import { ExpenseTransactionDto } from '@lexs/lexs-client';
import { DropDownConfig } from '@spig/core';
import { ExpenseService } from '../../services/expense.service';
import { IExpenseType } from '../create-payment-book/create-payment-book.component';

@Component({
  selector: 'app-expense-withdrawal-info-dialog',
  templateUrl: './expense-withdrawal-info-dialog.component.html',
  styleUrls: ['./expense-withdrawal-info-dialog.component.scss'],
})
export class ExpenseWithdrawalInfoDialogComponent implements OnInit {
  public expenseTypeConfig: DropDownConfig = {
    displayWith: 'expenseTypeFullName',
    valueField: 'expenseSubTypeCode',
    searchPlaceHolder: '',
  };
  public expenseType: Array<IExpenseType> = [];
  public expenseSubTypeCodeList: string[] = [];
  private stepSubCode?: string;
  private litigationDetailList: ExpenseTransactionDto[] = [];
  private oldLitigationDetailList: ExpenseTransactionDto[] = [];
  public sumLitigationDetailList?: number;
  public showErrorBanner: boolean = false;
  // table
  public tableList: any[] = [];
  public tableColumns: string[] = ['no', 'list', 'amount'];

  constructor(
    private masterDataService: MasterDataService,
    public expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  async initData() {
    this.expenseType = await this.masterDataService.expenseRate(
      [1],
      undefined,
      undefined,
      undefined,
      undefined,
      this.stepSubCode
    );
    this.mapOptionExpenseType();
    this.tableList = this.litigationDetailList;
    const expenseSubTypeCode: string[] = [];
    this.litigationDetailList.forEach(e => {
      expenseSubTypeCode.push(e.expenseSubTypeCode || '');
    });
    this.expenseSubTypeCodeList = expenseSubTypeCode;
  }

  async dataContext(data: any) {
    this.stepSubCode = data.stepSubCode;
    this.oldLitigationDetailList = Utils.deepClone(data.litigationDetailList);
    this.litigationDetailList = data.litigationDetailList;
    this.sumLitigationDetailList = data.sumLitigationDetailList;
  }

  mapOptionExpenseType() {
    this.expenseType.forEach(e => {
      e.expenseTypeFullName = e.expenseTypeCode + ' ' + e.expenseSubTypeName;
    });
  }

  onSelectedExpenseType(event: string, index: number) {
    this.showErrorBanner = false;
    const findExpenseType = this.expenseType.find(e => e.expenseSubTypeCode === event);
    if (findExpenseType) {
      this.litigationDetailList[index] = {
        ...this.litigationDetailList[index],
        expenseSubTypeCode: findExpenseType.expenseSubTypeCode,
        expenseSubTypeName: findExpenseType.expenseSubTypeName,
        expenseTypeCode: findExpenseType.expenseTypeCode,
        expenseTypeName: findExpenseType.expenseTypeName,
        expenseRateId: findExpenseType.id,
      };
    }
  }

  get returnData() {
    return { litigationDetailList: this.litigationDetailList };
  }

  public async onClose(): Promise<boolean> {
    // check duplicate
    const valueArr = this.litigationDetailList.map(function (item) {
      return item.expenseSubTypeCode;
    });
    const isDuplicate = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) != idx;
    });
    if (isDuplicate) {
      this.showErrorBanner = true;
      return false;
    }
    try {
      this.litigationDetailList.forEach((e, i) => {
        if (Object.entries(e).toString() !== Object.entries(this.oldLitigationDetailList[i]).toString()) {
          this.expenseService.hasEdit = true;
          return;
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
