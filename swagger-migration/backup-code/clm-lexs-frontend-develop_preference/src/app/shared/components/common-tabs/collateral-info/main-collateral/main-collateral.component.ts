import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Mode } from '@app/shared/models';
import { SessionService } from '@app/shared/services/session.service';
import {
  CollateralDto,
  CollateralInfoRequest,
  CollateralRequest,
  LitigationDetailDto,
  MeLexsUserDto,
  NameValuePair,
  PersonDto,
} from '@lexs/lexs-client';
import { LawsuitService } from '@modules/lawsuit/lawsuit.service';
import { MODE } from '@modules/user/user-form.constant';
import { TranslateService } from '@ngx-translate/core';
import { MasterDataService } from '@shared/services/master-data.service';
import { NotificationService } from '@shared/services/notification.service';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';
import { CollateralInfoService } from '../collateral-info.service';
import { CollateralOptions, CollateralRequestDes, TYPE_CODE } from '../collateral.constant';
interface PermissionsOnCollateralInfoScreen {
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
}
@Component({
  selector: 'app-main-collateral',
  templateUrl: './main-collateral.component.html',
  styleUrls: ['./main-collateral.component.scss'],
})
export class MainCollateralComponent implements OnInit {
  public ownershipOptions: Array<PersonDto> = [];
  public expropriatePersonOptions: Array<PersonDto> = [];
  public collateralOptions: SimpleSelectOption[] = CollateralOptions;

  collateralStatus: Array<NameValuePair> = [
    {
      name: 'ถูกยึด',
      value: 'A',
    },
    {
      name: 'ถูกอายัด',
      value: 'B',
    },

    {
      name: 'เวนคืน',
      value: 'C',
    },
    {
      name: 'ห้ามโอนกรรมสิทธิ์',
      value: 'D',
    },
  ];
  public legalStatusOptions: Array<NameValuePair> = [];

  public generalForm!: UntypedFormGroup;
  public subForm!: UntypedFormGroup;

  public ownershipConfig!: DropDownConfig;
  public expropriatePersonConfig!: DropDownConfig;
  public collateralConfig!: DropDownConfig;
  public collateralStatusConfig!: DropDownConfig;
  public legalStatusConfig!: DropDownConfig;

  mode: any;
  MODE = Mode;
  TYPE_CODE = TYPE_CODE;
  currentUser: MeLexsUserDto = {};
  public permissionsOnScreen: PermissionsOnCollateralInfoScreen = {
    canAdd: false,
    canEdit: false,
    canDelete: false,
  };

  constructor(
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder,
    private masterDataService: MasterDataService,
    private lawsuitService: LawsuitService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    public collateralInfoTabService: CollateralInfoService,
    private sessionService: SessionService
  ) {}

  get collateral() {
    return this.generalForm.get('collateralTypeCode')?.value || '';
  }

  async ngOnInit(): Promise<void> {
    this.initDropdown();
    this.initValueDropdown();
    // init form binding
    this.initGeneralForm();
    if (this.data.mode === MODE.EDIT || this.data.mode === MODE.VIEW) {
      this.patchValueToSubform();
    } else {
      this.initFormByType(this.data.type);
    }
    this.verifyUserPermission();
  }

  getControl(name: string) {
    return this.generalForm.get(name);
  }

  chageMode() {
    this.data.mode = MODE.EDIT;
  }
  initGeneralForm() {
    this.generalForm = this.fb.group({
      personId: ['', Validators.required],
      personName: '',
      collateralTypeCode: [this.data.type, Validators.required],
      collateralStatusCode: [''],
      externalAssetStatus: ['', Validators.required],
      description: '',
      collateralTypeDesc: '',
      collateralStatusDesc: '',
      externalAssetStatusDesc: '',
      seizureDate: '',
      freezeDate: '',
      seizureRedCaseNo: '',
      court: '',
      seizurePerson: '',
      expropriatePerson: '',
      expropriate: '',
      areaRai: '',
      areaNgan: '',
      areaSqrWa: '',
      expropriateAmount: '',
      notTransferOwnershipWithin: '',
      notTransferOwnershipFromDate: '',
      notTransferOwnershipToDate: '',
    });
  }

  initValueDropdown() {
    let personInfo = this.lawsuitService?.currentLitigation?.personInfo;
    let additionalPersons = personInfo?.additionalPersons;
    let persons = personInfo?.persons as Array<PersonDto>;
    this.ownershipOptions = additionalPersons?.concat(persons) as Array<NameValuePair>;
    const externalAssetStatus = this.collateralInfoTabService.externalAssetStatus;
    this.legalStatusOptions = externalAssetStatus.externalAssetStatus as Array<NameValuePair>;
  }

  collateralSelected(value: any) {
    let find: any = CollateralOptions.find(f => f.value === value);
    this.generalForm.get('collateralTypeDesc')?.setValue(find.text);
    this.initFormByType(this.collateral);
  }

  ownSelected(value: any) {
    let find: any = this.ownershipOptions.find((f: any) => f.personId === value);
    this.generalForm.get('personName')?.setValue(find.name);
  }

  collateralStatusSelected(value: any) {
    let find: any = this.collateralStatus.find((f: any) => f.value === value);
    this.generalForm.get('collateralStatusDesc')?.setValue(find.name);
  }

  legalStatusSelected(value: any) {
    let find: any = this.legalStatusOptions.find((f: any) => f.value === value);
    this.generalForm.get('externalAssetStatusDesc')?.setValue(find.name);
  }

  patchValueToSubform() {
    let value = this.data.element as CollateralDto;
    // patch value to generalForm
    this.generalForm.patchValue({
      personId: value.personId || value.ownerId,
      personName: value.ownerName,
      collateralTypeCode: value.collateralTypeCode,
      collateralStatusCode: value.collateralStatusCode,
      collateralTypeDesc: value.collateralTypeDesc,
      externalAssetStatus: value.externalAssetStatus,
      externalAssetStatusDesc: value.externalAssetStatusDesc,
      description: value.description,
      seizureDate: value.seizureDate,
      freezeDate: value.freezeDate,
      seizureRedCaseNo: value.seizureRedCaseNo,
      court: value.court,
      seizurePerson: value.seizurePerson,
      expropriatePerson: value.expropriatePerson,
      expropriate: value.expropriate,
      areaRai: value.areaRai,
      areaNgan: value.areaNgan,
      areaSqrWa: value.areaSqrWa,
      expropriateAmount: value.expropriateAmount,
      notTransferOwnershipWithin: value.notTransferOwnershipWithin,
      notTransferOwnershipFromDate: value.notTransferOwnershipFromDate,
      notTransferOwnershipToDate: value.notTransferOwnershipToDate,
    });
    // patch value to subForm
    switch (this.data.type) {
      case TYPE_CODE.LAND:
      case TYPE_CODE.LAND_BUILDING:
        this.subForm = this.fb.group({
          collateralId: [value.collateralId || this.data.element?.collateralId],
          collateralSubTypeCode: [value.collateralSubTypeCode, Validators.required],
          collateralSubTypeDesc: value.collateralSubTypeDesc,
          documentNo: [value.documentNo, Validators.required],
          landNo: value.landNo,
          surveySection: value.surveySection,
          areaRai: [value.areaRai, Validators.required],
          areaNgan: [value.areaNgan, Validators.required],
          areaSqrWa: [value.areaSqrWa, Validators.required],
          districtCode: value.districtCode,
          subdistrictCode: value.subdistrictCode,
          provinceCode: value.provinceCode,
          subDistrict: value.subDistrict,
          district: value.district,
          province: value.province,
          remark: value.remark,
          collateralTypeCode: value.collateralTypeCode,
          appraisalPrice: value.appraisalPrice,
          totalAppraisalValue: value.totalAppraisalValue,
        });
        break;
      case TYPE_CODE.BUILDING:
        this.subForm = this.fb.group({
          collateralId: [value.collateralId || this.data.element?.collateralId],
          buildingName: [value.buildingName, Validators.required],
          buildingNo: [value.buildingNo, Validators.required],
          address1: [value.address1, Validators.required],
          address2: value.address2,
          address3: value.address3,
          districtCode: value.districtCode,
          subdistrictCode: value.subdistrictCode,
          subDistrict: value.subDistrict,
          district: value.district,
          province: value.province,
          provinceCode: value.provinceCode,
          totalAppraisalValue: value.totalAppraisalValue,
          appraisalDate: value.appraisalDate,
        });
        break;
      case TYPE_CODE.MACHINE:
        this.subForm = this.fb.group({
          collateralId: value.collateralId || this.data.element?.collateralId,
          machineNo: [value.machineNo, Validators.required],
          buildingName: [value.buildingName, Validators.required],
          address1: [value.address1, Validators.required],
          remark: value.remark,
          appraisalDate: value.appraisalDate,
          totalAppraisalValue: value.totalAppraisalValue,
        });
        break;
      case TYPE_CODE.ACCOUNT:
        this.subForm = this.fb.group({
          collateralId: value.collateralId || this.data.element?.collateralId,
          accountNo: [value.accountNo, Validators.required],
          currency: value.currency,
          collateralSubTypeCode: value.collateralSubTypeCode,
          collateralSubTypeDesc: value.collateralSubTypeDesc,
          bankName: value.bankName,
          accountName: [value.accountName, Validators.required],
          totalAppraisalValue: [value.totalAppraisalValue, Validators.required],
          dueDate: [value.dueDate, Validators.required],
        });
        break;
      case TYPE_CODE.BOND:
        this.subForm = this.fb.group({
          collateralId: value.collateralId || this.data.element?.collateralId,
          issuer: [value.issuer, Validators.required],
          bondNo: [value.bondNo, Validators.required],
          collateralSubTypeCode: [value.collateralSubTypeCode, Validators.required],
          collateralSubTypeDesc: value.collateralSubTypeDesc,
          unitAmount: value.unitAmount,
          issueDate: [value.issueDate, Validators.required],
          priceValue: value.priceValue,
          dueDate: value.dueDate,
        });
        break;
      case TYPE_CODE.STOCK_CER:
        this.subForm = this.fb.group({
          collateralId: value.collateralId || this.data.element?.collateralId,
          issuer: [value.issuer, Validators.required],
          parValue: value.parValue,
          bookingValue: value.bookingValue,
          unitAmount: [value.unitAmount, Validators.required],
          priceValue: [value.priceValue, Validators.required],
          dueDate: value.dueDate,
        });
        break;
      case TYPE_CODE.CONDO:
        this.subForm = this.fb.group({
          collateralId: value.collateralId || this.data.element?.collateralId,
          buildingName: [value.buildingName, Validators.required],
          projectName: value.projectName,
          buildingNo: [value.buildingNo, Validators.required],
          roomNo: [value.roomNo, Validators.required],
          floor: value.floor,
          areaSqm: value.areaSqm,
          address1: [value.address1, Validators.required],
          address2: value.address2,
          address3: value.address3,
          provinceCode: value.provinceCode,
          districtCode: value.districtCode,
          subdistrictCode: value.subdistrictCode,
          subDistrict: value.subDistrict,
          district: value.district,
          province: value.province,
          appraisalPrice: value.appraisalPrice,
          totalAppraisalValue: value.totalAppraisalValue,
        });
        break;
      case TYPE_CODE.SALARY:
        this.subForm = this.fb.group({
          collateralId: value.collateralId || this.data.element?.collateralId,
          jobPosition: value.jobPosition,
          serviceYear: value.serviceYear,
          serviceMonth: value.serviceMonth,
          salary: [value.salary, Validators.required],
          otherIncome: value.otherIncome,
          employerType: value.employerType,
          employerName: [value.employerName, Validators.required],
          address1: value.address1,
          address2: value.address2,
          address3: value.address3,
          provinceCode: value.provinceCode,
          districtCode: value.districtCode,
          subdistrictCode: value.subdistrictCode,
          subDistrict: value.subDistrict,
          district: value.district,
          province: value.province,
        });
        break;
      case TYPE_CODE.VEHICLE:
        this.subForm = this.fb.group({
          collateralId: value.collateralId || this.data.element?.collateralId,
          typeDescription: [value.typeDescription, Validators.required],
          address1: value.address1,
          address2: value.address2,
          address3: value.address3,
          provinceCode: value.provinceCode,
          districtCode: value.districtCode,
          subdistrictCode: value.subdistrictCode,
          subDistrict: value.subDistrict,
          district: value.district,
          province: value.province,
          vehicleNo: [value.vehicleNo, Validators.required],
          vehicleCount: value.vehicleCount,
        });
        break;
      case TYPE_CODE.LEASEHOLD:
        this.subForm = this.fb.group({
          collateralId: value?.collateralId || this.data.element?.collateralId,
          lendDate: [value?.lendDate, Validators.required],
          dueDate: [value?.dueDate, Validators.required],
          borrower: value?.borrower,
          buildingName: value?.buildingName,
          buildingNo: value?.buildingNo,
          roomNo: value?.roomNo,
          floor: value?.floor,
          areaSqm: value?.areaSqm,
          address1: value?.address1,
          address2: value?.address2,
          subdistrictCode: value?.subdistrictCode,
          subDistrict: value.subDistrict,
          district: value.district,
          province: value.province,
          districtCode: value?.districtCode,
          provinceCode: value?.provinceCode,
          remark: value?.remark,
          appraisalValue: value?.appraisalValue,
          appraisalDate: value?.appraisalDate,
          rentalFee: value?.rentalFee,
          totalAppraisalValue: value?.totalAppraisalValue,
        });
        break;
      case TYPE_CODE.COOPERATIVE_STOCK:
        this.subForm = this.fb.group({
          collateralId: value.collateralId || this.data.element?.collateralId,
          workOrganization: value.workOrganization,
          payerOrganization: value.payerOrganization,
          address1: value.address1,
          address2: value.address2,
          address3: value.address3,
          provinceCode: value.provinceCode,
          districtCode: value.districtCode,
          subdistrictCode: value.subdistrictCode,
          subDistrict: value.subDistrict,
          district: value.district,
          province: value.province,
          unitAmount: value.unitAmount,
          priceValue: value.priceValue,
          estimateFreezeAmount: value.estimateFreezeAmount,
        });
        break;
      case TYPE_CODE.OTHER:
        this.subForm = this.fb.group({
          collateralId: value.collateralId || this.data.element?.collateralId,
          totalAppraisalValue: value.totalAppraisalValue,
          appraisalDate: value.appraisalDate,
          obligationType: [value.obligationType, Validators.required],
          obligationStatus: value.obligationStatus,
          mortgageAmount: value.mortgageAmount,
          pawnAmount: value.pawnAmount,
          consignmentAmount: value.consignmentAmount,
          redeemPeriod: value.redeemPeriod,
          issueDate: value.issueDate,
          dueDate: value.dueDate,
          leasePeriod: value.leasePeriod,
          remainingPeriod: value.remainingPeriod,
          mortgageeName: value.mortgageeName,
          pawnName: value.pawnName,
          consignmentSellerName: value.consignmentSellerName,
          buyerName: value.buyerName,
          remark: value.remark,
          seizureDate: value.seizureDate,
          freezeDate: value.freezeDate,
          seizureRedCaseNo: value.seizureRedCaseNo,
          court: value.court,
          seizurePerson: value.seizurePerson,
          expropriatePerson: value.expropriatePerson,
          foundPropertyProcessType: value.foundPropertyProcessType,
          foundPropertyRemark: value.foundPropertyRemark,
        });
        break;
    }
  }

  initFormByType(type: string) {
    switch (type) {
      case TYPE_CODE.LAND:
      case TYPE_CODE.LAND_BUILDING:
        this.subForm = this.fb.group({
          collateralSubTypeCode: ['', Validators.required],
          collateralSubTypeDesc: '',
          documentNo: ['', Validators.required],
          landNo: '',
          surveySection: '',
          areaRai: ['', Validators.required],
          areaNgan: ['', Validators.required],
          areaSqrWa: ['', Validators.required],
          districtCode: '',
          subdistrictCode: '',
          provinceCode: '',
          subDistrict: '',
          district: '',
          province: '',
          remark: '',
          collateralTypeCode: '',
          appraisalPrice: '',
          totalAppraisalValue: '',
          collateralId: [this.data.element?.collateralId],
        });
        break;
      case TYPE_CODE.BUILDING:
        this.subForm = this.fb.group({
          buildingName: ['', Validators.required],
          buildingNo: ['', Validators.required],
          address1: ['', Validators.required],
          address2: '',
          address3: '',
          districtCode: '',
          subdistrictCode: '',
          provinceCode: '',
          subDistrict: '',
          district: '',
          province: '',
          totalAppraisalValue: '',
          appraisalDate: '',
          collateralId: [this.data.element?.collateralId],
        });
        break;
      case TYPE_CODE.MACHINE:
        this.subForm = this.fb.group({
          machineNo: ['', Validators.required],
          buildingName: ['', Validators.required],
          address1: ['', Validators.required],
          remark: '',
          totalAppraisalValue: '',
          appraisalDate: '',
          collateralId: [this.data.element?.collateralId],
        });
        break;
      case TYPE_CODE.ACCOUNT:
        this.subForm = this.fb.group({
          accountNo: ['', Validators.required],
          currency: '',
          collateralSubTypeCode: '',
          collateralSubTypeDesc: '',
          bankName: [''],
          accountName: ['', Validators.required],
          totalAppraisalValue: ['', Validators.required],
          dueDate: ['', Validators.required],
          collateralId: [this.data.element?.collateralId],
        });
        break;
      case TYPE_CODE.BOND:
        this.subForm = this.fb.group({
          issuer: ['', Validators.required],
          bondNo: ['', Validators.required],
          collateralSubTypeCode: ['', Validators.required],
          collateralSubTypeDesc: '',
          unitAmount: '',
          issueDate: ['', Validators.required],
          priceValue: '',
          dueDate: '',
          collateralId: [this.data.element?.collateralId],
        });
        break;
      case TYPE_CODE.STOCK_CER:
        this.subForm = this.fb.group({
          issuer: ['', Validators.required],
          parValue: '',
          bookingValue: '',
          unitAmount: ['', Validators.required],
          priceValue: ['', Validators.required],
          dueDate: '',
          collateralId: [this.data.element?.collateralId],
        });
        break;
      case TYPE_CODE.CONDO:
        this.subForm = this.fb.group({
          buildingName: ['', Validators.required],
          projectName: '',
          buildingNo: ['', Validators.required],
          roomNo: ['', Validators.required],
          floor: '',
          areaSqm: '',
          address1: ['', Validators.required],
          address2: '',
          address3: '',
          provinceCode: '',
          districtCode: '',
          subdistrictCode: '',
          subDistrict: '',
          district: '',
          province: '',
          appraisalPrice: '',
          totalAppraisalValue: '',
          collateralId: [this.data.element?.collateralId],
        });
        break;
      case TYPE_CODE.SALARY:
        this.subForm = this.fb.group({
          jobPosition: '',
          serviceYear: '',
          serviceMonth: '',
          salary: ['', Validators.required],
          otherIncome: '',
          employerType: '',
          employerName: ['', Validators.required],
          address1: '',
          address2: '',
          address3: '',
          provinceCode: '',
          districtCode: '',
          subdistrictCode: '',
          subDistrict: '',
          district: '',
          province: '',
          collateralId: [this.data.element?.collateralId],
        });

        break;
      case TYPE_CODE.VEHICLE:
        this.subForm = this.fb.group({
          typeDescription: ['', Validators.required],
          typeDescriptionDesc: '',
          address1: '',
          address2: '',
          address3: '',
          provinceCode: '',
          districtCode: '',
          subdistrictCode: '',
          subDistrict: '',
          district: '',
          province: '',
          vehicleNo: ['', Validators.required],
          vehicleCount: '',
          collateralId: [this.data.element?.collateralId],
        });
        break;
      case TYPE_CODE.LEASEHOLD:
        this.subForm = this.fb.group({
          lendDate: ['', Validators.required],
          dueDate: ['', Validators.required],
          borrower: '',
          buildingName: '',
          buildingNo: '',
          roomNo: '',
          floor: '',
          areaSqm: '',
          address1: '',
          address2: '',
          provinceCode: '',
          districtCode: '',
          subdistrictCode: '',
          subDistrict: '',
          district: '',
          province: '',
          remark: '',
          appraisalValue: '',
          appraisalDate: '',
          rentalFee: '',
          totalAppraisalValue: '',
          collateralId: [this.data.element?.collateralId],
        });
        break;
      case TYPE_CODE.COOPERATIVE_STOCK:
        this.subForm = this.fb.group({
          workOrganization: '',
          payerOrganization: '',
          address1: '',
          address2: '',
          address3: '',
          provinceCode: '',
          districtCode: '',
          subdistrictCode: '',
          subDistrict: '',
          district: '',
          province: '',
          unitAmount: '',
          priceValue: '',
          estimateFreezeAmount: '',
          collateralId: [this.data.element?.collateralId],
        });
        break;
      case TYPE_CODE.OTHER:
        this.subForm = this.fb.group({
          totalAppraisalValue: '',
          appraisalDate: '',
          obligationType: ['', Validators.required],
          obligationTypeDesc: '',
          obligationStatus: '',
          obligationStatusDesc: '',
          mortgageAmount: '',
          pawnAmount: '',
          consignmentAmount: '',
          redeemPeriod: '',
          issueDate: '',
          dueDate: '',
          leasePeriod: '',
          remainingPeriod: '',
          mortgageeName: '',
          pawnName: '',
          consignmentSellerName: '',
          buyerName: '',
          remark: '',
          seizureDate: '',
          freezeDate: '',
          redCaseNo: '',
          court: '',
          seizurePerson: '',
          expropriatePerson: '',
          foundPropertyProcessType: '',
          foundPropertyRemark: '',
          collateralId: [this.data.element?.collateralId],
        });
        break;
      default:
        this.subForm = this.fb.group({});
        break;
    }
  }

  initDropdown() {
    this.ownershipConfig = {
      displayWith: 'name',
      valueField: 'personId',
      searchPlaceHolder: '',
      labelPlaceHolder: 'CUSTOMER.COMMON_LABEL_OWNERSHIP',
    };
    this.collateralConfig = {
      searchPlaceHolder: '',
      labelPlaceHolder: 'CUSTOMER.COMMON_LABEL_MARGIN_TYPE',
    };
    this.collateralStatusConfig = {
      displayWith: 'name',
      valueField: 'value',
      searchPlaceHolder: '',
      labelPlaceHolder: 'CUSTOMER.COMMON_LABEL_MARGIN_STATUS',
    };
    this.legalStatusConfig = {
      displayWith: 'name',
      valueField: 'value',
      searchPlaceHolder: '',
      labelPlaceHolder: 'CUSTOMER.COMMON_LABEL_MARGIN_STATUS_FOUND',
    };
    this.expropriatePersonConfig = {
      displayWith: 'name',
      valueField: 'value',
      searchPlaceHolder: '',
      labelPlaceHolder: 'ผู้เวนคืน',
    };
  }

  async cancel() {
    if (this.generalForm.dirty || this.subForm.dirty) {
      if (await this.sessionService.confirmExitWithoutSave()) {
        this.dialog.closeAll();
      }
    } else {
      this.dialog.closeAll();
    }
  }

  verifyUserPermission() {
    this.currentUser = this.sessionService.currentUser as MeLexsUserDto;
    if (
      this.currentUser.subRoleCode === 'VIEWER' ||
      (!!this.data.litigationId &&
        this.lawsuitService.currentLitigation.editStatus === LitigationDetailDto.EditStatusEnum.Pending)
    ) {
      this.permissionsOnScreen = {
        canAdd: false,
        canEdit: false,
        canDelete: false,
      };
      return;
    }
    this.permissionsOnScreen = {
      canAdd: true,
      canEdit: true,
      canDelete: true,
    };
    return;
  }

  async save() {
    this.generalForm.markAllAsTouched();
    this.subForm.markAllAsTouched();
    this.generalForm.updateValueAndValidity();
    this.subForm.updateValueAndValidity();

    if (this.generalForm.valid && this.subForm.valid) {
      const request = this.getRequest();
      const res: any = await this.lawsuitService.updateAssets(this.data.litigationId, request);
      if (res) {
        this.notificationService.openSnackbarSuccess(this.translate.instant('CUSTOMER.ADD_COLLATERAL_SUCCESS'));
        // Set flag to be PENDING after success update assets
        this.lawsuitService.currentLitigation.editStatus = LitigationDetailDto.EditStatusEnum.Pending;
      } else {
        this.notificationService.openSnackbarError(this.translate.instant('CUSTOMER.ADD_COLLATERAL_FAIL'));
      }
      this.dialog.closeAll();
    }
  }

  getRequest(): CollateralInfoRequest {
    let updateFlag = this.data.mode === MODE.ADD ? 'A' : ('U' as CollateralRequest.UpdateFlagEnum);

    let mainValue = this.generalForm.value;
    let subValue = this.subForm.value;
    let reqMain: CollateralRequestDes = {
      personId: mainValue?.personId,
      collateralTypeCode: mainValue?.collateralTypeCode,
      collateralTypeDesc: mainValue?.collateralTypeDesc,
      collateralStatusCode: mainValue?.collateralStatusCode,
      externalAssetStatus: mainValue?.externalAssetStatus,
      externalAssetStatusDesc: mainValue?.externalAssetStatusDesc,
      description: mainValue?.description,
      seizureDate: mainValue.seizureDate,
      freezeDate: mainValue.freezeDate,
      seizureRedCaseNo: mainValue.seizureRedCaseNo,
      court: mainValue.court,
      seizurePerson: mainValue.seizurePerson,
      expropriatePerson: mainValue.expropriatePerson,
      expropriate: mainValue.expropriate,
      areaRai: mainValue.areaRai,
      areaNgan: mainValue.areaNgan,
      areaSqrWa: mainValue.areaSqrWa,
      expropriateAmount: mainValue.expropriateAmount,
      notTransferOwnershipWithin: mainValue.notTransferOwnershipWithin,
      notTransferOwnershipFromDate: mainValue.notTransferOwnershipFromDate,
      notTransferOwnershipToDate: mainValue.notTransferOwnershipToDate,
      updateFlag: updateFlag,
    };

    let subRequest: CollateralRequestDes = {};

    switch (mainValue.collateralTypeCode) {
      case TYPE_CODE.LAND:
      case TYPE_CODE.LAND_BUILDING:
        subRequest = {
          collateralSubTypeCode: subValue?.collateralSubTypeCode,
          documentNo: subValue?.documentNo,
          landNo: subValue?.landNo,
          surveySection: subValue?.surveySection,
          areaRai: subValue?.areaRai,
          areaNgan: subValue?.areaNgan,
          areaSqrWa: subValue?.areaSqrWa,
          subdistrictCode: subValue?.subdistrictCode,
          districtCode: subValue?.districtCode,
          provinceCode: subValue?.provinceCode,
          remark: subValue?.remark,
          appraisalPrice: subValue?.appraisalPrice,
          totalAppraisalValue: subValue?.totalAppraisalValue,
          collateralId: subValue?.collateralId,
        };
        break;
      case TYPE_CODE.BUILDING:
        subRequest = {
          collateralId: subValue?.collateralId,
          buildingName: subValue?.buildingName,
          buildingNo: subValue?.buildingNo,
          address1: subValue?.address1,
          address2: subValue?.address2,
          address3: subValue?.address3,
          subdistrictCode: subValue?.subdistrictCode,
          districtCode: subValue?.districtCode,
          provinceCode: subValue?.provinceCode,

          totalAppraisalValue: subValue?.totalAppraisalValue,
          appraisalDate: subValue?.appraisalDate,
        };
        break;
      case TYPE_CODE.MACHINE:
        subRequest = {
          collateralId: subValue?.collateralId,
          machineNo: subValue?.machineNo,
          buildingName: subValue?.buildingName,
          address1: subValue?.address1,
          remark: subValue?.remark,
          totalAppraisalValue: subValue?.totalAppraisalValue,
          appraisalDate: subValue?.appraisalDate,
        };
        break;
      case TYPE_CODE.ACCOUNT:
        subRequest = {
          collateralId: subValue?.collateralId,
          accountNo: subValue?.accountNo,
          currency: subValue?.currency,
          collateralSubTypeCode: subValue?.collateralSubTypeCode,
          bankName: subValue?.bankName,
          accountName: subValue?.accountName,
          totalAppraisalValue: subValue?.totalAppraisalValue,
          dueDate: subValue?.dueDate,
        };
        break;
      case TYPE_CODE.BOND:
        subRequest = {
          collateralId: subValue?.collateralId,
          issuer: subValue?.issuer,
          bondNo: subValue?.bondNo,
          collateralSubTypeCode: subValue?.collateralSubTypeCode,
          unitAmount: subValue?.unitAmount,
          issueDate: subValue?.issueDate,
          priceValue: subValue?.priceValue,
          dueDate: subValue?.dueDate,
        };
        break;
      case TYPE_CODE.STOCK_CER:
        subRequest = {
          collateralId: subValue?.collateralId,
          issuer: subValue?.issuer,
          parValue: subValue?.parValue,
          bookingValue: subValue?.bookingValue,
          unitAmount: subValue?.unitAmount,
          priceValue: subValue?.priceValue,
          dueDate: subValue?.dueDate,
        };
        break;
      case TYPE_CODE.CONDO:
        subRequest = {
          collateralId: subValue?.collateralId,
          buildingName: subValue?.buildingName,
          projectName: subValue?.projectName,
          buildingNo: subValue?.buildingNo,
          roomNo: subValue?.roomNo,
          floor: subValue?.floor,
          areaSqm: subValue?.areaSqm,
          address1: subValue?.address1,
          address2: subValue?.address2,
          address3: subValue?.address3,
          subdistrictCode: subValue?.subdistrictCode,
          districtCode: subValue?.districtCode,
          provinceCode: subValue?.provinceCode,
          totalAppraisalValue: subValue?.totalAppraisalValue,
          appraisalPrice: subValue?.appraisalPrice,
        };
        break;
      case TYPE_CODE.SALARY:
        subRequest = {
          collateralId: subValue?.collateralId,
          jobPosition: subValue?.jobPosition,
          serviceYear: subValue?.serviceYear,
          serviceMonth: subValue?.serviceMonth,
          salary: subValue?.salary,
          otherIncome: subValue?.otherIncome,
          employerType: subValue?.employerType,
          employerName: subValue?.employerName,
          address1: subValue?.address1,
          address2: subValue?.address2,
          address3: subValue?.address3,
          subdistrictCode: subValue?.subdistrictCode,
          districtCode: subValue?.districtCode,
          provinceCode: subValue?.provinceCode,
        };
        break;
      case TYPE_CODE.VEHICLE:
        subRequest = {
          collateralId: subValue?.collateralId,
          typeDescription: subValue?.typeDescription,
          address1: subValue?.address1,
          address2: subValue?.address2,
          address3: subValue?.address3,
          subdistrictCode: subValue?.subdistrictCode,
          districtCode: subValue?.districtCode,
          provinceCode: subValue?.provinceCode,
          vehicleNo: subValue?.vehicleNo,
          vehicleCount: subValue?.vehicleCount,
        };
        break;
      case TYPE_CODE.LEASEHOLD:
        subRequest = {
          collateralId: subValue?.collateralId,
          lendDate: subValue?.lendDate,
          dueDate: subValue?.dueDate,
          borrower: subValue?.borrower,
          buildingName: subValue?.buildingName,
          buildingNo: subValue?.buildingNo,
          roomNo: subValue?.roomNo,
          floor: subValue?.floor,
          areaSqm: subValue?.areaSqm,
          address1: subValue?.address1,
          address2: subValue?.address2,
          subdistrictCode: subValue?.subdistrictCode,
          districtCode: subValue?.districtCode,
          provinceCode: subValue?.provinceCode,

          remark: subValue?.remark,
          appraisalValue: subValue?.appraisalValue,
          appraisalDate: subValue?.appraisalDate,
          rentalFee: subValue?.rentalFee,
          totalAppraisalValue: subValue?.totalAppraisalValue,
        };
        break;
      case TYPE_CODE.COOPERATIVE_STOCK:
        subRequest = {
          collateralId: subValue?.collateralId,
          workOrganization: subValue?.workOrganization,
          payerOrganization: subValue?.payerOrganization,
          address1: subValue?.address1,
          address2: subValue?.address2,
          address3: subValue?.address3,
          subdistrictCode: subValue?.subdistrictCode,
          districtCode: subValue?.districtCode,
          provinceCode: subValue?.provinceCode,
          unitAmount: subValue?.unitAmount,
          priceValue: subValue?.priceValue,
          estimateFreezeAmount: subValue?.estimateFreezeAmount,
        };
        break;
      case TYPE_CODE.OTHER:
        subRequest = {
          collateralId: subValue?.collateralId,
          totalAppraisalValue: subValue?.totalAppraisalValue,
          appraisalValue: subValue?.appraisalValue,
          obligationType: subValue?.obligationType,
          obligationStatus: subValue?.obligationStatus,
          mortgageAmount: subValue?.mortgageAmount,
          pawnAmount: subValue?.pawnAmount,
          consignmentAmount: subValue?.consignmentAmount,
          redeemPeriod: subValue?.redeemPeriod,
          issueDate: subValue?.issueDate,
          dueDate: subValue?.dueDate,
          leasePeriod: subValue?.leasePeriod,
          remainingPeriod: subValue?.remainingPeriod,
          mortgageeName: subValue?.mortgageeName,
          pawnName: subValue?.pawnName,
          consignmentSellerName: subValue?.consignmentSellerName,
          buyerName: subValue?.buyerName,
          remark: subValue?.remark,
          seizureDate: subValue?.seizureDate,
          freezeDate: subValue?.freezeDate,
          seizureRedCaseNo: subValue?.seizureRedCaseNo,
          court: subValue?.court,
          seizurePerson: subValue?.seizurePerson,
          expropriatePerson: subValue?.expropriatePerson,
          foundPropertyProcessType: subValue?.foundPropertyProcessType,
          foundPropertyRemark: subValue?.foundPropertyRemark,
        };
        break;
    }

    let asset = { ...reqMain, ...subRequest };

    return { assets: [asset] };
  }

  getGeneralControl(name: string) {
    return this.generalForm.get(name);
  }
}
