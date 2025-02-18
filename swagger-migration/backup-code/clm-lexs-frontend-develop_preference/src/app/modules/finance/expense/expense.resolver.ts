import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoggerService } from '@app/shared/services/logger.service';
import { ExpenseService } from '../services/expense.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseResolver {
  private expenseObjectId!: string;

  constructor(
    private expenseService: ExpenseService,
    private logger: LoggerService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('ExpenseResolver');
    this.expenseObjectId = route.queryParamMap.get('expenseObjectId') || '';
    if (this.expenseObjectId !== '') {
      this.expenseService.expenseDetail = await this.expenseService.getExpenseDetail(this.expenseObjectId);
    }

    this.logger.logResolverEnd('ExpenseResolver');
    return true;
  }
}
