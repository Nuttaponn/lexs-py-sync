import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TaskService } from '@app/modules/task/services/task.service';
import { UserService } from '@app/modules/user/user.service';
import { taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { LexsUserOption, NonPledgePropertiesAsset } from '@lexs/lexs-client';
import { SeizurePropertyService } from '../seizure-property.service';
import { SeizureCollateralTypes } from '@app/shared/constant';

@Injectable({
  providedIn: 'root',
})
export class SeizureListInfoResolver {
  public litigationCaseId: string = '';
  private taskCode!: taskCode;
  public litigationId: string = '';

  constructor(
    private litigationCaseService: LitigationCaseService,
    private logger: LoggerService,
    private taskService: TaskService,
    private userService: UserService,
    private seizurePropertyService: SeizurePropertyService
  ) {
    this.seizurePropertyService.seizurePageType = SeizureCollateralTypes.PLEDGE; // set-default value
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('SeizureListInfoResolver');
    this.seizurePropertyService.seizurePageType = SeizureCollateralTypes.PLEDGE; // set-default value
    this.litigationCaseId =
      this.taskService.taskDetail.litigationCaseId || route.parent?.parent?.data['seizureProperty']['litigationCaseId'];
    this.litigationId =
      this.taskService.taskDetail.litigationId || route.parent?.parent?.data['seizureProperty']['litigationId'];
    let mode = 'VIEW';
    if (!!this.seizurePropertyService.mode) {
      mode = this.seizurePropertyService.mode;
    } else {
      this.seizurePropertyService.mode = route.queryParams['mode'] || 'VIEW';
      mode = this.seizurePropertyService.mode;
    }
    this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    if (
      (this.litigationCaseService?.listCollaterals?.length === 0 &&
        [taskCode.R2E05_01_2D].includes(this.taskService.taskDetail.taskCode as taskCode)) ||
      mode === 'EDIT'
    ) {
      // ต้องมาจากยึดทรัพย์จำนองเท่านั้น
      if (
        ![taskCode.R2E05_07_2A, taskCode.R2E05_08_3A, taskCode.R2E05_09_4].includes(this.taskCode) &&
        route.queryParams['seizurePageType'] !== SeizureCollateralTypes.NON_PLEDGE
      ) {
        let data = await this.litigationCaseService.getLitigationCaseCollaterals(Number(this.litigationCaseId));
        this.litigationCaseService.documentsCollaterals = data;
      }
    }

    if ([taskCode.R2E05_02_3C, taskCode.R2E05_03_3D, taskCode.R2E05_06_3F].includes(this.taskCode)) {
      const seizureId = this.taskService.taskDetail.objectId || '0';
      let data = (await this.seizurePropertyService.getSeizureCollateralsLedsInfoBySeizureId(seizureId)) as any;
      this.litigationCaseService.documentsCollaterals = { collaterals: data.unMappedCollaterals };
    }

    if ([taskCode.R2E04_01_2B].includes(this.taskCode)) {
      const usersList: LexsUserOption[] = await this.userService.inquiryUserOptionV2KlawUserByFnCode(['LAW006']);
      if (!!usersList) {
        this.userService.kLawyerUserOptions = usersList;
      }
    }
    this.seizurePropertyService.lawyerForm = this.seizurePropertyService.getLawyerForm(
      this.litigationCaseService.litigationCaseShortDetail
    );
    if ([taskCode.R2E05_07_2A].includes(this.taskCode)) {
      this.seizurePropertyService.seizureDTO = await this.seizurePropertyService.getNonPledgeProperties(
        Number(this.litigationCaseId)
      );
      this.seizurePropertyService.seizurePageType = SeizureCollateralTypes.NON_PLEDGE;
    } else if ([taskCode.R2E05_08_3A, taskCode.R2E05_09_4].includes(this.taskCode)) {
      const seizureId = this.taskService.taskDetail.objectId || '';
      this.seizurePropertyService.seizureDTO = await this.seizurePropertyService.getSeizureNonPledgePropertiesInfo(
        Number(seizureId)
      );
      const data = await this.seizurePropertyService.getSeizureCollateralsLedsInfoBySeizureId(seizureId);
      this.seizurePropertyService.seizureDTO = {
        ...this.seizurePropertyService.seizureDTO,
        assets: data.unMappedCollaterals?.map(it => {
          return {
            ...it,
          } as NonPledgePropertiesAsset;
        }),
      };
      this.seizurePropertyService.seizurePageType = SeizureCollateralTypes.NON_PLEDGE;
    } else if (route.queryParams['seizurePageType'] === SeizureCollateralTypes.NON_PLEDGE) {
      if (mode !== 'VIEW') {
        this.seizurePropertyService.seizureDTO = await this.seizurePropertyService.getNonPledgeProperties(
          Number(this.litigationCaseId)
        );
      }
      this.seizurePropertyService.seizurePageType = SeizureCollateralTypes.NON_PLEDGE;
    }

    return true;
  }
}
