import { Injectable } from '@angular/core';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { TaskControllerService, TaskTransferRequest } from '@lexs/lexs-client';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  constructor(
    private errorHandlingService: ErrorHandlingService,
    private taskControllerService: TaskControllerService,
    private logger: LoggerService
  ) {}

  /** API Controller */
  async transferExpenseTask(request: TaskTransferRequest) {
    this.logger.logAPIRequest('transferExpenseTask ~ request :: ', request);
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.taskControllerService.transferExpenseTask(request))
    );
  }
}
