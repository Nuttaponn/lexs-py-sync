import { Inject, Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { UpdateLitigationNoticeDto } from '@app/shared/components/common-tabs/prepare-lawsuit/notice/UpdateLitigationNoticeDto';
import { BlobType, FileType } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import {
  AccountDto,
  CloseLitigationRequest,
  CollateralInfoRequest,
  CreateAddressRequest,
  CreateNewsRequest,
  DocumentInfoRequest,
  DocumentReceiveRequest,
  DocumentSendRequest,
  ExpenseInfo,
  LexsUserTransferOption,
  LitigationControllerService,
  LitigationDetailDto,
  LitigationFollowupDto,
  LitigationNoticeDto,
  MemoRequest,
  NewsAnnouncementRequest,
  NoticeControllerService,
  NoticeLetterDto,
  NoticeLetterRequest,
  NoticeTrackingDto,
  PersonDto,
  PersonInfoRequest,
  PostalRequest,
  SendReceiveDocumentDto,
  TrackingRequest,
  TransferLitigationRequest,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { SearchConditionRequest } from '@shared/components/search-controller/search-controller.model';
import { ErrorHandlingService } from '@shared/services/error-handling.service';
import { Utils } from '@shared/utils/util';
import { DialogOptions, DialogsService } from '@spig/core';
import { lastValueFrom } from 'rxjs';
import { TaskTransferUserOptions } from '../task/task.interface';

@Injectable({
  providedIn: 'root',
})
export class LawsuitService {
  private _litigation!: LitigationDetailDto;
  private dialogSetting: DialogOptions;
  private _currentTab: number | null = null;

  constructor(
    private translate: TranslateService,
    @Inject(DialogsService) private dialog: DialogsService,
    private errorHandlingService: ErrorHandlingService,
    private litigationControllerService: LitigationControllerService,
    private noticeControllerService: NoticeControllerService,
    private notificationService: NotificationService
  ) {
    this.dialogSetting = {
      type: 'xsmall',
      title: '',
      message: '',
      canDismiss: true,
      dismissTimeout: 0,
      contentCssClasses: [],
      leftButtonClass: '',
      rightButtonClass: '', //  'error'
    };
  }

  get currentLitigation(): LitigationDetailDto {
    return this._litigation;
  }

  set currentLitigation(role: LitigationDetailDto) {
    this._litigation = role;
  }

  get currentTab(): number {
    return this._currentTab || 0;
  }

  set currentTab(currentTab: number) {
    this._currentTab = currentTab;
  }

  private _noticeLetterRequest!: NoticeLetterRequest;
  public get noticeLetterRequest(): NoticeLetterRequest {
    return this._noticeLetterRequest;
  }
  public set noticeLetterRequest(value: NoticeLetterRequest) {
    this._noticeLetterRequest = value;
  }

  private _trackingRequest!: TrackingRequest;
  public get trackingRequest(): TrackingRequest {
    return this._trackingRequest;
  }
  public set trackingRequest(value: TrackingRequest) {
    this._trackingRequest = value;
  }

  private _postalRequest!: PostalRequest;
  public get postalRequest(): PostalRequest {
    return this._postalRequest;
  }
  public set postalRequest(value: PostalRequest) {
    this._postalRequest = value;
  }

  private _createNewsRequest!: CreateNewsRequest;
  public get createNewsRequest(): CreateNewsRequest {
    return this._createNewsRequest;
  }
  public set createNewsRequest(value: CreateNewsRequest) {
    this._createNewsRequest = value;
  }

  private _newsAnnouncementRequest!: NewsAnnouncementRequest;
  public get newsAnnouncementRequest(): NewsAnnouncementRequest {
    return this._newsAnnouncementRequest;
  }
  public set newsAnnouncementRequest(value: NewsAnnouncementRequest) {
    this._newsAnnouncementRequest = value;
  }

  private _updateLitigationNoticeDtoList!: UpdateLitigationNoticeDto[];
  public get updateLitigationNoticeDtoList(): UpdateLitigationNoticeDto[] {
    return this._updateLitigationNoticeDtoList;
  }
  public set updateLitigationNoticeDtoList(value: UpdateLitigationNoticeDto[]) {
    this._updateLitigationNoticeDtoList = value;
  }

  private _currentAccountDetail!: AccountDto | null;
  public get currentAccountDetail(): AccountDto | null {
    return this._currentAccountDetail;
  }
  public set currentAccountDetail(value: AccountDto | null) {
    this._currentAccountDetail = value;
  }

  private _lgCloseForm!: UntypedFormGroup | null;
  public get lgCloseForm(): UntypedFormGroup | null {
    return this._lgCloseForm;
  }
  public set lgCloseForm(value: UntypedFormGroup | null) {
    this._lgCloseForm = value;
  }

  // For tracking have edit some value in screen
  private _hasEdit: boolean = false;
  public get hasEdit(): boolean {
    return this._hasEdit;
  }
  public set hasEdit(value: boolean) {
    this._hasEdit = value;
  }

  // For tracking load data inquiryNotices
  private _litigationNotice: LitigationNoticeDto[] | null = null;
  public get litigationNotice(): LitigationNoticeDto[] | null {
    return this._litigationNotice || null;
  }
  public set litigationNotice(value: LitigationNoticeDto[] | null) {
    this._litigationNotice = value;
  }
  // For check disable button after additional person
  private _hasAdditionalPerson: boolean = false;
  public get hasAdditionalPerson(): boolean {
    return this._hasAdditionalPerson;
  }
  public set hasAdditionalPerson(value: boolean) {
    this._hasAdditionalPerson = value;
  }
  // find black case number from litigation detail
  findBlackCaseTaskDetail(litigationCaseId: number) {
    const cases = this.currentLitigation.cases || [];
    const litigationCase = cases.find(e => e.litigationCaseId === Number(litigationCaseId));
    return litigationCase?.blackCaseNo;
  }

  clearData() {
    this._updateLitigationNoticeDtoList = [];
    this._litigation = {};
    this._currentTab = null;
    this._hasEdit = false;
    this._litigationNotice = null;
    this._currentAccountDetail = null;
    this._hasAdditionalPerson = false;
  }

  getRequestInquiryLawsuits(request: SearchConditionRequest) {
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
      customerStatus: request.customerStatus !== 'N/A' ? request.customerStatus : undefined,
      customerSurname: request.customerSurname || '',
      debtTransferTo: request.debtTransferTo && request.debtTransferTo.length > 0 ? request.debtTransferTo : [],
      debtor: request.debtor !== 'N/A' ? request.debtor : '',
      deferDashboard: request.deferDashboard || '',
      deferExecDashboard: request.deferExecDashboard || '',
      kbdId: request.kbdId || '',
      lawyer: request.lawyer !== 'N/A' ? request.lawyer : undefined,
      legalStatus: request.legalStatus !== 'N/A' ? request.legalStatus : undefined,
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
      sortBy: request.sortBy || ['lawsuitId'],
      sortOrder: request.sortOrder || 'ASC',
      statusDashboard: request.statusDashboard || '',
      tamcFlag: request.tamcFlag !== 'N/A' ? request.tamcFlag : '',
      writeOffStatus: request.writeOffStatus !== 'N/A' ? request.writeOffStatus : '',
    };
  }

  async inquiryLawsuits(request: SearchConditionRequest) {
    const mapRequest = this.getRequestInquiryLawsuits(request);
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.litigationControllerService.inquiryLitigation(
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
          mapRequest.statusDashboard,
          mapRequest.tamcFlag,
          mapRequest.writeOffStatus
        )
      )
    );
  }

  async inquiryLitigationsDownload(request: SearchConditionRequest, filename: string) {
    const mapRequest = this.getRequestInquiryLawsuits(request);
    const response = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.litigationControllerService.inquiryLitigationDownload(
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
          // mapRequest.page,
          mapRequest.redCaseId,
          mapRequest.responseUnit,
          mapRequest.roomNo,
          mapRequest.samFlag,
          mapRequest.searchScope,
          mapRequest.searchString,
          // mapRequest.size,
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

  async confirmRemoveRelatedPersonDialog(title?: string, msg?: string, rightBtnLabel?: string, rightBtnIcon?: string) {
    const opts: DialogOptions = {
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      leftButtonClass: 'long-button',
      buttonIconName: rightBtnIcon || 'icon-Bin',
      rightButtonLabel: rightBtnLabel || 'COMMON.BUTTON_CONFIRM',
      rightButtonClass: 'mat-warn long-button',
    };
    return await this.openCenterAlignedDialog(title, msg, opts);
  }

  async confirmCreateNoticeDialog(title?: string, msg?: string, rightBtnLabel?: string, rightBtnIcon?: string) {
    const opts: DialogOptions = {
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      leftButtonClass: 'long-button',
      buttonIconName: rightBtnIcon || 'icon-Email',
      rightButtonLabel: rightBtnLabel || 'COMMON.BUTTON_CONFIRM',
      rightButtonClass: 'long-button',
    };
    return await this.openCenterAlignedDialog(title, msg, opts);
  }

  async createNoticeManual(litigationId: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.noticeControllerService.newNotice(litigationId))
    );
  }

  private async openCenterAlignedDialog(title?: any, msg?: any, options?: DialogOptions) {
    // First clone default setting
    const mergedOpts = { ...this.dialogSetting };
    mergedOpts.type = 'center';
    mergedOpts.title = title;
    mergedOpts.message = msg;
    options = Object.assign(mergedOpts, options);
    return await this.dialog.openDialog(options);
  }

  async getLitigation(id: string, taskId?: number) {
    this._litigation = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationControllerService.getLitigation(id, taskId))
    );

    return this.currentLitigation;
  }

  async updateAdditionalPersons(litigationId: string, dataObj: PersonInfoRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationControllerService.updateAdditionalPersons(litigationId, dataObj))
    );
  }

  async updateAssets(litigationId: string, request: CollateralInfoRequest): Promise<any> {
    await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationControllerService.updateAssets(litigationId, request))
    );
    // Set flag to be PENDING after successfully called API for update assets
    this._litigation.editStatus = LitigationDetailDto.EditStatusEnum.Pending;
    return true;
  }

  async transferLitigation(request: TransferLitigationRequest): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationControllerService.transferLitigation(request))
    );
  }

  async receiveDocuments(litigationId: string, request: DocumentReceiveRequest): Promise<SendReceiveDocumentDto> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.litigationControllerService.receiveDocuments(litigationId, request)),
      { notShowAsSnackBar: true }
    );
  }
  async documentExcel(litigationId: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationControllerService.documentExcel(litigationId))
    );
  }
  async sendDocuments(litigationId: string, request: DocumentSendRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationControllerService.sendDocuments(litigationId, request))
    );
  }
  async approve(taskId: number) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.litigationControllerService.approve(taskId)),
      {
        showDialogForSpecificCodes: ['L017', 'L018', 'L019'],
        notShowAsSnackBar: true,
      }
    );
  }

  async reject(taskId: number, reason: string) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.litigationControllerService.reject(taskId, { reason })),
      {
        showDialogForSpecificCodes: ['L017', 'L018', 'L019'],
        notShowAsSnackBar: true,
      }
    );
  }

  async inquiryDocumentAuditLog(litigationId: string, documentTemplateId?: string, page?: number, size?: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.litigationControllerService.inquiryDocumentAuditLog(litigationId, documentTemplateId, page, size)
      )
    );
  }

  async inquiryNotices(litigationId: string, taskId?: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.noticeControllerService.listLitigationNotice(litigationId, taskId))
    );
  }

  async inquiryNoticesForTracking(): Promise<NoticeTrackingDto[]> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.noticeControllerService.getNoticeLetters())
    );
  }

  async inquiryNoticesExcelForTracking(filename: string) {
    const response = await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.noticeControllerService.getNoticeLettersExcel()),
      {
        snackBarMessage: this.translate.instant('TASK.SUBMIT_NOTICE_LETTER.DOWNLOAD_FAIL'),
      }
    );
    Utils.saveAsStrToBlobFile(response, filename || 'excel' + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
  }

  async uploadTracking(file: Blob) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.noticeControllerService.uploadTracking(file)),
      {
        snackBarMessage: this.translate.instant('TASK.SUBMIT_NOTICE_LETTER.UPLOAD_FAIL'),
      }
    );
  }

  async updateNoticeLetter(litigationId: string, noticeRequest: NoticeLetterRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.noticeControllerService.updateNoticeLetter(litigationId, noticeRequest))
    );
  }

  async updateTracking(request: TrackingRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.noticeControllerService.updateTracking(request))
    );
  }

  async updatePostal(litigationId: string, postalRequest: PostalRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.noticeControllerService.updatePostal(litigationId, postalRequest))
    );
  }

  async createNews(newsRequest: CreateNewsRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.noticeControllerService.createNews(newsRequest))
    );
  }

  async updateNewsAnnouncement(litigationId: string, newsAnnouncementRequest: NewsAnnouncementRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.noticeControllerService.updateNewsAnnouncement(litigationId, newsAnnouncementRequest))
    );
  }

  async downloadNoticeLetter(noticeId: number) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.noticeControllerService.downloadNoticeLetter(noticeId)),
      {
        snackBarMessage: 'ไม่สามารถดาวน์โหลดหนังสือบอกกล่าวได้ในขณะนี้ โปรดลองใหม่อีกครั้งในภายหลัง',
      }
    );
  }

  async createAddress(litigationId: string, createAddressRequest: CreateAddressRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.noticeControllerService.createAddress(litigationId, createAddressRequest))
    );
  }

  checkConditionUpdateNoticeLetter(updateList: UpdateLitigationNoticeDto[]) {
    const temp = updateList.filter(dto => dto.actionFlag === true); // support defect LEXS-6669
    // ถ้ามีค่าแปลว่าผิด
    const filteredList = temp?.filter(dto => dto.noticeStatus !== NoticeLetterDto.NoticeStatusEnum.SuccessNotice);
    return filteredList?.length === 0;
  }

  checkConditionUpdateNoticeConfirmLetter(updateList: UpdateLitigationNoticeDto[]) {
    // ถ้ามีค่าแปลว่าผิด
    const filteredList = updateList?.filter(dto => dto.actionFlag !== true || !!dto.noticeImageId);
    return filteredList?.length === 0;
  }

  async listAvailableSubAccounts(litigationId: string): Promise<AccountDto[]> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationControllerService.listAvailableSubAccounts(litigationId))
    );
  }

  async updateSubAccounts(litigationId: string, body: any) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationControllerService.updateSubAccounts(litigationId, body))
    );
  }

  async transferTaskUserOption(request?: TaskTransferUserOptions): Promise<LexsUserTransferOption[]> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.litigationControllerService.transferTaskUserOption(request?.category, request?.keywords, request?.roleCode)
      )
    );
  }

  async updateFollowup(request: LitigationFollowupDto): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationControllerService.updateFollowUp(request.litigationId!, request))
    );
  }

  async closeLitigation(request: CloseLitigationRequest): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.litigationControllerService.closeLitigation(request)),
      {
        showDialogForSpecificCodes: ['L017', 'L018', 'L019'],
        notShowAsSnackBar: true,
      }
    );
  }

  async inquiryLitigationMemos(litigationId: string, searchText: string) {
    if (!!litigationId) {
      return await this.errorHandlingService.invokeNoRetry(() =>
        lastValueFrom(this.litigationControllerService.getMemoLitigation(litigationId, searchText ?? ''))
      );
    }
    return;
  }

  async addLitigationMemo(litigationId: string, memoRequest: MemoRequest): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationControllerService.memoSave(litigationId, memoRequest))
    );
  }

  async updateLitigationMemo(litigationId: string, memoId: string, memoRequest: MemoRequest): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationControllerService.memoUpdate(litigationId, memoId, memoRequest))
    );
  }

  async removeLitigationMemo(litigationId: string, memoId: string, memoRequest: MemoRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationControllerService.memoDelete(litigationId, memoId, memoRequest))
    );
  }

  async getExpenseInfo(litigationId: string): Promise<ExpenseInfo> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationControllerService.getExpenseInfo(litigationId))
    );
  }

  async downloadReturnOriginalCover(litigationId: string) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.litigationControllerService.downloadReturnOriginalCover(litigationId)),
      { notShowAsSnackBar: true }
    );
  }

  async updateDocuments(customerId: string, docInfoReq: DocumentInfoRequest) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.litigationControllerService.updateDocuments(customerId, docInfoReq)),
      { notShowAsSnackBar: true }
    );
  }
  async downloadKtbLogisticDoc(litigationId: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationControllerService.downloadKtbLogisticDoc(litigationId))
    );
  }

  validateNoticeNoHeir() {
    //ตรวจสอบกรณีจำเลย ตาย หรือ ล้มละลาย จะไม่ยอมให้บันทึก
    const noticeList: LitigationNoticeDto[] = this.litigationNotice || [];
    const noticePersonDeathList: LitigationNoticeDto[] = noticeList.filter(
      obj =>
        obj.personStatus == PersonDto.PersonStatusEnum.Death || obj.personStatus == PersonDto.PersonStatusEnum.Close
    );
    const additionalPersonsList: PersonDto[] = this.currentLitigation?.personInfo?.additionalPersons || [];
    for (const personDto of additionalPersonsList) {
      const personObj = noticePersonDeathList.find(obj => obj.personId === personDto.personId);
      if (!personObj) {
        this.notificationService.alertDialog(
          'LAWSUIT.NOTICE.TITLE_NO_HEIR',
          'LAWSUIT.NOTICE.CONTENT_NO_HEIR',
          'COMMON.BUTTON_BACK',
          'icon-Refresh'
        );
        return;
      }
    }
  }
}
