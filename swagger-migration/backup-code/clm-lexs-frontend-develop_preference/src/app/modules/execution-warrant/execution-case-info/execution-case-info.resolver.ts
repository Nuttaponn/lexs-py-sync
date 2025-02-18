import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CourtService } from '@app/modules/court/court.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { UserService } from '@app/modules/user/user.service';
import { TMode, taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { LexsUserOption } from '@lexs/lexs-client';
import { ExecutionWarrantService } from '../execution-warrant.service';

@Injectable({
  providedIn: 'root',
})
export class ExecutionCaseInfoResolver {
  private taskCode!: taskCode;
  private taskId!: number | undefined;

  /**
   * litigationCaseId and litigationId of execution case info resolver
   *  task menu get from this.taskService.taskDetail
   *  itigation menu get from routing params
   */
  private litigationCaseId!: string;
  private litigationId!: string;

  constructor(
    private litigationCaseService: LitigationCaseService,
    private lawsuitService: LawsuitService,
    private courtService: CourtService,
    private taskService: TaskService,
    private userService: UserService,
    private executionWarrantService: ExecutionWarrantService,
    private logger: LoggerService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('ExecutionDocumentInfoResolver');
    const mode: TMode = route.queryParams['mode'];
    this.litigationCaseId = route.queryParams['litigationCaseId'] || '';
    if (mode === 'EDIT') {
      this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
      this.taskId = this.taskService.taskDetail.id;
      this.litigationId = this.taskService.taskDetail.litigationId || '';
    } else {
      this.litigationId = this.lawsuitService.currentLitigation.litigationId || '';
    }

    this.litigationCaseService.litigationCaseShortDetail =
      await this.litigationCaseService.getLitigationCaseShortDetail(Number(this.litigationCaseId));
    this.logger.logResolverProcess(
      'ExecutionDocumentInfoResolver litigationCaseShortDetail : ',
      this.litigationCaseService.litigationCaseShortDetail
    );
    this.courtService.courtResult = await this.courtService.getCourtResults(this.litigationId, this.taskId);
    this.logger.logResolverProcess('ExecutionDocumentInfoResolver courtResult : ', this.courtService.courtResult);

    if (this.taskCode === taskCode.R2E04_01_2B) {
      const usersList: LexsUserOption[] = await this.userService.inquiryUserOptionV2KlawUserByFnCode(['LAW006']);
      if (!!usersList) {
        this.userService.kLawyerUserOptions = usersList;
      }
    }
    this.executionWarrantService.lawyerForm = this.executionWarrantService.getLawyerForm(
      this.litigationCaseService.litigationCaseShortDetail
    );

    this.logger.logResolverEnd('ExecutionDocumentInfoResolver');
    return true;
  }
}
