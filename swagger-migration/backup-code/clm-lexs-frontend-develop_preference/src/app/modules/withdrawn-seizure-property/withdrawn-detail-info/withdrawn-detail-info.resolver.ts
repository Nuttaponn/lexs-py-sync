import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TaskService } from '@app/modules/task/services/task.service';
import { UserService } from '@app/modules/user/user.service';
import { TMode, taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { coerceString } from '@app/shared/utils';
import { LexsUserOption } from '@lexs/lexs-client';
import { WithdrawnSeizurePropertyService } from '../withdrawn-seizure-property.service';

@Injectable({
  providedIn: 'root',
})
export class WithdrawnDetailInfoResolver {
  private taskCode!: taskCode;

  /**
   * litigationCaseId and litigationId of execution case info resolver
   *  task menu get from this.taskService.taskDetail
   *  itigation menu get from routing params
   */
  private litigationCaseId!: string;

  constructor(
    private logger: LoggerService,
    private litigationCaseService: LitigationCaseService,
    private userService: UserService,
    private withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService,
    private taskService: TaskService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('WithdrawnDetailInfoResolver');

    // value from routing params
    const mode: TMode = route.queryParams['mode'];
    this.litigationCaseId =
      this.taskService.taskDetail?.litigationCaseId ||
      coerceString(this.withdrawnSeizurePropertyService.litigationCaseId, '') ||
      '';

    if (mode === 'EDIT') {
      this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    } else {
      // prepare for view mode
    }

    // Process data from API
    this.litigationCaseService.litigationCaseShortDetail =
      await this.litigationCaseService.getLitigationCaseShortDetail(Number(this.litigationCaseId));
    this.logger.logResolverProcess(
      'ExecutionDocumentInfoResolver litigationCaseShortDetail : ',
      this.litigationCaseService.litigationCaseShortDetail
    );
    if (this.taskCode === taskCode.R2E06_03_C || this.taskCode === taskCode.R2E06_04_D) {
      const usersList: LexsUserOption[] = await this.userService.inquiryUserOptionV2KlawUserByFnCode(['LAW006']);
      if (!!usersList) {
        this.userService.kLawyerUserOptions = usersList;
      }
      const matchLawer = this.userService.kLawyerUserOptions.filter(
        it =>
          it.userId ===
          this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllResponse?.withdrawSeizureLed?.publicAuctionLawyerId
      );
      if (
        !!this.withdrawnSeizurePropertyService.lawyerForm &&
        this.withdrawnSeizurePropertyService?.lawyerForm?.get('legalExecutionLawyerId')?.value
      ) {
        const rawvalue = this.withdrawnSeizurePropertyService.lawyerForm.getRawValue();
        this.withdrawnSeizurePropertyService.lawyerForm = this.withdrawnSeizurePropertyService.getLawyerForm(
          this.taskCode !== taskCode.R2E06_03_C,
          rawvalue
        );
      } else {
        this.withdrawnSeizurePropertyService.lawyerForm =
          this.taskCode === taskCode.R2E06_03_C
            ? this.withdrawnSeizurePropertyService.getLawyerForm(false)
            : this.withdrawnSeizurePropertyService.getLawyerForm(true, {
                ...this.litigationCaseService.litigationCaseShortDetail,
                legalExecutionLawyerId:
                  matchLawer.length > 0
                    ? this.withdrawnSeizurePropertyService?.withdrawSeizureLedAllResponse?.withdrawSeizureLed
                        ?.publicAuctionLawyerId
                    : '',
              });
      }
    }

    this.logger.logResolverEnd('WithdrawnDetailInfoResolver');
    return true;
  }
}
