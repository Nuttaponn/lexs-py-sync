import { AfterViewChecked, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { ILinkTooltip, ITooltip } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { Item, ListNoticeTrackingExcelUploadDto, NoticeTrackingDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { RouterService } from '@shared/services/router.service';
@Component({
  selector: 'app-update-tracking-status',
  templateUrl: './update-tracking-status.component.html',
  styleUrls: ['./update-tracking-status.component.scss'],
})
export class updateTrackingStatusComponent implements OnInit, AfterViewChecked {
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  @ViewChildren(MatTable) table!: QueryList<any>;
  public isOpened = true;
  public isOpenedList: any;
  public noticeLetterColumns: string[] = [
    'seq',
    'noticeTrackingNo',
    'addressType',
    'addressName',
    'noticeDate',
    'noticeDuration',
    'noticeDueDate',
    'trackingStatus',
    'barcode',
  ];
  public downloadBtnClicked: boolean = false;
  public updateNumberClicked: boolean = false;
  public trackingStatus: NoticeTrackingDto[] | undefined;
  public STATUS_CODE_ENUM = NoticeTrackingDto.TrackingStatusCodeEnum;
  constructor(
    private routerService: RouterService,
    public lawsuitService: LawsuitService,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private documentService: DocumentService
  ) {}

  async ngOnInit(): Promise<void> {
    let MatTabNumber: any;
    this.trackingStatus = await this.lawsuitService.inquiryNoticesForTracking();
    MatTabNumber = this.trackingStatus.length;
    this.isOpenedList = new Array(MatTabNumber).fill(true);
    this.passTrackingRequest();
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
      });
    }
  }

  onBack(event: any) {
    this.routerService.back();
  }

  downloadNoticeLetter() {
    let fileName = 'NoticeLetterTracking';
    this.lawsuitService.inquiryNoticesExcelForTracking(fileName);
  }

  getNoticeLetter() {
    this.downloadBtnClicked = !this.downloadBtnClicked;
    this.downloadNoticeLetter();
  }

  async uploadDocument(file: any) {
    let res: ListNoticeTrackingExcelUploadDto = await this.lawsuitService.uploadTracking(file);
    this.lawsuitService.hasEdit = true;
    if (res) {
      this.trackingStatus = this.trackingStatus?.map(data => {
        let list = res.items?.find(item => item.litigationId === data.litigationId && item.noticeNo === data.noticeNo);
        data.barcode = list?.barcode || data.barcode;
        return data;
      });
    } else {
      this.notificationService.openSnackbarSuccess(
        `${this.translateService.instant('SUBMIT_NOTICE_LETTER.UPLOAD_FAIL')}`
      );
    }

    this.passTrackingRequest();
  }

  selectDocument() {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.onchange = () => {
      for (let index = 0; index < fileInput.files.length; index++) {
        const file = this.documentService.validateFileType(fileInput.files[index]);
        this.uploadDocument(file);
      }
    };
    fileInput.click();
  }

  onClickRadioBtn(mode: boolean) {
    this.updateNumberClicked = mode;
    this.lawsuitService.hasEdit = this.updateNumberClicked ? true : false;
  }

  getTrackingStatusToolTip(data: NoticeTrackingDto, deliveryDate: string): Array<ITooltip> {
    switch (data.trackingStatusCode) {
      case this.STATUS_CODE_ENUM.Success:
        return [
          { title: deliveryDate, content: data.thaiPostStatusDescription || '' },
          { content: data.deliveryDescription || '' },
        ];
      case this.STATUS_CODE_ENUM.Failed:
        return [
          { title: deliveryDate, content: data.thaiPostStatusDescription || '' },
          { content: data.deliveryDescription || '' },
        ];
      default:
        return [
          {
            title: this.translateService.instant('COMMON.LABEL_REMARKS'),
            content: this.translateService.instant('TASK.SUBMIT_NOTICE_LETTER.INVALID_TRACKING_NO_MESSAGE') || '',
          },
        ];
    }
  }

  getHyperLinkTooltip(data: NoticeTrackingDto): ILinkTooltip {
    let thaiPostURL: string = 'https://track.thailandpost.co.th/?trackNumber=';
    thaiPostURL = thaiPostURL + data.barcode;

    if (
      data.trackingStatusCode === this.STATUS_CODE_ENUM.Success ||
      data.trackingStatusCode === this.STATUS_CODE_ENUM.Failed
    ) {
      return {
        name: 'ไปที่ไปรษณีย์ไทย',
        url: thaiPostURL,
        icon: 'icon-Expand',
      };
    }
    return {};
  }

  onModelChanged() {
    this.passTrackingRequest();
  }

  passTrackingRequest() {
    let updateItems =
      this.trackingStatus?.map(data => {
        return {
          barcode: data.barcode,
          litigationId: data.litigationId,
          noticeId: data.noticeId,
        } as Item;
      }) || [];

    this.lawsuitService.trackingRequest = { items: updateItems };
  }
  getFilteredTrackingStatus(groupIndex: number, rowFilterIndex: number) {
    return this.trackingStatus?.filter(data => data.group === groupIndex && data.rowFilter === rowFilterIndex) || [];
  }

  getFilteredRowList(groupIndex: number) {
    let groupFilteredList = this.trackingStatus?.filter(data => data.group === groupIndex);
    return groupFilteredList;
  }

  getFilteredGroupList() {
    let uniqueGroup = this.trackingStatus?.map(data => data.group);
    let uniqueGroupList = this.trackingStatus?.filter(({ group }, index) => !uniqueGroup?.includes(group, index + 1));
    return uniqueGroupList;
  }
}
