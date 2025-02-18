import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TMode, taskCode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { RouterService } from '@app/shared/services/router.service';
import { TaskService } from '../task/services/task.service';
import { WithdrawnSeizurePropertyService } from './withdrawn-seizure-property.service';

@Injectable({
  providedIn: 'root',
})
export class WithdrawnSeizurePropertyResolver {
  private withdrawSeizureId!: number;
  private withdrawSeizuresLedId!: number;
  private taskCode!: taskCode;

  constructor(
    private withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService,
    private taskService: TaskService,
    private logger: LoggerService,
    private routerService: RouterService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('WithdrawnSeizurePropertyResolver');
    this.taskCode = '' as taskCode;
    const mode: TMode = route.queryParams['mode'];
    const objectId: string = route.queryParams['objectId'] || route.queryParams['withdrawSeizureId'];

    if (this.taskService.taskDetail && this.taskService.taskDetail.taskCode) {
      this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    }

    if (this.routerService.navigateFormTaskMenu || mode === 'EDIT') {
      this.withdrawSeizureId =
        this.taskService.taskDetail.objectType === 'WITHDRAW_SEIZURE_ID'
          ? Number(this.taskService.taskDetail.objectId)
          : 0;
      this.withdrawnSeizurePropertyService.withdrawSeizureId = this.withdrawSeizureId;
      this.withdrawSeizuresLedId =
        JSON.parse(this.taskService.taskDetail.attributes || '{}')?.withdrawSeizureLedId || 0;
      this.withdrawnSeizurePropertyService.withdrawSeizureLedId = this.withdrawSeizuresLedId;
    } else if (mode === 'ADD') {
      this.withdrawnSeizurePropertyService.litigationId = route.queryParams['litigationId'];
      this.withdrawnSeizurePropertyService.litigationCaseId = Number(route.queryParams['litigationCaseId']);
      this.withdrawnSeizurePropertyService.withdrawSeizureMode = route.queryParams['mode'];
      this.withdrawnSeizurePropertyService.clearData();
    } else {
      const litigationCaseId =
        route.queryParams['litigationCaseId'] || this.withdrawnSeizurePropertyService?.litigationCaseId;
      const litigationId = route.queryParams['litigationId'] || this.withdrawnSeizurePropertyService?.litigationId;
      this.withdrawnSeizurePropertyService.litigationId = litigationId;
      this.withdrawnSeizurePropertyService.litigationCaseId = Number(litigationCaseId);
      this.withdrawnSeizurePropertyService.withdrawSeizureId = Number(objectId);
      this.withdrawSeizuresLedId = route.queryParams['withdrawSeizuresLedId'];
      this.withdrawnSeizurePropertyService.withdrawSeizureLedId = route.queryParams['withdrawSeizuresLedId'];
    }

    if (this.taskCode === taskCode.R2E06_01_A || this.taskCode === taskCode.R2E06_02_B) {
      this.logger.logResolverEnd('WithdrawnSeizurePropertyResolver ===>>> getWithdrawSeizures');
      const isSkipUpdate = route.queryParams['skipUpdate'];
      this.withdrawnSeizurePropertyService.litigationCaseId = Number(this.taskService.taskDetail.litigationCaseId);
      this.withdrawnSeizurePropertyService.withdrawSeizureId =
        this.taskService.taskDetail.objectType === 'WITHDRAW_SEIZURE_ID'
          ? Number(this.taskService.taskDetail.objectId)
          : 0;
      if (!isSkipUpdate) {
        this.withdrawnSeizurePropertyService.withdrawSeizureResponse =
          await this.withdrawnSeizurePropertyService.getWithdrawSeizures(
            this.withdrawnSeizurePropertyService.withdrawSeizureId
          );
      }
    } else if (
      this.taskCode === taskCode.R2E06_03_C ||
      this.taskCode === taskCode.R2E06_04_D ||
      this.taskCode === taskCode.R2E06_05_E
    ) {
      this.withdrawnSeizurePropertyService.litigationCaseId = Number(this.taskService.taskDetail.litigationCaseId);
      this.withdrawnSeizurePropertyService.withdrawSeizureId =
        this.taskService.taskDetail.objectType === 'WITHDRAW_SEIZURE_ID'
          ? Number(this.taskService.taskDetail.objectId)
          : 0;
      this.withdrawSeizuresLedId =
        JSON.parse(this.taskService.taskDetail.attributes || '{}')?.withdrawSeizureLedId || 0;
      this.withdrawnSeizurePropertyService.withdrawSeizureResponse =
        await this.withdrawnSeizurePropertyService.getWithdrawSeizures(
          this.withdrawnSeizurePropertyService.withdrawSeizureId
        );
      this.withdrawnSeizurePropertyService.withdrawSeizureLedAllResponse =
        await this.withdrawnSeizurePropertyService.getWithdrawSeizuresLed(
          this.withdrawnSeizurePropertyService.withdrawSeizureId,
          this.withdrawSeizuresLedId
        );
    } else {
      if (this.withdrawnSeizurePropertyService.withdrawSeizureId) {
        this.withdrawnSeizurePropertyService.withdrawSeizureResponse =
          await this.withdrawnSeizurePropertyService.getWithdrawSeizures(
            this.withdrawnSeizurePropertyService.withdrawSeizureId
          );
      }
      if (this.withdrawnSeizurePropertyService.withdrawSeizureId && this.withdrawSeizuresLedId) {
        this.withdrawnSeizurePropertyService.withdrawSeizureLedAllResponse =
          await this.withdrawnSeizurePropertyService.getWithdrawSeizuresLed(
            this.withdrawnSeizurePropertyService.withdrawSeizureId,
            this.withdrawSeizuresLedId
          );
      }
    }
    this.logger.logResolverEnd('WithdrawnSeizurePropertyResolver');
    return true;
  }
}
