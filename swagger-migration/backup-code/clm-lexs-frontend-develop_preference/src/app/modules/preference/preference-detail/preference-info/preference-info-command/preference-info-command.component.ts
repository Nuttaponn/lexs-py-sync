import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommandAccountDialogComponent } from '@app/modules/preference/preference-component/command-account-dialog/command-account-dialog.component';
import { CommandCifDialogComponent } from '@app/modules/preference/preference-component/command-cif-dialog/command-cif-dialog.component';
import { CommandCollateralDialogComponent } from '@app/modules/preference/preference-component/command-collateral-dialog/command-collateral-dialog.component';
import { PreferenceHeaderComponent } from '@app/modules/preference/preference-component/preference-header/preference-header.component';
import {
  rejectReason,
  executeCaseTypeEnum,
  sell,
  executeType,
} from '@app/modules/preference/preference-mock/mock-dropdown.const';
import { DropdownOptions } from '@app/modules/preference/preference-mock/preference-detail.interface';
import { ModeCompEnum, ScenarioPreferenceEnum } from '@app/modules/preference/preference.model';
import { PreferenceService } from '@app/modules/preference/preference.service';
import { IUploadMultiInfo, IUploadMultiFile } from '@app/shared/models';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { SharedModule } from '@app/shared/shared.module';
import {
  CollateralDto,
  CustomerDto,
  InquiryCustomerResponse,
  InquiryAccountResponse,
  InquiryCollateralResponse,
  PreferenceDetails,
  AssetInvestigationDocument,
  DocumentDto,
} from '@lexs/lexs-client';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownConfig, NameValuePair, SpigCoreModule, SpigShareModule } from '@spig/core';
import { SubSink } from 'subsink';
import { MasterDataService } from '@shared/services/master-data.service';
import { Utils } from '@shared/utils';
import ExecuteCaseTypeEnum = PreferenceDetails.ExecuteCaseTypeEnum;
import RejectReasonEnum = PreferenceDetails.RejectReasonEnum;

import ExecuteTypeEnum = PreferenceDetails.ExecuteTypeEnum;
import { RouterService } from '@app/shared/services/router.service';

@Component({
  selector: 'app-preference-info-command',
  standalone: true,
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    PipesModule,
    PreferenceHeaderComponent,
  ],
  templateUrl: './preference-info-command.component.html',
  styleUrl: './preference-info-command.component.scss',
})
export class PreferenceInfoCommandComponent implements OnInit, OnDestroy {
  @Input() mode: ModeCompEnum = ModeCompEnum.VIEW;

  get isModeView(): boolean {
    return this.mode == ModeCompEnum.VIEW;
  }

  get currentScenario() {
    return this.preferenceService.currentScenario;
  }

  get ScenarioPreferenceEnum() {
    return ScenarioPreferenceEnum;
  }

  get disableButtonSearchDebtor() {
    return this.currentScenario === ScenarioPreferenceEnum.SCENARIO3;
  }

  isOnRequest: boolean = false;
  ExecuteCaseTypeEnum = ExecuteCaseTypeEnum;
  RejectReasonEnum = RejectReasonEnum;
  ExecuteTypeEnum = ExecuteTypeEnum;
  public isOpenedCustomer: boolean = true;
  public isOpenedAccount: boolean = true;
  public isOpenedCollateral: boolean = true;
  public isOpened: boolean = true;
  // isShowCustomerTable: boolean = false;
  preferenceDto: PreferenceDetails = {};
  preferenceForm!: FormGroup;
  uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };

  customerColumns = ['no', 'cifName', 'dpd', 'cFinalStage', 'responseUnit', 'responseAmdUnit', 'branch'];
  public accountColumns = [
    'no',
    'accountNumber',
    'billNumber',
    'dpd',
    'cFinalStage',
    'debtType',
    'lawNumber',
    'totalDebtBurden',
    'litigationStatus',
    'collateralDetails',
  ];
  public collateralColumns = [
    'select',
    'no',
    'collateralId',
    'collateralTypeDesc',
    'collateralSubTypeDesc',
    'documentNo',
    'deteil',
    'litigationNo1',
    'litigationNo',
    'amount',
    'statuscms',
    'status',
  ];

  public custTableDataSource: InquiryCustomerResponse[] = []; // mockCustomerDtos; // TODO: change mock data to real data
  // public custTableDataSource: CustomerDto[] = mockCustomerDtos;
  public accountTableDataSource: InquiryAccountResponse[] = []; // mockAccountDtos;
  public collateralTableDataSource: InquiryCollateralResponse[] = []; // mockCollateralDtos;

  // isUploadReadOnly: boolean = true;
  documentUpload: IUploadMultiFile[] = [];
  documentUploadDto: IUploadMultiFile[] = [];
  public documentColumns: string[] = ['documentName', 'uploadDate'];
  private subs = new SubSink(); // SubSink instance

  constructor(
    private logger: LoggerService,
    private notificationService: NotificationService,
    // private translate: TranslateService,
    private preferenceService: PreferenceService,
    private route: ActivatedRoute,
    private masterDataService: MasterDataService,
     private routerService: RouterService,
  ) {
    this.isOnRequest = !!this.route.snapshot.queryParams['isOnRequest'] || false;
  }

  async ngOnInit() {
    this.preferenceDto = this.preferenceService.preferenceDetail;
    this.preferenceForm = this.preferenceService.getForm();
    // getControl('executeCaseType')?.getRawValue() === ExecuteCaseTypeEnum.NotPreferranceNotDebt
    await this.initDropdowns();
    // detect if found preferenceId or taskId, then get data from server
    // bind data to form
    this.initialTableDataSource();
    this.initialDocumentTemplate(this.preferenceDto?.documents || []);
    this.initDefaultData();
  }

  initDefaultData() {
    if (this.currentScenario === ScenarioPreferenceEnum.SCENARIO1) {
      this.preferenceForm.get('receivedDate')?.setValue(new Date());
      this.preferenceForm.get('ledId')?.setValue('');
      this.preferenceForm.get('elementRedCaseCiosCode')?.setValue('');
      this.preferenceForm.get('courtCode')?.setValue('');
      this.preferenceForm.get('executeCaseType')?.setValue('');
      this.preferenceForm.get('sell')?.setValue('');
    }
  }

  initialTableDataSource() {
    if (this.isModeView) {
      this.collateralColumns.shift();
    }
    this.custTableDataSource = this.preferenceDto.customer?.cifNo ? [this.preferenceDto.customer] : [];
    this.accountTableDataSource = this.preferenceDto.accounts ? this.preferenceDto.accounts : [];
    this.collateralTableDataSource = this.preferenceDto.collaterals ? this.preferenceDto.collaterals : [];

    this.collateralTableDataSource.map((m, index) => {
      // if (!m.selected) {
      //   //m.selected = true;
      //   //this.collateralSelection.toggle(m);
      //   this.toggleRow(m,index);
      // }
      const collateralsArrForm = this.preferenceService.getForm().controls['collaterals'] as FormArray;
      collateralsArrForm.at(index)?.get('selected')?.setValue(m.selected);
      if (m.selected) this.collateralSelection.toggle(m);
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subs.unsubscribe();
  }

  initialDocumentTemplate(data: any[]): void {
    const uploadData = data
      ? data.map((m, index) => {
          return {
            imageId: m?.imageId,
            isUpload: !!m?.imageId,
            documentTemplate: m?.documentTemplate,
            documentTemplateId: m?.documentTemplate?.documentTemplateId,
            uploadDate: m?.documentDate,
            removeDocument: true,
            indexOnly: true,
            active: true,
            uploadRequired: false,
          } as IUploadMultiFile;
        })
      : [];
    this.documentUpload = JSON.parse(JSON.stringify(uploadData));
    this.documentUploadDto = JSON.parse(JSON.stringify(uploadData.slice()));
    const executeTypeValue = this.preferenceForm.get('executeType')?.getRawValue();
    this.onChangeExecuteType(executeTypeValue);
  }

  uploadFileEvent($event: IUploadMultiFile[] | null) {
    this.logger.info('PreferenceInfoCommandComponent -> uploadFileEvent', $event);
    if (!$event) return;
    const updateBackForm: Array<AssetInvestigationDocument> = $event.map((it: any) => {
      return {
        // documentId: it.documentId || undefined,
        active: it.active,
        documentTemplate: it.documentTemplate,
        documentTemplateId: it.documentTemplateId,
        imageId: it.imageId,
        // imageName: it.imageName || undefined,
        // imageSource: it.imageSource || undefined,
        // originalDocument: it.originalDocument || undefined,
        documentDate: it.documentDate,
      } as DocumentDto;
    });
    this.preferenceForm.get('documents')?.patchValue(updateBackForm);
  }

  async onSelectCustomer() {
    // open command-cif-dialog
    const dialogRes = await this.notificationService.showCustomDialog({
      component: CommandCifDialogComponent,
      // component: SubmitCancelMatchingDialogComponent,
      title: 'เลือก CIF',
      iconName: 'none',//icon-Search
      rightButtonClass: 'long-button',
      buttonIconName: 'icon-save-primary',
      rightButtonLabel: 'บันทึกลูกหนี้',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      leftButtonClass: '',
      cancelEvent: true,
      iconClass: '',
      context: {
        selectedCustomer: this.preferenceService.getForm().getRawValue().customer || null,
      },
    });

    if (dialogRes && !!dialogRes.selectedCustomer) {
      const selectedCustomer = dialogRes.selectedCustomer as CustomerDto;
      const prevCifNo = this.preferenceForm.get('customer')?.getRawValue()?.cifNo;
      if (prevCifNo === selectedCustomer.name) return;
      this.custTableDataSource = [selectedCustomer];
      this.preferenceForm.get('customer')?.patchValue(selectedCustomer);
      this.preferenceForm.controls['accounts'] = this.preferenceService.getAccountDtosArrForm(null);
      this.preferenceForm.controls['collaterals'] = this.preferenceService.getCollateralDtosArrForm(null);
      this.preferenceForm.get('customerId')?.setValue(selectedCustomer.cifNo);
      this.uploadMultiInfo.cif = selectedCustomer.cifNo ? selectedCustomer.cifNo : '';
      // TODO: pls review getDocumentForm function accept array of document
      // this.preferenceForm.controls['documents'] = this.preferenceService.getDocumentArrForm(this.preferenceDto.documents ? this.preferenceDto.documents : null)
      // this.initialDocumentTemplate(this.preferenceDto?.documents || [])
      this.accountTableDataSource = [];
      this.collateralTableDataSource = [];
    }
  }

  async onSelectAccounts() {
    // open command-cif-dialog
    const dialogRes = await this.notificationService.showCustomDialog({
      component: CommandAccountDialogComponent,
      // component: SubmitCancelMatchingDialogComponent,
      title: 'เลือกบัญชี',
      iconName: 'none',
      rightButtonClass: 'long-button',
      buttonIconName: 'icon-save-primary',
      rightButtonLabel: 'บันทึกบัญชี',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      leftButtonClass: '',
      cancelEvent: true,
      iconClass: '',
      context: {
        selectedCustomer: this.preferenceService.getForm().getRawValue().customer || null,
        selectedAccounts: this.accountTableDataSource || null,
      },
    });
    const allAccountsDialog = (JSON.parse(JSON.stringify(dialogRes.allAccounts)) as InquiryAccountResponse[]) || [];
    const selectedAccounts = JSON.parse(JSON.stringify(dialogRes.selectedAccounts)) as InquiryAccountResponse[];
    if (dialogRes && dialogRes.selectedAccounts) {
      this.preferenceForm.controls['accounts'] = this.preferenceService.getAccountDtosArrForm(null);
      this.preferenceForm.controls['collaterals'] = this.preferenceService.getCollateralDtosArrForm(null);
      const arrAccountNo = selectedAccounts.map(m => m.accountNo) || [];
      let allAccounts: InquiryAccountResponse[] = [];
      allAccountsDialog.map((m: InquiryAccountResponse) => {
        if (m.accountNo && arrAccountNo.includes(m.accountNo)) {
          allAccounts.push({ ...m, selected: true });
        } else {
          allAccounts.push({ ...m, selected: false });
        }
      });
      this.preferenceForm.controls['accounts'] = this.preferenceService.getAccountDtosArrForm(allAccounts);
      this.accountTableDataSource = selectedAccounts;
      const selectedBillNo: string[] = selectedAccounts.map(acc => acc.billNo ?? '') ?? [];

      const preferenceGroupNoForInquiryCollaterals: string = this.preferenceDto?.preferenceGroupNo || '';
      let mode: 'ADD' | 'VIEW' | 'EDIT' = 'VIEW';
      if (this.currentScenario === ScenarioPreferenceEnum.SCENARIO1) {
        mode = 'ADD';
      } else if (this.currentScenario === ScenarioPreferenceEnum.SCENARIO3) {
        mode = 'EDIT';
      }
      this.collateralTableDataSource = await this.preferenceService.inquiryCollaterals(
        selectedBillNo,
        mode,
        preferenceGroupNoForInquiryCollaterals
      );
      if (this.collateralTableDataSource.length !== 0) {
        let collateralArrForm = this.preferenceForm.controls['collaterals'] as FormArray;
        this.collateralTableDataSource.forEach((item, index) => {
          collateralArrForm.push(this.preferenceService.getCollateralDtosForm(item));
        });
        this.collateralTableDataSource.map((m, index) => {
          collateralArrForm.at(index)?.get('selected')?.setValue(m.selected);
          if (m.selected) this.collateralSelection.toggle(m);
        });
      }
    }
  }

  async onLookupCollaterals(accNo: string, billNo: string) {
    // const dialogRes =
    await this.notificationService.showCustomDialog({
      component: CommandCollateralDialogComponent,
      // component: SubmitCancelMatchingDialogComponent,
      title: 'รายละเอียดหลักประกัน',
      iconName: 'icon-Search',
      rightButtonClass: 'long-button',
      buttonIconName: '',
      rightButtonLabel: 'ตกลง',
      leftButtonLabel: '',
      leftButtonClass: '',
      cancelEvent: false,
      iconClass: '',
      context: {
        accountNo: accNo,
        billNo: billNo,
        preferenceGroupNo: this.preferenceDto?.preferenceGroupNo,
        // isReProcess:
        //   this.auctionService.actionCode === auctionActionCode.R2E09_2_A &&
        //   this.auctionService.actionType !== taskCode.ON_REQUEST &&
        //   this.auctionService.mode === 'EDIT',
      },
    });
  }

  // Selection model for multi-selection
  public collateralSelection = new SelectionModel<InquiryCollateralResponse>(true, []);

  // Toggle selection for a single row
  toggleRow(row: InquiryCollateralResponse, index: number): void {
    const collateralsArrForm = this.preferenceService.getForm().controls['collaterals'] as FormArray;
    const val = collateralsArrForm.at(index)?.get('selected')?.getRawValue() || false;
    collateralsArrForm.at(index)?.get('selected')?.setValue(!val);
    this.collateralSelection.toggle(row);
  }

  // Check if all rows are selected
  isAllCollateralSelected(): boolean {
    const numSelected = this.collateralSelection.selected.length;
    const numRows = this.collateralTableDataSource.length;
    return numSelected === numRows;
  }

  // Select or deselect all rows
  toggleAllCollateralRows(): void {
    if (this.isAllCollateralSelected()) {
      this.collateralSelection.clear();
      // const collateralsArrForm =  this.preferenceService.getForm().controls['collaterals'] as FormArray
      // collateralsArrForm.
    } else {
      this.collateralSelection.select(...this.collateralTableDataSource);
    }
    const collateralsArrForm = this.preferenceService.getForm().get('collaterals') as FormArray;
    collateralsArrForm.controls.map(item => {
      item.get('selected')?.setValue(this.isAllCollateralSelected());
    });
  }

  changeRejectReason(value: string) {
    if (value) {
      if (value === RejectReasonEnum.Other) {
        this.preferenceForm.get('rejectReasonRemark')?.setValidators(Validators.required)
        this.preferenceForm.get('rejectReasonRemark')?.updateValueAndValidity()
      } else {
        this.preferenceForm.get('rejectReasonRemark')?.setValue('')
        this.preferenceForm.get('rejectReasonRemark')?.clearValidators()
        this.preferenceForm.get('rejectReasonRemark')?.updateValueAndValidity()
      }
    }
  }

  onChangeExecuteType(value: string) {
    const docIdSelected = executeType.find(f => f.value === value)?.docId
    let selectDocUpload = this.documentUploadDto.find(f => f.documentTemplateId === docIdSelected)
    if (selectDocUpload) {
      this.documentUpload = [{ ...selectDocUpload, uploadRequired: true }];
      this.preferenceForm.controls['documents'] = this.preferenceService.getDocumentArrForm([selectDocUpload]);
    }
    if (value === ExecuteTypeEnum.Other) {
      this.preferenceForm.get('executeTypeRemark')?.setValidators(Validators.required);
    } else {
      this.preferenceForm.get('executeTypeRemark')?.setValue('');
      this.preferenceForm.get('executeTypeRemark')?.clearValidators();
    }
    this.preferenceForm.get('executeTypeRemark')?.updateValueAndValidity();

    if(value === ExecuteTypeEnum.DeedLed){
      this.preferenceForm.get('executeDate')?.setValidators(Validators.required);
      this.preferenceForm.get('receivedDate')?.setValidators(Validators.required);
      this.preferenceForm.get('executeNo')?.setValidators(Validators.required);
      this.preferenceForm.get('ledId')?.setValidators(Validators.required);
    }
    else {
      this.preferenceForm.get('executeDate')?.setValue('');
      this.preferenceForm.get('executeDate')?.clearValidators();
      this.preferenceForm.get('receivedDate')?.setValue(new Date());
      this.preferenceForm.get('receivedDate')?.clearValidators();
      this.preferenceForm.get('executeNo')?.setValue('');
      this.preferenceForm.get('executeNo')?.clearValidators();
      this.preferenceForm.get('ledId')?.setValue('');
      this.preferenceForm.get('ledId')?.clearValidators();
    }
    this.preferenceForm.get('executeDate')?.updateValueAndValidity();
    this.preferenceForm.get('receivedDate')?.updateValueAndValidity();
    this.preferenceForm.get('executeNo')?.updateValueAndValidity();
    this.preferenceForm.get('ledId')?.updateValueAndValidity();

  }

  changeExecuteCaseType(value: string) {
    if (value) {
      if (value === ExecuteCaseTypeEnum.NotPreferranceHaveDebt || value === ExecuteCaseTypeEnum.NotPreferranceNotDebt) {
        this.preferenceForm.get('rejectReason')?.setValidators(Validators.required)
        this.preferenceForm.get('rejectReason')?.updateValueAndValidity()
        this.preferenceForm.get('sell')?.clearValidators()
        this.preferenceForm.get('sell')?.updateValueAndValidity()
        this.preferenceForm.get('sell')?.setValue(null)
      } else {
        this.changeRejectReason('')
        this.preferenceForm.get('rejectReason')?.setValue('')
        this.preferenceForm.get('sell')?.setValue('')
        this.preferenceForm.get('sell')?.setValidators(Validators.required)
        this.preferenceForm.get('sell')?.updateValueAndValidity()
        this.preferenceForm.get('rejectReason')?.clearValidators()
        this.preferenceForm.get('rejectReason')?.updateValueAndValidity()
      }
    }
  }

  dropdownOptions: DropdownOptions = {
    executeType: [],
    led: [],
    // writNotificationNumber: [],
    ciosCaseType: [],
    // caseNumber: [],
    year: [],
    court: [],
    executeCaseTypeEnum: [],
    rejectReason: [],
    sell: [],
    cannotSelected: [],
    // lawOffice: [],
  };

  public defaultConfig: DropDownConfig = {
    // defaultValue: 'N/A',
    // iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    // searchPlaceHolder: '',
    // searchWith: 'name',
  };

  public writTypeConfig: DropDownConfig = {
    // displayWith: 'name',
    // valueField: 'value',
    ...this.defaultConfig,
    // searchPlaceHolder: '',
    labelPlaceHolder: 'ประเภทหมาย',
  };
  public executionOfficeConfig: DropDownConfig = {
    ...this.defaultConfig,
    labelPlaceHolder: 'สำนักงานบังคับคดี',
  };
  // public writNotificationNumberConfig: DropDownConfig = {
  //   ...this.defaultConfig,
  //   labelPlaceHolder: 'ประเภทหมาย',
  // };
  public categoryConfig: DropDownConfig = {
    ...this.defaultConfig,
    labelPlaceHolder: 'หมวด',
  };
  // public caseNumberConfig: DropDownConfig = {
  //   ...this.defaultConfig,
  //   labelPlaceHolder: 'ประเภทหมาย',
  // };
  public yearConfig: DropDownConfig = {
    ...this.defaultConfig,
    labelPlaceHolder: 'ปี พ.ศ. (4 หลัก)',
  };
  public courtConfig: DropDownConfig = {
    ...this.defaultConfig,
    labelPlaceHolder: 'ศาล',
  };
  public orderTypeConfig: DropDownConfig = {
    ...this.defaultConfig,
    labelPlaceHolder: 'ประเภทสั่งการ',
  };
  public nonFilingReasonConfig: DropDownConfig = {
    ...this.defaultConfig,
    labelPlaceHolder: 'ประเภทหมาย',
  };
  public rejectReasonConfig: DropDownConfig = {
    ...this.defaultConfig,
    labelPlaceHolder: 'เหตุผลที่ไม่ยื่นขอรับชำระหนี้',
  };
  public saleMethodConfig: DropDownConfig = {
    ...this.defaultConfig,
    labelPlaceHolder: 'วิธีการขาย',
  };

  public cannotSelectedConfig: DropDownConfig = {
    ...this.defaultConfig,
    labelPlaceHolder: ' - ',
  };

  getControl(name: string): AbstractControl | null {
    return this.preferenceForm?.get(name);
  }

  private async initDropdowns() {
    const courtDD = (await this.masterDataService.court()).court || [];
    const ciosCaseTypeDD =
      (await this.masterDataService.ciosCaseType()).ciosCaseTypeList?.map(item => {
        return { name: item.name, value: item.code } as NameValuePair;
      }) ||
      [] ||
      [];

    const ledsDD =
      (await this.masterDataService.led()).leds?.map(item => {
        return { name: item.ledName, value: item.ledId + '' } as NameValuePair;
      }) || [];
    let option: NameValuePair = { value: '', name: 'กรุณาเลือก' };
    let leddto = [] as NameValuePair[];
    leddto.push(option);
    ledsDD?.map(m => {
      leddto?.push(m);
    });

    this.dropdownOptions = {
      executeType: executeType,
      led: leddto,
      // writNotificationNumber: writNotificationNumber,
      ciosCaseType: ciosCaseTypeDD,
      court: courtDD,
      // caseNumber: caseNumber,
      year: Utils.getYearFromNow(15), // since currently and the previous 15 years
      executeCaseTypeEnum: executeCaseTypeEnum,
      rejectReason: rejectReason,
      sell: sell,
      cannotSelected: []
      // lawOffice:lawOffice
    };
    // when mode edit init dropdown value
    const executeCaseTypeVal = this.preferenceForm.get('executeCaseType')?.getRawValue()
    if (executeCaseTypeVal) {
      this.onChangeExecuteType(executeCaseTypeVal)
    }
    const rejectReasonVal = this.preferenceForm.get('rejectReason')?.getRawValue()
    if (rejectReasonVal) {
      this.changeRejectReason(rejectReasonVal)
    }
  }

  getDropdownName(key: keyof DropdownOptions, value?: undefined | string ) {
    if (!value || !key) {
      return ' - '
    }
    return this.dropdownOptions[key]?.find(f => f.value == value)?.name;
  }

  get showHideSell() {
    if(this.getControl('executeCaseType')?.getRawValue() !== ExecuteCaseTypeEnum.Preference) {
      return false
    } else if (this.getControl('executeCaseType')?.getRawValue() === ExecuteCaseTypeEnum.Preference &&
               this.getControl('rejectReason')?.getRawValue() === RejectReasonEnum.Other) {
      return false
    }
    return true
  }

  navigateToCustomer(customerId: string) {
    this.routerService.navigateTo('/main/customer/detail', {
      customerId: customerId,
    });
  }
}
