import { Injectable } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TaskService } from '@app/modules/task/services/task.service';
import { TMode, taskCode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { WithdrawnSeizurePropertyService } from '../withdrawn-seizure-property.service';

@Injectable({
  providedIn: 'root',
})
export class LegalExecutionOfficeInfoResolver {
  private withdrawSeizureId!: number;
  private withdrawSeizuresLedId!: number;
  private taskCode!: taskCode;

  constructor(
    private logger: LoggerService,
    private taskService: TaskService,
    private withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('LegalExecutionOfficeInfoResolver');

    const mode: TMode = route.queryParams['mode'];
    if (mode === 'EDIT') {
      this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
      this.withdrawSeizureId =
        this.taskService.taskDetail.objectType === 'WITHDRAW_SEIZURE_ID'
          ? Number(this.taskService.taskDetail.objectId)
          : 0;
      this.withdrawSeizuresLedId =
        JSON.parse(this.taskService.taskDetail.attributes || '{}')?.withdrawSeizureLedId || 0;
    } else {
      this.withdrawSeizureId = Number(this.withdrawnSeizurePropertyService.withdrawSeizureId);
      this.withdrawSeizuresLedId = Number(this.withdrawnSeizurePropertyService.withdrawSeizureLedId);
    }

    if (this.taskCode === taskCode.R2E06_05_E) {
      this.withdrawnSeizurePropertyService.withdrawDateCtrl = new UntypedFormControl(null, Validators.required);
    }

    if (this.taskCode === taskCode.R2E06_03_C || this.taskCode === taskCode.R2E06_04_D || mode === 'VIEW') {
      this.withdrawnSeizurePropertyService.withdrawDateCtrl = new UntypedFormControl(null, Validators.required);
      const responseAll = await Promise.all([
        this.withdrawnSeizurePropertyService.getWithdrawSeizures(this.withdrawSeizureId),
        this.withdrawnSeizurePropertyService.getWithdrawSeizuresLed(this.withdrawSeizureId, this.withdrawSeizuresLedId),
      ]);
      this.withdrawnSeizurePropertyService.withdrawSeizureResponse = responseAll[0];
      this.withdrawnSeizurePropertyService.withdrawSeizureLedAllResponse = responseAll[1];
    }

    this.logger.logResolverEnd('LegalExecutionOfficeInfoResolver');
    return true;
  }
}
