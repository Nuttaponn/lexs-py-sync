import { AccountDto, ExpenseDto } from '@lexs/lexs-client';

export interface DisplayCloseLgAccount extends AccountDto {
  isSum?: boolean;
  summaryDebt?: number;
}

export interface DisplayCloseLgExpense extends ExpenseDto {
  isSum?: boolean;
  totalBalance?: number;
  totalExpense?: number;
}
