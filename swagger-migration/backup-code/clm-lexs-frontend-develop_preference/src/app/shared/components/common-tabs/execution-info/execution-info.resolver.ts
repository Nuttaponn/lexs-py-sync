import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ExecutionWarrantService } from '@app/modules/execution-warrant/execution-warrant.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { WithdrawnWritExecutionService } from '@app/modules/withdrawn-writ-execution/withdrawn-writ-execution.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { WithdrawWritOfExecByLitigationResponse } from '@lexs/lexs-client';

@Injectable({
  providedIn: 'root',
})
export class ExecutionInfoResolver {
  constructor(
    private executionWarrantService: ExecutionWarrantService,
    private lawsuitService: LawsuitService,
    private taskService: TaskService,
    private withdrawnWritExecutionService: WithdrawnWritExecutionService,
    private logger: LoggerService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let _litigationId =
      this.lawsuitService.currentLitigation.litigationId || this.taskService.taskDetail.litigationId || '';
    if (_litigationId !== '') {
      this.executionWarrantService.litigationWritOfExec =
        await this.executionWarrantService.getLegalExecutionWritOfExecsByLgId(_litigationId);
      try {
        this.executionWarrantService.withdrawWritOfExecByLitigationResponse =
          await this.withdrawnWritExecutionService.getWithdrawWritOfExecByLitigation(_litigationId);
      } catch (error) {
        this.executionWarrantService.withdrawWritOfExecByLitigationResponse =
          {} as WithdrawWritOfExecByLitigationResponse;
      }
    }
    this.logger.logResolverEnd('executionWarrantService', this.executionWarrantService.litigationWritOfExec);
    return true;
  }
}
