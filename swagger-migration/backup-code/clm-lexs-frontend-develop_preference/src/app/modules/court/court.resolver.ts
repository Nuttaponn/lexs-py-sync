import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TaskCodeMemorandumCourt, taskCode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { RouterService } from '@app/shared/services/router.service';
import { LawsuitService } from '../lawsuit/lawsuit.service';
import { TaskService } from '../task/services/task.service';
import { CourtService } from './court.service';

@Injectable({
  providedIn: 'root',
})
export class CourtResolver {
  private taskCode!: taskCode;

  constructor(
    private courtService: CourtService,
    private lawsuitService: LawsuitService,
    private taskService: TaskService,
    private routerService: RouterService,
    private logger: LoggerService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('CourtResolver');
    const _action = route.queryParams['action'];
    const _litigationCaseId = route.queryParams['litigationCaseId'];
    const _litigationId = this.lawsuitService.currentLitigation.litigationId || route.queryParams['litigationId'] || '';
    const _taskId = !!this.routerService.navigateFormTaskMenu
      ? this.taskService.taskDetail.id || route?.queryParams['id'] || ''
      : '';
    this.taskCode = !!this.routerService.navigateFormTaskMenu
      ? this.taskService.taskDetail.taskCode || route?.queryParams['taskCode'] || ('' as taskCode)
      : '';

    // DISPUTE_APPEAL
    const _disputeAppealId = route.queryParams['disputeAppealId'];

    // SAVE_DECREE
    const _courtDecreeId = route.queryParams['courtDecreeId'];

    // SAVE_EXECUTION
    const _personId = route.queryParams['personId'];

    if (_action === 'CONSIDER_APPEAL' || _action === 'CONSIDER_SUPREME_COURT') {
      await this.initConsiderAppealData(_litigationCaseId, _litigationId, _taskId);
    } else if (_action === 'DISPUTE_APPEAL') {
      await this.initDisputeAppealData(_disputeAppealId, _litigationCaseId, _litigationId);
    } else if (_action === 'SAVE_DECREE') {
      await this.initDecreeData(_courtDecreeId, _litigationCaseId, _litigationId);
    } else if (_action === 'SAVE_EXECUTION') {
      await this.initDecreePersonData(_courtDecreeId, _personId, _litigationCaseId, _litigationId);
    } else if (_action === 'UPLOAD_EXECUTION_RECEIPT') {
      await this.initUploadExecutionReceipt(_litigationCaseId);
    } else {
      TaskCodeMemorandumCourt.includes(this.taskCode) &&
        (await this.initCourtVerdictDetailData(_litigationCaseId, _litigationId, _taskId));
    }
    this.logger.logResolverEnd('CourtResolver');
    return true;
  }

  async initCourtVerdictDetailData(litigationCaseId: number, litigationId: string, taskId?: number | undefined) {
    try {
      this.logger.logResolverProcess('CourtResolver :: getCourtVerdictDetail');
      this.courtService.courtVerdictDetail = await this.courtService.getCourtVerdictDetail(
        litigationCaseId,
        litigationId,
        taskId
      );
    } catch (error) {
      this.routerService.back();
    }
  }

  async initDisputeAppealData(disputeAppealId: number | null, litigationCaseId: number, litigationId: string) {
    this.logger.logResolverProcess('CourtResolver :: getDisputeAppealDetail');
    this.courtService.currentDisputeAppealBundle = await this.courtService.getDisputeAppealDetail(
      disputeAppealId || 0,
      litigationCaseId,
      litigationId
    );
  }

  async initConsiderAppealData(litigationCaseId: number, litigationId: string, taskId?: number | undefined) {
    this.logger.logResolverProcess('CourtResolver :: getCourtAppeal');
    const response = await this.courtService.getCourtAppeal(litigationCaseId, litigationId, taskId);
    this.courtService.courtAppealBundle = response;
  }

  async initDecreeData(courtDecreeId: number, litigationCaseId: number, litigationId: string) {
    this.logger.logResolverProcess('CourtResolver :: getCourtDecreeDetail');
    this.courtService.currentDecree = await this.courtService.getCourtDecreeDetail(
      courtDecreeId,
      litigationCaseId,
      litigationId
    );
  }

  async initDecreePersonData(courtDecreeId: number, personId: string, litigationCaseId: number, litigationId: string) {
    try {
      this.logger.logResolverProcess('CourtResolver :: getCourtDecreeDetail');
      this.courtService.currentDecree = await this.courtService.getCourtDecreeDetail(
        courtDecreeId,
        litigationCaseId,
        litigationId
      );
      this.logger.logResolverProcess('CourtResolver :: getCourtDecreePersonDetail');
      this.courtService.currentDecreePerson = await this.courtService.getCourtDecreePersonDetail(
        courtDecreeId,
        personId
      );
    } catch (e) {
      this.logger.catchError('initDecreePersonData :: ', e);
    }
  }

  async initUploadExecutionReceipt(litigationCaseId: number) {
    this.logger.logResolverProcess('CourtResolver :: getCourtDecreeDetail');
    this.courtService.currentExecutionReceipt = await this.courtService.getUploadExecutionReceipt(litigationCaseId);
  }
}
