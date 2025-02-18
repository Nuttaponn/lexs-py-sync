import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IPersonDto } from '@app/modules/customer/customer-detail/person.model';
import { CustomerService } from '@app/modules/customer/customer.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { TASK_ROUTES } from '@app/shared/constant';
import { LexsUserPermissionCodes, statusCode, taskCode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { ActionOnScreen, SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils/util';
import {
  CustomerDetailDto,
  LitigationCaseDto,
  LitigationDetailDto,
  Person,
  PersonAddressDto,
  PersonAddressRequest,
  PersonDto,
  PersonHeirInfoDto,
  PersonInfoRequest,
  PersonRequest,
  TitlePair,
} from '@lexs/lexs-client';
import { LawsuitService } from '@modules/lawsuit/lawsuit.service';
import { TranslateService } from '@ngx-translate/core';
import { BuddhistEraPipe, DropDownConfig, SimpleSelectOption } from '@spig/core';
import { firstValueFrom } from 'rxjs';
import { DebtRelatedInfoTabService } from '../debt-related-info-tab.service';
import { AddRelatedPersonLawsuitComponent } from './add-related-person-lawsuit/add-related-person-lawsuit.component';
import { EditRelatedPersonComponent } from './edit-related-person/edit-related-person.component';
import { RegisterAddressDialogComponent } from './register-address-dialog/register-address-dialog.component';
import { RemoveRelatedPersonLawsuitComponent } from './remove-related-person-lawsuit/remove-related-person-lawsuit.component';

@Component({
  selector: 'app-debt-related-info-tab',
  templateUrl: './debt-related-info-tab.component.html',
  styleUrls: ['./debt-related-info-tab.component.scss'],
  providers: [BuddhistEraPipe],
})
export class DebtRelatedInfoTabComponent implements OnInit {
  private _customerDetail!: CustomerDetailDto;
  @Input()
  public set customerDetail(object: CustomerDetailDto) {
    this._customerDetail = { ...object } || {};
  }
  public get customerDetail(): CustomerDetailDto {
    return this._customerDetail;
  }

  private _litigationDetail!: LitigationDetailDto;
  @Input()
  public set litigationDetail(object: LitigationDetailDto) {
    this._litigationDetail = { ...object } || {};
  }
  public get litigationDetail(): LitigationDetailDto {
    return this._litigationDetail;
  }

  public accessPermissions = this.sessionService.accessPermissions();
  public actionOnScreen: ActionOnScreen = {
    canAdd: false,
    canEdit: false,
    canDelete: false,
  };
  public permissions: string[] = this.accessPermissions.permissions;
  public isEdited: boolean = false;
  public isOnAdd: boolean = false;

  public isCustomer: boolean = false;
  public isLawsuit: boolean = false;
  public isAddBlackCase: boolean = false;
  public isFromTask: boolean = false;
  private taskCode!: taskCode;
  public statusCode!: statusCode;

  public filterConfig: DropDownConfig = {
    displayWith: 'text',
    valueField: 'value',
    searchPlaceHolder: '',
    labelPlaceHolder: 'COMMON.PLACEHOLDER_SHOW',
  };
  public filterOptions: SimpleSelectOption[] = [];
  public filterCtrl: UntypedFormControl = new UntypedFormControl('');

  public detail!: CustomerDetailDto | LitigationDetailDto;
  public originalDetail: LitigationDetailDto = {};
  public personInfoArray: Array<IPersonDto> = [];
  public addressPhoneColumns: string[] = ['no', 'type', 'address', 'date', 'reference'];
  public bankruptcyColumns: string[] = ['no', 'case', 'name', 'citizenId', 'status', 'courtDate', 'comparisonBy'];
  public customerId!: string;
  public isEmptyPerson = true;
  public titleList: Array<TitlePair> = [];
  public personTypeEnum = PersonDto.PersonTypeEnum;
  public sourceSystemEditAddress = 'KEYIN';
  public deceasePersonId: String = '0';

  public uniqueCivilCourtBlackCaseNo: Array<string> = [];

  constructor(
    private lawsuitService: LawsuitService,
    private translate: TranslateService,
    private sessionService: SessionService,
    private masterDataService: MasterDataService,
    private routerService: RouterService,
    private dialog: MatDialog,
    private taskService: TaskService,
    private notificationService: NotificationService,
    private customerService: CustomerService,
    private debtRelatedInfoTabService: DebtRelatedInfoTabService,
    private buddhistEra: BuddhistEraPipe,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    if (this.debtRelatedInfoTabService.loadCustomerDetail.getValue()) {
      this.customerDetail = { ...this.customerService.customerDetail };
      this.debtRelatedInfoTabService.loadCustomerDetail.next(false);
    }
    if (this.debtRelatedInfoTabService.loadLitigationDetail.getValue()) {
      this.litigationDetail = { ...this.lawsuitService.currentLitigation };
      this.debtRelatedInfoTabService.loadCustomerDetail.next(false);
    }

    this.taskCode = (this.taskService.taskDetail?.taskCode as taskCode) || '';
    this.statusCode = (this.taskService.taskDetail?.statusCode as statusCode) || '';

    console.log('customerDetail :: ', this.customerDetail, 'litigationDetail :: ', !this.litigationDetail);
    if (this.customerDetail && !this.litigationDetail) {
      this.isCustomer = true;
      this.isLawsuit = false;
      this.detail = this.customerDetail;
      this.sortPersonInfo();
    } else {
      this.isCustomer = false;
      this.isLawsuit = true;
      this.isFromTask = this.routerService.currentRoute.includes(TASK_ROUTES.DETAIL);
      this.debtRelatedInfoTabService.currentLitigation = this.litigationDetail;
      this.debtRelatedInfoTabService.litigationId = this.litigationDetail?.litigationId;
      this.isAddBlackCase = this.lawsuitService.hasAdditionalPerson;
      this.isEdited = this.isAddBlackCase;
      this.detail = this.litigationDetail;

      this.originalDetail = Utils.deepClone(Object.assign({}, this.detail));
      if (
        this.debtRelatedInfoTabService.updatePersonsBlackCase &&
        this.debtRelatedInfoTabService.updatePersonsBlackCase.length > 0
      ) {
        this.detail = this.lawsuitService.currentLitigation;
        this.detail?.personInfo?.additionalPersons?.push(...this.debtRelatedInfoTabService.updatePersonsBlackCase);
        this.debtRelatedInfoTabService.updatePersonsBlackCase = [];
      }
      this.initTaskInvestigateHeir();
      this.sortPersonInfo();
      this.setFilterOptions();
      // Verify Permission
      if (
        (this.detail?.editStatus !== LitigationDetailDto.EditStatusEnum.Pending && this.taskService.editableData()) ||
        this.isTaskInvestigateHeir
      ) {
        if (this.accessPermissions.subRoleCode === 'VIEWER') {
          this.actionOnScreen = {
            canAdd: false,
            canEdit: false,
            canDelete: false,
          };
        } else {
          this.actionOnScreen = {
            canAdd: this.permissions.includes('ADD_LEGAL_RELATED_PERSON'),
            canEdit: true,
            canDelete: true,
          };
        }
      } else {
        this.actionOnScreen = {
          canAdd: false,
          canEdit: false,
          canDelete: false,
        };
      }
    }
    console.log('this.actionOnScreen=' + JSON.stringify(this.actionOnScreen));
    this.customerId = this.detail?.customerId || '';
  }

  getFullAddress(element: PersonAddressDto) {
    if (element.addressLine || element.subdistrictName || element.districtName || element.provinceName) {
      let postalCode = element.postalCode || '';
      return `${element.addressLine} ${element.subdistrictName} ${element.districtName} ${element.provinceName} ${postalCode}`;
    } else {
      return '-';
    }
  }

  // ----------------------- Action Lawsuit ----------------------- //
  async onEdit(item: PersonDto) {
    const myContext = {
      personDto: item,
      personInfoArray: this.personInfoArray,
      actionInput: PersonDto.UpdateFlagEnum.U,
    };
    const result = await this.notificationService.showCustomDialog({
      component: EditRelatedPersonComponent,
      context: myContext,
      title: 'LAWSUIT.NOTI_EDIT_TITLE_RELATED_PERSON',
      iconName: 'icon-Plus',
      rightButtonLabel: 'COMMON.BUTTON_SAVE',
      buttonIconName: 'icon-save-primary',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      type: 'normal',
      autoWidth: false,
    });
    if (result) {
      const personDto: PersonDto = result.personDto;
      const additionalPersons: Array<PersonDto> = this.detail?.personInfo?.additionalPersons!;
      const findIndex = additionalPersons.findIndex(data => data.personId === item.personId);
      if (findIndex !== -1) {
        additionalPersons[findIndex].personStatus = personDto.personStatus;
        additionalPersons[findIndex].relation = personDto.relation;
        additionalPersons[findIndex].title = personDto.title;
        additionalPersons[findIndex].firstName = personDto.firstName;
        additionalPersons[findIndex].lastName = personDto.lastName;
        additionalPersons[findIndex].name = personDto.name;
        additionalPersons[findIndex].identificationNo = personDto.identificationNo;
        additionalPersons[findIndex].birthDate = personDto.birthDate;
        additionalPersons[findIndex].personType = personDto.personType;
        additionalPersons[findIndex].updateFlag = personDto.updateFlag;
        this.updateAdditionalPersons(personDto);
        this.notificationService.openSnackbarSuccess(`${this.translate.instant('CUSTOMER.ADDITIONAL_PERSON_ADDED')}`);
      }
      this.disabledActionAditionalAndSortPerson(PersonDto.UpdateFlagEnum.U);
    }
  }

  async onDelete(item: PersonDto) {
    const hasBlackCaseNo = this.detail?.cases?.some(e => e.blackCaseNo);
    if (hasBlackCaseNo && !this.isTaskInvestigateHeir) {
      this.notificationService.alertDialog(
        'DEBT_RELATED_INFO_TAB.TAB_REMOVE_RELATE_PERSON.ALERT_MESSAGE',
        'DEBT_RELATED_INFO_TAB.TAB_REMOVE_RELATE_PERSON.ALERT_MESSAGE_DETAIL'
      );
      return;
    }
    const result = await this.lawsuitService.confirmRemoveRelatedPersonDialog(
      this.translate.instant('LAWSUIT.NOTI_DEL_TITLE_RELATED_PERSON'),
      `${item.name} ${this.translate.instant('LAWSUIT.NOTI_DEL_DETAIL_RELATED_PERSON')}<br/>${this.translate.instant(
        'LAWSUIT.NOTI_DEL_SUB_DETAIL_RELATED_PERSON'
      )}`,
      this.translate.instant('LAWSUIT.NOTI_BTN_DEL_RELATED_PERSON')
    );
    if (result) {
      const additionalPersons: Array<PersonDto> = this.detail.personInfo?.additionalPersons!;
      const findIndex = additionalPersons.findIndex(data => data.personId === item.personId);
      if (findIndex !== -1) {
        additionalPersons[findIndex].updateFlag = PersonDto.UpdateFlagEnum.D;
        this.updateAdditionalPersons(item);
      }
      this.detail?.personInfo?.additionalPersons?.forEach((data: PersonDto, index: number, array: PersonDto[]) => {
        if (!data.personId) {
          array[index] = item;
        }
      });
      this.disabledActionAditionalAndSortPerson(PersonDto.UpdateFlagEnum.D);
    }
  }

  async onAdd() {
    const myContext = {
      personInfoArray: this.personInfoArray,
      actionInput: PersonDto.UpdateFlagEnum.A,
    };
    const result = await this.notificationService.showCustomDialog({
      component: EditRelatedPersonComponent,
      context: myContext,
      title: 'LAWSUIT.NOTI_ADD_TITLE_RELATED_PERSON',
      iconName: 'icon-Plus',
      rightButtonLabel: 'COMMON.BUTTON_SAVE',
      buttonIconName: 'icon-save-primary',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      type: 'normal',
      autoWidth: false,
    });
    if (result) {
      const personDto: PersonDto = result.personDto;
      this.updateAdditionalPersons(personDto);
      if (this.isTaskInvestigateHeir) {
        this.notificationService.openSnackbarSuccess(`${this.translate.instant('CUSTOMER.HEIR_ADDED')}`);
      } else {
        this.notificationService.openSnackbarSuccess(`${this.translate.instant('CUSTOMER.ADDITIONAL_PERSON_UPDATED')}`);
      }

      personDto.address = [];
      personDto.bankruptcy = [];
      personDto.updateFlag = personDto.updateFlag;
      personDto.referencePersonId = personDto.referencePersonId;
      this.detail?.personInfo?.additionalPersons?.push(personDto);
      this.disabledActionAditionalAndSortPerson(PersonDto.UpdateFlagEnum.A);
    }
  }

  initTaskInvestigateHeir() {
    if (this.isTaskInvestigateHeir) {
      const taskDetailAttributes = JSON.parse(this.taskService.taskDetail.attributes || '{}');
      this.deceasePersonId = taskDetailAttributes?.deceasePersonId;
    }
  }

  disabledActionAditionalAndSortPerson(updateFlag: PersonDto.UpdateFlagEnum) {
    if (this.isTaskInvestigateHeir) {
      let litigationDetailObj = this.detail;
      if (updateFlag === PersonDto.UpdateFlagEnum.A || updateFlag === PersonDto.UpdateFlagEnum.U) {
        this.isOnAdd = true;

        //update currentLitigation for validate task INVESTIGATE_HEIR_OR_TRUSTEE
        litigationDetailObj?.personInfo?.persons?.forEach((data: PersonDto, index: number, obj: PersonDto[]) => {
          if (data.personId === this.deceasePersonId) {
            obj[index].haveHeir = true;
          }
        });
        this.debtRelatedInfoTabService.currentLitigation = litigationDetailObj;
      } else if (updateFlag === PersonDto.UpdateFlagEnum.D) {
        //case task INVESTIGATE_HEIR_OR_TRUSTEE >> condition : delete display only, save data on-click task-action-bar
        this.isOnAdd = false;
        //remove original-data object for render-ui
        litigationDetailObj?.personInfo?.additionalPersons?.forEach(
          (data: PersonDto, index: number, obj: PersonDto[]) => {
            if (data.referencePersonId === this.deceasePersonId) {
              obj.splice(index, 1);
            }
          }
        );

        //remove object for render-ui
        this.personInfoArray.forEach((data: PersonDto, index: number, obj: PersonDto[]) => {
          if (data.referencePersonId === this.deceasePersonId) {
            obj.splice(index, 1);
          }
        });

        //update currentLitigation for validate task INVESTIGATE_HEIR_OR_TRUSTEE
        litigationDetailObj?.personInfo?.persons?.forEach((data: PersonDto, index: number, obj: PersonDto[]) => {
          if (data.personId === this.deceasePersonId) {
            obj[index].haveHeir = false;
          }
        });
        this.debtRelatedInfoTabService.currentLitigation = litigationDetailObj;
      } else {
        this.isEdited = false;
      }
    } else {
      this.isEdited = true;
    }
    this.sortPersonInfo();
  }

  async updateAdditionalPersons(dataForm: PersonDto) {
    let personInfoRequest!: PersonInfoRequest;
    let personRequest: PersonRequest = {};
    let additionalPersons: Array<PersonRequest> = [];
    personRequest.personId = dataForm.personId;
    personRequest.relation = dataForm.relation;
    personRequest.title = dataForm.title;
    personRequest.firstName = dataForm.firstName;
    personRequest.lastName = dataForm.lastName;
    personRequest.name = dataForm.name;
    personRequest.identificationNo = dataForm.identificationNo;
    personRequest.birthDate = dataForm.birthDate;
    personRequest.personType = dataForm.personType;
    personRequest.referencePersonId = dataForm.referencePersonId;
    personRequest.updateFlag = dataForm.updateFlag;

    additionalPersons.push(personRequest);
    personInfoRequest = { additionalPersons };

    if (this.isTaskInvestigateHeir) {
      personInfoRequest.taskId = this.taskService.taskDetail.id;
    }

    const litigationId: string = this.lawsuitService.currentLitigation?.litigationId
      ? this.lawsuitService.currentLitigation?.litigationId
      : '';
    if (litigationId && !this.isTaskInvestigateHeir) {
      try {
        await this.lawsuitService.updateAdditionalPersons(litigationId, personInfoRequest);
      } catch (error) {
        this.logger.catchError('updateAdditionalPersons :: ', error);
      }
    }
  }

  async onUpdateStatusFromDOPA(item: Person, index: number) {
    const res = await this.customerService.updateDeathStatus(this.customerId || '', item);
    if (res) {
      this.personInfoArray[index] = { ...this.personInfoArray[index], ...res };
      this.notificationService.openSnackbarSuccess(this.translate.instant('DOPA.UPDATE_STATUS_MESSAGE_COMPLETED'));
    }
  }

  showUpdateStatusFromDOPA(item: Person) {
    const hasPermission = this.permissions.includes(LexsUserPermissionCodes.UPDATE_DOPA);
    const hasSubRole = ['MAKER', 'APPROVER', 'ADMIN'].includes(this.accessPermissions.subRoleCode);
    const isIndividual = item.personType === Person.PersonTypeEnum.Individual;
    return hasPermission && hasSubRole && isIndividual && !this.isTaskInvestigateHeir;
  }

  async sortPersonInfo() {
    const personArray: Array<IPersonDto> = this.detail?.personInfo?.persons ? this.detail?.personInfo?.persons : [];
    const additionalPersonArray: Array<IPersonDto> = this.detail?.personInfo?.additionalPersons
      ? this.detail?.personInfo?.additionalPersons
      : [];
    if (
      (personArray.length !== 0 && personArray.every(item => Object.keys(item).length !== 0)) ||
      (additionalPersonArray.length !== 0 && additionalPersonArray.every(item => Object.keys(item).length !== 0))
    ) {
      personArray.map(data => (data.isAdditionalPersons = false));
      additionalPersonArray.map(data => (data.isAdditionalPersons = true));
      this.personInfoArray = [...personArray, ...additionalPersonArray];
      this.isEmptyPerson =
        this.personInfoArray.length === 0 || this.personInfoArray.every(item => Object.keys(item).length === 0);
      this.personInfoArray.map(data => {
        if (data.relation === 'MAIN_BORROWER') {
          data.relationSeq = 1;
        } else if (data.relation === 'CO_BORROWER') {
          data.relationSeq = 2;
        } else if (data.relation === 'GUARANTOR') {
          data.relationSeq = 3;
        } else if (data.relation === 'COLLATERAL_OWNER') {
          data.relationSeq = 4;
        } else if (data.relation === 'MAIN_BORROWER_TRUSTEE') {
          data.relationSeq = 5;
        } else if (data.relation === 'CO_BORROWER_TRUSTEE') {
          data.relationSeq = 6;
        } else if (data.relation === 'GUARANTOR_TRUSTEE') {
          data.relationSeq = 7;
        } else if (data.relation === 'MAIN_BORROWER_HEIR') {
          data.relationSeq = 8;
        } else if (data.relation === 'CO_BORROWER_HEIR') {
          data.relationSeq = 9;
        } else if (data.relation === 'GUARANTOR_HEIR') {
          data.relationSeq = 10;
        } else if (data.relation === 'STAND_IN_PAYER') {
          data.relationSeq = 11;
        } else if (data.relation === 'DEBT_ACCEPTOR') {
          data.relationSeq = 12;
        } else if (data.relation === 'DEBT_ACCEPT_SIGNER') {
          data.relationSeq = 13;
        } else if (data.relation === 'CO_DEFENDANT') {
          data.relationSeq = 14;
        } else {
          data.relationSeq = 15;
        }
      });

      this.personInfoArray.sort((d1, d2) => {
        const v1 = d1.relationSeq ? d1.relationSeq : 0;
        const v2 = d2.relationSeq ? d2.relationSeq : 0;
        return v1 - v2;
      });

      const litigationId = this.debtRelatedInfoTabService.litigationId || '';
      for (let i in this.personInfoArray) {
        const addressArr = this.personInfoArray[i].address || [];
        const addressTypeRegistrationArr = addressArr.filter(obj => obj.addressType === 'REGISTRATION');
        const foundDopaOrDBD = addressTypeRegistrationArr.filter(
          obj => obj.sourceSystem === 'DOPA' || obj.sourceSystem === 'DBD'
        );
        const hasSubRole = ['MAKER', 'APPROVER', 'ADMIN'].includes(this.accessPermissions.subRoleCode);

        const addressManualObj = addressTypeRegistrationArr.filter(
          obj => obj.sourceSystem === this.sourceSystemEditAddress
        );
        this.personInfoArray[i].manualAddressLineEmpty =
          addressTypeRegistrationArr.length == 0 ||
          addressManualObj.filter(
            obj => obj.addressLine == null || obj.addressLine == undefined || obj.addressLine == ''
          ).length > 0;
        this.personInfoArray[i].canUpdateAddress =
          addressTypeRegistrationArr.length == 0 ||
          (addressTypeRegistrationArr.length > 0 && foundDopaOrDBD.length === 0 && hasSubRole && addressArr.length > 0);
        this.personInfoArray[i].foundDopaOrDBD = foundDopaOrDBD.length > 0;
        this.personInfoArray[i].foundHeirObj = false;
        if (
          (this.personInfoArray[i].personStatus === PersonDto.PersonStatusEnum.Death ||
            this.personInfoArray[i].personStatus === PersonDto.PersonStatusEnum.Close) &&
          litigationId
        ) {
          const personHeirInfoObj: PersonHeirInfoDto = await this.debtRelatedInfoTabService.getHeirInformation(
            litigationId,
            String(this.personInfoArray[i].personId)
          );
          this.personInfoArray[i].foundHeirObj = personHeirInfoObj?.document?.imageId ? true : false;
        }
      }
    } else {
      this.isEmptyPerson = true;
    }
  }

  getDeathStatus(item: IPersonDto): string {
    let bannerStr = '';
    if (!item.foundHeirObj) {
      switch (item.personStatus) {
        case PersonDto.PersonStatusEnum.Death:
          bannerStr = this.translate.instant('CUSTOMER.BANNER_PERSON_STATUS_DEATH', {
            LAST_UPDATE: this.buddhistEra.transform(item.lastUpdate, 'DD/MM/YYYY') || '',
          });
          break;
        case PersonDto.PersonStatusEnum.Close:
          bannerStr = this.translate.instant('CUSTOMER.BANNER_PERSON_STATUS_CLOSE', {
            LAST_UPDATE: this.buddhistEra.transform(item.lastUpdate, 'DD/MM/YYYY') || '',
          });
          break;
      }
    } else {
      switch (item.personStatus) {
        case PersonDto.PersonStatusEnum.Death:
          bannerStr = this.translate.instant('CUSTOMER.BANNER_NOHEIR_PERSON_STATUS_DEATH', {
            LAST_UPDATE: this.buddhistEra.transform(item.lastUpdate, 'DD/MM/YYYY') || '',
          });
          break;
        case PersonDto.PersonStatusEnum.Close:
          bannerStr = this.translate.instant('CUSTOMER.BANNER_NOHEIR_PERSON_STATUS_CLOSE', {
            LAST_UPDATE: this.buddhistEra.transform(item.lastUpdate, 'DD/MM/YYYY') || '',
          });
          break;
      }
    }

    return bannerStr;
  }

  setFilterOptions() {
    let civilCourtBlackCaseNo: Array<string> = [];
    this.detail?.cases?.forEach((data: LitigationCaseDto) => {
      if (data.civilCourtBlackCaseNo) {
        civilCourtBlackCaseNo.push(data.civilCourtBlackCaseNo);
      }
    });
    //filter out duplicates from
    this.uniqueCivilCourtBlackCaseNo = [...new Set(civilCourtBlackCaseNo)];

    //set filterOptions dropdown
    let obj: SimpleSelectOption = { text: 'ทุกคดี', value: 'ALL' };
    this.filterOptions.push(obj);
    this.uniqueCivilCourtBlackCaseNo.forEach(data => {
      obj = { text: data ? data : '', value: data ? data : '' };
      this.filterOptions.push(obj);
    });
    this.filterCtrl.setValue(this.filterOptions[0]?.value);
  }

  ddlOnChanges(value: string) {
    if (this.detail.cases && this.filterCtrl?.value != 'ALL') {
      const litigationCaseDtoArray: Array<LitigationCaseDto> = this.detail?.cases;
      const litigationCaseDtoArraySelect = litigationCaseDtoArray.find(
        data => data.civilCourtBlackCaseNo === this.filterCtrl.value
      );
      const personIdArr = litigationCaseDtoArraySelect?.persons?.map(data => {
        return data.personId;
      });
      this.detail?.personInfo?.persons?.forEach((data: PersonDto, index: number, array: any) => {
        const searchPerson = personIdArr?.find(personId => personId === data.personId);
        if (!searchPerson) {
          delete array[index];
        }
      });
    } else {
      this.detail = { ...this.originalDetail };
    }
  }

  getCaseSelectIndex() {
    let index = this.filterOptions.findIndex(data => data.value === this.filterCtrl.value);
    return index;
  }

  get checkAddRelatePerson() {
    const litigationCaseDtoArray: Array<LitigationCaseDto> = this.detail?.cases || [];
    const hasBlackCaseNo = litigationCaseDtoArray.some(e => e.blackCaseNo);
    const hasPermission = this.permissions.includes(
      LexsUserPermissionCodes.LAWSUIT_ADD_RELATED_PERSON_AFTER_UNDICIDED_CASE
    );
    const hasSubRole = ['MAKER', 'APPROVER', 'ADMIN'].includes(this.accessPermissions.subRoleCode);
    const isNoneStatus =
      this.detail?.editStatus === LitigationDetailDto.EditStatusEnum.None || this.detail?.editStatus == null;
    return hasBlackCaseNo && hasPermission && hasSubRole && isNoneStatus;
  }

  // เพิ่มผู้ที่เกี่ยวข้อง ระดับเลขที่กฎหมาย
  addRelatePersonLegal() {
    this.routerService.navigateTo('/main/lawsuit/detail/add-related-person-legal');
  }
  // เพิ่มผู้ที่เกี่ยวข้อง ระดับคดีความ
  async addRelatePersonLawsuit() {
    const data = {
      // data context
      context: {
        litigationId: this.litigationDetail?.litigationId,
      },
    };
    const dialogRef = this.dialog.open(AddRelatedPersonLawsuitComponent, {
      data: data,
      // id: "custom-dialog-xsmall",
      disableClose: true,
      autoFocus: false,
    });
    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      await this.updateLitigation();
      this.isAddBlackCase = true;
      this.lawsuitService.hasAdditionalPerson = true;
      this.isEdited = true;
      this.notificationService.openSnackbarSuccess(
        this.translate.instant('DEBT_RELATED_INFO_TAB.ADD_RELATE_PERSON_LAWSUIT.SNACKBAR_ADD_LAWSUIT_SAVED')
      );
    }
  }
  // ลดผู้ที่เกี่ยวข้อง ระดับเลขที่กฎหมาย
  async removeRelatePersonLegal() {
    const result = await this.notificationService.showCustomDialog({
      component: RemoveRelatedPersonLawsuitComponent,
      type: 'small',
      iconName: 'icon-Bin',
      title: 'DEBT_RELATED_INFO_TAB.TAB_REMOVE_RELATE_PERSON.TITLE',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'DEBT_RELATED_INFO_TAB.TAB_REMOVE_RELATE_PERSON.BTN_CONFIRM',
      buttonIconName: 'icon-Bin',
      rightButtonClass: 'long-button mat-warn',
    });
    if (result) {
      await this.updateLitigation();
      this.isAddBlackCase = true;
      this.lawsuitService.hasAdditionalPerson = true;
      this.isEdited = true;
      this.notificationService.openSnackbarSuccess(
        this.translate.instant('DEBT_RELATED_INFO_TAB.REMOVE_RELATE_PERSON_LEGAL.SNACKBAR_REMOVE_LEGAL_SAVED')
      );
      result?.forEach((e: IPersonDto) => {
        let personInfoIndex = this.personInfoArray.findIndex(f => f.personId === e.personId);
        if (personInfoIndex > -1) {
          this.personInfoArray[personInfoIndex].updateFlag = PersonDto.UpdateFlagEnum.D;
        }
      });
      this.debtRelatedInfoTabService.updatePersonsBlackCase = [];
    }
  }

  async updateLitigation() {
    const litigation = await this.lawsuitService.getLitigation(this.litigationDetail?.litigationId || '');
    this.litigationDetail = litigation;
    this.detail = this.litigationDetail;
  }

  /* LEX2-1121 */
  public findIndexRegistrationAddr(addrs: PersonAddressDto[]) {
    return addrs.findIndex(
      dto => dto.addressType === 'REGISTRATION' && dto.sourceSystem == this.sourceSystemEditAddress
    );
  }

  async onOpenRegisterAddressDialog(personDto: IPersonDto, index: number) {
    /* Load address master data */
    await Promise.all([
      this.masterDataService.province(),
      this.masterDataService.district(),
      this.masterDataService.subdistrict(),
    ]);

    const regIndex = this.findIndexRegistrationAddr(personDto.address ?? []);
    let dto: PersonAddressDto = {};
    if (regIndex >= 0 && !!personDto?.address) {
      dto = personDto?.address[regIndex] ?? {};
    }

    const myContext = {
      dto,
    };
    const result = await this.notificationService.showCustomDialog({
      component: RegisterAddressDialogComponent,
      type: 'small',
      iconName: 'icon-Edit',
      title: this.translate.instant('CUSTOMER.SUB_TITLE_EDIT_REGIST_ADDR') + personDto?.name,
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: 'COMMON.BUTTON_SAVE',
      buttonIconName: 'icon-save-primary',
      context: myContext,
    });
    if (!!result) {
      try {
        let personAddressRequest: PersonAddressRequest = result;

        const personIdMain = this.customerId;
        const personId = personDto.personId || '';
        personAddressRequest.personId = personId;
        if (this.isLawsuit) {
          const litigationId: string = this.lawsuitService.currentLitigation?.litigationId
            ? this.lawsuitService.currentLitigation?.litigationId
            : '';
          personAddressRequest.litigationId = litigationId;
        }
        this.customerService.updateAddress(personIdMain, personAddressRequest);

        const addressRegistrationObj =
          this.personInfoArray[index].address?.filter(obj => obj.addressType === 'REGISTRATION') || [];

        if (addressRegistrationObj?.length > 0) {
          addressRegistrationObj.map(addObj => {
            addObj.addressLine = personAddressRequest.addressLine || '';
            addObj.provinceName = personAddressRequest.provinceName || '';
            addObj.districtName = personAddressRequest.districtName || '';
            addObj.subdistrictName = personAddressRequest.subdistrictName || '';
          });
        } else {
          let personAddressDto: PersonAddressDto = {};
          personAddressDto.addressLine = personAddressRequest.addressLine || '';
          personAddressDto.provinceName = personAddressRequest.provinceName || '';
          personAddressDto.districtName = personAddressRequest.districtName || '';
          personAddressDto.subdistrictName = personAddressRequest.subdistrictName || '';
          personAddressDto.sourceSystem = this.sourceSystemEditAddress;
          personAddressDto.addressType = 'REGISTRATION';
          personAddressDto.lastUpdate = new Date().toString();

          this.personInfoArray[index].address?.push(personAddressDto);
        }
        this.personInfoArray[index].manualAddressLineEmpty = false;

        // ที่อยู่ตามทะเบียนราษฎร์ถูกบันทึกแล้ว
        this.notificationService.openSnackbarSuccess(`${this.translate.instant('CUSTOMER.UPDATED_REGIST_ADDR')}`);
      } catch (e) {
        this.logger.catchError('onOpenRegisterAddressDialog :: ', e);
      }
    }
  }
  /* End LEX2-1121 */

  async openDialogResonReject(personId: string) {
    const litigationId = this.debtRelatedInfoTabService.litigationId || '';
    this.debtRelatedInfoTabService.openDialogResonReject(litigationId, personId, this.taskCode);
  }

  get isTaskInvestigateHeir(): boolean {
    const taskDetailTaskCodes = this.taskCode;
    return taskDetailTaskCodes === taskCode.INVESTIGATE_HEIR_OR_TRUSTEE;
  }

  get canAddRelatePersonCaseInvestigateHeir(): boolean {
    const statusCode = this.statusCode === 'PENDING';
    const checkStatusAddHeir = this.lawsuitService?.currentLitigation?.checkStatusAddHeir;
    return this.isFromTask && this.isTaskInvestigateHeir && statusCode && !checkStatusAddHeir;
  }

  showBannerDeathStatus(personObj: IPersonDto) {
    const taskDetailTaskCodes = this.taskCode;
    const taskShowBannerDeathStatus =
      taskDetailTaskCodes === taskCode.PROCESS_NOT_PROSECUTE_1 ||
      taskDetailTaskCodes === taskCode.PROCESS_NOT_PROSECUTE_2;

    return (taskShowBannerDeathStatus && personObj.foundHeirObj) || (!this.isFromTask && personObj.foundHeirObj);
  }

  getClassRelatedInfoCard(item: IPersonDto) {
    let classStr = '';
    if (
      (this.isTaskInvestigateHeir && (item?.updateFlag == 'U' || item?.updateFlag == 'D' || item?.updateFlag == 'A')) ||
      (this.isTaskInvestigateHeir && item.referencePersonId === this.deceasePersonId)
    ) {
      classStr = 'pending-add';
    } else {
      switch (item?.updateFlag) {
        case 'A':
          classStr = 'pending-add';
          break;
        case 'U':
          classStr = 'pending-update';
          break;
        case 'D':
          classStr = 'pending-delete';
          break;
      }
    }

    return classStr;
  }
}
