import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LitigationNoticeDto, NoticeLetterDto } from '@lexs/lexs-client';
import { UpdateLitigationNoticeDto } from '../UpdateLitigationNoticeDto';
import { NEWSPAPER_TRACKING_STATUS_TEXTS } from '../notice.const';
@Component({
  selector: 'app-newspaper',
  templateUrl: './newspaper.component.html',
  styleUrls: ['./newspaper.component.scss'],
})
export class NewspaperComponent {
  isOpened1 = true;

  public NOTICE_STATUS = NoticeLetterDto.NoticeStatusEnum;
  public ADDRESS_TYPE_ENUM = LitigationNoticeDto.AddressTypeEnum;

  displayedColumns: string[] = [
    'no',
    'noticeNo',
    'noticeDate',
    'firstNoticeDate',
    'lastNoticeDate',
    'noticeDueDate',
    'trackingStatusName',
    'btnCol',
  ];

  @Input()
  dataSource: UpdateLitigationNoticeDto[] = [];

  @Output()
  clickDownloadNews = new EventEmitter<LitigationNoticeDto>();

  @Output()
  clickUploadNews = new EventEmitter<LitigationNoticeDto>();

  @Output()
  clickDownloadDocNews = new EventEmitter<LitigationNoticeDto>();

  NEWSPAPER_TRACKING_STATUS_TEXTS = NEWSPAPER_TRACKING_STATUS_TEXTS;

  get hasRelationList() {
    return this.dataSource[0] && this.dataSource[0].relationList && this.dataSource[0].relationList.length > 0
      ? true
      : false;
  }

  constructor() {}

  onClickDownloadNews(element: LitigationNoticeDto) {
    this.clickDownloadNews.emit(element);
  }

  onClickDownloadDocNews(element: LitigationNoticeDto) {
    this.clickDownloadDocNews.emit(element);
  }

  onClickUploadNews(element: LitigationNoticeDto) {
    this.clickUploadNews.emit(element);
  }
}
