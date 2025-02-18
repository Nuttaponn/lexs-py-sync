import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MENU_ROUTE_PATH } from '@app/shared/constant';
import { taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { RouterService } from '@app/shared/services/router.service';
import { TaskService } from '../task/services/task.service';
import { UserService } from '../user/user.service';
import { WithdrawnWritExecutionService } from './withdrawn-writ-execution.service';

@Injectable({
  providedIn: 'root',
})
export class WithdrawnWritExecutionResolver {
  private taskCode!: taskCode | string;

  /**
   * litigationCaseId and litigationId of execution case info resolver
   *  task menu get from this.taskService.taskDetail
   *  itigation menu get from routing params
   */
  private litigationCaseId!: string;
  private withdrawWritOfExecId!: number;
  constructor(
    private logger: LoggerService,
    private litigationCaseService: LitigationCaseService,
    private taskService: TaskService,
    private withdrawnWritExecutionService: WithdrawnWritExecutionService,
    private userService: UserService,
    private routerService: RouterService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('WithdrawnWritExecutionResolver');

    const isFromTask = this.routerService.previousUrl.startsWith(MENU_ROUTE_PATH.TASK);
    if (isFromTask) {
      this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
      this.litigationCaseId = this.taskService.taskDetail.litigationCaseId || '';
      this.withdrawWritOfExecId = Number(this.taskService.taskDetail.objectId);
    } else {
      this.litigationCaseId = route.queryParams['litigationCaseId'] || '';

      //first time withdrawWritOfExecId = 0 >> BE create withdrawWritOfExecId when call api postWithdrawWritOfExecCommandAcceptionSubmit
      this.withdrawWritOfExecId = route.queryParams['withdrawWritOfExecId'] || 0;
    }

    this.litigationCaseService.litigationCaseShortDetail =
      await this.litigationCaseService.getLitigationCaseShortDetail(Number(this.litigationCaseId));
    this.logger.logResolverProcess(
      'ExecutionDocumentInfoResolver litigationCaseShortDetail : ',
      this.litigationCaseService.litigationCaseShortDetail
    );

    // GET /v1/withdraw-writ-of-exec/{withdrawWritOfExecId}
    // ข้อมูลร่างคำสั่งการบังคับคดีที่ได้บันทึกไว้/ข้อมูลคำสั่งการที่ถูกส่งกลับเพื่อแก้ไข
    // ข้อมูลรายละเอียดการถอนการบังคับคดี และร่างผลการดำเนินการ
    //มาจากหน้า task list หรือ ฟอร์มบังคับคดี
    this.withdrawnWritExecutionService.withdrawWritOfExecResponse =
      await this.withdrawnWritExecutionService.getWithdrawWritOfExec(
        Number(this.litigationCaseId),
        Number(this.withdrawWritOfExecId || '0')
      );
    this.logger.logResolverProcess(
      'ExecutionDocumentInfoResolver withdrawWritOfExecResponse : ',
      this.withdrawnWritExecutionService.withdrawWritOfExecResponse
    );

    if (this.taskCode === taskCode.R2E06_13_C || this.taskCode === taskCode.R2E06_14_D) {
      const usersList: any = await this.userService.inquiryUserOptionV2KlawUserByFnCode(['LAW006']);
      if (!!usersList) {
        this.userService.kLawyerUserOptions = usersList;
      }
      this.withdrawnWritExecutionService.lawyerForm =
        this.taskCode === taskCode.R2E06_14_D
          ? this.withdrawnWritExecutionService.getLawyerForm(
              this.withdrawnWritExecutionService.withdrawWritOfExecResponse
            )
          : this.withdrawnWritExecutionService.getLawyerForm();
    } else if (this.taskCode === taskCode.R2E06_15_E) {
      this.withdrawnWritExecutionService.withdrawExcutionResultComponentForm =
        this.withdrawnWritExecutionService.getWithdrawExcutionResultComponentForm(
          this.withdrawnWritExecutionService.withdrawWritOfExecResponse
        );
      this.withdrawnWritExecutionService.lawyerForm = this.withdrawnWritExecutionService.getLawyerForm(
        this.litigationCaseService.litigationCaseShortDetail
      );
    } else if (this.taskCode === taskCode.R2E06_11_A) {
      this.withdrawnWritExecutionService.withdrawExcutionDetailComponentForm =
        this.withdrawnWritExecutionService.getWithdrawExcutionDetailComponentForm(
          this.withdrawnWritExecutionService.withdrawWritOfExecResponse
        );
    } else {
      // for 'R2E06-10' | 'R2E06-12-B'
      this.withdrawnWritExecutionService.lawyerForm = this.withdrawnWritExecutionService.getLawyerForm(
        this.litigationCaseService.litigationCaseShortDetail
      );
      this.withdrawnWritExecutionService.withdrawExcutionResultComponentForm =
        this.withdrawnWritExecutionService.getWithdrawExcutionResultComponentForm(
          this.withdrawnWritExecutionService.withdrawWritOfExecResponse
        );
      this.withdrawnWritExecutionService.withdrawExcutionDetailComponentForm =
        this.withdrawnWritExecutionService.getWithdrawExcutionDetailComponentForm(
          this.withdrawnWritExecutionService.withdrawWritOfExecResponse
        );
    }

    this.logger.logResolverEnd('WithdrawnWritExecutionResolver');
    return true;
  }
}
