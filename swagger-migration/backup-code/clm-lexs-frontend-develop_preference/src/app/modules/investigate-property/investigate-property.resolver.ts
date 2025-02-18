import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { MENU_ROUTE_PATH } from '@shared/constant';
import { LitigationCaseService } from '@shared/services/litigation-case.service';
import { LoggerService } from '@shared/services/logger.service';
import { TaskService } from '@modules/task/services/task.service';
import { RouterService } from '@shared/services/router.service';
import { SessionService } from '@shared/services/session.service';
import { InvestigatePropertyService } from '@modules/investigate-property/investigate-property.service';
import { taskCode, TMode } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class InvestigatePropertyResolver {
  public isOnRequest!: boolean;
  private taskCode!: taskCode;
  private litigationCaseId!: string;
  private litigationId!: string;
  public litigationCaseSeqNo!: string;
  constructor(
    private litigationCaseService: LitigationCaseService,
    private logger: LoggerService,
    private taskService: TaskService,
    private routerService: RouterService,
    private investigatePropertyService: InvestigatePropertyService,
    private sessionService: SessionService
  ) {}

  get menuPath() {
    if (this.routerService.previousUrl.startsWith(MENU_ROUTE_PATH.TASK)) {
      // form task menu
      return 'TASK';
    } else {
      // form litigation menu or other conditions
      return 'LAWSUIT';
    }
  }

  get isOwnerTask(): boolean {
    const _owner = this.taskService.taskOwner;
    if (_owner && this.sessionService.isOwnerTask(_owner, this.taskService.taskDetail.enableTaskSupportRole)) {
      return true;
    } else {
      return false;
    }
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('AuctionResolver');
    this.taskCode = '' as taskCode;
    const mode: TMode = route.queryParams['mode'];
    if (!this.investigatePropertyService.actionCode) {
      this.investigatePropertyService.actionCode = route.queryParams['actionCode'] || '';
    }
    this.investigatePropertyService.mode = mode || '';
    this.investigatePropertyService.actionType = (route.queryParams['actionType'] as taskCode) || '';
    this.litigationId = this.taskService?.taskDetail?.litigationId || route.queryParams['litigationId'] || '';

    this.litigationCaseId =
      this.taskService?.taskDetail?.litigationCaseId || route.queryParams['litigationCaseId'] || '';

    if (this.menuPath === 'TASK' || mode === 'EDIT') {
      this.investigatePropertyService.taskLedName =
        JSON.parse(this.taskService.taskDetail.attributes || '{}')?.ledName || '';
    }

    this.isOnRequest = !!route.queryParams['isOnRequest'];
    this.investigatePropertyService.litigationCaseSeqNo = route.queryParams['litigationCaseSeqNo'];
    this.investigatePropertyService.litigationCaseId = this.litigationCaseId;
    this.investigatePropertyService.litigationId = this.litigationId;
    this.litigationCaseService.litigationCaseShortDetail =
      await this.litigationCaseService.getLitigationCaseShortDetail(Number(this.litigationCaseId));

    if (mode === 'EDIT') {
      this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
      this.investigatePropertyService.taskCode = this.taskService.taskDetail.taskCode;
      if (this.taskCode === taskCode.R2E03_01_01) {
        const assetInvestigationId = this.taskService.taskDetail?.objectId;
        const data = await this.investigatePropertyService.getAssetInvestigationLitigationInfo(
          Number(assetInvestigationId)
        );
        this.investigatePropertyService.assetInvestigationInfo = data;
      }
    } else if (mode === 'VIEW') {
      const assetInvestigationId =
        route.queryParams['assetInvestigationId'] || this.taskService.taskDetail?.objectId || '';
      const _litigationCaseSeqNo = route.queryParams['litigationCaseSeqNo'] || '';
      this.investigatePropertyService.litigationCaseSeqNo = _litigationCaseSeqNo;
      const data = await this.investigatePropertyService.getAssetInvestigationLitigationInfo(
        Number(assetInvestigationId)
      );
      this.investigatePropertyService.assetInvestigationInfo = data;
    }

    return true;
  }
}
