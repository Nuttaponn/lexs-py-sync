import { Injectable } from '@angular/core';
import {
  ExpenseSearchConditionRequest,
  SearchConditionRequest,
} from '@app/shared/components/search-controller/search-controller.model';
import { BlobType, FileType, LexsUserPermissionCodes } from '@app/shared/models';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { Utils } from '@app/shared/utils/util';
import {
  AccountDocumentStatusDashboard,
  CollateralLexsStatusDashboard,
  ConveyanceControllerService,
  CustomerControllerService,
  CustomerDashboard,
  CustomerDocumentDashboard,
  ExpenseControllerService,
  ExpenseDashboard,
  LitigationControllerService,
  LitigationDefermentDashboard,
  LitigationDefermentExecDashboard,
  LitigationStatusDashboard,
  MeLexsUserDto,
  WorkbenchControllerService,
} from '@lexs/lexs-client';
import { lastValueFrom } from 'rxjs';
import { CustomerService } from '../customer/customer.service';
import { ExpenseService } from '../finance/services/expense.service';
import { LawsuitService } from '../lawsuit/lawsuit.service';

export interface DashboardPermissions {
  document: boolean;
  litigationStatus: boolean;
  defermentStatus: boolean;
  defermentExecutionStatus: boolean;
  accountStatus: boolean;
  collateralStatus: boolean;
  finance: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private litigationControllerService: LitigationControllerService,
    private workbenchControllerService: WorkbenchControllerService,
    private conveyanceControllerService: ConveyanceControllerService,
    private expenseControllerService: ExpenseControllerService,
    private customerControllerService: CustomerControllerService,
    private errorHandlingService: ErrorHandlingService,
    private lawsuitService: LawsuitService,
    private customerService: CustomerService,
    private expenseService: ExpenseService
  ) {}

  customerDashboard!: CustomerDashboard;
  defermentDashboard!: LitigationDefermentDashboard;
  defermentExecDashboard!: LitigationDefermentExecDashboard;
  litigationStatusDashboard!: LitigationStatusDashboard;
  financeDashboard!: ExpenseDashboard;
  accountStatusDashboard!: AccountDocumentStatusDashboard;
  collateralStatusDashboard!: CollateralLexsStatusDashboard;

  customerCount: { [key: string]: number } = {};
  litigationStatusCount: { [key: string]: number } = {};
  defermentCount: { [key: string]: number } = {};
  defermentExecCount: { [key: string]: number } = {};
  financeCount: { [key: string]: number } = {};
  accountStatusCount: { [key: string]: number } = {};
  collateralStatusCount: { [key: string]: number } = {};

  lexsDpd: number = 60;
  litigationDpd: number = 90;

  initDefermentChartData(data: LitigationDefermentDashboard) {
    return {
      NONE_DEFER: [data.noneDeferment || 0, 0, 0],
      DEFER_PROSECUTION_APPROVED: [data.noneNotice || 0, data.noneNotice || 0, 0],
      DEFER_ALREADY_NOTICE: [data.alreadyNotice || 0, 0, data.alreadyNotice || 0],
    };
  }

  initDefermentExecutionChartData(data: LitigationDefermentExecDashboard) {
    return {
      NONE_DEFER_EXEC: [data.noneDefermentExec || 0, 0, 0, 0, 0],
      DEFER_EXEC_WRIT_OF: [data.deferExecWritOfExec || 0, data.deferExecWritOfExec || 0, 0, 0, 0],
      DEFER_EXEC_SEIZURE: [data.deferExecSeizure, 0, data.deferExecSeizure || 0, 0, 0],
      DEFER_EXEC_AUCTION: [data.deferExecAuction, 0, 0, data.deferExecAuction || 0, 0],
      DEFER_EXEC_OTHER: [data.deferExecOther, 0, 0, 0, data.deferExecOther || 0],
    };
  }

  initLitigationStatusChartData(data: LitigationStatusDashboard) {
    return [
      data.approveLitigation || 0, // อนุมัติดำเนินคดี
      data.noticeLitigation || 0, // บอกกล่าว
      data.litigationInProgress || 0, // อยู่ระหว่างพิจารณาคดี
      data.adjudicationLitigation || 0, // มีคำพิพากษา
      data.writOfExecution || 0, // ออกหมายบังคับคดี
      data.seizured || 0, // ยึดทรัพย์
      data.auction || 0, // ขายทอดตลาด
      data.deferLitigation || 0, // ชะลอดำเนินคดี
      data.deferExecution || 0, // ชะลอบังคับคดี
      data.assetInvestigation || 0, // สืบทรัพย์
    ];
  }

  initCustomerDashboardData(data: CustomerDocumentDashboard) {
    return {
      NORMAL: [data?.total || 0, 0, 0, data?.finishedDocumentCustomer || 0],
      IN_SLA: [
        0,
        data?.pendingNoticeDocumentCustomerNotOverDue || 0,
        data?.pendingLitigationDocumentCustomerNotOverDue || 0,
        0,
      ],
      OUT_OF_SLA: [
        0,
        data?.pendingNoticeDocumentCustomerOverDue || 0,
        data?.pendingLitigationDocumentCustomerOverDue || 0,
        0,
      ],
    };
  }

  initFinanceDashboardData(data: ExpenseDashboard) {
    return {
      NON_AUTO: [data?.pendingVerification || 0, data?.pendingApproval || 0, data?.pendingReceiptUpload || 0],
      AUTO: [
        data?.pendingVerificationKlawAuto || 0,
        data?.pendingReceiptUploadAuto || 0,
        data?.pendingVerificationAuto || 0,
      ],
    };
  }

  initAccountStatusDashboardData(data: AccountDocumentStatusDashboard) {
    return [data.followUp || 0, data.approval || 0, data.debtSettlement || 0];
  }

  initCollateralStatusDashboardData(data: CollateralLexsStatusDashboard) {
    return [data.pledge || 0, data.seizured || 0, data.onSale || 0, data.pendingSale || 0, data.sold || 0];
  }

  initCustomerDocumentCount() {
    this.customerCount = {
      allPendingNoticeDocuments:
        (this.customerDashboard?.customerLexsDocumentDashboard?.pendingNoticeDocumentCustomerOverDue || 0) +
        (this.customerDashboard?.customerLexsDocumentDashboard?.pendingNoticeDocumentCustomerNotOverDue || 0) +
        (this.customerDashboard?.customerLitigationDocumentDashboard?.pendingNoticeDocumentCustomerOverDue || 0) +
        (this.customerDashboard?.customerLitigationDocumentDashboard?.pendingNoticeDocumentCustomerNotOverDue || 0),

      allPendingLitigationDocuments:
        (this.customerDashboard?.customerLexsDocumentDashboard?.pendingLitigationDocumentCustomerOverDue || 0) +
        (this.customerDashboard?.customerLexsDocumentDashboard?.pendingLitigationDocumentCustomerNotOverDue || 0) +
        (this.customerDashboard?.customerLitigationDocumentDashboard?.pendingLitigationDocumentCustomerOverDue || 0) +
        (this.customerDashboard?.customerLitigationDocumentDashboard?.pendingLitigationDocumentCustomerNotOverDue || 0),

      allFinishedDocuments:
        (this.customerDashboard?.customerLexsDocumentDashboard?.finishedDocumentCustomer || 0) +
        (this.customerDashboard?.customerLitigationDocumentDashboard?.finishedDocumentCustomer || 0),

      lexsPendingNoticeDocuments:
        (this.customerDashboard?.customerLexsDocumentDashboard?.pendingNoticeDocumentCustomerNotOverDue || 0) +
        (this.customerDashboard?.customerLexsDocumentDashboard?.pendingNoticeDocumentCustomerOverDue || 0),

      lexsPendingLitigationDocuments:
        (this.customerDashboard?.customerLexsDocumentDashboard?.pendingLitigationDocumentCustomerNotOverDue || 0) +
        (this.customerDashboard?.customerLexsDocumentDashboard?.pendingLitigationDocumentCustomerOverDue || 0),

      lexsFinishedDocuments: this.customerDashboard?.customerLexsDocumentDashboard?.finishedDocumentCustomer || 0,

      litigationPendingNoticeDocuments:
        (this.customerDashboard?.customerLitigationDocumentDashboard?.pendingNoticeDocumentCustomerNotOverDue || 0) +
        (this.customerDashboard?.customerLitigationDocumentDashboard?.pendingNoticeDocumentCustomerOverDue || 0),

      litigationPendingLitigationDocuments:
        (this.customerDashboard?.customerLitigationDocumentDashboard?.pendingLitigationDocumentCustomerNotOverDue ||
          0) +
        (this.customerDashboard?.customerLitigationDocumentDashboard?.pendingLitigationDocumentCustomerOverDue || 0),

      litigationFinishedDocuments:
        this.customerDashboard?.customerLitigationDocumentDashboard?.finishedDocumentCustomer || 0,
    };
  }

  initDefermentStatusCount() {
    this.defermentCount = {
      litigation: this.defermentDashboard?.noneNotice || 0,
      notice: this.defermentDashboard?.alreadyNotice || 0,
    };
  }

  initDefermentExecStatusCount() {
    this.defermentExecCount = {
      deferExecWritOfExec: this.defermentExecDashboard.deferExecWritOfExec || 0,
      deferExecSeizure: this.defermentExecDashboard.deferExecSeizure || 0,
      deferExecAuction: this.defermentExecDashboard.deferExecAuction || 0,
      deferExecOther: this.defermentExecDashboard.deferExecOther || 0,
    };
  }

  initLitigationStatusCount() {
    this.litigationStatusCount = {
      adjudicationLitigation: this.litigationStatusDashboard?.adjudicationLitigation || 0,
      approveLitigation: this.litigationStatusDashboard?.approveLitigation || 0,
      deferLitigation: this.litigationStatusDashboard?.deferLitigation || 0,
      litigationInProgress: this.litigationStatusDashboard?.litigationInProgress || 0,
      noticeLitigation: this.litigationStatusDashboard?.noticeLitigation || 0,
      writOfExecution: this.litigationStatusDashboard?.writOfExecution || 0,
      seizured: this.litigationStatusDashboard?.seizured || 0,
      auction: this.litigationStatusDashboard?.auction || 0,
      deferExecution: this.litigationStatusDashboard?.deferExecution || 0,
      assetInvestigation: this.litigationStatusDashboard?.assetInvestigation || 0,
    };
  }

  initFinanceCount() {
    this.financeCount = {
      pendingVerification:
        (this.financeDashboard?.pendingVerification || 0) + (this.financeDashboard?.pendingVerificationKlawAuto || 0),
      pendingApproval: this.financeDashboard?.pendingApproval || 0,
      pendingReceiptUpload:
        (this.financeDashboard?.pendingReceiptUpload || 0) + (this.financeDashboard?.pendingReceiptUploadAuto || 0),
      pendingReceiptVerification: this.financeDashboard?.pendingVerificationAuto || 0,
    };
  }

  initAccountStatusCount() {
    this.accountStatusCount = {
      followUp: this.accountStatusDashboard?.followUp || 0,
      approval: this.accountStatusDashboard?.approval || 0,
      debtSettlement: this.accountStatusDashboard?.debtSettlement || 0,
    };
  }

  initCollateralStatusCount() {
    this.collateralStatusCount = {
      pledge: this.collateralStatusDashboard?.pledge || 0,
      seizured: this.collateralStatusDashboard?.seizured || 0,
      onSale: this.collateralStatusDashboard?.onSale || 0,
      pendingSale: this.collateralStatusDashboard?.pendingSale || 0,
      sold: this.collateralStatusDashboard?.sold || 0,
    };
  }

  getDashboardAccessPermissions(user: MeLexsUserDto): DashboardPermissions {
    return {
      document: user.permissions?.includes(LexsUserPermissionCodes.DASHBOARD_CUSTOMERS_DPD_DOC_STATUS) ? true : false,
      litigationStatus: user.permissions?.includes(LexsUserPermissionCodes.DASHBOARD_CUSTOMERS_LIGITATION_STATUS)
        ? true
        : false,
      defermentStatus: user.permissions?.includes(LexsUserPermissionCodes.DASHBOARD_HOLDING_LITIGATION_CASE)
        ? true
        : false,
      finance: user.permissions?.includes(LexsUserPermissionCodes.DASHBOARD_KLAW_FINANCIAL) ? true : false,
      defermentExecutionStatus: user.permissions?.includes(LexsUserPermissionCodes.VIEW_DEFERMENT_EXECUTION)
        ? true
        : false,
      accountStatus: user.permissions?.includes(LexsUserPermissionCodes.VIEW_ACCOUNT_DOCUMENT_STATUS) ? true : false,
      collateralStatus: user.permissions?.includes(LexsUserPermissionCodes.VIEW_COLLATERAL_LEXS_STATUS) ? true : false,
    };
  }

  checkEmpty(response: Object) {
    const values = Object.values(response);
    return values.every(v => v === 0);
  }

  async getCustomerDocumentDashboardInfo() {
    const res = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.workbenchControllerService.getCustomerDocumentDashboardInfo())
    );
    this.customerDashboard = res;
    return res;
  }

  async getLitigationStatusDashboardInfo() {
    const res = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.workbenchControllerService.getLitigationStatusDashboardInfo())
    );
    this.litigationStatusDashboard = res;
    return res;
  }

  async getLitigationDefermentDashboardInfo() {
    const res = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.workbenchControllerService.getLitigationDefermentDashboardInfo())
    );
    this.defermentDashboard = res;
    return res;
  }

  async getLitigationDefermentExecDashboardInfo() {
    const res = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.workbenchControllerService.getLitigationDefermentExecDashboardInfo())
    );
    this.defermentExecDashboard = res;
    return res;
  }

  async getExpenseDashboardInfo() {
    const res = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.workbenchControllerService.getExpenseDashboardInfo())
    );
    this.financeDashboard = res;
    return res;
  }

  async getAccountDocumentStatusDashboardInfo() {
    const res = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.workbenchControllerService.getAccountDocumentStatusDashboardInfo())
    );
    this.accountStatusDashboard = res;
    return res;
  }

  async getCollateralLexsStatusDashboardInfo() {
    const res = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.workbenchControllerService.getCollateralLexsStatusDashboardInfo())
    );
    this.collateralStatusDashboard = res;
    return res;
  }

  async inquiryCustomerDashboard(_request: SearchConditionRequest) {
    const mapRequest = this.customerService.getRequestInquiryCustomers(_request);
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.customerControllerService.getCustomerDocumentDashboard(
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
          mapRequest.litigationId,
          mapRequest.litigationCloseStatus,
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

  async inquiryCollateralLexsStatus(_request: SearchConditionRequest) {
    const mapRequest = this.getRequestInquiryAccountsAndCollaterals(_request);
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.litigationControllerService.inquiryCollateralLexsStatus(
          mapRequest.searchMode,
          mapRequest.tab,
          mapRequest.accountNo,
          mapRequest.amdUnit,
          mapRequest.billNo,
          mapRequest.blackCaseId,
          mapRequest.caseCreator,
          mapRequest.caseStatus,
          mapRequest.citizenId,
          mapRequest.collateralLexsStatusDashboard,
          mapRequest.collateralSubTypeCode,
          mapRequest.collateralTypeCode,
          mapRequest.court,
          mapRequest.customerId,
          mapRequest.customerName,
          mapRequest.customerStatus,
          mapRequest.customerSurname,
          mapRequest.debtTransferTo,
          mapRequest.debtor,
          mapRequest.kbdId,
          mapRequest.legalStatus,
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

  async inquiryAccountDocumentStatus(_request: SearchConditionRequest) {
    const mapRequest = this.getRequestInquiryAccountsAndCollaterals(_request);
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.conveyanceControllerService.inquiryAccountDocumentStatus(
          mapRequest.searchMode,
          mapRequest.tab,
          mapRequest.accountDocumentStatusDashboard,
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
          mapRequest.debtTransferTo,
          mapRequest.debtor,
          mapRequest.kbdId,
          mapRequest.ledId,
          mapRequest.legalStatus,
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

  async inquiryCustomerDashboardDownload(_request: SearchConditionRequest, filename: string) {
    const mapRequest = this.customerService.getRequestInquiryCustomers(_request);
    const res = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.customerControllerService.getCustomerDocumentDashboardDownload(
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
          mapRequest.litigationId,
          mapRequest.litigationCloseStatus,
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
    Utils.saveAsStrToBlobFile(res, filename || 'excel' + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
  }

  async inquiryExpenseDashboardDownload(_request: ExpenseSearchConditionRequest, filename: string) {
    const mapRequest = this.expenseService.getRequestInquiryExpense(_request);
    const response = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.expenseControllerService.inquiryExpenseDashboardDownload(
          mapRequest.assigneeId,
          mapRequest.createdBy,
          mapRequest.expenseDashboard,
          mapRequest.expenseNo,
          mapRequest.expenseStatus,
          mapRequest.litigationStatus,
          mapRequest.page,
          mapRequest.searchString,
          mapRequest.size,
          mapRequest.sortBy,
          mapRequest.sortOrder,
          mapRequest.tab
        )
      )
    );
    Utils.saveAsStrToBlobFile(response, filename || 'excel' + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
  }

  async litigationDefermentDownloadExcel(_request: SearchConditionRequest, filename: string) {
    const mapRequest = this.lawsuitService.getRequestInquiryLawsuits(_request);
    const response = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.litigationControllerService.litigationDefermentDownloadExcel(
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
          mapRequest.debtTransferTo,
          mapRequest.debtor,
          mapRequest.deferDashboard,
          mapRequest.deferExecDashboard,
          mapRequest.kbdId,
          mapRequest.lawyer,
          mapRequest.legalStatus,
          mapRequest.litigationCloseStatus,
          mapRequest.litigationId,
          mapRequest.loanType,
          mapRequest.orgCode,
          mapRequest.ownerId,
          mapRequest.redCaseId,
          mapRequest.responseUnit,
          mapRequest.roomNo,
          mapRequest.samFlag,
          mapRequest.searchScope,
          mapRequest.searchString,
          mapRequest.sortBy,
          mapRequest.sortOrder,
          mapRequest.statusDashboard,
          mapRequest.tamcFlag,
          mapRequest.writeOffStatus
        )
      )
    );
    Utils.saveAsStrToBlobFile(response, filename || 'excel' + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
  }

  async litigationStatusDownloadExcel(_request: SearchConditionRequest, filename: string) {
    const mapRequest = this.lawsuitService.getRequestInquiryLawsuits(_request);
    const response = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.litigationControllerService.litigationStatusDownloadExcel(
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
          mapRequest.debtTransferTo,
          mapRequest.debtor,
          mapRequest.deferDashboard,
          mapRequest.deferExecDashboard,
          mapRequest.kbdId,
          mapRequest.lawyer,
          mapRequest.legalStatus,
          mapRequest.litigationCloseStatus,
          mapRequest.litigationId,
          mapRequest.loanType,
          mapRequest.orgCode,
          mapRequest.ownerId,
          mapRequest.redCaseId,
          mapRequest.responseUnit,
          mapRequest.roomNo,
          mapRequest.samFlag,
          mapRequest.searchScope,
          mapRequest.searchString,
          mapRequest.sortBy,
          mapRequest.sortOrder,
          mapRequest.statusDashboard,
          mapRequest.tamcFlag,
          mapRequest.writeOffStatus
        )
      )
    );
    Utils.saveAsStrToBlobFile(response, filename || 'excel' + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
  }

  async downloadAccountDocumentStatus(_request: SearchConditionRequest, filename: string) {
    const mapRequest = this.getRequestInquiryAccountsAndCollaterals(_request);
    const response = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.conveyanceControllerService.downloadAccountDocumentStatus(
          mapRequest.searchMode,
          mapRequest.tab,
          mapRequest.accountDocumentStatusDashboard,
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
          mapRequest.debtTransferTo,
          mapRequest.debtor,
          mapRequest.kbdId,
          mapRequest.ledId,
          mapRequest.legalStatus,
          mapRequest.litigationCloseStatus,
          mapRequest.litigationId,
          mapRequest.loanType,
          mapRequest.orgCode,
          mapRequest.ownerId,
          mapRequest.redCaseId,
          mapRequest.responseUnit,
          mapRequest.roomNo,
          mapRequest.samFlag,
          mapRequest.searchScope,
          mapRequest.searchString,
          mapRequest.sortBy,
          mapRequest.sortOrder,
          mapRequest.tamcFlag,
          mapRequest.writeOffStatus
        )
      )
    );
    Utils.saveAsStrToBlobFile(response, filename || 'excel' + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
  }

  async downloadCollateralLexsStatus(_request: SearchConditionRequest, filename: string) {
    const mapRequest = this.getRequestInquiryAccountsAndCollaterals(_request);
    const response = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.litigationControllerService.downloadCollateralLexsStatus(
          mapRequest.searchMode,
          mapRequest.tab,
          mapRequest.accountNo,
          mapRequest.amdUnit,
          mapRequest.billNo,
          mapRequest.blackCaseId,
          mapRequest.caseCreator,
          mapRequest.caseStatus,
          mapRequest.citizenId,
          mapRequest.collateralLexsStatusDashboard,
          mapRequest.collateralSubTypeCode,
          mapRequest.collateralTypeCode,
          mapRequest.court,
          mapRequest.customerId,
          mapRequest.customerName,
          mapRequest.customerStatus,
          mapRequest.customerSurname,
          mapRequest.debtTransferTo,
          mapRequest.debtor,
          mapRequest.kbdId,
          mapRequest.legalStatus,
          mapRequest.litigationCloseStatus,
          mapRequest.litigationId,
          mapRequest.loanType,
          mapRequest.orgCode,
          mapRequest.ownerId,
          mapRequest.redCaseId,
          mapRequest.responseUnit,
          mapRequest.roomNo,
          mapRequest.samFlag,
          mapRequest.searchScope,
          mapRequest.searchString,
          mapRequest.sortBy,
          mapRequest.sortOrder,
          mapRequest.tamcFlag,
          mapRequest.writeOffStatus
        )
      )
    );
    Utils.saveAsStrToBlobFile(response, filename || 'excel' + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
  }

  getRequestInquiryAccountsAndCollaterals(request: SearchConditionRequest) {
    return {
      searchMode: request.searchMode || 'BASIC',
      tab: request.tab || 'USER',
      accountDocumentStatusDashboard: request.accountDocumentStatusDashboard || '',
      accountNo: request.accountNo || '',
      amdUnit: request.amdUnit !== 'N/A' ? request.amdUnit : '',
      billNo: request.billNo || '',
      amountOfLitigation: request.amountOfLitigation || '',
      blackCaseId: request.blackCaseId || '',
      caseCreator: request.caseCreator !== 'N/A' && request.caseCreator !== 'ALL' ? request.caseCreator : '',
      caseStatus: request.caseStatus !== 'N/A' ? request.caseStatus : '',
      citizenId: request.citizenId || '',
      collateralLexsStatusDashboard: request.collateralLexsStatusDashboard || '',
      collateralSubTypeCode: request.collateralSubTypeCode !== 'N/A' ? request.collateralSubTypeCode : '',
      collateralTypeCode: request.collateralTypeCode !== 'N/A' ? request.collateralTypeCode : '',
      court: request.court !== 'N/A' ? request.court : undefined,
      customerId: request.customerId || '',
      customerName: request.customerName || '',
      customerStatus: request.customerStatus !== 'N/A' ? request.customerStatus : undefined,
      customerSurname: request.customerSurname || '',
      debtTransferTo: request.debtTransferTo,
      debtor: request.debtor !== 'N/A' ? request.debtor : '',
      kbdId: request.kbdId || '',
      ledId: request.ledId || '',
      legalStatus: request.legalStatus !== 'N/A' ? request.legalStatus : '',
      litigationId: request.litigationId || '',
      litigationCloseStatus: request.litigationCloseStatus || '',
      loanType: request.loanType,
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
}
