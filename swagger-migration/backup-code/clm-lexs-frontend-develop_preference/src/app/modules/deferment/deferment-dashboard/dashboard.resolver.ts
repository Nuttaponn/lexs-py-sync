import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { RouterService } from '@app/shared/services/router.service';
import { DefermentDto, DefermentInfo, InquiryDefermentExecRequest } from '@lexs/lexs-client';
import { DefermentCategoryCode, IDefermentExcution } from '../deferment.model';
import { DefermentService } from '../deferment.service';
@Injectable({
  providedIn: 'root',
})
export class DashboardResolver {
  private data!: DefermentDto;
  private litigationId!: string;
  private customerId!: string;
  private hasCeased!: boolean;
  private _defermentCategory: DefermentCategoryCode = 'PROSECUTE';

  constructor(
    private defermentService: DefermentService,
    private lawsuitService: LawsuitService,
    private route: ActivatedRoute,
    private routerService: RouterService
  ) {
    this.route.queryParams.subscribe(value => {
      this.litigationId = value['litigationId'] || this.lawsuitService.currentLitigation.litigationId;
      this.hasCeased = value['hasCeased'] || false;
    });
  }

  async resolve(
    route: ActivatedRouteSnapshot,
    state?: RouterStateSnapshot
  ): Promise<IDefermentExcution | DefermentDto> {
    this.hasCeased = route.queryParamMap.get('hasCeased') === 'true';
    this._defermentCategory = route.queryParamMap.get('defermentCategory') as DefermentCategoryCode;
    this.customerId = this.lawsuitService.currentLitigation?.customerId || route.queryParamMap.get('customerId') || '';
    if (!this.routerService.previousUrl.includes('/main/task'))
      this.defermentService.currentLitigation = this.lawsuitService.currentLitigation;
    if (this._defermentCategory === 'EXECUTION') {
      this.defermentService.clearDataExec();
      return await this.initDataForExcution();
    } else {
      this.data = await this.defermentService.inquiryDeferment(
        this.customerId,
        '',
        this.hasCeased ? DefermentInfo.DefermentTypeEnum.Cessation : DefermentInfo.DefermentTypeEnum.Deferment,
        this.litigationId as string,
        'DASHBOARD'
      );
      this.defermentService.dashboard = this.data;
    }
    return {
      defermentCategory: this._defermentCategory,
    };
  }

  async initDataForExcution(): Promise<IDefermentExcution> {
    let query: InquiryDefermentExecRequest = {
      customerId: this.customerId || '',
      defermentId: '',
      // when click button first time set default for query data
      defermentType:
        this.defermentService.currentLitigation.defermentExecInfo?.defermentType ||
        (this.defermentService.defaultDefermentExecType as InquiryDefermentExecRequest.DefermentTypeEnum),
      litigationId: this.litigationId,
      mode: 'DASHBOARD',
    };
    const res = await this.defermentService.inquiryDefermentExec(query);
    this.defermentService.dashboard = res;

    return {
      defermentCategory: this._defermentCategory,
    };
  }
}
