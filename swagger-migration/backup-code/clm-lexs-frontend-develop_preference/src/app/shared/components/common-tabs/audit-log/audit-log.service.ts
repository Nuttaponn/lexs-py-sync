import { Injectable } from '@angular/core';
import { LogType } from '@app/shared/constant';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { LoggerService } from '@app/shared/services/logger.service';
import {
  CustomerControllerService,
  ExpenseControllerService,
  LitigationControllerService,
  Pageable,
  PageOfCustomerAuditLogDto,
  PageOfExpenseAuditLogDto,
  PageOfLitigationAuditLogDto,
} from '@lexs/lexs-client';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuditLogService {
  public refreshLogType = new BehaviorSubject<LogType | null>(null);

  constructor(
    private errorHandlingService: ErrorHandlingService,
    private litigationControllerService: LitigationControllerService,
    private customerControllerService: CustomerControllerService,
    private expenseControllerService: ExpenseControllerService,
    private logger: LoggerService
  ) {}

  async getLitigationAuditLog(
    cusId: string,
    auditLogReq: any,
    pageOption: Pageable
  ): Promise<PageOfLitigationAuditLogDto> {
    this.logger.logAPIRequest('Litigation AuditLog ', cusId, auditLogReq, pageOption);
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.litigationControllerService.inquireAuditLog(
          cusId,
          auditLogReq.action,
          pageOption.pageNumber,
          pageOption.pageSize,
          auditLogReq.objectType,
          auditLogReq.userId
        )
      )
    );
  }

  async getCustomerAuditLog(cusId: string, auditLogReq: any, pageOption: Pageable): Promise<PageOfCustomerAuditLogDto> {
    this.logger.logAPIRequest('Customer AuditLog ', cusId, auditLogReq, pageOption);
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.customerControllerService.inquireCustomerAuditLog(
          cusId,
          auditLogReq.action,
          pageOption.pageNumber,
          pageOption.pageSize,
          auditLogReq.objectType,
          auditLogReq.userId
        )
      )
    );
  }

  async getExpenseAuditLog(
    expenseObjectId: string,
    expenseObjectType: string = 'EXPENSE',
    auditLogReq: any,
    pageOption: Pageable,
    sortBy: string = 'timestamp',
    sortOrder: string = 'ASC'
  ): Promise<PageOfExpenseAuditLogDto> {
    this.logger.logAPIRequest(
      'Expense AuditLog ',
      expenseObjectId,
      expenseObjectType,
      auditLogReq,
      pageOption,
      sortBy,
      sortOrder
    );
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.expenseControllerService.inquireExpenseAuditLog(
          expenseObjectId,
          expenseObjectType,
          auditLogReq.action,
          auditLogReq.objectType,
          pageOption.pageNumber,
          pageOption.pageSize,
          sortBy,
          sortOrder,
          auditLogReq.userId
        )
      )
    );
  }
}
