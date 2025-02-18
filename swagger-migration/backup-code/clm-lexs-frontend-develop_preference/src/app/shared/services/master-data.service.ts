import { Injectable } from '@angular/core';
import {
  AdvancePaymentStatusDto,
  AllegationDto,
  ApprovalAuthorityDlaDto,
  ApprovalAuthorityDto,
  CaseCreatorDto,
  CaseTypeDto,
  CessationReasonDto,
  CiosCaseTypeDto,
  CollType,
  CollateralStatusDto,
  CollateralSubTypeDto,
  CollateralTypeDto,
  CourtDto,
  CourtFeeSubTypeDto,
  CourtFeeTypeDto,
  CourtOrderDto,
  CourtSubVerdictDto,
  CourtTypeDto,
  CourtVerdictDto,
  CourtVerdictTypeDto,
  CustomerStatusDto,
  DebtTransferToDto,
  DebtorDto,
  DefermentReasonDto,
  Dist,
  DistrictDto,
  DoneByDto,
  ExpenseActionDto,
  ExpenseCancelReasonDto,
  ExpenseObjectDto,
  ExpenseRateDto,
  ExpenseReceiveDto,
  ExpenseReviseReasonDto,
  ExpenseStatusDto,
  ExpenseStepSubType,
  ExpenseStepType,
  ExternalAssetStatusDto,
  FinancialAccountCodeDto,
  FinancialAccountTypeDto,
  FinancialInstitutionsDto,
  FinancialObjectTypeDto,
  FollowUpStatusDto,
  JuristicTypeDto,
  KcorpTransferStatusDto,
  KtbOrgDto,
  Led,
  LedDto,
  LegalStatusDto,
  LitigationCloseStatusDto,
  LoanTypeDto,
  MasterDataControllerService,
  NameValuePair,
  Prov,
  ProvinceDto,
  ReceiveAccountCodeDto,
  ReceiveCancelReasonDto,
  ReceiveStatusDto,
  ReceiveTypeDto,
  RejectOriginalDocumentReasonDto,
  SaleTypeDescDto,
  SamFlagDto,
  ScopeDto,
  Subd,
  SubdistrictDto,
  SuspensExecutionDto,
  TamcFlagDto,
  TaskStatusDto,
  TaskTypeDto,
  TitleDto,
  WriteOffStatusDto,
  OccupantDto,
  CiosCaseType
} from '@lexs/lexs-client';
import { lastValueFrom } from 'rxjs';
import {
  AdvancePaymentSearchOption,
  AdvanceSearchOption,
  ExpenseSearchOption,
  ReceiptSearchOption,
  SummaryRiemburstmentSearchOption,
} from '../components/search-controller/search-controller.model';
import { LOCAL_STORAGE } from '../constant/localstorage.constant';
import { DataService } from './data.service';
import { ErrorHandlingService } from './error-handling.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MasterDataService {
  constructor(
    private masterDataControllerService: MasterDataControllerService,
    private errorHandlingService: ErrorHandlingService,
    private dataService: DataService,
    private translate: TranslateService
  ) {}
  private _advanceOptions: AdvanceSearchOption = {};
  private _expenseOptions: ExpenseSearchOption = {};
  private _receiptOptions: ReceiptSearchOption = {};
  private _advancePaymentOptions: AdvancePaymentSearchOption = {};
  private _summaryRiemburstmentSearchOption: SummaryRiemburstmentSearchOption = {};
  /** clear all data */
  public clearAllData() {
    // clear Master Data
    this.dataService.clear();
    // clear Advance Search Options
    this._advanceOptions = {};
    // clear Finance Search Options
    this._expenseOptions = {};
    this._receiptOptions = {};
  }

  /** for Advance Search Options */
  public get advanceOptions(): AdvanceSearchOption {
    return this._advanceOptions;
  }
  public set advanceOptions(value: AdvanceSearchOption) {
    this._advanceOptions = value;
  }

  /** for Finance Search Options */
  public get expenseOptions(): ExpenseSearchOption {
    return this._expenseOptions;
  }
  public set expenseOptions(value: ExpenseSearchOption) {
    this._expenseOptions = value;
  }

  public get receiptOptions(): ReceiptSearchOption {
    return this._receiptOptions;
  }
  public set receiptOptions(value: ReceiptSearchOption) {
    this._receiptOptions = value;
  }
  public get advancePaymentOptions(): AdvancePaymentSearchOption {
    return this._advancePaymentOptions;
  }
  public set advancePaymentOptions(value: AdvancePaymentSearchOption) {
    this._advancePaymentOptions = value;
  }

  /** for Summary Riemburstment Search Options */
  public get summaryRiemburstmentSearchOption(): SummaryRiemburstmentSearchOption {
    return this._summaryRiemburstmentSearchOption;
  }
  public set summaryRiemburstmentSearchOption(value: SummaryRiemburstmentSearchOption) {
    this._summaryRiemburstmentSearchOption = value;
  }

  /** get defermentReson */
  public async defermentReson(): Promise<DefermentReasonDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.DEFERMENT_RESON) as DefermentReasonDto;
    if (data) {
      return data;
    } else {
      const response = await this.getDefermentReson();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.DEFERMENT_RESON, response);
      }
      return response;
    }
  }

  /** get approvalAuthority */
  public async ApprovalAuthorityByType(defermentType: 'DEFERMENT' | 'CESSATION'): Promise<ApprovalAuthorityDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.APPROVAL_AUTHORITY) as ApprovalAuthorityDto;
    if (data) {
      return data;
    } else {
      const response = await this.getApprovalAuthorityByType(defermentType);
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.APPROVAL_AUTHORITY, response);
      }
      return response;
    }
  }

  /** get cessationReason */
  public async cessationReason(): Promise<CessationReasonDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.CESSATION_REASON) as CessationReasonDto;
    if (data) {
      return data;
    } else {
      const response = await this.getCessationReason();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.CESSATION_REASON, response);
      }
      return response;
    }
  }

  /** get caseCreator */
  public async caseCreator(): Promise<CaseCreatorDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.CASE_CREATOR) as CaseCreatorDto;
    if (data) {
      return data;
    } else {
      const response = await this.getCaseCreator();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.CASE_CREATOR, response);
      }
      return response;
    }
  }

  /** get collateralStatus */
  public async collateralStatus(): Promise<CollateralStatusDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.COLLATERAL_STATUS) as CollateralStatusDto;
    if (data) {
      return data;
    } else {
      const response = await this.getCollateralStatus();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.COLLATERAL_STATUS, response);
      }
      return response;
    }
  }

  /** get collateralType */
  public async collateralType(): Promise<CollateralTypeDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.COLLATERAL_TYPE) as CollateralTypeDto;
    if (data) {
      return data;
    } else {
      const response = await this.getCollateralType();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.COLLATERAL_TYPE, response);
      }
      return response;
    }
  }

  async getCollateralTypeOptions(exceptedTypeCode?: string[]) {
    let res = (await this.collateralType()).collateralType || [];
    let collateralTypeList = res.filter((obj: CollType) => {
      return obj.collateralTypeCode && !exceptedTypeCode?.includes(obj.collateralTypeCode);
    });
    let allOption: CollType[] = [
      {
        collateralTypeCode: 'ALL',
        collateralTypeDesc: this.translate.instant('PROPERTY.COLLATERAL_TYPE'),
      },
    ];
    return allOption.concat(collateralTypeList);
  }

  async getLedOptions() {
    const leds = (await this.led()).leds || [];
    let ledsFormat: NameValuePair[] = [];
    leds.forEach(e => {
      ledsFormat.push({ name: e.ledName, value: e.ledId?.toString() });
    });
    let allOption: NameValuePair[] = [
      {
        value: 'ALL',
        name: this.translate.instant('LAWSUIT.LEGAL_EXECUTION_OFFICE'),
      },
    ];
    return allOption.concat(ledsFormat);
  }

  async getSaleTypeDescOptions() {
    const saleTypeDesc = (await this.saleTypeDesc()).saleTypeDesc || [];
    let allOption: NameValuePair[] = [
      {
        value: 'ALL',
        name: this.translate.instant('LAWSUIT.DEFERMENT.SALES_TYPE'),
      },
    ];
    return allOption.concat(saleTypeDesc);
  }

  async getOccupantOptions() {
    const occupants = (await this.occupant()).occupants || [];
    let allOption: NameValuePair[] = [
      {
        value: 'ALL',
        name: this.translate.instant('ประเภทกรรมสิทธิ์'),
      },
    ];
    return allOption.concat(occupants);
  }

  public async collateralSubType(): Promise<CollateralSubTypeDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.COLLATERAL_SUB_TYPE) as CollateralSubTypeDto;
    if (data) {
      return data;
    } else {
      const response = await this.getCollateralSubType();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.COLLATERAL_SUB_TYPE, response);
      }
      return response;
    }
  }
  public async juristicType(): Promise<JuristicTypeDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.JURISTIC_TYPE) as JuristicTypeDto;
    if (data) {
      return data;
    } else {
      const response = await this.getJuristicType();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.JURISTIC_TYPE, response);
      }
      return response;
    }
  }

  /** get court */
  public async court(includeDefaultOption: boolean = true): Promise<CourtDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.COURT) as CourtDto;
    let result;
    if (data) {
      result = data;
    } else {
      result = await this.getCourt();
      if (result) {
        this.dataService.set(LOCAL_STORAGE.MASTER.COURT, result);
      }
    }

    let dto = {} as CourtDto;
    dto.court = [] as NameValuePair[];

    let option: NameValuePair = {value: '',name: 'กรุณาเลือก',};
    if (includeDefaultOption) {
      dto.court?.push(option);
    }

    result.court?.map(m=>{
      dto.court?.push(m);
    });
    return dto;
  }

  /** get customerStatus */
  public async customerStatus(): Promise<CustomerStatusDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.CUSTOMER_STATUS) as CustomerStatusDto;
    if (data) {
      return data;
    } else {
      const response = await this.getCustomerStatus();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.CUSTOMER_STATUS, response);
      }
      return response;
    }
  }

  /** get debtTransferTo */
  public async debtTransferTo(): Promise<DebtTransferToDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.DEBT_TRANSFER_TO) as DebtTransferToDto;
    if (data) {
      return data;
    } else {
      const response = await this.getDebtTransferTo();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.DEBT_TRANSFER_TO, response);
      }
      return response;
    }
  }

  /** get debtor */
  public async debtor(): Promise<DebtorDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.DEBTOR) as DebtorDto;
    if (data) {
      return data;
    } else {
      const response = await this.getDebtor();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.DEBTOR, response);
      }
      return response;
    }
  }

  public get districtList(): Array<Dist> | any {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.DISTRICT) as DistrictDto;
    return data?.district;
  }

  /** get district */
  public async district(): Promise<DistrictDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.DISTRICT) as DistrictDto;
    if (data) {
      return data;
    } else {
      const response = await this.getDistrict();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.DISTRICT, response);
      }
      return response;
    }
  }

  /** get doneBy */
  public async doneBy(): Promise<DoneByDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.DONE_BY) as DoneByDto;
    if (data) {
      return data;
    } else {
      const response = await this.getDoneBy();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.DONE_BY, response);
      }
      return response;
    }
  }

  /** get samFlag */
  public async samFlag(): Promise<SamFlagDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.SAM_FLAG) as SamFlagDto;
    if (data) {
      return data;
    } else {
      const response = await this.getSamFlag();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.SAM_FLAG, response);
      }
      return response;
    }
  }

  /** get followUpStatus */
  public async followUpStatus(): Promise<FollowUpStatusDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.FOLLOW_UP_STATUS) as FollowUpStatusDto;
    if (data) {
      return data;
    } else {
      const response = await this.getFollowUpStatus();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.FOLLOW_UP_STATUS, response);
      }
      return response;
    }
  }

  /** get ktbOrg */
  public async ktbOrg(): Promise<KtbOrgDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.KTB_ORG) as KtbOrgDto;
    if (data) {
      return data;
    } else {
      const response = await this.getKtbOrg();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.KTB_ORG, response);
      }
      return response;
    }
  }

  /** get bcOrg (response unit) */
  public async bcOrg(): Promise<KtbOrgDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.BC_ORG) as KtbOrgDto;
    if (data) {
      return data;
    } else {
      const response = await this.getBcOrg();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.BC_ORG, response);
      }
      return response;
    }
  }

  /** get amd */
  public async amdOrg(): Promise<KtbOrgDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.AMD_ORG) as KtbOrgDto;
    if (data) {
      return data;
    } else {
      const response = await this.getAmdOrg();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.AMD_ORG, response);
      }
      return response;
    }
  }

  /** get legalStatus */
  public async legalStatus(): Promise<LegalStatusDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.LEGAL_STATUS) as LegalStatusDto;
    if (data) {
      return data;
    } else {
      const response = await this.getLegalStatus();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.LEGAL_STATUS, response);
      }
      return response;
    }
  }

  public async externalAssetStatus(): Promise<ExternalAssetStatusDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.EXTERNAL_ASSET_STATUS) as ExternalAssetStatusDto;
    if (data) {
      return data;
    } else {
      const response = await this.getExternalAssetStatus();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.EXTERNAL_ASSET_STATUS, response);
      }
      return response;
    }
  }

  /** get loanType */
  public async loanType(): Promise<LoanTypeDto> {
    let loanType = this.dataService.get(LOCAL_STORAGE.MASTER.LOAN_TYPE) as LoanTypeDto;
    if (loanType) {
      return loanType;
    } else {
      const response = await this.getLoanType();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.LOAN_TYPE, response);
      }
      return response;
    }
  }

  public get provinceList(): Prov[] | any {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.PROVICE) as ProvinceDto;
    return data.province;
  }
  /** get province */
  public async province(): Promise<ProvinceDto> {
    let provice = this.dataService.get(LOCAL_STORAGE.MASTER.PROVICE) as ProvinceDto;
    if (provice) {
      return provice;
    } else {
      let proviceResponse = await this.getProvince();
      if (proviceResponse.province) {
        this.dataService.set(LOCAL_STORAGE.MASTER.PROVICE, proviceResponse);
      }

      return proviceResponse;
    }
  }

  /** get scope */
  public async scope(): Promise<ScopeDto> {
    let scope = this.dataService.get(LOCAL_STORAGE.MASTER.SCOPE) as ScopeDto;
    if (scope) {
      return scope;
    } else {
      const response = await this.getScope();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.SCOPE, response);
      }
      return response;
    }
  }

  public get subDistrictList(): Array<Subd> | any {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.SUB_DISTRICT) as SubdistrictDto;
    return data.subdistrict;
  }

  /** get subdistrict */
  public async subdistrict(): Promise<SubdistrictDto> {
    let subdistrict = this.dataService.get(LOCAL_STORAGE.MASTER.SUB_DISTRICT) as SubdistrictDto;
    if (subdistrict) {
      return subdistrict;
    } else {
      const response = await this.getSubdistrict();
      if (response.subdistrict) {
        this.dataService.set(LOCAL_STORAGE.MASTER.SUB_DISTRICT, response);
      }
      return response;
    }
  }

  /** get tamcFlag */
  public async tamcFlag(): Promise<TamcFlagDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.TAMC_FLAG) as TamcFlagDto;
    if (data) {
      return data;
    } else {
      const response = await this.getTamcFlag();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.TAMC_FLAG, response);
      }
      return response;
    }
  }

  /** get taskType */
  public async taskType(): Promise<TaskTypeDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.TASK_TYPE) as TaskTypeDto;
    if (data) {
      return data;
    } else {
      const response = await this.getTaskType();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.TASK_TYPE, response);
      }
      return response;
    }
  }

  /** get taskStatus */
  public async taskStatus(): Promise<TaskStatusDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.TASK_STATUS) as TaskStatusDto;
    if (data) {
      return data;
    } else {
      const response = await this.getTaskStatus();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.TASK_STATUS, response);
      }
      return response;
    }
  }

  /** get writeOffStatus */
  public async writeOffStatus(): Promise<WriteOffStatusDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.WRITE_OFF_STATUS) as WriteOffStatusDto;
    if (data) {
      return data;
    } else {
      const response = await this.getWriteOffStatus();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.WRITE_OFF_STATUS, response);
      }
      return response;
    }
  }

  /** get litigationCloseStatus */
  public async litigationCloseStatus(): Promise<LitigationCloseStatusDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.LITIGATION_CLOSE_STATUS) as LitigationCloseStatusDto;
    if (data) {
      return data;
    } else {
      const response = await this.getLitigationCloseStatus();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.LITIGATION_CLOSE_STATUS, response);
      }
      return response;
    }
  }

  /** get Allegation */
  public async allegation(caseTypeCode: string): Promise<AllegationDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.ALLEGATION) as AllegationDto;
    if (data) {
      return data;
    } else {
      const response = await this.getAllegation(caseTypeCode);
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.ALLEGATION, response);
      }
      return response;
    }
  }

  /** get Title */
  public async title(): Promise<TitleDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.TITLE) as TitleDto;
    if (data) {
      return data;
    } else {
      const response = await this.getTitle();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.TITLE, response);
      }
      return response;
    }
  }

  public async ciosCaseType(): Promise<CiosCaseTypeDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.CIOS_CASE_TYPE) as CiosCaseTypeDto;
    let result;
    if (data) {
      result = data;
    } else {
      result = await this.getCiosCaseType();
      if (result) {
        this.dataService.set(LOCAL_STORAGE.MASTER.CIOS_CASE_TYPE, result);
      }
    }

    let option: CiosCaseType = {code: '',name: 'กรุณาเลือก',};
    let dto = {} as CiosCaseTypeDto;
    dto.ciosCaseTypeList = [] as CiosCaseType[];
    dto.ciosCaseTypeList?.push(option);

    result.ciosCaseTypeList?.map(m=>{
      dto.ciosCaseTypeList?.push(m);
    });
    return dto;
  }

  public async courtVerdictType(): Promise<CourtVerdictTypeDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.COURT_VERDICT_TYPE) as CourtVerdictTypeDto;
    if (data) {
      return data;
    } else {
      const response = await this.getCourtVerdictType();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.COURT_VERDICT_TYPE, response);
      }
      return response;
    }
  }

  public async courtFeeType(): Promise<CourtFeeTypeDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.COURT_FEE_TYPE) as CourtFeeTypeDto;
    if (data) {
      return data;
    } else {
      const response = await this.getCourtFeeType();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.COURT_FEE_TYPE, response);
      }
      return response;
    }
  }

  public async courtVerdict(): Promise<CourtVerdictDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.COURT_VERDICT) as CourtVerdictDto;
    if (data) {
      return data;
    } else {
      const response = await this.getCourtVerdict();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.COURT_VERDICT, response);
      }
      return response;
    }
  }

  public async courtFeeSubType(): Promise<CourtFeeSubTypeDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.COURT_FEE_SUB_TYPE) as CourtFeeSubTypeDto;
    if (data) {
      return data;
    } else {
      const response = await this.getCourtFeeSubType();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.COURT_FEE_SUB_TYPE, response);
      }
      return response;
    }
  }

  public async courtOrder(): Promise<CourtOrderDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.COURT_ORDER) as CourtOrderDto;
    if (data) {
      return data;
    } else {
      const response = await this.getCourtOrder();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.COURT_ORDER, response);
      }
      return response;
    }
  }

  public async suspensExecution(): Promise<SuspensExecutionDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.SUSPENS_EXECUTION) as SuspensExecutionDto;
    if (data) {
      return data;
    } else {
      const response = await this.getSuspensExecution();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.SUSPENS_EXECUTION, response);
      }
      return response;
    }
  }

  public async courtSubVerdict(): Promise<CourtSubVerdictDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.COURT_SUB_VERDICT) as CourtSubVerdictDto;
    if (data) {
      return data;
    } else {
      const response = await this.getCourtSubVerdict();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.COURT_SUB_VERDICT, response);
      }
      return response;
    }
  }

  public async expenseStatus(): Promise<ExpenseStatusDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.EXPENSE_STATUS) as ExpenseStatusDto;
    if (data) {
      return data;
    } else {
      const response = await this.getExpenseStatus();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.EXPENSE_STATUS, response);
      }
      return response;
    }
  }

  public async expenseStepType(): Promise<Array<ExpenseStepType>> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.EXPENSE_STEP_TYPE) as Array<ExpenseStepType>;
    if (data) {
      return data;
    } else {
      const response = await this.getExpenseStepType();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.EXPENSE_STEP_TYPE, response);
      }
      return this.dataService.get(LOCAL_STORAGE.MASTER.EXPENSE_STEP_TYPE) as Array<ExpenseStepType>;
    }
  }

  public async expenseStepSubType(expenseGroup?: Array<number>, stepCode?: string): Promise<Array<ExpenseStepSubType>> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.EXPENSE_STEP_SUB_TYPE) as Array<ExpenseStepSubType>;
    if (data) {
      return data;
    } else {
      const response = await this.getExpenseStepSubType(expenseGroup, stepCode);
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.EXPENSE_STEP_SUB_TYPE, response);
      }
      return this.dataService.get(LOCAL_STORAGE.MASTER.EXPENSE_STEP_SUB_TYPE) as Array<ExpenseStepSubType>;
    }
  }

  public async expenseTypeCode(
    expenseGroup?: Array<number>,
    expenseTypeCode?: string,
    stepCode?: string,
    stepSubCode?: string
  ): Promise<Array<ExpenseRateDto>> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.EXPENSE_TYPE_CODE) as Array<ExpenseRateDto>;
    if (data) {
      return data;
    } else {
      const response = await this.getExpenseTypeCode(expenseGroup, expenseTypeCode, stepCode, stepSubCode);
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.EXPENSE_TYPE_CODE, response);
      }
      return this.dataService.get(LOCAL_STORAGE.MASTER.EXPENSE_TYPE_CODE) as Array<ExpenseRateDto>;
    }
  }

  public async expenseRate(
    expenseGroup?: Array<number>,
    expenseSubTypeCode?: string,
    expenseTypeCode?: string,
    id?: string,
    stepCode?: string,
    stepSubCode?: string
  ): Promise<Array<ExpenseRateDto>> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.EXPENSE_RATE) as Array<ExpenseRateDto>;
    if (data) {
      return data;
    } else {
      const response = await this.getExpenseRate(
        expenseGroup,
        expenseSubTypeCode,
        expenseTypeCode,
        id,
        stepCode,
        stepSubCode
      );
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.EXPENSE_RATE, response);
      }
      return this.dataService.get(LOCAL_STORAGE.MASTER.EXPENSE_RATE) as Array<ExpenseRateDto>;
    }
  }

  /** getExpenseAction */
  public async expenseAction(): Promise<ExpenseActionDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.EXPENSE_ACTION) as ExpenseActionDto;
    if (data) {
      return data;
    } else {
      const response = await this.getExpenseAction();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.EXPENSE_ACTION, response);
      }
      return response;
    }
  }

  /** getExpenseObject */
  public async expenseObject(): Promise<ExpenseObjectDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.EXPENSE_OBJECT) as ExpenseObjectDto;
    if (data) {
      return data;
    } else {
      const response = await this.getExpenseObject();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.EXPENSE_OBJECT, response);
      }
      return response;
    }
  }

  /** getExpenseCancelReason */
  public async expenseCancelReason(): Promise<ExpenseCancelReasonDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.EXPENSE_CANCEL_REASON) as ExpenseCancelReasonDto;
    if (data) {
      return data;
    } else {
      const response = await this.getExpenseCancelReason();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.EXPENSE_CANCEL_REASON, response);
      }
      return response;
    }
  }

  /** getExpenseReviseReason */
  public async expenseReviseReason(): Promise<ExpenseReviseReasonDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.EXPENSE_REVISE_REASON) as ExpenseReviseReasonDto;
    if (data) {
      return data;
    } else {
      const response = await this.getExpenseReviseReason();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.EXPENSE_REVISE_REASON, response);
      }
      return response;
    }
  }

  public async receiveStatus(): Promise<ReceiveStatusDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.RECEIVE_STATUS) as ReceiveStatusDto;
    if (data) {
      return data;
    } else {
      const response = await this.getReceiveStatus();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.RECEIVE_STATUS, response);
      }
      return response;
    }
  }

  public async receiveType(): Promise<ReceiveTypeDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.RECEIVE_TYPE) as ReceiveTypeDto;
    if (data) {
      return data;
    } else {
      const response = await this.getReceiveType();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.RECEIVE_TYPE, response);
      }
      return response;
    }
  }
  public async expenseReceive(): Promise<ExpenseReceiveDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.EXPENSE_RECEIVE) as ExpenseReceiveDto;
    if (data) {
      return data;
    } else {
      const response = await this.getExpenseReceive();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.EXPENSE_RECEIVE, response);
      }
      return response;
    }
  }

  public async kcorpTransferStatus(): Promise<KcorpTransferStatusDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.KCORP_TRANSFER_STATUS) as KcorpTransferStatusDto;
    if (data) {
      return data;
    } else {
      const response = await this.getKcorpTransferStatus();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.KCORP_TRANSFER_STATUS, response);
      }
      return response;
    }
  }

  public async advancePaymentStatus(): Promise<AdvancePaymentStatusDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.ADVANCE_STATUS) as AdvancePaymentStatusDto;
    if (data) {
      return data;
    } else {
      const response = await this.getAdvancePaymentStatus();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.ADVANCE_STATUS, response);
      }
      return response;
    }
  }

  public async receiveAccountCode(): Promise<ReceiveAccountCodeDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.RECEIVE_ACCOUNT_CODE) as ReceiveAccountCodeDto;
    if (data) {
      return data;
    } else {
      const response = await this.getReceiveAccountCode();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.RECEIVE_ACCOUNT_CODE, response);
      }
      return response;
    }
  }

  public async financialAccountType(financialObjectType: string): Promise<FinancialAccountTypeDto> {
    const data = this.dataService.get(
      LOCAL_STORAGE.MASTER.FINANCIAL_ACCOUNT_TYPE + (!!financialObjectType ? `_${financialObjectType}` : '')
    ) as FinancialAccountTypeDto;
    if (data) {
      return data;
    } else {
      const response = await this.getFinancialAccountType(financialObjectType);
      if (response) {
        this.dataService.set(
          LOCAL_STORAGE.MASTER.FINANCIAL_ACCOUNT_TYPE + (!!financialObjectType ? `_${financialObjectType}` : ''),
          response
        );
      }
      return response;
    }
  }

  public async financialObjectType(): Promise<FinancialObjectTypeDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.FINANCIAL_OBJECT_TYPE) as FinancialObjectTypeDto;
    if (data) {
      return data;
    } else {
      const response = await this.getFinancialObjectType();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.FINANCIAL_OBJECT_TYPE, response);
      }
      return response;
    }
  }

  public async courtType(): Promise<CourtTypeDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.COURT_TYPE) as CourtTypeDto;
    if (data) {
      return data;
    } else {
      const response = await this.getCourtType();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.COURT_TYPE, response);
      }
      return response;
    }
  }

  public async caseType(): Promise<CaseTypeDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.CASE_TYPE) as CaseTypeDto;
    if (data) {
      return data;
    } else {
      const response = await this.getCaseType();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.CASE_TYPE, response);
      }
      return response;
    }
  }

  public async financialAccountCode(): Promise<FinancialAccountCodeDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.FINANCIAL_ACCOUNT_CODE) as FinancialAccountCodeDto;
    if (data) {
      return data;
    } else {
      const response = await this.getFinancialAccountCode();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.FINANCIAL_ACCOUNT_CODE, response);
      }
      return response;
    }
  }
  public async receiveCancelReason(): Promise<NameValuePair[]> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.RECEIVE_CANCEL_REASON) as Array<NameValuePair>;
    if (data) {
      return data;
    } else {
      const response = (await this.getReceiveCancelReason()) as ReceiveCancelReasonDto;
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.RECEIVE_CANCEL_REASON, response.receiveCancelReason);
      }
      return response?.receiveCancelReason || [];
    }
  }

  public async approvalAuthorityDla(): Promise<ApprovalAuthorityDlaDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.APPROVAL_AUTHORITY_DLA) as ApprovalAuthorityDlaDto;
    if (data) {
      return data;
    } else {
      const response = await this.getApprovalAuthorityDla();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.APPROVAL_AUTHORITY_DLA, response);
      }
      return response;
    }
  }
  public async rejectOriginalDocumentReason(): Promise<NameValuePair[]> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.REJECT_ORIGINAL_DOCUMENT_REASON) as Array<NameValuePair>;
    if (data) {
      return data;
    } else {
      const response = (await this.getRejectOriginalDocumentReason()) as RejectOriginalDocumentReasonDto;
      if (response) {
        this.dataService.set(
          LOCAL_STORAGE.MASTER.REJECT_ORIGINAL_DOCUMENT_REASON,
          response.rejectOriginalDocumentReason
        );
      }
      return response.rejectOriginalDocumentReason || [];
    }
  }
  public async financialInstitutions(purpose: string): Promise<NameValuePair[]> {
    const localStorageText = LOCAL_STORAGE.MASTER.FINANCIAL_INSTITUTION + '_' + purpose;
    const data = this.dataService.get(localStorageText) as Array<NameValuePair>;
    if (data) {
      return data;
    } else {
      const response: FinancialInstitutionsDto = await this.getFinancialInstitutions(purpose);
      const nameValuePairs: Array<NameValuePair> = (response.financialInstitutions || []).map(({ code, nameThai }) => ({
        value: code,
        name: nameThai,
      }));

      this.dataService.set(localStorageText, nameValuePairs);
      return nameValuePairs || [];
    }
  }

  public async led(): Promise<LedDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.LED) as LedDto;
    let result;
    if (data) {
      result = data;
    } else {
      result = await this.getLed();
      if (result) {
        this.dataService.set(LOCAL_STORAGE.MASTER.LED, result);
      }
    }
    return result;
  }

  public async occupant(): Promise<OccupantDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.OCCUPANT) as OccupantDto;
    if (data) {
      return data;
    } else {
      const response = await this.getOccupant();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.OCCUPANT, response);
      }
      return response;
    }
  }

  public async saleTypeDesc(): Promise<SaleTypeDescDto> {
    const data = this.dataService.get(LOCAL_STORAGE.MASTER.SALE_TYPE_DESC) as SaleTypeDescDto;
    if (data) {
      return data;
    } else {
      const response = await this.getSaleTypeDesc();
      if (response) {
        this.dataService.set(LOCAL_STORAGE.MASTER.SALE_TYPE_DESC, response);
      }
      return response;
    }
  }

  /**
   * API Controllers
   **/

  async getDefermentReson() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getDefermentReson())
    );
  }

  async getApprovalAuthority() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getApprovalAuthority())
    );
  }

  async getApprovalAuthorityByType(defermentType: 'DEFERMENT' | 'CESSATION') {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getApprovalAuthorityByType(defermentType))
    );
  }
  async getCessationReason() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getCessationReason())
    );
  }

  async getCaseCreator() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getCaseCreator())
    );
  }

  async getCollateralStatus() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getCollateralStatus())
    );
  }

  async getCollateralType() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getCollateralType())
    );
  }
  async getCollateralSubType() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getCollateralSubType())
    );
  }
  async getJuristicType() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getJuristicType())
    );
  }

  async getCourt() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getCourt())
    );
  }

  async getCustomerStatus() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getCustomerStatus())
    );
  }

  async getDebtTransferTo() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getDebtTransferTo())
    );
  }

  async getDebtor() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getDebtor())
    );
  }

  async getDistrict() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getDistrict())
    );
  }

  async getDoneBy() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getDoneBy())
    );
  }

  async getSamFlag() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getSamFlag())
    );
  }

  async getFollowUpStatus() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getFollowUpStatus())
    );
  }

  async getKtbOrg() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getKtbOrg())
    );
  }

  async getBcOrg() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getKtbOrgOptions({}, 'BC'))
    );
  }

  async getAmdOrg() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getKtbOrgOptions({}, 'AMD'))
    );
  }

  async getLegalStatus() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getLegalStatus())
    );
  }

  async getExternalAssetStatus() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getExternalAssetStatus())
    );
  }

  async getLoanType() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getLoanType())
    );
  }

  async getProvince() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getProvince())
    );
  }

  async getScope() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getScope())
    );
  }

  async getSubdistrict() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getSubdistrict())
    );
  }

  async getTamcFlag() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getTamcFlag())
    );
  }

  async getTaskType() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getTaskType())
    );
  }

  async getTaskStatus() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getTaskStatus())
    );
  }

  async getWriteOffStatus() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getWriteOffStatus())
    );
  }

  async getLitigationCloseStatus() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getLitigationCloseStatus())
    );
  }

  async getAllegation(caseTypeCode: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getAllegation(caseTypeCode))
    );
  }

  async getTitle() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getTitle())
    );
  }

  private async getCiosCaseType(): Promise<CiosCaseTypeDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getCiosCaseType())
    );
  }

  private async getCourtVerdictType(): Promise<CourtVerdictTypeDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getCourtVerdictType())
    );
  }

  private async getCourtSubVerdict(): Promise<CourtSubVerdictDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getCourtSubVerdict())
    );
  }

  private async getCourtFeeType(): Promise<CourtFeeTypeDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getCourtFeeType())
    );
  }

  private async getCourtVerdict(): Promise<CourtVerdictDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getCourtVerdict())
    );
  }

  private async getCourtFeeSubType(): Promise<CourtFeeSubTypeDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getCourtFeeSubType())
    );
  }

  private async getCourtOrder(): Promise<CourtOrderDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getCourtOrder())
    );
  }

  private async getSuspensExecution(): Promise<SuspensExecutionDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getSuspensExecution())
    );
  }

  async getExpenseStepType(): Promise<ExpenseStepType[]> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getExpenseStepType())
    );
  }

  async getExpenseStepSubType(expenseGroup?: Array<number>, stepCode?: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getExpenseStepSubType(expenseGroup, stepCode))
    );
  }

  async getExpenseRate(
    expenseGroup?: Array<number>,
    expenseSubTypeCode?: string,
    expenseTypeCode?: string,
    id?: string,
    stepCode?: string,
    stepSubCode?: string
  ) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.masterDataControllerService.getExpenseRate(
          expenseGroup,
          expenseSubTypeCode,
          expenseTypeCode,
          id,
          stepCode,
          stepSubCode
        )
      )
    );
  }

  async getExpenseStatus(): Promise<ExpenseStatusDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getExpenseStatus())
    );
  }

  async getExpenseTypeCode(
    expenseGroup?: Array<number>,
    expenseTypeCode?: string,
    stepCode?: string,
    stepSubCode?: string
  ): Promise<Array<ExpenseRateDto>> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.masterDataControllerService.getExpenseTypeCode(expenseGroup, expenseTypeCode, stepCode, stepSubCode)
      )
    );
  }

  async getExpenseAction(): Promise<ExpenseActionDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getExpenseAction())
    );
  }

  async getExpenseObject(): Promise<ExpenseObjectDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getExpenseObject())
    );
  }

  async getExpenseCancelReason() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getExpenseCancelReason())
    );
  }

  async getExpenseReviseReason() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getExpenseReviseReason())
    );
  }

  async getReceiveStatus() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getReceiveStatus())
    );
  }

  async getReceiveType() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getReceiveType())
    );
  }

  async getExpenseReceive() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getExpenseReceive())
    );
  }

  async getKcorpTransferStatus() {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getKcorpTransferStatus())
    );
  }

  async getAdvancePaymentStatus(): Promise<AdvancePaymentStatusDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getAdvancePaymentStatus())
    );
  }
  async getReceiveAccountCode(): Promise<ReceiveAccountCodeDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getReceiveAccountCode())
    );
  }

  async getFinancialAccountType(financialObjectType: string): Promise<FinancialAccountTypeDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getFinancialAccountType(financialObjectType))
    );
  }

  async getFinancialObjectType(): Promise<FinancialObjectTypeDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getFinancialObjectType())
    );
  }

  async getCourtType(): Promise<CourtTypeDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getCourtType())
    );
  }

  async getCaseType(): Promise<CaseTypeDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getCaseType())
    );
  }

  async getFinancialAccountCode(): Promise<FinancialAccountCodeDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getFinancialAccountCode())
    );
  }
  async getReceiveCancelReason(): Promise<ReceiveCancelReasonDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getReceiveCancelReason())
    );
  }

  async getApprovalAuthorityDla(): Promise<ApprovalAuthorityDlaDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getApprovalAuthorityDla())
    );
  }

  async getRejectOriginalDocumentReason(): Promise<RejectOriginalDocumentReasonDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getRejectOriginalDocumentReason())
    );
  }

  async getFinancialInstitutions(purpose: string): Promise<FinancialInstitutionsDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getFinancialInstitutions(purpose))
    );
  }

  async getLed(): Promise<LedDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getLed())
    );
  }

  async getSaleTypeDesc(): Promise<SaleTypeDescDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getSaleTypeDesc())
    );
  }


  async getOccupant(): Promise<OccupantDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.masterDataControllerService.getOccupant())
    );
  }
}
