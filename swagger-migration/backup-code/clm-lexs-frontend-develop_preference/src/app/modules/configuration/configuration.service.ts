import { Injectable } from '@angular/core';
import { LOCAL_STORAGE } from '@app/shared/constant/localstorage.constant';
import { DataService } from '@app/shared/services/data.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { Utils } from '@app/shared/utils/util';
import {
  ConfigurationControllerService,
  ExpenseConfigDto,
  LexsConfigRequest,
  PageOfResponseUnitUserDto,
  ResponseUnitMapTasksRequest,
  ResponseUnitRequest,
} from '@lexs/lexs-client';
import { MultiUserMatchDialogComponent } from '@shared/components/configuration-matching/multi-user-match-dialog/multi-user-match-dialog.component';
import { ErrorHandlingService } from '@shared/services/error-handling.service';
import { DialogOptions } from '@spig/core';
import { lastValueFrom } from 'rxjs';
import {
  BusinessLogicAdduserValidate,
  ConfigModel,
  ConfigurationSearchConditionReq,
  ExtendResponseUnitUserDto,
  ExtendedResponseUnitUserDetailsDto,
  ILexsUserOption,
  UserMatchDialogResponse,
} from './config.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private _updatedResponseUnitUsers: ExtendResponseUnitUserDto[] = [];
  public get updatedResponseUnitUsers(): ExtendResponseUnitUserDto[] {
    return this._updatedResponseUnitUsers;
  }
  public set updatedResponseUnitUsers(value: ExtendResponseUnitUserDto[]) {
    this._updatedResponseUnitUsers = value;
  }

  constructor(
    private configurationControllerService: ConfigurationControllerService,
    private notificationService: NotificationService,
    private errorHandlingService: ErrorHandlingService,
    private dataService: DataService
  ) {}

  clearData() {
    this.updatedResponseUnitUsers = [];
  }

  public async expenseTypeCode(expenseTypeCode: string): Promise<ExpenseConfigDto> {
    let data = this.dataService.get(LOCAL_STORAGE.CONFIGURATION.EXPENSE_TYPE_CODE) as ExpenseConfigDto;
    if (data) {
      return data;
    } else {
      let response = await this.getExpenseTypeCode(expenseTypeCode);
      if (response) {
        this.dataService.set(LOCAL_STORAGE.CONFIGURATION.EXPENSE_TYPE_CODE, response);
      }
      return this.dataService.get(LOCAL_STORAGE.CONFIGURATION.EXPENSE_TYPE_CODE) as ExpenseConfigDto;
    }
  }

  async inquiryConfig() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.configurationControllerService.inquiryConfig())
    );
  }

  async updateConfig(requestBody: LexsConfigRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.configurationControllerService.updateConfig(requestBody))
    );
  }

  async inquiryResponseUnitUsers(searchCondReq: ConfigurationSearchConditionReq): Promise<PageOfResponseUnitUserDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.configurationControllerService.inquiryResponsibleUsers(
          searchCondReq.page,
          searchCondReq.responseUnitCode,
          searchCondReq.size,
          searchCondReq.userId === 'ALL' ? undefined : searchCondReq.userId
        )
      )
    );
  }

  async inquiryResponseUnitMapTasks(
    taskId: string,
    searchCondReq: ConfigurationSearchConditionReq
  ): Promise<PageOfResponseUnitUserDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.configurationControllerService.inquiryResponseUnitMapTasks(
          taskId,
          searchCondReq.page,
          searchCondReq.responseUnitCode,
          searchCondReq.size,
          searchCondReq.userId === 'ALL' ? undefined : searchCondReq.userId
        )
      )
    );
  }

  public getResponseUnitMapRequestList(): ResponseUnitRequest[] {
    let responseUnitRequestList: ResponseUnitRequest[] = [];
    for (let updatedResponseUnitUser of this._updatedResponseUnitUsers) {
      for (let detailDto of updatedResponseUnitUser?.responseUnitUserDetailsDto ?? []) {
        if (!!detailDto.updateFlag) {
          const responseUnitRequest: ResponseUnitRequest = {
            effectiveDate: detailDto.effectiveDate,
            id: detailDto.id,
            responseUnitCode: updatedResponseUnitUser.responseUnitCode,
            updateFlag: detailDto.updateFlag,
            userId: detailDto.userId,
          };

          responseUnitRequestList.push(responseUnitRequest);
        }
      }
    }
    return responseUnitRequestList;
  }

  async postResponseUnitMapTasks(requestBody: ResponseUnitMapTasksRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.configurationControllerService.postResponseUnitMapTasks(requestBody))
    );
  }

  // ####################### No integrate API function #####################
  async callMultiUserMatchDialogComponent(
    selectedLength: number,
    userOptions: ILexsUserOption[]
  ): Promise<UserMatchDialogResponse | boolean> {
    const myContext = {
      selectedLength,
      userOptions: userOptions,
    };

    const dialogSetting: DialogOptions = {
      component: MultiUserMatchDialogComponent,
      title: 'CONFIGURATION.MULTI_USER_MATCH_DIALOG_TITLE',
      iconName: 'icon-Person-Swap',
      rightButtonLabel: 'CONFIGURATION.MULTI_USER_MATCH_DIALOG_CONFIRM_BTN',
      buttonIconName: 'icon-Person-Swap',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      context: myContext,
    };

    const res = await this.notificationService.showCustomDialog(dialogSetting);

    if (!res) return false;

    return res;
  }

  getBusinessLogicAddUserValidate(
    details: ExtendedResponseUnitUserDetailsDto[],
    userId: string,
    effectiveDate: string
  ): BusinessLogicAdduserValidate {
    if (details.length === 0) {
      return {
        isRepeatAssigningUser: false,
        isSameEffectiveDateAsExisted: false,
      };
    }

    // ๐ หากเลือกตรงกับผู้ดูแลรายเดิมที่มีผลอยู่และไม่ได้มีรายการผู้ดูแลรายอื่นมาคั่นระหว่างวันที่มีผลกับรายการผู้ดูแลที่รับผิดชอบในอนาคตให้ ignore รายการของหน่วยงานนี้(เหมือนไม่ได้เลือก)
    let clonedDetails = [...details];
    clonedDetails = clonedDetails.filter(dto => dto.statusCode !== ConfigModel.RES_UNIT_USER_STATUSES.I.statusCode);
    clonedDetails = this.sortDescDetailDtosByEffDate([
      { userId, effectiveDate, isMock: true },
      ...clonedDetails,
    ]); /** dto with ACTIVE statusCode must be the most behind or this code is collapsed! */
    const mockIndex = clonedDetails.findIndex(dto => dto.isMock === true);
    let isRepeatAssigningUser: boolean = false;
    /** เช็ค Dto ใหม่ กับ Dto ตัวท้าย */
    if (mockIndex < clonedDetails.length - 1) {
      isRepeatAssigningUser = clonedDetails[mockIndex].userId === clonedDetails[mockIndex + 1].userId;
    }
    /** เช็ค Dto ใหม่ กับ Dto ตัวหน้า */
    if (mockIndex > 0) {
      isRepeatAssigningUser =
        isRepeatAssigningUser || clonedDetails[mockIndex].userId === clonedDetails[mockIndex - 1].userId;
    }

    // ๐ หากวันที่ที่มีผลตรงกับรายการในอนาคตของรายการที่มีอยู่แล้วให้ ignore รายการของหน่วยงานนี้(เหมือนไม่ได้เลือก)
    const isSameEffectiveDateAsExisted: boolean =
      details.findIndex(
        dto =>
          Utils.calculateDateDiff(
            new Date(dto.effectiveDate ?? ''),
            new Date(clonedDetails[mockIndex].effectiveDate ?? '')
          ) === 0
      ) >= 0;
    return {
      isRepeatAssigningUser,
      isSameEffectiveDateAsExisted,
    };
  }

  isBusinessLogicAddUserInvalid(BLAV: BusinessLogicAdduserValidate) {
    return BLAV.isRepeatAssigningUser || BLAV.isSameEffectiveDateAsExisted; // TODO: check correctness
  }
  businessLogicAddUserAddNewUserToList(
    selectedUser: ILexsUserOption,
    effectiveDate: string,
    currentDetails: ExtendedResponseUnitUserDetailsDto[]
  ): ExtendedResponseUnitUserDetailsDto[] {
    const addedDto: ExtendedResponseUnitUserDetailsDto = {
      updateFlag: 'A',
      createdDate: new Date().toISOString(),
      effectiveDate: effectiveDate,
      name: selectedUser?.name,
      statusCode: ConfigModel.RES_UNIT_USER_STATUSES.Q.statusCode,
      statusName: ConfigModel.RES_UNIT_USER_STATUSES.Q.statusName,
      surName: selectedUser?.surname,
      userId: selectedUser.userId,
    };

    /* เพิ่มค่าใหม่เข้าไป */
    currentDetails.unshift(addedDto);
    currentDetails = [...currentDetails];

    /* sort data */
    currentDetails = this.sortDescDetailDtosByEffDate(currentDetails);
    return currentDetails;
  }

  public sortDescDetailDtosByEffDate(details: ExtendedResponseUnitUserDetailsDto[]) {
    return details.sort(
      (a, b) => new Date(b.effectiveDate ?? '').valueOf() - new Date(a.effectiveDate ?? '').valueOf()
    );
  }

  async getExpenseTypeCode(expenseTypeCode: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.configurationControllerService.getExpenseTypeCode(expenseTypeCode))
    );
  }
}
