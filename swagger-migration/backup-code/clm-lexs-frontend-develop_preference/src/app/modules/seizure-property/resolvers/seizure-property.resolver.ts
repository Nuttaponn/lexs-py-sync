import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { TMode, taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { RouterService } from '@app/shared/services/router.service';
import { LexsUserOption } from '@lexs/lexs-client';
import { TaskService } from '../../task/services/task.service';
import { UserService } from '../../user/user.service';
import { SeizurePropertyService } from '../seizure-property.service';

@Injectable({
  providedIn: 'root',
})
export class SeizurePropertyResolver {
  /**
   * litigationCaseId and litigationId of execution case info resolver
   * task menu get from this.taskService.taskDetail
   * litigation menu get from ...
   */
  private litigationCaseId!: string;
  private litigationId!: string;
  private seizureId!: string;

  private taskCode!: taskCode;
  private mode: TMode = 'VIEW';

  constructor(
    private litigationCaseService: LitigationCaseService,
    private taskService: TaskService,
    private routerService: RouterService,
    private userService: UserService,
    private seizurePropertyService: SeizurePropertyService,
    private documentService: DocumentService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    if (this.routerService.navigateFormTaskMenu) {
      if (route.queryParams['mode'] === 'VIEW') {
        this.mode = 'VIEW';
      } else {
        this.mode = this.documentService.R2_TaskCode.includes(this.taskCode) ? '' : route.queryParams['mode'] || 'VIEW';
      }
    } else {
      this.mode = route.queryParams['mode'] || 'VIEW';
    }
    this.seizurePropertyService.mode = this.mode;
    this.seizurePropertyService.hasTaskSubmit = !!route.queryParams['createdTimestamp'];
    this.seizurePropertyService.hasHidelawyer = !!route.queryParams['hidelawyer'];
    this.litigationCaseId = this.routerService.navigateFormTaskMenu
      ? this.taskService.taskDetail.litigationCaseId
      : route.queryParams['litigationCaseId'] || route.paramMap.get('litigationCaseId') || '';
    if (this.mode === 'EDIT') {
      this.seizureId = route.queryParams['objectId'] || route.queryParams['seizureId'];
    } else {
      this.litigationId = route.queryParams['litigationId'] || route.paramMap.get('litigationId') || '';
      this.seizureId =
        route.queryParams['seizureId'] || route.paramMap.get('seizureId') || route.queryParams['objectId'] || '';
    }

    this.litigationCaseService.litigationCaseShortDetail =
      await this.litigationCaseService.getLitigationCaseShortDetail(Number(this.litigationCaseId));

    if ([taskCode.R2E05_06_3F, taskCode.R2E05_09_4, taskCode.R2E05_08_3A].includes(this.taskCode as taskCode)) {
      const usersList: LexsUserOption[] = await this.userService.inquiryUserOptionV2KlawUserByFnCode(['LAW006']);
      if (!!usersList) {
        this.userService.kLawyerUserOptions = usersList;
      }
      if (this.mode != 'VIEW') {
        if ([taskCode.R2E05_09_4, taskCode.R2E05_08_3A].includes(this.taskCode as taskCode)) {
          const seizureId = this.taskService.taskDetail.objectId || '';
          this.seizurePropertyService.seizureDTO = await this.seizurePropertyService.getSeizureNonPledgePropertiesInfo(
            Number(seizureId)
          );
        } else {
          this.seizurePropertyService.seizureDTO = await this.seizurePropertyService.getNonPledgeProperties(
            Number(this.litigationCaseId)
          );
        }
      }
    }

    this.seizurePropertyService.lawyerForm = this.seizurePropertyService.getLawyerForm(
      this.litigationCaseService.litigationCaseShortDetail
    );

    return {
      litigationCaseId: this.litigationCaseId,
      litigationId: this.litigationId,
      seizureId: this.seizureId,
      mode: route.queryParams['mode'],
      seizurePageType: route.queryParams['seizurePageType'],
    };
  }
}
