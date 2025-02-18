import { Injectable } from '@angular/core';
import { taskCode } from '@app/shared/models';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { NotificationService } from '@app/shared/services/notification.service';
import {
  HeirInfoRequest,
  LitigationCaseControllerService,
  LitigationControllerService,
  LitigationDetailDto,
  PersonDto,
  PersonHeirInfoDto,
  PersonLitigationInfoRequest,
} from '@lexs/lexs-client';
import { DialogOptions } from '@spig/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { ResonRejectDialogComponent } from './debt-related-info-tab/reson-reject-dialog/reson-reject-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DebtRelatedInfoTabService {
  constructor(
    private errorHandlingService: ErrorHandlingService,
    private litigationService: LitigationControllerService,
    private litigationCaseService: LitigationCaseControllerService,
    private notificationService: NotificationService
  ) {}

  public loadCustomerDetail: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loadLitigationDetail: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private _litigation!: LitigationDetailDto;
  get currentLitigation(): LitigationDetailDto {
    return this._litigation;
  }

  set currentLitigation(role: LitigationDetailDto) {
    this._litigation = role;
  }

  private _litigationId?: string | undefined;
  get litigationId(): string | undefined {
    return this._litigationId;
  }

  set litigationId(litigationId: string | undefined) {
    this._litigationId = litigationId;
  }

  private _updatePersonsBlackCase!: PersonDto[];
  get updatePersonsBlackCase(): PersonDto[] {
    return this._updatePersonsBlackCase;
  }

  set updatePersonsBlackCase(persons: PersonDto[]) {
    this._updatePersonsBlackCase = persons;
  }

  async getAdditionalPersonsRelation(litigationId: string, serviceName: string, taskId?: number): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationService.getAdditionalPersonsRelation(litigationId, serviceName, taskId))
    );
  }

  async updateAdditionalPersonsBlackCase(request: PersonLitigationInfoRequest): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationService.updateAdditionalPersonsBlackCase(request))
    );
  }

  async updateCaseAdditionalPersonsBlackCase(request: PersonLitigationInfoRequest): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationCaseService.updateAdditionalPersonsBlackCase(request))
    );
  }

  async decreasePersonsBlackCase(request: PersonLitigationInfoRequest, taskId?: number): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationCaseService.decreasePersonsBlackCase(request, taskId))
    );
  }

  async getHeirInformation(litigationId: string, personId: string): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationService.getHeirInformation(litigationId, personId))
    );
  }

  async openDialogResonReject(litigationId: string, personId: string, taskCodeInput: taskCode) {
    const heirInformation: PersonHeirInfoDto = await this.getHeirInformation(litigationId, personId);
    let isViewMode = taskCodeInput === taskCode.INVESTIGATE_HEIR_OR_TRUSTEE ? false : true;
    const context = { isViewMode: isViewMode, heirInformationObj: heirInformation };
    const dialogSetting: DialogOptions = this.initDialogResonReject(context, taskCodeInput);
    const res = await this.notificationService.showCustomDialog(dialogSetting);
    return res;
  }

  private initDialogResonReject(context: any, taskCodeInput?: taskCode): DialogOptions {
    const taskDetailTaskCodes = taskCodeInput;
    let dialogSetting: DialogOptions = {};
    if (taskDetailTaskCodes === taskCode.INVESTIGATE_HEIR_OR_TRUSTEE) {
      dialogSetting = {
        component: ResonRejectDialogComponent,
        title: 'ไม่พบทายาทหรือผู้จัดการมรดก',
        iconName: 'icon-Dismiss-Square',
        rightButtonLabel: 'ไม่พบ',
        rightButtonClass: 'mat-warn long-button',
        buttonIconName: 'icon-Dismiss-Square',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        context: context,
      };
    } else if (
      taskDetailTaskCodes === taskCode.PROCESS_NOT_PROSECUTE_1 ||
      taskDetailTaskCodes === taskCode.PROCESS_NOT_PROSECUTE_2 ||
      !taskDetailTaskCodes
    ) {
      dialogSetting = {
        component: ResonRejectDialogComponent,
        title: 'รายละเอียดและเอกสารประกอบ',
        iconName: 'icon-Window',
        rightButtonLabel: 'COMMON.BUTTON_ACKNOWLEDGE',
        context: context,
      };
    }
    return dialogSetting;
  }

  async processHeir(taskId: number, request: HeirInfoRequest): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationService.processHeir(taskId, request))
    );
  }

  async processNotProsecute(taskId: number, request: HeirInfoRequest): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationService.processNotProsecute(taskId, request))
    );
  }
}
