import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@app/shared/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig } from '@spig/core';
import { ConfigModel, ExtendedResponseUnitUserDetailsDto, ILexsUserOption } from '../config.model';
import { ConfigurationService } from './../configuration.service';
@Component({
  selector: 'app-user-match',
  templateUrl: './user-match.component.html',
  styleUrls: ['./user-match.component.scss'],
})
export class UserMatchComponent implements OnInit {
  public currentDate: Date = new Date();
  initialListLength: number = 0;
  isEdited = false;

  dataSource: Array<any> = [];

  public extendedResponseUnitUserDetailsDtos!: ExtendedResponseUnitUserDetailsDto[];
  public userOptions!: Array<ILexsUserOption>;

  public userMatchForm!: UntypedFormGroup;

  userOptionErrorMsg: string = '';
  public ddlUserConfig: DropDownConfig = {
    displayWith: 'fullname',
    valueField: 'userId',
    searchPlaceHolder: '',
    labelPlaceHolder: '',
  };

  effectiveDateErrorMsg: string = '';
  public displayedColumns: string[] = ['userIdName', 'statusCode', 'createdDate', 'effectiveDate', 'cmd'];

  isRepeatAssigningUserProp: boolean = false;

  constructor(
    private translate: TranslateService,
    public fb: UntypedFormBuilder,
    private notificationService: NotificationService,
    private configurationService: ConfigurationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.initTranslateTexts();
    this.userMatchForm = this.initUserMatchForm();
  }

  initUserMatchForm() {
    return this.fb.group({
      userId: ['', Validators.required],
      effectiveDate: ['', Validators.required],
    });
  }

  static isForceShowError(isShowError: boolean) {
    if (isShowError) {
      return { invalidName: true };
    } else {
      return null;
    }
  }

  onClickCancelQueue(index: number) {
    if (!this.extendedResponseUnitUserDetailsDtos[index].id) {
      //   • รายการผู้ดูแลที่เพิ่งเพิ่มใหม่ (ยังไม่มีการ call API ไปบันทึกลง database)
      //   • If BA confirm to remove item then remove that item from list
      this.extendedResponseUnitUserDetailsDtos.splice(index, 1);
    } else {
      this.extendedResponseUnitUserDetailsDtos[index] = {
        ...this.extendedResponseUnitUserDetailsDtos[index],
        statusCode: ConfigModel.RES_UNIT_USER_STATUSES.I.statusCode,
        statusName: ConfigModel.RES_UNIT_USER_STATUSES.I.statusName,
        updateFlag: ConfigModel.UpdateFlagEnum.U,
      };
    }
    this.isEdited = true;
    this.extendedResponseUnitUserDetailsDtos = [...this.extendedResponseUnitUserDetailsDtos];

    this.notificationService.openSnackbarSuccess(this.translate.instant('CONFIGURATION.CANCEL_USER_SUCCESS'));
  }

  onClickAddUser() {
    if (
      !this.userMatchForm.get('userId')?.hasValidator(Validators.required) &&
      !this.userMatchForm.get('effectiveDate')?.hasValidator(Validators.required)
    ) {
      this.setResponseUnitUserValidators();
    }

    if (this.userMatchForm.invalid) {
      this.userOptionErrorMsg = 'COMMON.ERROR_MSG_REQUIRED';
      this.effectiveDateErrorMsg = 'COMMON.ERROR_MSG_REQUIRED';
      this.userMatchForm.markAllAsTouched();
      return;
    }

    const { isRepeatAssigningUser, isSameEffectiveDateAsExisted } =
      this.configurationService.getBusinessLogicAddUserValidate(
        [...this.extendedResponseUnitUserDetailsDtos],
        this.getControl('userId')?.value,
        this.getControl('effectiveDate')?.value
      );

    /** if value is invalid is term of busiess logic */
    if (
      this.configurationService.isBusinessLogicAddUserInvalid({
        isRepeatAssigningUser,
        isSameEffectiveDateAsExisted,
      })
    ) {
      this.isRepeatAssigningUserProp = isRepeatAssigningUser;
      if (isRepeatAssigningUser) {
        this.userOptionErrorMsg = 'USER.ERROR_MSG_USER_ID_INVALID';

        this.isRepeatAssigningUserProp = true;
        this.getControl('userId')?.setErrors({ incorrect: true });
      }
      if (isSameEffectiveDateAsExisted) {
        this.effectiveDateErrorMsg = 'USER.ERROR_MSG_USER_ID_INVALID';
        this.getControl('effectiveDate')?.setErrors({ incorrect: true });
      }

      return;
    }

    const selectedUser = this.userOptions.find(dto => dto.userId === this.getControl('userId')?.value);
    if (!selectedUser) return;

    this.extendedResponseUnitUserDetailsDtos = this.configurationService.businessLogicAddUserAddNewUserToList(
      selectedUser,
      this.getControl('effectiveDate')?.value,
      [...this.extendedResponseUnitUserDetailsDtos]
    );

    this.notificationService.openSnackbarSuccess(this.translate.instant('CONFIGURATION.ADD_USER_SUCCESS'));

    this.clearResponseUnitUserValidators();
  }

  clearResponseUnitUserValidators() {
    this.userMatchForm.get('userId')?.clearValidators();
    this.userMatchForm.get('userId')?.setValue('');
    this.userMatchForm.get('effectiveDate')?.clearValidators();
    this.userMatchForm.get('effectiveDate')?.setValue(null);
    this.userMatchForm.get('userId')?.updateValueAndValidity();
    this.userMatchForm.get('effectiveDate')?.updateValueAndValidity();
  }

  setResponseUnitUserValidators() {
    this.userMatchForm.get('userId')?.setValidators(Validators.required);
    this.userMatchForm.get('userId')?.updateValueAndValidity();
    this.userMatchForm.get('effectiveDate')?.setValidators(Validators.required);
    this.userMatchForm.get('effectiveDate')?.updateValueAndValidity();
  }

  initTranslateTexts() {
    this.ddlUserConfig.labelPlaceHolder = 'CONFIGURATION.USER_NAME';
    this.userOptionErrorMsg = 'COMMON.ERROR_MSG_REQUIRED';
    this.effectiveDateErrorMsg = 'COMMON.ERROR_MSG_REQUIRED';
  }

  getControl(name: string): AbstractControl | null {
    return this.userMatchForm.get(name);
  }

  dataContext(data: any) {
    this.extendedResponseUnitUserDetailsDtos = this.configurationService.sortDescDetailDtosByEffDate([
      ...data.extendedResponseUnitUserDetailsDtos,
    ]);
    this.userOptions = data.ddlcc_kbdOptions;
    this.initialListLength = this.extendedResponseUnitUserDetailsDtos?.length ?? 0;
  }

  onUserOptionsSelected(value: string) {
    this.isRepeatAssigningUserProp = false;
  }

  get returnData() {
    return {
      extendedResponseUnitUserDetailsDtos: this.extendedResponseUnitUserDetailsDtos,
      isEdited: this.isEdited || this.initialListLength < this.extendedResponseUnitUserDetailsDtos.length,
    };
  }

  public async onClose(): Promise<boolean> {
    return true;
  }
}
