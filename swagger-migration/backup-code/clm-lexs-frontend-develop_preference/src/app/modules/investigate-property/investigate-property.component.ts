import { Component, OnInit } from '@angular/core';
import { TaskService } from '@modules/task/services/task.service';
import { RouterService } from '@shared/services/router.service';
import { SessionService } from '@shared/services/session.service';
import { NotificationService } from '@shared/services/notification.service';
import { DialogOptions } from '@spig/core';
import { MAIN_ROUTES } from '@shared/constant';
import { ActionBar, taskCode, TMode } from '@shared/models';
import { SubButtonModel } from '@shared/components/action-bar/action-bar.component';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { InvestigatePropertyService } from './investigate-property.service';
import {
  AssetInvestigationPersonDocumentUpload,
  AssetInvestigationPersonUpdate,
  AssetInvestigationPersons,
  AssetInvestigationSaveRequest,
  AssetInvestigationSaveResponse,
  PersonDto,
} from '@lexs/lexs-client';

@Component({
  selector: 'app-investigate-property',
  templateUrl: './investigate-property.component.html',
  styleUrls: ['./investigate-property.component.scss'],
})
export class InvestigatePropertyComponent implements OnInit {
  ICON_TYPE = {
    TASK_LIST: 'icon-Task-List',
    LIST_MUTILPLE: 'icon-List-Multiple',
    LIST_CHEQUE: 'icon-Cheque',
    VIEW_CASHIER: 'icon-Document-Bullet-List',
    UPLOAD: 'icon-Arrow-Upload',
    VIEW_PAYMENT: 'icon-Money',
    ICON_LIST: 'icon-List',
    AUCTION_SUBMIT: 'icon-Auction-Submit',
    HAT_OUTLINE: 'icon-Hat-Outline',
  };
  public accessPermissions = this.sessionService.accessPermissions();
  public permissions = this.accessPermissions.permissions;

  public actionBar: ActionBar = {
    hasSave: false,
    hasPrimary: false,
    hasCancel: false,
    hasReject: false,
    hasEdit: false,
  };
  subButtonList!: SubButtonModel[];
  maxSubButton!: number;

  title!: string;
  taskIcon!: string;
  statusName: any;
  statusCode: any;
  taskCode!: taskCode;
  public mode!: TMode;

  messageBanner = '';
  errorBannerMsg = '';

  public hasSubmitPermission = false;
  public hasAdditionalTitle = false;
  public additionalTitle = '';

  get taskId() {
    return coerceNumberProperty(this.taskService.taskDetail.id);
  }

  get isOwnerTask() {
    if (this.mode === 'ADD') return true;
    return this.sessionService.isOwnerTask(
      this.taskService.taskOwner,
      this.taskService.taskDetail.enableTaskSupportRole
    );
  }

  constructor(
    private taskService: TaskService,
    private routerService: RouterService,
    private sessionService: SessionService,
    private notificationService: NotificationService,
    private investigatePropertyService: InvestigatePropertyService
  ) {}

  ngOnInit(): void {
    this.mode = this.investigatePropertyService.mode as TMode;
    this.taskCode = this.taskService.taskDetail?.taskCode as taskCode;
    this.statusCode = this.taskService.taskDetail?.statusCode || '';
    this.initActionBar();
    this.initActionBarStatus();
    this.initPermission();
    this.initActionBar();
    this.mappingPageBanner();
    this.mappingPageIcon();
    this.mappingPageTitle();
    this.onRouterLink();
  }

  private initActionBarStatus() {
    if (this.mode === 'VIEW') {
      this.statusName = this.investigatePropertyService.assetInvestigationInfo.statusName;
      this.statusCode = this.investigatePropertyService.assetInvestigationInfo.status;
    } else if (this.taskCode === taskCode.R2E03_01_01) {
      this.statusName = this.taskService.taskDetail.statusName;
      this.statusCode = this.taskService.taskDetail.statusCode;
    } else {
      this.statusName = this.taskService.taskDetail?.statusName || '';
    }
  }

  private mappingPageBanner() {
    if (this.taskCode === taskCode.R2E03_01_01) {
      this.messageBanner = `INVESTIGATE_PROPERTY.MSG_BANNER_E03_01_01`;
    }
  }

  private mappingPageIcon() {
    if (this.mode === 'VIEW' || this.mode === 'ADD') {
      this.taskIcon = this.ICON_TYPE.HAT_OUTLINE;
    } else if (this.taskCode === taskCode.R2E03_01_01) {
      this.taskIcon = this.ICON_TYPE.TASK_LIST;
    }
  }

  private mappingPageTitle() {
    if (this.mode === 'VIEW') {
      this.title = `รายละเอียดสืบทรัพย์: คดีแพ่ง ${this.investigatePropertyService.litigationCaseSeqNo}`;
    } else if (this.taskCode === taskCode.R2E03_01_01) {
      this.title = 'สั่งการสืบทรัพย์';
    } else if (this.mode === 'ADD') {
      this.title = `สั่งการสืบทรัพย์: คดี ${this.investigatePropertyService.litigationCaseSeqNo}`;
    }
  }

  onRouterLink() {
    const mainPath = `/${this.routerService.findRootMenu(this.routerService.currentRoute)}/investigate-property`;
    const params = this.routerService.paramMapp.get(mainPath);
    if (this.taskCode === taskCode.R2E03_01_01) {
      this.routerService.navigateTo(`${MAIN_ROUTES.MAIN}/task/investigate-property/investigate-property-command`);
    } else if (this.mode === 'ADD') {
      this.routerService.navigateTo(
        `${MAIN_ROUTES.MAIN}/task/investigate-property/investigate-property-command`,
        params
      );
    } else {
      this.routerService.navigateFormTaskMenu
        ? this.routerService.navigateTo(`${MAIN_ROUTES.TASK}/investigate-property/investigate-property-detail`, params)
        : this.routerService.navigateTo(
            `${MAIN_ROUTES.LAWSUIT}/investigate-property/investigate-property-detail`,
            params
          );
    }
  }

  initActionBar() {
    if (this.isOwnerTask && (this.taskCode === taskCode.R2E03_01_01 || this.mode === 'ADD')) {
      this.actionBar = {
        ...this.actionBar,
        hasPrimary: true,
        hasReject: true,
        hasSave: true,
        primaryText: 'INVESTIGATE_PROPERTY.ACTION_BAR_CONFIRM_TEXT',
        rejectText: 'INVESTIGATE_PROPERTY.ACTION_BAR_CANCEL_TEXT',
        rejectIcon: 'icon-Bin',
        saveText: 'INVESTIGATE_PROPERTY.ACTION_BAR_SAVE_TEXT',
        primaryIcon: 'icon-Hat-White',
      };
    } else {
      this.actionBar = {
        hasSave: false,
        hasPrimary: false,
        hasCancel: false,
        hasReject: false,
        hasEdit: false,
      };
    }
  }

  initPermission() {
    if (this.mode === 'ADD') {
      this.hasSubmitPermission = true;
    } else if (this.mode === 'VIEW') {
      this.hasSubmitPermission = false;
    } else {
      // this.hasSubmitPermission = this.sessionService.hasPermissionByTaskCode(this.taskCode);
    }
    // this.auctionService.hasSubmitPermission = this.hasSubmitPermission;
  }

  async onBack() {
    if (this.mode === 'ADD') {
      if (this.investigatePropertyService.assetInvestigationForm.touched) {
        this.openConfirmBackToEdit();
      } else {
        this.routerService.back();
      }
    } else {
      switch (this.taskCode) {
        case taskCode.R2E03_01_01:
          if (this.investigatePropertyService.assetInvestigationForm.touched) {
            this.openConfirmBackToEdit();
          } else {
            this.routerService.back();
          }
          break;
        default:
          this.routerService.back();
          break;
      }
    }
  }

  private async openConfirmBackToEdit() {
    const res = await this.sessionService.confirmExitWithoutSave();
    if (!res) return;
    // this.auctionService.submitResultStatus = false;
    this.routerService.back();
  }

  async onCancel() {
    const optionsDialog: DialogOptions = {
      rightButtonLabel: 'INVESTIGATE_PROPERTY.CONFIRM_CANCEL',
      buttonIconName: 'icon-Bin',
      rightButtonClass: 'mat-warn',
    };
    const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
      'INVESTIGATE_PROPERTY.CONFIRM_CANCEL',
      'INVESTIGATE_PROPERTY.DELETE_TASK',
      optionsDialog
    );
    if (!res) return;

    this.notificationService.openSnackbarSuccess('ยกเลิกงานสั่งการสืบทรัพย์แล้ว');
    this.routerService.back();
  }

  async onSave() {
    if (!this.investigatePropertyService.assetInvestigationForm?.get('reasonCode')?.valid) {
      this.investigatePropertyService.assetInvestigationForm?.get('reasonCode')?.markAsTouched();
      return;
    }
    const resp = await this.saveInvestigationData();
    this.investigatePropertyService.assetInvestigationForm
      .get('assetInvestigationId')
      ?.setValue(resp.assetInvestigationId);
    this.investigatePropertyService.assetInvestigationForm.markAsUntouched();
    this.notificationService.openSnackbarSuccess('บันทึกสั่งการสืบทรัพย์แล้ว');
  }

  private async saveInvestigationData(isSubmit?: boolean) {
    const litigationCaseId: any = this.investigatePropertyService.litigationCaseId;
    const prePayload = this.investigatePropertyService.assetInvestigationForm.getRawValue();
    const litigationDocumentUpload = prePayload.litigationDocuments
      ?.filter((it: any) => it.imageId && !it.originalDocument)
      .map((it: any) => {
        return {
          documentId: it.documentId,
          documentTemplateId: it.documentTemplate?.documentTemplateId,
          documentGroup: it.documentTemplate?.documentGroup,
          uploadSessionId: it.imageId,
        } as AssetInvestigationPersonDocumentUpload;
      });

    const personUpdate = prePayload.persons
      ?.filter((it: AssetInvestigationPersons) => it.personStatus !== PersonDto.PersonStatusEnum.Death)
      .map((it: AssetInvestigationPersons) => {
        return {
          personId: it.personId,
          activeFlag: it.activeFlag || true,
          personDocumentUpload: it.personDocuments
            ?.filter(it => it.imageId && !it.originalDocument)
            ?.map(doc => {
              return {
                documentId: doc.documentId,
                documentTemplateId: doc.documentTemplate?.documentTemplateId,
                documentGroup: doc.documentTemplate?.documentGroup,
                uploadSessionId: doc.imageId,
              } as AssetInvestigationPersonDocumentUpload;
            }),
        } as AssetInvestigationPersonUpdate;
      });

    const payload: AssetInvestigationSaveRequest = {
      action: isSubmit
        ? AssetInvestigationSaveRequest.ActionEnum.Submit
        : AssetInvestigationSaveRequest.ActionEnum.Save,
      reasonCode: prePayload.reasonCode,
      remark: prePayload.remark,
      litigationDocumentUpload: litigationDocumentUpload,
      personUpdate: personUpdate,
    };
    if (this.taskCode === taskCode.R2E03_01_01 || prePayload.assetInvestigationId) {
      return this.investigatePropertyService.postAssetInvestigationSave(
        litigationCaseId,
        payload,
        prePayload.assetInvestigationId
      );
    } else {
      return this.investigatePropertyService.postAssetInvestigationSave(litigationCaseId, payload);
    }
  }

  private async saveInvestigationDataTaskFlow(isSubmit?: boolean) {
    const litigationCaseId: any = this.investigatePropertyService.litigationCaseId;
    const prePayload = this.investigatePropertyService.assetInvestigationForm.getRawValue();
    const litigationDocumentUpload = prePayload.litigationDocuments
      ?.filter((it: any) => it.imageId && !it.originalDocument)
      .map((it: any) => {
        return {
          documentId: it.documentId,
          documentTemplateId: it.documentTemplate?.documentTemplateId,
          documentGroup: it.documentTemplate?.documentGroup,
          uploadSessionId: it.imageId,
        } as AssetInvestigationPersonDocumentUpload;
      });

    const personUpdate = prePayload.persons
      ?.filter((it: any) => it.personStatus !== 'DEATH')
      .map((it: any) => {
        return {
          personId: it.cifNo,
          activeFlag: it.activeFlag,
          personDocumentUpload: it.personDocuments
            ?.filter((it: any) => it.imageId && !it.originalDocument)
            ?.map((doc: any) => {
              return {
                documentId: doc.documentId,
                documentTemplateId: doc.documentTemplate?.documentTemplateId,
                documentGroup: doc.documentTemplate?.documentGroup,
                uploadSessionId: doc.imageId,
              } as AssetInvestigationPersonDocumentUpload;
            }),
        } as AssetInvestigationPersonUpdate;
      });
    const payload: AssetInvestigationSaveRequest = {
      action: isSubmit
        ? AssetInvestigationSaveRequest.ActionEnum.Submit
        : AssetInvestigationSaveRequest.ActionEnum.Save,
      reasonCode: prePayload.reasonCode,
      remark: prePayload.remark,
      litigationDocumentUpload: litigationDocumentUpload,
      personUpdate: personUpdate,
    };
    if (prePayload.assetInvestigationId) {
      await this.investigatePropertyService.postAssetInvestigationSave(
        litigationCaseId,
        payload,
        prePayload.assetInvestigationId
      );
    } else {
      await this.investigatePropertyService.postAssetInvestigationSave(litigationCaseId, payload);
    }
  }

  async onReject() {
    const optionsDialog: DialogOptions = {
      rightButtonLabel: 'INVESTIGATE_PROPERTY.CONFIRM_CANCEL',
      buttonIconName: 'icon-Bin',
      rightButtonClass: 'mat-warn',
    };
    const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
      'INVESTIGATE_PROPERTY.CONFIRM_CANCEL',
      'INVESTIGATE_PROPERTY.DELETE_TASK',
      optionsDialog
    );
    if (!res) return;
    const dataForm = this.investigatePropertyService.assetInvestigationForm.getRawValue();
    const assetInvestigationId = dataForm?.assetInvestigationId;
    if (assetInvestigationId) {
      await this.investigatePropertyService.postAssetInvestigationCancel(assetInvestigationId);
    }
    this.notificationService.openSnackbarSuccess(`ยกเลิกงานสั่งการสืบทรัพย์แล้ว`);
    this.routerService.back();
  }

  async onSubmit() {
    if (this.mode === 'ADD') {
      if (this.investigatePropertyService.assetInvestigationForm.valid) {
        const prePayload = this.investigatePropertyService.assetInvestigationForm.getRawValue();
        let assetInvestigationId = prePayload?.assetInvestigationId;
        let saveResp: AssetInvestigationSaveResponse = {};
        if (!assetInvestigationId) {
          saveResp = await this.saveInvestigationData(true);
          if (saveResp) {
            assetInvestigationId = saveResp.assetInvestigationId || '';
            this.investigatePropertyService.assetInvestigationForm
              .get('assetInvestigationId')
              ?.setValue(saveResp.assetInvestigationId);
          }
        } else if (assetInvestigationId && this.investigatePropertyService.assetInvestigationForm.touched) {
          await this.saveInvestigationData(true);
          this.investigatePropertyService.assetInvestigationForm.markAsUntouched();
        }

        await this.investigatePropertyService.postAssetInvestigationSubmit(assetInvestigationId);
        this.notificationService.openSnackbarSuccess(
          `เลขที่กฏหมาย: ${this.investigatePropertyService.litigationId} สั่งการสืบทรัพย์แล้ว`
        );
        this.routerService.back();
      } else {
        this.investigatePropertyService.assetInvestigationForm.markAllAsTouched();
      }
    } else {
      switch (this.taskCode) {
        case taskCode.R2E03_01_01:
          if (this.investigatePropertyService.assetInvestigationForm.valid) {
            const prePayload = this.investigatePropertyService.assetInvestigationForm.getRawValue();
            const assetInvestigationId = prePayload?.assetInvestigationId;
            if (assetInvestigationId && this.investigatePropertyService.assetInvestigationForm.touched) {
              await this.saveInvestigationDataTaskFlow(true);
            }
            await this.investigatePropertyService.postAssetInvestigationSubmit(assetInvestigationId);
            this.notificationService.openSnackbarSuccess(
              `เลขที่กฏหมาย: ${this.investigatePropertyService.litigationId} สั่งการสืบทรัพย์แล้ว`
            );
            this.routerService.back();
          }
          this.investigatePropertyService.assetInvestigationForm.markAllAsTouched();
          break;

        default:
          break;
      }
    }
  }
}
