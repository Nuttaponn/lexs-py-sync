import { Component, OnInit } from '@angular/core';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { SeizurePropertyService } from '@app/modules/seizure-property/seizure-property.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { WithdrawnSeizurePropertyService } from '@app/modules/withdrawn-seizure-property/withdrawn-seizure-property.service';
import { WITHDRAWN_REASON_OPTION } from '@app/shared/constant/withdraw-reasons.constant';

import { Mode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { coerceString, compare, getOption } from '@app/shared/utils';
import {
  CollateralAppraisalDocumentDto,
  LegalExecutionCommandResponse,
  LitigationCaseInfo,
  PostValidateRequest,
  SeizureCommandResponse,
  SeizureInfo,
  TitleDeedDocument,
  ValidateRequestDto,
  WithdrawLitigationCaseDto,
  WithdrawSeizureGroups,
  WithdrawSeizureResponse,
} from '@lexs/lexs-client';
import { LexsUserPermissionCodes as PCode } from '@shared/models/permission';
import { SeizeMoreAssetsDialogComponent } from './seize-more-assets-dialog/seize-more-assets-dialog.component';
import { SeizureCollateralTypes } from '@app/shared/constant';
@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.scss'],
})
export class OrderInfoComponent implements OnInit {
  public canWithdrawn: boolean = false;
  public canOrderSeizure: boolean = false;
  public seizureCommand!: any;
  public withdrawnSeizureCommand!: LegalExecutionCommandResponse;
  public accessPermissions = this.sessionService.accessPermissions();
  public getSeizureCommandData!: SeizureCommandResponse;
  public hideDateSeizureDate = ['R2E06-01-A', 'R2E06-01-A_CREATE', 'R2E06-01-A_02', 'PENDING', 'CANCELLED'];
  public hasWithdrawnAssetSeizurePermission = this.sessionService.hasPermission(PCode.WITHDRAW_ASSET_SEIZURE);
  public hasAssetSeizurePrepPermission = this.sessionService.hasPermission(PCode.ASSET_SEIZURE_PREP);

  private litigationId =
    this.lawsuitService.currentLitigation.litigationId || this.taskService.taskDetail.litigationId || '';

  constructor(
    private routerService: RouterService,
    private sessionService: SessionService,
    private lawsuitService: LawsuitService,
    private taskService: TaskService,
    private seizurePropertyService: SeizurePropertyService,
    private withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService,
    private litigationCaseService: LitigationCaseService,
    private notificationService: NotificationService
  ) {
    // TODO: merge getSeizureCommand and getWithdrawnSeizureCommand -> render to html
    this.getSeizureCommand();
    this.getWithdrawnSeizureCommand();
  }

  ngOnInit() {
    this.canWithdrawn = this.initPermissionWithdrawn();
    this.canOrderSeizure = this.initPermissioOrderSeizure();
  }

  initPermissionWithdrawn() {
    return (
      this.accessPermissions.subRoleCode === 'MAKER' ||
      this.sessionService.isBUOwner() ||
      this.hasWithdrawnAssetSeizurePermission
    );
  }

  initPermissioOrderSeizure() {
    return (
      (this.sessionService.isAMDRestructure() && this.accessPermissions.subRoleCode === 'MAKER') ||
      this.sessionService.isBC() ||
      (this.sessionService.isCBC() && this.accessPermissions.subRoleCode === 'MAKER') ||
      this.sessionService.isBUOwner() ||
      this.hasAssetSeizurePrepPermission
    );
  }

  private async getSeizureCommand() {
    if (this.litigationId) {
      let data = await this.seizurePropertyService.getSeizureCommand(this.litigationId);
      this.getSeizureCommandData = data;
      if (Object.keys(data).length > 0) {
        const formatRows = this.formatData(data.litigationCases || []);
        const sortedRows = formatRows.litigationCases.map((it: LitigationCaseInfo) => {
          if (it.seizures?.length) {
            it.seizures = it.seizures?.sort(this.sortSeizure);
          }
          return it;
        });
        this.seizureCommand = { litigationCases: [...sortedRows] };
      } else {
        this.seizureCommand = {
          litigationCases: [],
        };
      }
    }
  }

  private async getWithdrawnSeizureCommand() {
    if (this.litigationId) {
      this.withdrawnSeizureCommand = {};
      // TODO: enable after api ready to call
      this.withdrawnSeizureCommand = await this.withdrawnSeizurePropertyService.getLegalExecutionCommand(
        this.litigationId
      );

      this.withdrawnSeizureCommand.litigationCases?.forEach(x => {
        x.withdrawSeizure?.sort((a: any, b: any) => {
          const result = a.withdrawSeizureSeq
            .toString()
            .localeCompare(b.withdrawSeizureSeq.toString(), 'en', { numeric: true });
          return -result;
        });
      });
    }
  }

  formatData(array: any[]) {
    let arr = [];
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      element.isOpened = true;
      arr.push(element);
    }
    return { litigationCases: arr };
  }

  onViewDetail(element: any, details: any) {
    this.setDataSeizure(details);
    if (details.seizureType === 'NCOL') {
      this.seizurePropertyService.seizureDTO = {
        ...this.seizurePropertyService.seizureDTO,
        processingDocument: element.processingDocument,
      };
    }
    const destination =
      details.seizureType === 'NCOL'
        ? '/main/lawsuit/seizure-property/non-pledge'
        : '/main/lawsuit/seizure-property/command';

    return this.routerService.navigateTo(destination, {
      litigationId: this.litigationId,
      litigationCaseId: element.litigationCaseId,
      seizureId: details.seizureId || '',
      createdTimestamp: details.createdTimestamp,
      mode: 'VIEW',
      seizurePageType:
        details.seizureType === 'NCOL' ? SeizureCollateralTypes.NON_PLEDGE : SeizureCollateralTypes.PLEDGE,
    });
  }

  async onClickWithdrawn(element: any) {
    const request: PostValidateRequest = {
      actorId: this.sessionService.currentUser?.userId,
      litigationCaseId: Number(element.litigationCaseId),
      withdrawSeizureType: 'COL',
    };
    const response = await this.withdrawnSeizurePropertyService.postWithdrawSeizuresValidate(request);
    // TODO: pass some params for check render withdrawn-info-step
    this.routerService.navigateTo('/main/lawsuit/withdrawn-seizure-property', {
      litigationId: this.litigationId,
      litigationCaseId: element.litigationCaseId,
      mode: 'ADD',
      isOnRequest: true,
    });
  }

  async onClickOrderSeizure(element: any, index: number) {
    const assetType = await this.notificationService.showCustomDialog({
      component: SeizeMoreAssetsDialogComponent,
      title: 'สั่งการยึดทรัพย์เพิ่ม',
      iconClass: 'icon-medium',
      iconName: 'icon-Stack',
      buttonIconName: 'icon-Selected',
      rightButtonLabel: 'ยืนยันสั่งการ',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      type: 'normal',
      autoWidth: false,
    });

    if (!assetType) return;

    switch (assetType) {
      case 'NON_PLEDGE':
        let requestNCOL: ValidateRequestDto = {
          actorId: this.sessionService.currentUser?.userId,
          initType: 'M',
          litigationCaseId: element.litigationCaseId,
          seizureType: 'NCOL',
        };

        await this.seizurePropertyService.validate(requestNCOL);
        this.routerService.navigateTo(`/main/lawsuit/seizure-property/non-pledge`, {
          litigationId: this.litigationId,
          litigationCaseId: element.litigationCaseId,
          mode: 'EDIT',
          seizureId: element?.seizures[index]?.seizureId || '',
          seizurePageType: SeizureCollateralTypes.NON_PLEDGE,
        });
        break;

      default:
        let request: ValidateRequestDto = {
          actorId: this.sessionService.currentUser?.userId,
          initType: 'M',
          litigationCaseId: element.litigationCaseId,
          seizureType: 'COL',
        };

        await this.seizurePropertyService.validate(request);
        this.routerService.navigateTo(`/main/lawsuit/seizure-property/command`, {
          litigationId: this.litigationId,
          litigationCaseId: element.litigationCaseId,
          mode: 'EDIT',
          seizureId: element?.seizures[index]?.seizureId || '',
          seizurePageType: SeizureCollateralTypes.PLEDGE,
        });
        break;
    }
  }

  setDataSeizure(seizure: SeizureInfo) {
    this.seizurePropertyService.documentsTitleDeed = seizure?.deedDocuments as TitleDeedDocument[];
    this.litigationCaseService.documentsCollaterals = {
      collaterals: seizure?.seizureCollaterals || [],
    } as any;

    this.seizurePropertyService.docCollateralAppraisal =
      seizure?.appraisalDocuments as CollateralAppraisalDocumentDto[];
  }

  sortSeizure(a: SeizureInfo, b: SeizureInfo) {
    const aa = a.createdTimestamp ? new Date(a.createdTimestamp).getTime() : 0;
    const bb = b.createdTimestamp ? new Date(b.createdTimestamp).getTime() : 0;
    return compare(aa, bb, true);
  }

  onViewWithdrawnDetail(details: WithdrawSeizureResponse) {
    const litigationId = coerceString(this.litigationId, '');
    const litigationCaseId = coerceString(details.litigationCaseId, '');
    const withdrawSeizureId = coerceString(details.withdrawSeizureId, '');
    const mode = Mode.VIEW_PENDING;
    const withdrawnCount = details.withdrawSeizureSeq;
    this.routerService.navigateTo('/main/lawsuit/withdrawn-seizure-property', {
      mode,
      withdrawSeizureId,
      litigationId,
      litigationCaseId,
      withdrawnCount,
    });
  }

  getWithdrawnSeizureByCaseId(litigationCaseId: number): any {
    let withdrawnSeizureByCase: WithdrawLitigationCaseDto = {};
    if (litigationCaseId) {
      withdrawnSeizureByCase =
        this.withdrawnSeizureCommand.litigationCases?.find(it => it.litigationCaseId === litigationCaseId) || {};
    }
    return withdrawnSeizureByCase;
  }

  getWithdrawnSeizureReason(data: any): IWithdrawSeizureReasonViewModel[] {
    const reasonText = getOption(coerceString(data.reasonWithdrawSeizures), WITHDRAWN_REASON_OPTION)?.text;
    const obj: IWithdrawSeizureReasonViewModel = {
      ...data,
      debtPaidAmount: parseFloat(data.debtPaidAmount) > 0 ? data.debtPaidAmount : '',
      reason: reasonText,
      maker: coerceString(data.actorId) + '-' + coerceString(data.actorName),
    };
    return [obj];
  }

  countWithdrawnCallateral(data?: Array<WithdrawSeizureGroups>) {
    let countCol = data?.flatMap(it => it.collaterals).length || 0;
    let countAsset = data?.flatMap(it => it.assets).length || 0;
    return countCol + countAsset;
  }

  countWithdrawnContact(data?: Array<WithdrawSeizureGroups>) {
    return data?.flatMap(it => it.contacts).length;
  }

  trackReason(index: number, item: IWithdrawSeizureReasonViewModel): string {
    return `${item.withdrawSeizureId}`;
  }

  filterSeizure(items: any[], type: 'COL' | 'NCOL') {
    return items.filter(it => it.seizureType === type);
  }
}

export interface IWithdrawSeizureReasonViewModel extends WithdrawSeizureResponse {
  reason?: string;
  maker: string;
}
