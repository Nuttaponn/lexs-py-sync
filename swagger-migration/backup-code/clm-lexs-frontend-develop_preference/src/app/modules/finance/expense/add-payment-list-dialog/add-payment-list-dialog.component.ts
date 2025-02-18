import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { TMode } from '@app/shared/models';
import { Utils } from '@app/shared/utils/util';
import { ExpenseTransactionDto, InquiryLitigationDto } from '@lexs/lexs-client';
import { PaginatorActionConfig, PaginatorResultConfig } from '@spig/core';
import { ExpenseService } from '../../services/expense.service';
import { LoggerService } from '@app/shared/services/logger.service';

@Component({
  selector: 'app-add-payment-list-dialog',
  templateUrl: './add-payment-list-dialog.component.html',
  styleUrls: ['./add-payment-list-dialog.component.scss'],
})
export class AddPaymentListDialogComponent implements OnInit {
  public isSearch: boolean = false;
  public isContinueClicked: boolean = false;
  public islgClosedNotSame: boolean = false;
  private firstTransaction!: ExpenseTransactionDto;
  private mode!: TMode;
  // search
  public searchString: UntypedFormControl = new UntypedFormControl(undefined);
  public placeholder: string = 'FINANCE.ADD_PAYMENT_LIST_DIALOG.SEARCH_PLACEHOLDER';
  // table
  public tablePageResultConfig!: PaginatorResultConfig;
  public tablePageActionConfig!: PaginatorActionConfig;
  private pageSize = 10;
  public selected: UntypedFormControl = new UntypedFormControl(undefined, Validators.required);
  public tableList: InquiryLitigationDto[] = [];
  public tableColumns: string[] = [
    'selected',
    'litigationId',
    'blackCaseNo',
    'customerId',
    'customerName',
    'customerStatusName',
  ];

  private expenseRateId: string = '';
  private isCaseExecutionSeizureAsset: boolean = false;

  constructor(
    private expenseService: ExpenseService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    // get first transaction
    if (!!this.expenseService.expenseTransactionList) {
      if (this.mode === TMode.EDIT && this.expenseService.expenseTransactionList.length === 1) {
        return;
      }
      this.firstTransaction = this.expenseService.expenseTransactionList[0];
    } else if (
      !!this.expenseService.expenseDetail.expenseTransactionDto &&
      this.expenseService.expenseDetail.expenseTransactionDto.length > 0
    ) {
      if (this.mode === TMode.EDIT && this.expenseService.expenseDetail.expenseTransactionDto.length === 1) {
        return;
      }
      this.firstTransaction = this.expenseService.expenseDetail.expenseTransactionDto[0];
    }
  }

  async getDataTable(page?: number, searchString?: string, size?: number) {
    const expenseRateId = this.isCaseExecutionSeizureAsset ? this.expenseRateId : '';
    const res = await this.expenseService.getLitigationList(expenseRateId, page, searchString, size);
    this.tableList = res.content || [];
    const { resultConfig, actionConfig } = Utils.setPagination(
      res.pageable,
      res.numberOfElements,
      res.totalPages,
      res.totalElements
    );
    this.tablePageResultConfig = resultConfig;
    this.tablePageActionConfig = actionConfig;
  }

  async dataContext(data: any) {
    this.logger.info('dataContext AddPaymentListDialogComponent', data);
    this.mode = data?.mode;
    this.isCaseExecutionSeizureAsset = data.isCaseExecutionSeizureAsset;
    this.expenseRateId = data.expenseRateId;
  }

  onSearch() {
    this.isSearch = true;
    this.selected.patchValue(undefined);
    this.getDataTable(0, this.searchString.value, this.pageSize);
  }

  onSelectLitigation() {
    this.islgClosedNotSame = false;
  }

  async pageEvent(event: number) {
    await this.getDataTable(event - 1, this.searchString.value, this.pageSize);
  }

  get returnData() {
    return this.selected.value;
  }

  public async onClose(): Promise<boolean> {
    this.isContinueClicked = true;
    this.searchString.markAsTouched();
    this.selected.markAsTouched();
    if (this.selected.invalid) {
      return false;
    }
    // check litigationClosed same type
    if (!!this.firstTransaction && this.firstTransaction.litigationClosed !== this.selected.value?.litigationClosed) {
      this.islgClosedNotSame = true;
      return false;
    }
    try {
      return true;
    } catch (error) {
      return false;
    }
  }
}
