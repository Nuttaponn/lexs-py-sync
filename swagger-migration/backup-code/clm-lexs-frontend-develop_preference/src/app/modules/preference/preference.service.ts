import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { lastValueFrom, of } from 'rxjs';
import { mockAccountDtos, mockCollateralDtos, mockCustomerDtos, mockPreferenceDto } from './preference-mock/mock-pref-data.const';
import { PreferenceDto } from './preference-mock/preference-detail.interface';
import {
  PreferenceDetails,
  InquiryAccountResponse,
  InquiryCustomerResponse,
  InquiryCollateralResponse,
  PreferenceApproveRequest,
  PreferenceControllerService,
  PagePreferenceGroupDto,
  AssignLawyerRequest,
  DocumentDto,
  ShotLexsUser, PreferenceGroupDto, PageInquiryCustomerResponse,
} from "@lexs/lexs-client";
import ExecuteCaseTypeEnum = PreferenceDetails.ExecuteCaseTypeEnum;
import SellEnum = PreferenceDetails.SellEnum;
import { DefaultModeCompPreference, ModeCompPreference, ScenarioPreferenceEnum } from './preference.model';
import {IUploadMultiFile} from "@shared/models";
import ExecuteTypeEnum = PreferenceGroupDto.ExecuteTypeEnum;
@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  preferenceId: string = '';
  preferenceDto: PreferenceDto | undefined | null = null;

  constructor(
    private fb: FormBuilder,
    private errorHandlingService: ErrorHandlingService,
    private preferenceControllerService: PreferenceControllerService,
  ) { }

  clearData() {

    this.currentScenario = ScenarioPreferenceEnum.SCENARI0;
    this.modeCompPreference = new DefaultModeCompPreference();
    this.preferenceDetailForm = this.fb.group({});
    this.preferenceDetail = {};
    this.preferenceId = '';
    this.preferenceDto = null;
  }

  //PreferenceDetailComponent condition scenario preference-detail
  currentScenario: ScenarioPreferenceEnum = ScenarioPreferenceEnum.SCENARI0;
  modeCompPreference : ModeCompPreference = new DefaultModeCompPreference();

  //AssignLawyerComponent formData
  preferenceLawyerForm!: UntypedFormGroup;
  createPreferenceLawyerForm(){
    return this.fb.group({
      lawyerId: ['', Validators.required],
      lawyerName: [''],
    });
  }

  //PreferenceInfoCommandComponent modelData and formData
  preferenceDetail : PreferenceDetails = {};
  preferenceDetailForm!: FormGroup;
  createPreferenceDetailForm(data : PreferenceDetails): FormGroup {
    if (data) {
      return  this.fb.group({
        executeType: [data.executeType || ExecuteTypeEnum.DeedLed, Validators.required], //ประเภทหมาย
        executeTypeRemark: [data.executeTypeRemark || ''], //ประเภทหมายอื่นๆ
        executeDate: [data.executeDate || '', Validators.required], //หมายลงวันที่
        receivedDate: [data.receivedDate || '', Validators.required], //วันที่หน่วยงานดูแลูกหนี้ได้รับหมาย
        executeNo: [data.executeNo || '', Validators.required], //เลขที่หมายแจ้ง
        ledId: [data.ledId || '', Validators.required], //สำนักงานบังคับคดี
        elementRedCaseCiosCode: [data.elementRedCaseCiosCode || '', Validators.required],
        elementRedCaseRunning: [data.elementRedCaseRunning || '', Validators.required],
        elementRedCaseYear: [data.elementRedCaseYear || '', Validators.required],
        executeCaseType: [data.executeCaseType || '' || ExecuteCaseTypeEnum.Preference, Validators.required],
        redCaseNo: [data.redCaseNo || ''],
        customerId: [data.customerId || ''],
        plaintiffName: [data.plaintiffName || '', Validators.required], //ชื่อโจทก์
        defendantName: [data.defendantName || '', Validators.required], //ชื่อจำเลย
        courtCode: [data.courtCode || '', Validators.required], //ศาล

        // Related objects can be added later
        customer: this.fb.group({
          cifNo: [data.customer?.cifNo || ''], //CIF No.
          fullName: [data.customer?.fullName || ''], // ชื่อลูกหนี้
          dpd: [data.customer?.dpd || ''],  //DPD
          cfinalStage: [data.customer?.cfinalStage || ''], //C-Final/Stage
          responseUnitCode: [data.customer?.responseUnitCode || ''], //Response Unit/ผู้ดูแลลูกหนี้
          responseUnitName: [data.customer?.responseUnitName || ''], //Response Unit/ผู้ดูแลลูกหนี้
          amdResponseUnitCode: [data.customer?.amdResponseUnitCode || ''], //Response AMD Unit/ผู้ดูแลลูกหนี้
          amdResponseUnitName: [data.customer?.amdResponseUnitName || ''], //Response AMD Unit/ผู้ดูแลลูกหนี้
          branchCode: [data.customer?.branchCode || ''], //สาขา (Booking/Cost Center)
          branchName: [data.customer?.branchName || ''], //สาขา (Booking/Cost Center)
        }),
        documents: this.getDocumentArrForm(data.documents),
        accounts: this.getAccountDtosArrForm(data.accounts),
        collaterals: this.getCollateralDtosArrForm(data.collaterals),
        approverRejectReason: [data.approverRejectReason || ''],
        rejectReason: [data.rejectReason || ''],
        rejectReasonRemark: [data.rejectReason || ''],
        sell: [data.sell, Validators.required || null],
      });
    }else{
      return this.fb.group({});
    }
  }

  // Get the form
  getForm(): FormGroup {
    return this.preferenceDetailForm;
  }

  async inquiryDetails(preferenceGroupNo: string, mode: 'ADD' | 'VIEW' | 'EDIT'): Promise<PreferenceDetails> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.preferenceControllerService.inquiryDetails(preferenceGroupNo, mode))
    );
  }

  async save(preferenceDetails : PreferenceDetails){
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.preferenceControllerService.save(preferenceDetails))
    );
  }

  async inquiryAccount(mode: 'ADD' | 'VIEW' | 'EDIT', customerId?: string, preferenceGroupNo?: string): Promise<Array<InquiryAccountResponse>> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.preferenceControllerService.inquiryAccount(mode, customerId, preferenceGroupNo))
    );
  }

  async inquiryCustomer({
    cifNo,
    citizenId,
    fullName,
    size,
    page,
  }: {
    cifNo: string;
    citizenId: string;
    fullName: string;
    size: number;
    page: number;
  }): Promise<PageInquiryCustomerResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.preferenceControllerService.inquiryCustomer(cifNo, citizenId, fullName, size, page))
    );
  }

  async inquiryCollaterals(billNo: Array<string>, mode: 'ADD' | 'VIEW' | 'EDIT', preferenceGroupNo?: string): Promise<Array<InquiryCollateralResponse>> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.preferenceControllerService.inquiryCollaterals(billNo, mode, preferenceGroupNo))
    );
  }

  async approve(taskId: number, preferenceApproveRequest: PreferenceApproveRequest){
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.preferenceControllerService.approve(taskId, preferenceApproveRequest))
    );
  }

  async getAssignLawyer(taskId: number): Promise<Array<ShotLexsUser>>  {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.preferenceControllerService.getAssignLawyer(taskId))
    );
  }

  async getPreference(litigationId: string): Promise<Array<PreferenceGroupDto>>  {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.preferenceControllerService.getPreference(litigationId))
    );
  }

  async assignLawyer(taskId: number, assignLawyerRequest: AssignLawyerRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.preferenceControllerService.assignLawyer(taskId, assignLawyerRequest))
    );
  }


  // getPreferenceCustomers
  async getPreferenceCustomers({
    cifNo,
    citizenId,
    fullName,
  }: {
    cifNo: string;
    citizenId: string;
    fullName: string;
  }): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        // this.auctionControllerService.getAuctionCustomer(cifNo, citizenId, fullName)
        of(mockCustomerDtos)
      )
    );
  };

  // getPreferenceAccounts
  async getPreferenceAccounts(
    accountNoList: string /* accountList: string */
  ): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        // this.auctionControllerService.getAuctionAccount(cifNo, accountNo, accountType)
        of(mockAccountDtos)
      )
    );
  };

  // getCollateralsByAccounts
  async getCollateralsByAccounts(accountNos: string[]) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        // this.auctionControllerService.getCollateralsByAccounts(accountNos)
        of(mockCollateralDtos)
      )
    );
  }

  async getPreferenceDto(): Promise<PreferenceDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        // this.auctionControllerService.getAuctionPreferenceDto()
        of(mockPreferenceDto)
      )
    );
  }

  getAccountDtosArrForm(data?: InquiryAccountResponse[] | null) {
    const formArray = this.fb.array<FormGroup>([])
    if (!!data && data.length > 0) {
      data.forEach(e => formArray.push(this.getAccountDtosForm(e)))
    }
    return formArray
  }

  getAccountDtosForm(data?: InquiryAccountResponse | null) {
    return this.fb.group({
      accountNo: data?.accountNo || null,
      billNo: data?.billNo || null,
      accountType: data?.accountType || null,
      dpd: data?.dpd || null,
      stageAccount: data?.stageAccount || null,
      marketCode: data?.marketCode || null,
      marketDescription: data?.marketDescription || null,
      totalAmount: data?.totalAmount || null,
      prescriptionDate: data?.prescriptionDate || null,
      litigationId: data?.litigationId || null,
      litigationStatus: data?.litigationStatus || null,
      litigationStatusName: data?.litigationStatusName || null,
      blackCaseNo: data?.blackCaseNo || null,
      redCaseNo: data?.redCaseNo || null,
      insertFlag: data?.insertFlag || null,
      selected: data?.selected || false,
      cfinalStage: data?.cfinalStage || null,
    });
  }

  getCollateralDtosArrForm(data?: InquiryCollateralResponse[] | null) {
    const formArray = this.fb.array<FormGroup>([])
    if (!!data && data.length > 0) {
      data.forEach(e => formArray.push(this.getCollateralDtosForm(e)))
    }
    return formArray
  }

  getCollateralDtosForm(data?: InquiryCollateralResponse | null) {
    let form = this.fb.group({
      billNo: data?.billNo || null,
      collateralId: data?.collateralId || null,
      collateralTypeCode: data?.collateralTypeCode || null,
      collateralTypeDesc: data?.collateralTypeDesc || null,
      collateralSubTypeCode: data?.collateralSubTypeCode || null,
      collateralSubTypeDesc: data?.collateralSubTypeDesc || null,
      documentNo: data?.documentNo || null,
      description: data?.description || null,
      selected: data?.selected || false,
    });
    return form
  }

  getDocumentArrForm(data?: DocumentDto[] | IUploadMultiFile[] | null) {
    const formArray = this.fb.array<FormGroup>([])
    if (!!data && data.length > 0) {
      data.forEach(e => formArray.push(this.getDocumentForm(e)))
    }
    return formArray
  }

  getDocumentForm(data?: IUploadMultiFile | DocumentDto | null) {
    let form = this.fb.group({
      active: data?.active || false,
      documentTemplateId: data?.documentTemplateId,
      documentDate: data?.documentDate,
      imageId: data?.imageId,
      documentTemplate: this.fb.group({
        documentTemplateId: data?.documentTemplate?.documentTemplateId || null,
        documentName: data?.documentTemplate?.documentName || null,
        searchType: data?.documentTemplate?.searchType || null,
        documentGroup: data?.documentTemplate?.documentGroup || null,
        needHardCopy: data?.documentTemplate?.needHardCopy || false,
        optional: data?.documentTemplate?.optional || false,
        forNoticeLetter: data?.documentTemplate?.forNoticeLetter || false,
        forLitigation: data?.documentTemplate?.forLitigation || false,
        requiredDocumentDate: data?.documentTemplate?.requiredDocumentDate || false,
        contentType: data?.documentTemplate?.contentType || null,
        generatedBySystem: data?.documentTemplate?.generatedBySystem || false,
        multipleUpload: data?.documentTemplate?.multipleUpload || false,
      }),
    });
    return form
  }

  // public dataForm!: UntypedFormGroup;
  // getDataForm(data?: any) {
  //   if (data) {
  //     return this.fb.group({
  //       result: ['data', Validators.required],
  //     });
  //   } else {
  //     return this.fb.group({
  //       result: ['no-data', Validators.required],
  //     });
  //   }
  // }

  async inquiryPreferenceGroups(tabName: 'USER' | 'TEAM' | 'ORG' | 'CLOSED' | 'DASHBOARD' | 'PREFERENCE' | 'NOT_PREFERENCE' | 'ALL', preferenceGroupNo?: string, litigationId?: string, size?: number, page?: number): Promise<PagePreferenceGroupDto>{
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.preferenceControllerService.inquiryPreferenceGroups(tabName,preferenceGroupNo,litigationId,size,page))
    );
  }

}
