import { Pipe, PipeTransform } from '@angular/core';
import { DebitTransaction, DebtSettlementAccount, ExpenseTransactionDto } from '@lexs/lexs-client';
import { Utils } from '../utils';
import Decimal from 'decimal.js';

@Pipe({
  name: 'expenseAmount',
  pure: false,
})
export class ExpenseAmountPipe implements PipeTransform {
  transform(value: ExpenseTransactionDto[] | any, ...args: any[]): unknown {
    const type = args[0];
    switch (type) {
      case 'EXPENSE':
        return this.sumExpenseAmount(value);
      case 'WT':
        return this.sumWtAmount(value);
      case 'WT_AMOUNT':
        return this.sumWtAmountLoop(value);
      case 'VAT':
        return this.sumVatAmount(value);
      case 'TOTAL':
        return this.sumTotalAmount(value);
      case 'DEBT':
        return this.sumTotalDebtAmount(value);
      case 'DEBIT':
        return this.sumTotalDebitAmount(value);
      case 'DEBT_SETTLEMENT':
        return this.sumTotalDebtSettlementAmount(value);
      case 'DEBT_SETTLEMENT_TOTAL':
        return this.sumTotalDebtSettlementAmountTotal(value);
      case 'DEBT_TOTAL':
        return this.sumTotalDebtTotal(value);
      default:
        return '-';
    }
  }

  sumExpenseAmount(list: ExpenseTransactionDto[]) {
    return list.map(t => Number(t?.expenseAmount)).reduce((acc?: number, value?: number) => acc! + value!, 0);
  }

  sumWtAmount(list: ExpenseTransactionDto[]) {
    return list.map(t => t?.wtAmount).reduce((acc?: number, value?: number) => acc! + value!, 0);
  }

  sumWtAmountLoop(list: ExpenseTransactionDto[]) {
    let sum = 0;
    for (const item of list) {
      sum += Number(item.wtAmount) || 0;
    }
    return sum;
  }

  sumVatAmount(list: ExpenseTransactionDto[]) {
    let sum = 0;
    for (const item of list) {
      sum += Number(item.excludedVatAmount) || 0;
    }
    return sum;
  }

  sumTotalAmount(list: ExpenseTransactionDto[]) {
    let sum = 0;
    for (const item of list) {
      sum += Number(item.totalAmount) || 0;
    }
    return sum;
  }

  sumTotalDebtAmount(list: DebtSettlementAccount[] | any) {
    return list
      .map((t: DebtSettlementAccount) => (t?.debtAmount ? Number(t?.debtAmount) : 0))
      .reduce((prev?: number, current?: number) => this.sum(prev, current), 0);
  }
  sumTotalDebitAmount(list: DebitTransaction[] | any) {
    return list
      .map((t: DebitTransaction) => (t?.debitAmount ? Number(t?.debitAmount) : 0))
      .reduce((prev?: number, current?: number) => this.sum(prev, current), 0);
  }
  sumTotalDebtSettlementAmount(list: DebtSettlementAccount[] | any) {
    return list
      .map((t: any) => {
        if (typeof t?.debtSettlementAmount === 'string') {
          return Utils.convertStringToNumber(t?.debtSettlementAmount) || 0;
        } else {
          return t?.debtSettlementAmount || 0;
        }
      })
      .reduce((prev?: number, current?: number) => this.sum(prev, current), 0);
  }
  sumTotalDebtSettlementAmountTotal(list: DebtSettlementAccount[] | any) {
    return list
      .map((t: any) => {
        if (typeof t?.debtSettlementAmountTotal === 'string') {
          return Utils.convertStringToNumber(t?.debtSettlementAmountTotal) || 0;
        } else {
          return t?.debtSettlementAmountTotal || 0;
        }
      })
      .reduce((prev?: number, current?: number) => this.sum(prev, current), 0);
  }
  sumTotalDebtTotal(list: DebtSettlementAccount[] | any) {
    return list
      .map((t: any) => {
        if (typeof t?.debtAmountTotal === 'string') {
          return Utils.convertStringToNumber(t?.debtAmountTotal) || 0;
        } else {
          return t?.debtAmountTotal || 0;
        }
      })
      .reduce((prev?: number, current?: number) => this.sum(prev, current), 0);
  }

  sum(prev?: number, current?: number) {
    let currentDigit = new Decimal(current || 0);
    let prevDigi = new Decimal(prev || 0);
    let sumDigit = currentDigit.plus(prevDigi);
    return sumDigit.toNumber();
  }
}
