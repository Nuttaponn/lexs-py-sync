import { Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { ILinkTooltip, ITooltip, LexsUserPermissionCodes, taskCode } from '@app/shared/models';
import { SessionService } from '@app/shared/services/session.service';
import { LitigationNoticeDto, MeLexsUserDto, NoticeLetterDto, PersonDto, TaskDetailDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { UpdateLitigationNoticeDto } from '../UpdateLitigationNoticeDto';
import { LETTER_TRACKING_STATUS_TEXTS } from '../notice.const';

@Pipe({
  name: 'linkTooltipThaiPost',
})
export class LinkTooltipThaiPostPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}
  transform(barcode: string): ILinkTooltip {
    return {
      name: this.translateService.instant('LAWSUIT.NOTICE.LINK_TO_THAILAND_POST'),
      url: `https://track.thailandpost.co.th/?trackNumber=${barcode}`,
      icon: 'icon-Expand',
    };
  }
}

@Component({
  selector: 'app-letter',
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.scss'],
})
export class LetterComponent implements OnInit {
  isOpened1 = true;

  public TASK_CODE = taskCode;
  public NOTICE_STATUS = NoticeLetterDto.NoticeStatusEnum;

  public RELATION_ENUM = LitigationNoticeDto.RelationEnum;
  public ADDRESS_TYPE_ENUM = LitigationNoticeDto.AddressTypeEnum;
  public LETTER_TRACKING_STATUS_TEXTS = LETTER_TRACKING_STATUS_TEXTS;

  public taskDetail: TaskDetailDto = {};
  public taskCode!: taskCode;
  private currentUser?: MeLexsUserDto;

  displayedColumns: string[] = [
    'no',
    'noticeNo',
    'addressType',
    'addressDetail',
    'noticeDate',
    'noticeDuration',
    'noticeDueDate',
    'cmdV1',
  ];

  displayedViewColumns: string[] = [
    'no',
    'noticeNo',
    'addressType',
    'addressDetail',
    'noticeDate',
    'noticeDuration',
    'noticeDueDate',
    'trackingStatusName',
    'barcode',
    'btn',
  ];

  @Input() taskId!: number;

  @Input()
  dataSource: UpdateLitigationNoticeDto[] = [];

  @Output()
  confirmBankrupt = new EventEmitter<LitigationNoticeDto>();

  @Output()
  cancelBankrupt = new EventEmitter<LitigationNoticeDto>();

  @Output()
  clickDownloadLetter = new EventEmitter<LitigationNoticeDto>();

  @Output()
  clickDeleteLetter = new EventEmitter<LitigationNoticeDto>();

  @Output()
  clickAddLetter = new EventEmitter<LitigationNoticeDto>();

  @Output()
  clickUploadLetter = new EventEmitter<LitigationNoticeDto>();

  @Output()
  clickUploadConfirmLetter = new EventEmitter<LitigationNoticeDto>();

  @Output()
  clickDownloadDoc = new EventEmitter<LitigationNoticeDto>();

  @Output()
  clickDownloadConfirmLetterDoc = new EventEmitter<LitigationNoticeDto>();

  @Output()
  clickDownloadSession = new EventEmitter<LitigationNoticeDto>();

  @Output()
  clickNoticeTracking = new EventEmitter<LitigationNoticeDto>();

  @Input()
  isDisabledDownloadBtn = false;

  constructor(
    private translate: TranslateService,
    private lawsuitService: LawsuitService,
    private taskService: TaskService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.sessionService.currentUser;
    this.taskDetail = this.taskService.taskDetail;

    this.taskCode = (this.taskDetail?.taskCode as taskCode) || '';
  }

  get isDataContainsReceivership(): boolean {
    /* ปุ่ม ผู้กู้หลักล้มละลาย : Action ตาม section ปุ่มผู้กู้หลักล้มละลาย ข้างล่าง
    • Display banner for ‘MAIN_BORROWER’ if no item with addressType =
    ‘RECEIVERSHIP’ (สนง.พิทักษ์ทรัพย์) in list of LitigationNoticeDto for that person */
    return this.dataSource?.findIndex(dto => dto.addressType === this.ADDRESS_TYPE_ENUM.Receivership) !== -1;
  }

  get isShowCancelBankruptBanner(): boolean {
    if (this.currentUser?.subRoleCode === 'VIEWER') {
      return true;
    }

    return !(this.currentUser?.permissions?.includes(LexsUserPermissionCodes.LAWSUIT_CREATE_NOTICE) || false);
  }

  get isNotAddNoticeBook(): boolean {
    if (this.currentUser?.subRoleCode === 'VIEWER') {
      return true;
    }

    return !(this.currentUser?.permissions?.includes(LexsUserPermissionCodes.LAWSUIT_CREATE_NOTICE) || false);
  }

  get hasRelationList() {
    return this.dataSource[0] && this.dataSource[0].relationList && this.dataSource[0].relationList.length > 0
      ? true
      : false;
  }

  onClickUploadConfirmLetter(element: LitigationNoticeDto) {
    this.clickUploadConfirmLetter.emit(element);
  }

  onAddLetter() {
    this.clickAddLetter.emit(this.dataSource[0]);
  }

  async onClickDeleteLetter(element: LitigationNoticeDto) {
    const result = await this.lawsuitService.confirmRemoveRelatedPersonDialog(
      this.translate.instant('LAWSUIT.NOTICE.LETTER_DEL_TITLE'),
      this.translate.instant('LAWSUIT.NOTICE.LETTER_DEL_CONTENT'),
      this.translate.instant('LAWSUIT.NOTICE.LETTER_DEL_CORFIRM')
    );

    if (result) {
      this.clickDeleteLetter.emit(element);
    }
  }

  onClickDownloadLetter(element: LitigationNoticeDto) {
    this.clickDownloadLetter.emit(element);
  }

  onClickUploadLetter(element: LitigationNoticeDto) {
    this.clickUploadLetter.emit(element);
  }

  onClickDownloadDoc(element: LitigationNoticeDto) {
    this.clickDownloadDoc.emit(element);
  }

  onClickDownloadConfirmLetterDoc(element: LitigationNoticeDto) {
    this.clickDownloadConfirmLetterDoc.emit(element);
  }

  getLetterTooltipViewText(buddhistDate: string, element: LitigationNoticeDto) {
    let content = '';
    switch (element.trackingStatusName) {
      case LETTER_TRACKING_STATUS_TEXTS.success: // ‘จัดส่งแล้ว’
        content = this.translate.instant('LAWSUIT.NOTICE.LETTER_TOOLTIP_PAID');
        break;
      case LETTER_TRACKING_STATUS_TEXTS.failed: //‘จัดส่งไม่สำเร็จ’
        content = `${element?.deliveryDescription ?? '-'}`;
        break;
      case LETTER_TRACKING_STATUS_TEXTS.invalidBarcode: //‘หมายเลขติดตามไม่ถูกต้อง’
        content = this.translate.instant('LAWSUIT.NOTICE.LETTER_TOOLTIP_INVALIDE_BARCODE');
        break;
    }

    const tdrInfo: Array<ITooltip> = [{ title: buddhistDate, content }];
    return tdrInfo;
  }

  getHyperlink(barcode: string): ILinkTooltip {
    return {
      name: this.translate.instant('LAWSUIT.NOTICE.LINK_TO_THAILAND_POST'),
      url: `https://track.thailandpost.co.th/?trackNumber=${barcode}`,
      icon: 'icon-Expand',
    };
  }

  async callMainBorrowerBankrupt(element: LitigationNoticeDto) {
    const result = await this.lawsuitService.confirmRemoveRelatedPersonDialog(
      this.translate.instant('LAWSUIT.NOTICE.DIALOG_BORROWER_BANKRUPT_TITLE'),
      `${element?.personName} ${this.translate.instant('LAWSUIT.NOTICE.DIALOG_BORROWER_BANKRUPT_SUB_CONTENT')}`,
      this.translate.instant('LAWSUIT.NOTICE.DIALOG_BORROWER_BANKRUPT_CONFIRM'),
      '-'
    );

    if (result) {
      this.confirmBankrupt.emit(element);
    }
  }

  async onClickCancelBankrupt(element: LitigationNoticeDto) {
    const result = await this.lawsuitService.confirmRemoveRelatedPersonDialog(
      this.translate.instant('LAWSUIT.NOTICE.DIALOG_BORROWER_BANKRUPT_CANCEL_TITLE'),
      `${element?.personName} ${this.translate.instant('LAWSUIT.NOTICE.DIALOG_BORROWER_BANKRUPT_CANCEL_SUB_CONTENT')}`,
      this.translate.instant('LAWSUIT.NOTICE.DIALOG_BORROWER_BANKRUPT_CANCEL_CONFIRM'),
      '-'
    );

    if (!result) return;

    const req =
      element.addressType !== this.ADDRESS_TYPE_ENUM.Receivership
        ? this.dataSource.find(dto => dto.addressType === this.ADDRESS_TYPE_ENUM.Receivership)
        : element;

    this.cancelBankrupt.emit(req);
  }

  onClickRefresh(element: LitigationNoticeDto) {
    this.clickNoticeTracking.emit(element);
  }

  get showBannerNoHeir(): boolean {
    return (
      this.dataSource.length == 1 &&
      (this.dataSource[0].personStatus == PersonDto.PersonStatusEnum.Close ||
        this.dataSource[0].personStatus == PersonDto.PersonStatusEnum.Death) &&
      this.dataSource[0].referencePersonId == undefined
    );
  }
}
