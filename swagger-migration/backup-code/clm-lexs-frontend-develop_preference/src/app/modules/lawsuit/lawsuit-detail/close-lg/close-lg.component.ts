import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { ActionBar } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { CloseLitigationRequest, LitigationDetailDto } from '@lexs/lexs-client';
import { BuddhistEraPipe } from '@spig/core';
import { SubSink } from 'subsink';
import { LawsuitService } from '../../lawsuit.service';
import { CloseLgDetailComponent } from '../close-lg-detail/close-lg-detail.component';
import { TranslateService } from '@ngx-translate/core';
import { ArraySumPipe } from '@app/shared/pipes/array-sum.pipe';

@Component({
  selector: 'app-close-lg',
  templateUrl: './close-lg.component.html',
  styleUrls: ['./close-lg.component.scss'],
  providers: [BuddhistEraPipe, ArraySumPipe],
})
export class CloseLgComponent implements OnInit, OnDestroy {
  @ViewChild('closeLgDetail') closeLgDetail!: CloseLgDetailComponent;
  public nextRouting: string = '';
  private subs = new SubSink();
  public litigationDetail: LitigationDetailDto = {};
  private isViewMode: boolean = true;
  private lgCloseForm!: UntypedFormGroup;
  public closeMessage: string = '';
  // ** ACTION BAR //
  public actionBarConfig: ActionBar = {
    hasPrimary: !this.isViewMode,
    primaryText: 'LAWSUIT.CLOSE.BTN_CLOSE_LITIGATION',
    primaryIcon: 'icon-Archive',
    hasCancel: false,
    hasReject: false,
    rejectText: 'COMMON.BUTTON_NOT_APPROVE',
    rejectIcon: 'icon-Dismiss-Square',
    hasSave: false,
  };

  constructor(
    private lawsuitService: LawsuitService,
    private routerService: RouterService,
    private router: Router,
    private sessionService: SessionService,
    private buddhistEraPipe: BuddhistEraPipe,
    private translate: TranslateService,
    private arraySumPipe: ArraySumPipe
  ) {
    this.subs.add(
      this.router.events.subscribe(val => {
        if (val instanceof NavigationStart) this.nextRouting = val.url;
      })
    );
  }

  ngOnInit(): void {
    this.lawsuitService.hasEdit = true;
    this.litigationDetail = this.lawsuitService.currentLitigation;
    this.lgCloseForm = this.lawsuitService.lgCloseForm!;
    this.isViewMode = this.litigationDetail?.litigationCloseInfo?.litigationId ? true : false;

    const litigationCloseInfo = this.litigationDetail.litigationCloseInfo;
    this.closeMessage = this.translate.instant('LAWSUIT.DEFERMENT.MESSAGE_BANNER.CLOSE_START_BANNER_MESSAGE', {
      CREATEBY: litigationCloseInfo?.createdBy,
      CREATEBYNAME: litigationCloseInfo?.createdByName,
      CREATEDDATE: this.buddhistEraPipe.transform(litigationCloseInfo?.createdDate, 'DD/MM/YYYY'),
    });
    this.initActionBarConfig();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initActionBarConfig() {
    this.actionBarConfig = {
      hasPrimary: !this.isViewMode,
      primaryText: 'LAWSUIT.CLOSE.BTN_CLOSE_LITIGATION',
      primaryIcon: 'icon-Archive',
      hasCancel: false,
      hasReject: false,
      rejectText: 'COMMON.BUTTON_NOT_APPROVE',
      rejectIcon: 'icon-Dismiss-Square',
      hasSave: false,
    };
  }

  /** ACTIONS */
  async onPrimary() {
    this.lgCloseForm = this.lawsuitService.lgCloseForm!;
    this.lgCloseForm?.markAllAsTouched();
    if (!this.lgCloseForm.invalid) {
      let closeLitigationRequest: CloseLitigationRequest = {
        closeCondition: this.lgCloseForm.value.closeCondition,
        closeReason: this.lgCloseForm.value.closeReason,
        litigationId: this.litigationDetail.litigationId,
      };
      if (closeLitigationRequest.closeCondition === CloseLitigationRequest.CloseConditionEnum.DeptClosed) {
        closeLitigationRequest.litigationCaseDebtInfos = this.closeLgDetail.litigationCaseDebtInfos;
        closeLitigationRequest.totalDebtAmount = Number(
          this.arraySumPipe.transform(this.closeLgDetail.litigationCaseDebtInfos, 'debtAmount')
        );
      }
      const res = await this.lawsuitService.closeLitigation(closeLitigationRequest);
      if (res) {
        this.clearForm();
        this.lawsuitService.hasEdit = false;
        this.routerService.back();
      }
    }
  }

  clearForm() {
    this.lgCloseForm = this.lawsuitService.lgCloseForm!;
    if (this.lgCloseForm) this.lgCloseForm.reset();
  }

  async onCancel() {
    if (await this.sessionService.confirmExitWithoutSave()) {
      this.clearForm();
      this.lawsuitService.hasEdit = false;
      this.routerService.back();
    }
  }

  async canDeactivate() {
    const routesWithDataRemain = [
      '/main/lawsuit/detail',
      '/main/lawsuit/deferment/defer',
      '/main/lawsuit/detail/account-detail',
    ];
    if (routesWithDataRemain.some(path => this.nextRouting.includes(path))) {
      return true;
    }
    this.lawsuitService.clearData();
    return true;
  }
}
