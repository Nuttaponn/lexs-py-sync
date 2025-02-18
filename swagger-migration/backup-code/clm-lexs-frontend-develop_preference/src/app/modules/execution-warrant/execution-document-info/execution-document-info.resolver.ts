import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { TMode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { ExecutionWarrantService } from '../execution-warrant.service';

@Injectable({
  providedIn: 'root',
})
export class ExecutionDocumentInfoResolver {
  private litigationCaseId!: string;
  private litigationId!: string;

  constructor(
    private executionWarrantService: ExecutionWarrantService,
    private litigationCaseService: LitigationCaseService,
    private logger: LoggerService,
    private taskService: TaskService,
    private lawsuitService: LawsuitService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('ExecutionDocumentInfoResolver');

    const mode: TMode = route.queryParams['mode'];
    this.litigationCaseId = route.queryParams['litigationCaseId'] || '';
    if (mode === 'EDIT') {
      this.litigationId = this.taskService.taskDetail.litigationId || '';
    } else {
      this.litigationId = this.lawsuitService.currentLitigation.litigationId || '';
    }

    this.executionWarrantService.litigationCaseDebtCalculation =
      await this.executionWarrantService.getDebtCalculationInfo(Number(this.litigationCaseId));
    this.logger.logResolverProcess(
      'ExecutionDocumentInfoResolver litigationCaseDebtCalculation : ',
      this.executionWarrantService.litigationCaseDebtCalculation
    );
    const accountResponse = await this.litigationCaseService.getLitigationCaseAccountDocuments(
      Number(this.litigationCaseId)
    );
    this.litigationCaseService.accountDocuments = accountResponse.accountDocuments || [];
    this.logger.logResolverProcess(
      'ExecutionDocumentInfoResolver accountDocuments : ',
      this.litigationCaseService.accountDocuments
    );
    const caseDocumentsResponse = await this.litigationCaseService.getLitigationCaseDocuments(
      Number(this.litigationCaseId)
    );
    this.litigationCaseService.litigationCaseDocuments = caseDocumentsResponse.litigationCaseDocuments || [];
    this.logger.logResolverProcess(
      'ExecutionDocumentInfoResolver litigationCaseDocuments : ',
      this.litigationCaseService.litigationCaseDocuments
    );
    this.executionWarrantService.legalExecutionWritOfExecsByLgIdAngLgCaseId =
      await this.executionWarrantService.getLegalExecutionWritOfExecsByLgIdAngLgCaseId(
        Number(this.litigationCaseId),
        this.litigationId
      );
    this.logger.logResolverProcess(
      'ExecutionDocumentInfoResolver legalExecutionWritOfExecsByLgIdAngLgCaseId : ',
      this.executionWarrantService.legalExecutionWritOfExecsByLgIdAngLgCaseId
    );
    this.logger.logResolverEnd('ExecutionDocumentInfoResolver');
    return true;
  }
}
