import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { LoggerService } from '@app/shared/services/logger.service';
import { Utils } from '@app/shared/utils';
import { LitigationCaseDto } from '@lexs/lexs-client';
import { SuitService } from './suit.service';

@Injectable({
  providedIn: 'root',
})
export class SuitResolver {
  constructor(
    private suitService: SuitService,
    private logger: LoggerService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<LitigationCaseDto> {
    this.logger.logResolverStart('SuitResolver');
    const caseId = route.queryParamMap.get('caseId') || '';
    const taskId = route.queryParamMap.get('taskId');
    const firstTimeList = this.suitService.firstTime.getValue();
    const isFirstTime = !firstTimeList.find(_caseId => _caseId === caseId);
    if (isFirstTime) {
      if (
        this.suitService.litigationCaseDetail?.id &&
        this.suitService.litigationCaseDetail?.id?.toString() === caseId
      ) {
        this.suitService.litigationCaseDetail = this.suitService.litigationCaseDetail;
      } else {
        const res = await this.suitService.getLitigationCaseDetail(
          Number(caseId),
          !!taskId ? Number(taskId) : undefined
        );
        this.suitService.litigationCaseDetail = res;
      }
      this.suitService.firstTime.next([...firstTimeList, ...[caseId]]);
      this.logger.logResolverEnd('SuitResolver :: ', this.suitService.litigationCaseDetail);
      return this.suitService.litigationCaseDetail;
    } else {
      if (this.suitService.litigationCaseDetail?.id) {
        this.logger.logResolverEnd('SuitResolver :: ', this.suitService.litigationCaseDetail);
        return this.suitService.litigationCaseDetail;
      } else {
        const res = await this.suitService.getLitigationCaseDetail(
          Number(caseId),
          !!taskId ? Number(taskId) : undefined
        );
        this.suitService.litigationCaseDetail = res;
        this.logger.logResolverEnd('SuitResolver :: ', res);
        return res;
      }
    }
  }

  async resolveLitigationCase(_litigationCaseId: string, _taskId?: number) {
    const firstTimeList = this.suitService.firstTime.getValue();
    const isFirstTime = !firstTimeList.find(_caseId => _caseId === _litigationCaseId);
    if (isFirstTime && Utils.isEmptyObject(this.suitService.litigationCaseDetail)) {
      const res = await this.suitService.getLitigationCaseDetail(
        Number(_litigationCaseId),
        _taskId ? Number(_taskId) : undefined
      );
      this.suitService.litigationCaseDetail = res;
      this.suitService.firstTime.next([...firstTimeList, ...[_litigationCaseId]]);
      this.logger.logResolverEnd('SuitResolver :: ', res);
      return res;
    } else {
      if (this.suitService.litigationCaseDetail?.id) {
        this.logger.logResolverEnd('SuitResolver :: ', this.suitService.litigationCaseDetail);
        return this.suitService.litigationCaseDetail;
      } else {
        const res = await this.suitService.getLitigationCaseDetail(
          Number(_litigationCaseId),
          _taskId ? Number(_taskId) : undefined
        );
        this.suitService.litigationCaseDetail = res;
        this.logger.logResolverEnd('SuitResolver :: ', res);
        return res;
      }
    }
  }
}
