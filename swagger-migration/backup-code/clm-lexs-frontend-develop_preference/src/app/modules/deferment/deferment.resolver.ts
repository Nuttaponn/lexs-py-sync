import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { taskCode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { RouterService } from '@app/shared/services/router.service';
import { DefermentInfo, DefermentItem, InquiryDefermentExecRequest, NameValuePair } from '@lexs/lexs-client';
import { LawsuitService } from '@modules/lawsuit/lawsuit.service';
import { SessionService } from '@shared/services/session.service';
import { CustomerService } from '../customer/customer.service';
import { TaskService } from '../task/services/task.service';
import { DefermentCategoryCode } from './deferment.model';
import { DefermentService } from './deferment.service';

export interface IDeferment {
  defermentReason?: NameValuePair[];
  approvalAuthority?: NameValuePair[];
  cessationReason?: NameValuePair[];
  approvalAuthorityDla?: NameValuePair[];
  defermentCategory?: 'EXECUTION' | 'PROSECUTE';
}

@Injectable({
  providedIn: 'root',
})
export class DefermentResolver {
  private defermentType = DefermentInfo.DefermentTypeEnum;
  private RESPONSE_UNIT_TYPE_ENUM = DefermentItem.ResponseUnitTypeEnum;
  constructor(
    private masterDataService: MasterDataService,
    private defermentService: DefermentService,
    private customerService: CustomerService,
    private lawsuitService: LawsuitService,
    private sessionService: SessionService,
    private taskService: TaskService,
    private logger: LoggerService,
    private routerService: RouterService
  ) {}

  private litigationId = '';
  private customerId: string = '';
  private accessPermissions = this.sessionService.accessPermissions();
  private _defermentCategory!: DefermentCategoryCode;

  private cessationTaskCode: taskCode[] = [
    'REQUEST_CESSATION',
    'AUTO_CREATE_DRAFT_CESSATION',
    'AUTO_WHEN_MEET_CRITERIA_CESSATION',
    'REQUEST_REVISE_CESSATION',
    'SAVE_DRAFT_CESSATION',
  ];

  async resolve(route: ActivatedRouteSnapshot): Promise<IDeferment> {
    if (this.routerService.previousUrl.includes('/main/lawsuit/deferment/defer/seizure-property')) {
      route.queryParams = this.defermentService.paramTemp;
    }
    if (
      this.lawsuitService?.currentLitigation?.customerId !== this.customerService?.customerDetail?.customerId &&
      this.lawsuitService?.currentLitigation?.customerId !== undefined
    ) {
      this.customerService.customerDetail = {};
    }
    this.logger.logResolverStart('DefermentResolver');
    const _taskId = route.queryParams['taskId'];
    let _hasCeased = route.queryParamMap.get('hasCeased') === 'true';
    const _btnAction = route.queryParamMap.get('btnAction') || route.queryParamMap.get('_btnAction') || 'DEFERMENT';
    this._defermentCategory = route.queryParamMap.get('defermentCategory') as DefermentCategoryCode;
    const _modeFromBtn = route.queryParamMap.get('modeFromBtn');
    const _defermentType = route.queryParamMap.get('defermentType');
    let _defermentId = route.queryParamMap.get('defermentId');
    let _isViewOnly = route.queryParamMap.get('isViewOnly') === 'true';
    const _hasCustomerDetail =
      this.customerService?.customerDetail && Object.keys(this.customerService.customerDetail).length !== 0;
    this.customerId = _hasCustomerDetail
      ? this.customerService?.customerDetail?.customerId + ''
      : this.lawsuitService?.currentLitigation?.customerId || route.queryParamMap.get('customerId') || '';
    this.litigationId = _hasCustomerDetail
      ? ''
      : this.lawsuitService.currentLitigation?.litigationId
        ? this.lawsuitService.currentLitigation?.litigationId
        : route.queryParams['litigationId'];
    const litigationResponse = _hasCustomerDetail
      ? {}
      : this.lawsuitService.currentLitigation && Object.keys(this.lawsuitService.currentLitigation).length !== 0
        ? this.lawsuitService.currentLitigation
        : await this.lawsuitService.getLitigation(this.litigationId, _taskId ? Number(_taskId) : _taskId);
    const _amdResponseUser = _hasCustomerDetail
      ? { userId: this.customerService.customerDetail.amdResponseUser?.userId }
      : litigationResponse.amdResponseUser;
    const _ResponseUser = _hasCustomerDetail
      ? { userId: this.customerService.customerDetail.responseUser?.userId }
      : litigationResponse.responseUser;
    const mode = _modeFromBtn ? _modeFromBtn : (this.getModeInquiryDeferment(_btnAction) as any);
    _hasCeased = _btnAction === 'CESSATION' ? true : false;
    _defermentId =
      mode === 'ADD' ? '' : _defermentId ? _defermentId : this.defermentService.deferment.deferment?.defermentId || '';
    await this.inquiryData(
      _defermentId,
      _hasCeased,
      mode,
      _taskId,
      (_defermentType as DefermentItem.DefermentTypeEnum) || undefined,
      _isViewOnly
    );
    let result: any = [];
    const pExecution = this.defermentService.hasPermissionExecution();
    if (route.queryParamMap.get('flagdeferment') !== 'true') {
      this.defermentService.validateUserDeferment(litigationResponse);
    }
    if (this.accessPermissions.subRoleCode === 'APPROVER' || this.accessPermissions.subRoleCode === 'MAKER') {
      let taskCode = this.taskService.taskDetail.taskCode as taskCode;
      if (
        !!this.lawsuitService.currentLitigation.amdResponseUnitCode?.toString()?.trim() ||
        !!this.customerService.customerDetail.amdResponseUnitCode?.toString()?.trim()
      ) {
        if (
          _amdResponseUser?.userId === this.sessionService.currentUser?.userId ||
          ((pExecution.canDelay || pExecution.canCancelDelay || pExecution.canEditDelay || pExecution.canExtendDelay) &&
            this._defermentCategory === 'EXECUTION' &&
            _amdResponseUser?.userId === this.sessionService.currentUser?.userId)
        ) {
          this.defermentService.responseUnitType = this.RESPONSE_UNIT_TYPE_ENUM.AmdResponseUnit;
          result = _hasCeased
            ? await this.initCessationMasterData()
            : this.cessationTaskCode.includes(taskCode)
              ? await this.initCessationMasterData()
              : await this.initDefermentMaterData();
        } else {
          this.defermentService.responseUnitType = null;
          result = {
            defermentReason: [],
            approvalAuthority: [],
            cessationReason: [],
            approvalAuthorityDla: [],
            defermentCategory: this._defermentCategory,
          };
        }
      } else if (
        _ResponseUser?.userId === this.sessionService.currentUser?.userId ||
        ((pExecution.canDelay || pExecution.canCancelDelay || pExecution.canEditDelay || pExecution.canExtendDelay) &&
          this._defermentCategory === 'EXECUTION' &&
          _ResponseUser?.userId === this.sessionService.currentUser?.userId)
      ) {
        this.defermentService.responseUnitType = this.RESPONSE_UNIT_TYPE_ENUM.ResponseUnit;
        result = _hasCeased
          ? await this.initCessationMasterData()
          : this.cessationTaskCode.includes(taskCode)
            ? await this.initCessationMasterData()
            : await this.initDefermentMaterData();
      } else {
        result = {
          defermentReason: [],
          approvalAuthority: [],
          cessationReason: [],
          approvalAuthorityDla: [],
          defermentCategory: this._defermentCategory,
        };
      }
    } else {
      result = {
        defermentReason: [],
        approvalAuthority: [],
        cessationReason: [],
        approvalAuthorityDla: [],
        defermentCategory: this._defermentCategory,
      };
    }

    this.defermentService.dataResolve = result;
    this.logger.logResolverEnd('DefermentResolver');
    return result;
  }

  async initDefermentMaterData() {
    const response = await Promise.all([
      this.masterDataService.defermentReson(),
      this.masterDataService.ApprovalAuthorityByType('DEFERMENT'),
      this.masterDataService.approvalAuthorityDla(),
    ]);
    const result: IDeferment = {
      defermentReason: response[0].defermentReason || [],
      approvalAuthority: response[1].approvalAuthority || [],
      approvalAuthorityDla: response[2].approvalAuthorityDla || [],
      defermentCategory: 'PROSECUTE',
    };
    return result;
  }

  async initCessationMasterData() {
    const responseCessation = await Promise.all([
      this.masterDataService.cessationReason(),
      this.masterDataService.ApprovalAuthorityByType('CESSATION'),
      this.masterDataService.approvalAuthorityDla(),
    ]);
    const result: IDeferment = {
      cessationReason: responseCessation[0].cessationReason || [],
      approvalAuthority: responseCessation[1].approvalAuthority || [],
      approvalAuthorityDla: responseCessation[2].approvalAuthorityDla || [],
      defermentCategory: 'PROSECUTE',
    };
    return result;
  }

  getModeInquiryDeferment(_action: string) {
    const _status = this.lawsuitService.currentLitigation.defermentStatus;
    if (_action === 'DEFERMENT') {
      const _hasApproved =
        this.lawsuitService.currentLitigation.defermentInfo?.approved ||
        this.lawsuitService.currentLitigation.defermentExecInfo?.approved
          ? true
          : false;
      if (_status === 'NORMAL' && !_hasApproved) {
        return 'ADD';
      } else {
        return _status === 'NORMAL' || _status === 'DEFERMENT' ? 'APPROVE' : 'ADD';
      }
    } else {
      return !!!this.lawsuitService.currentLitigation.cessationInfo?.approved ? 'ADD' : 'APPROVE';
    }
  }

  async inquiryData(
    _defermentId: string,
    _hasCeased: boolean,
    mode: InquiryDefermentExecRequest.ModeEnum,
    _taskId: number | undefined,
    _defermentType?: DefermentInfo.DefermentTypeEnum | undefined,
    _isViewOnly?: boolean | false
  ) {
    if (
      this.routerService.previousUrl.includes('/main/task') &&
      ['R2E07-02-B', 'R2E07-03-C', 'R2E07-04-D'].includes(this.taskService.taskDetail.taskCode as any)
    )
      return;

    if (this._defermentCategory === 'EXECUTION') {
      _isViewOnly = (this.taskService.taskDetail.taskCode as taskCode) === 'R2E07-05-E' ? true : false;
      let query: InquiryDefermentExecRequest = {
        customerId: this.customerId || '',
        defermentId: _defermentId,
        defermentType:
          _defermentType ||
          this.defermentService.defaultDefermentExecType ||
          (_hasCeased ? this.defermentType.Cessation : this.defermentType.Deferment),
        litigationId: this.litigationId,
        mode: mode,
        taskId: _taskId,
        isViewOnly: _isViewOnly,
      };
      const res = await this.defermentService.inquiryDefermentExec(query);
      this.defermentService.deferment = res;
      this.defermentService.litigations = res?.deferment?.defermentLitigationInfos?.map(m => m?.litigationId) || [];
    } else {
      const res = await this.defermentService.inquiryDeferment(
        this.customerId || '',
        _defermentId,
        _hasCeased ? this.defermentType.Cessation : this.defermentType.Deferment,
        this.litigationId,
        mode,
        _taskId ? _taskId : undefined
      );
      this.defermentService.deferment = res;
    }
  }
}
