import { Injectable } from '@angular/core';
import { BlobType, FileType, taskCode } from '@app/shared/models';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { Utils } from '@app/shared/utils/util';
import {
  CustomerDetailDto,
  LexsUserTransferOption,
  LitigationDetailDto,
  PageOfTaskDto,
  Task,
  TaskControllerService,
  TaskDetailDto,
  TaskTransferRequest,
  TaskUserRequest,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { SearchConditionRequest } from '@shared/components/search-controller/search-controller.model';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  [x: string]: any;

  constructor(
    private translate: TranslateService,
    private taskControllerService: TaskControllerService,
    private errorHandlingService: ErrorHandlingService
  ) {}

  // object for litigation detail
  private _litigationDetail!: LitigationDetailDto;
  public get litigationDetail(): LitigationDetailDto {
    return this._litigationDetail;
  }
  public set litigationDetail(value: LitigationDetailDto) {
    this._litigationDetail = value;
  }

  // object for customer detail
  private _customerDetail!: CustomerDetailDto;
  public get customerDetail(): CustomerDetailDto {
    return this._customerDetail;
  }
  public set customerDetail(value: CustomerDetailDto) {
    this._customerDetail = value;
  }

  // object for customer detail
  private _taskDetail!: TaskDetailDto;
  public get taskDetail(): TaskDetailDto {
    return this._taskDetail;
  }
  public set taskDetail(value: TaskDetailDto) {
    this._taskDetail = value;
  }

  private _taskOwner!: string;
  public get taskOwner(): string {
    return this._taskOwner;
  }
  public set taskOwner(value: string) {
    this._taskOwner = value;
  }

  private _currentTab: number | null = null;
  get currentTab(): number | null {
    return this._currentTab;
  }
  set currentTab(currentTab: number | null) {
    this._currentTab = currentTab;
  }

  private _currentSubTab: number | null = null;
  get currentSubTab(): number | null {
    return this._currentSubTab;
  }
  set currentSubTab(currentSubTab: number | null) {
    this._currentSubTab = currentSubTab;
  }

  private _transferUserOption!: LexsUserTransferOption[];
  public get transferUserOption(): LexsUserTransferOption[] {
    return this._transferUserOption;
  }
  public set transferUserOption(val: LexsUserTransferOption[]) {
    this._transferUserOption = val;
  }

  public isNotClearCurrentTab: boolean = false; // work-around task-detail: canDeactivate exception

  // task pool
  public taskPoolCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  editableData() {
    const _currentTab = this.currentTab || 0;
    const _taskCode: taskCode = this.taskDetail.taskCode as taskCode;
    switch (_taskCode) {
      case 'EDIT_MORTGAGE_ASSETS':
      case 'VERIFY_INFO_AND_DOCUMENT':
        return _currentTab !== 3 ? false : true;
      case 'RECORD_NOTICE':
      case 'RECORD_NOTICE_GUARANTOR':
      case 'CONFIRM_NOTICE_LETTER':
      case 'NEWSPAPER_ANNOUCEMENT':
      case 'RECEIPT_ORIGINAL_DOCUMENT':
      case 'SUBMIT_ORIGINAL_DOCUMENT':
        return _currentTab !== 4 ? false : true;
      case 'INDICTMENT_RECORD':
      case 'UPLOAD_COURT_FEES_RECEIPT':
        return _currentTab !== 5 ? false : true;
      default:
        return true;
    }
  }

  clearData() {
    this.litigationDetail = {};
    this.customerDetail = {};
    this.taskDetail = {};
    this.taskOwner = '';
    if (!this.isNotClearCurrentTab) {
      this._currentTab = null;
    }
  }

  getRequestInquiryTasks(request: SearchConditionRequest) {
    return {
      searchMode: request.searchMode || 'LIST',
      tab: request.tab || 'USER',
      accountNo: request.accountNo || '',
      amdUnit: request.amdUnit !== 'N/A' ? request.amdUnit : '',
      billNo: request.billNo || '',
      blackCaseId: request.blackCaseId || '',
      caseCreator: request.caseCreator !== 'N/A' && request.caseCreator !== 'ALL' ? request.caseCreator : '',
      caseStatus: request.caseStatus !== 'N/A' ? request.caseStatus : '',
      citizenId: request.citizenId || '',
      court: request.court !== 'N/A' ? request.court : undefined,
      customerId: request.customerId || '',
      customerName: request.customerName || '',
      customerSurname: request.customerSurname || '',
      debtTransferTo: request.debtTransferTo,
      debtor: request.debtor !== 'N/A' ? request.debtor : '',
      kbdId: request.kbdId || '',
      litigationCloseStatus: request.litigationCloseStatus || '',
      litigationId: request.litigationId || '',
      loanType: request.loanType,
      orgCode: request.orgCode !== 'N/A' ? request.orgCode : '',
      ownerId: request.ownerId || '',
      page: request.page || 0,
      redCaseId: request.redCaseId || '',
      responseUnit: request.responseUnit !== 'N/A' ? request.responseUnit : '',
      roomNo: request.roomNo || '',
      samFlag: request.samFlag !== 'N/A' ? request.samFlag : '',
      searchScope: request.searchScope !== 'N/A' ? request.searchScope : '',
      searchString: request.searchString || '',
      size: request.size || 10,
      sortBy: request.sortBy || ['customerId'],
      sortOrder: request.sortOrder || 'ASC',
      taskStatus: request.taskStatus !== 'N/A' ? request.taskStatus?.split('|')[0] : '', // for status
      tamcFlag: request.tamcFlag !== 'N/A' ? request.tamcFlag : '',
      taskType: request.taskType !== 'N/A' ? request.taskType : '', // for type
      writeOffStatus: request.writeOffStatus !== 'N/A' ? request.writeOffStatus : '',
    };
  }

  inquiryTasks(request: SearchConditionRequest): Promise<PageOfTaskDto> {
    const mapRequest = this.getRequestInquiryTasks(request);
    return this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.taskControllerService.inquiryTasks(
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
          mapRequest.customerSurname,
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
          mapRequest.taskStatus, // for status
          mapRequest.tamcFlag,
          mapRequest.taskType, // for type
          mapRequest.writeOffStatus
        )
      )
    );
  }

  async inquiryTasksDownload(request: SearchConditionRequest, filename: string): Promise<void> {
    const mapRequest = this.getRequestInquiryTasks(request);
    const response = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.taskControllerService.inquiryTasksDownload(
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
          mapRequest.customerSurname,
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
          mapRequest.taskStatus, // for status
          mapRequest.tamcFlag,
          mapRequest.taskType, // for type
          mapRequest.writeOffStatus
        )
      )
    );
    Utils.saveAsStrToBlobFile(response, filename || 'งานทั้งหมด' + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
  }

  async transferTasks(request: TaskTransferRequest): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.taskControllerService.transferTask(request)),
      { snackBarMessage: this.translate.instant('TASK.TRANSFER_SNACKBAR_FAIL') }
    );
  }

  async transferExpenseTask(request: TaskTransferRequest): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.taskControllerService.transferExpenseTask(request)),
      { snackBarMessage: this.translate.instant('TASK.TRANSFER_SNACKBAR_FAIL') }
    );
  }

  async transferTaskUserOption(request: TaskUserRequest): Promise<Array<LexsUserTransferOption>> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.taskControllerService.transferTaskUserOption(request)),
      { notShowAsSnackBar: true }
    );
  }

  async inquiryTaskDetails(taskId: number): Promise<TaskDetailDto> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.taskControllerService.inquiryTaskDetails(taskId)),
      { notShowAsSnackBar: true }
    );
  }

  async unHoldPageSession(taskId: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.taskControllerService.unHoldPageSession(taskId))
    );
  }

  async inquiryUnassignedTask(request: SearchConditionRequest): Promise<PageOfTaskDto> {
    const mapRequest = this.getRequestInquiryTasks(request);
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.taskControllerService.inquiryUnassignedTask(
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
          mapRequest.customerSurname,
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
          mapRequest.taskStatus, // for status
          mapRequest.tamcFlag,
          mapRequest.taskType, // for type
          mapRequest.writeOffStatus
        )
      )
    );
  }

  async countUnassignedTasks(): Promise<number> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.taskControllerService.countUnassignedTask()),
      { disableErrorDisplay: true }
    );
  }

  async selfAssignTask(taskId: number): Promise<Task> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.taskControllerService.selfAssignTask(taskId)),
      { notShowAsSnackBar: true }
    );
  }
}
