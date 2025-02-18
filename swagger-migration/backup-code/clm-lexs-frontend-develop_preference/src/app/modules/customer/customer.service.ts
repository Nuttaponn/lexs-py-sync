import { Injectable } from '@angular/core';
import { BlobType, FileType } from '@app/shared/models';
import {
  AccountDto,
  CustomerControllerService,
  CustomerDetailDto,
  DocumentInfoRequest,
  PageOfCustomerDto,
  Person,
  PersonAddressRequest,
} from '@lexs/lexs-client';
import { SearchConditionRequest } from '@shared/components/search-controller/search-controller.model';
import { ErrorHandlingService } from '@shared/services/error-handling.service';
import { Utils } from '@shared/utils/util';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(
    private customerControllerService: CustomerControllerService,
    private errorHandlingService: ErrorHandlingService
  ) {}

  // object for customer detail
  private _customerDetail!: CustomerDetailDto;
  public get customerDetail(): CustomerDetailDto {
    return this._customerDetail;
  }
  public set customerDetail(value: CustomerDetailDto) {
    this._customerDetail = value;
  }

  private _currentAccountDetail!: AccountDto | null;
  public get currentAccountDetail(): AccountDto | null {
    return this._currentAccountDetail;
  }
  public set currentAccountDetail(value: AccountDto | null) {
    this._currentAccountDetail = value;
  }

  private _currentTab: number | null = null;
  get currentTab(): number | null {
    return this._currentTab;
  }

  set currentTab(currentTab: number | null) {
    this._currentTab = currentTab;
  }

  public isNotClearCurrentTab: boolean = false; // work-around customer-detail: canDeactivate exception

  public tempCustomerId!: string | undefined; // ใช้เก็บค่า customerId ก่อนไปหน้าอื่น **มีการเคลียที่ customer-resolver เสมอ

  clearData() {
    if (!this.isNotClearCurrentTab) {
      this._currentTab = null;
    }
  }

  getRequestInquiryCustomers(request: SearchConditionRequest) {
    return {
      searchMode: request.searchMode || 'LIST',
      tab: request.tab || 'USER',
      accountNo: request.accountNo || '',
      amdUnit: request.amdUnit !== 'N/A' ? request.amdUnit : '',
      billNo: request.billNo || '',
      amountOfLitigation: request.amountOfLitigation || '',
      blackCaseId: request.blackCaseId || '',
      caseCreator: request.caseCreator !== 'N/A' && request.caseCreator !== 'ALL' ? request.caseCreator : '',
      caseStatus: request.caseStatus !== 'N/A' ? request.caseStatus : '',
      citizenId: request.citizenId || '',
      court: request.court !== 'N/A' ? request.court : undefined,
      customerId: request.customerId || '',
      customerName: request.customerName || '',
      customerStatus: request.customerStatus !== 'N/A' ? request.customerStatus : undefined,
      customerSurname: request.customerSurname || '',
      dashboard: request.dashboard || '',
      debtTransferTo: request.debtTransferTo && request.debtTransferTo?.length > 0 ? request.debtTransferTo : [],
      debtor: request.debtor !== 'N/A' ? request.debtor : '',
      kbdId: request.kbdId || '',
      litigationId: request.litigationId || '',
      litigationCloseStatus: request.litigationCloseStatus || '',
      loanType:
        request.loanType && request.loanType?.length > 0
          ? Utils.getValueArrayObject(request.loanType || [], 'value')
          : [],
      orgCode: request.orgCode !== 'N/A' ? request.orgCode : '',
      ownerId: request.ownerId || '',
      page: request.page,
      redCaseId: request.redCaseId || '',
      responseUnit: request.responseUnit !== 'N/A' ? request.responseUnit : '',
      roomNo: request.roomNo || '',
      samFlag: request.samFlag !== 'N/A' ? request.samFlag : '',
      searchScope: request.searchScope !== 'N/A' ? request.searchScope : '',
      searchString: request.searchString || '',
      size: request.size || 10,
      sortBy: request.sortBy || ['customerId'],
      sortOrder: request.sortOrder || 'ASC',
      tamcFlag: request.tamcFlag !== 'N/A' ? request.tamcFlag : '',
      writeOffStatus: request.writeOffStatus !== 'N/A' ? request.writeOffStatus : '',
    };
  }

  async inquiryCustomersDownload(request: SearchConditionRequest, filename: string) {
    const mapRequest = this.getRequestInquiryCustomers(request);
    const response = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.customerControllerService.inquiryCustomersDownload(
          mapRequest.searchMode,
          mapRequest.tab,
          mapRequest.accountNo,
          mapRequest.amdUnit,
          mapRequest.billNo,
          mapRequest.blackCaseId,
          mapRequest.caseCreator,
          mapRequest.caseStatus,
          mapRequest.citizenId,
          mapRequest.court,
          mapRequest.customerId,
          mapRequest.customerName,
          mapRequest.customerStatus,
          mapRequest.customerSurname,
          mapRequest.dashboard,
          mapRequest.debtTransferTo,
          mapRequest.debtor,
          mapRequest.kbdId,
          mapRequest.litigationCloseStatus,
          mapRequest.litigationId,
          mapRequest.loanType,
          mapRequest.orgCode,
          mapRequest.ownerId,
          mapRequest.page,
          mapRequest.redCaseId,
          mapRequest.responseUnit,
          mapRequest.roomNo,
          mapRequest.samFlag,
          mapRequest.searchScope,
          mapRequest.searchString,
          mapRequest.size,
          mapRequest.sortBy,
          mapRequest.sortOrder,
          mapRequest.tamcFlag,
          mapRequest.writeOffStatus
        )
      )
    );
    Utils.saveAsStrToBlobFile(response, filename || 'excel' + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
  }

  async inquiryCustomers(request: SearchConditionRequest): Promise<PageOfCustomerDto> {
    const mapRequest = this.getRequestInquiryCustomers(request);
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.customerControllerService.inquiryCustomers(
          mapRequest.searchMode,
          mapRequest.tab,
          mapRequest.accountNo,
          mapRequest.amdUnit,
          mapRequest.billNo,
          mapRequest.blackCaseId,
          mapRequest.caseCreator,
          mapRequest.caseStatus,
          mapRequest.citizenId,
          mapRequest.court,
          mapRequest.customerId,
          mapRequest.customerName,
          mapRequest.customerStatus,
          mapRequest.customerSurname,
          mapRequest.dashboard,
          mapRequest.debtTransferTo,
          mapRequest.debtor,
          mapRequest.kbdId,
          mapRequest.litigationCloseStatus,
          mapRequest.litigationId,
          mapRequest.loanType,
          mapRequest.orgCode,
          mapRequest.ownerId,
          mapRequest.page,
          mapRequest.redCaseId,
          mapRequest.responseUnit,
          mapRequest.roomNo,
          mapRequest.samFlag,
          mapRequest.searchScope,
          mapRequest.searchString,
          mapRequest.size,
          mapRequest.sortBy,
          mapRequest.sortOrder,
          mapRequest.tamcFlag,
          mapRequest.writeOffStatus
        )
      )
    );
  }

  async getCustomer(customerId: string): Promise<CustomerDetailDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.customerControllerService.getCustomer(customerId))
    );
  }

  async processOnRequest(customerId: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.customerControllerService.processOnRequest(customerId))
    );
  }

  async inquiryDocumentAuditLog(customerId: string, documentTemplateId?: string, page?: number, size?: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.customerControllerService.inquiryDocumentAuditLog(customerId, documentTemplateId, page, size))
    );
  }
  async updateDocuments(customerId: string, docInfoReq: DocumentInfoRequest) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.customerControllerService.updateDocuments(customerId, docInfoReq)),
      { notShowAsSnackBar: true }
    );
  }

  async updateDeathStatus(customerId: string, person: Person) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.customerControllerService.updateDeathStatus(customerId, person)),
      { notShowAsSnackBar: true }
    );
  }

  async updateAddress(customerId: string, personAddressRequest: PersonAddressRequest) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.customerControllerService.updateAddress(customerId, personAddressRequest)),
      { notShowAsSnackBar: true }
    );
  }
}
