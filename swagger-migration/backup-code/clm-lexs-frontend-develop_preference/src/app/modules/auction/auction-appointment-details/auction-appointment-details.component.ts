import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '@app/modules/task/services/task.service';
import { DOC_TEMPLATE } from '@app/shared/constant';
import { CommonDocumentConfig, maxFileSize, taskCode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { RouterService } from '@app/shared/services/router.service';
import { AuctionService } from '../auction.service';
import { AuctionConveyanceAppointmentInfoResponseExtend } from '../auction.const';
import { AuctionMenu } from '../auction.model';
import { BuddhistEraPipe } from '@spig/core';

@Component({
  selector: 'app-auction-appointment-details',
  templateUrl: './auction-appointment-details.component.html',
  styleUrls: ['./auction-appointment-details.component.scss'],
})
export class AuctionAppointmentDetailsComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  @Input() isViewMode = false;

  public isOpened = false;
  public isOpened1 = false;
  public DOC_TEMPLATE = DOC_TEMPLATE;
  public businessDay: number = 5;
  public _column = ['documentName', 'uploadDate'];
  public onDownLoadForm = new EventEmitter();
  public maxFileSize: number = maxFileSize; // MB Size
  public mainList: any = [];

  public displayAsset: Array<any> = ['id', 'documentName', 'collateralDate'];
  public displayReport: Array<any> = ['id', 'documentName', 'collateralNo', 'collateralId', 'collateralDate'];
  public displayDeed: Array<any> = [
    'id',
    'documentName',
    'collateralNo',
    'collateralId',
    'storeOrganization',
    'collateralDate',
  ];
  public displayCalendar: Array<any> = ['id', 'date', 'time', 'store', 'branch', 'owner'];

  public docAssetConfig: CommonDocumentConfig = {
    title: 'เอกสารประกอบชุดทรัพย์',
    isMain: true,
    canShowIcon: false,
    showDropdown: false,
    selectText: 'เลือกส่งทั้งหมด',
    msgNotFound: 'ไม่มีเอกสารประกอบชุดทรัพย์ที่เกี่ยวข้อง',
    customIcon: 'icon-Doc-circle',
    classIcon: 'icon icon-xmedium default-cursor icon-hide-show',
    forGeneral: true,
    ready: false,
    forAsset: false,
    viewImage: true,
    classTitle: 'text-gray-700',
  };
  public reportConfig: CommonDocumentConfig = {
    title: 'รายงานตรวจสภาพและประเมินราคา',
    isMain: true,
    canShowIcon: false,
    showDropdown: true,
    selectText: 'เลือกส่งทั้งหมด',
    msgNotFound: 'ไม่มีเอกสารรายงานตรวจสภาพและประเมินราคาที่เกี่ยวข้อง',
    customIcon: 'icon-Doc-circle',
    classIcon: 'icon icon-xmedium default-cursor icon-hide-show',
    classInput: 'input-xsm input-normal',
    forGeneral: true,
    ready: true,
    forAsset: false,
    viewImage: true,
    dropdownOptions: [
      {
        text: 'รายการ 1',
        value: 1,
      },
    ],
    classTitle: 'text-gray-700',
  };
  public deedConfig: CommonDocumentConfig = {
    title: 'เอกสารสิทธิ์',
    isMain: true,
    canShowIcon: false,
    showDropdown: true,
    selectText: 'เลือกส่งทั้งหมด',
    msgNotFound: 'ไม่มีเอกสารสิทธิ์ที่เกี่ยวข้อง',
    customIcon: 'icon-Doc-circle',
    classIcon: 'icon icon-xmedium default-cursor icon-hide-show',
    classInput: 'input-xsm input-normal',
    forGeneral: true,
    ready: false,
    forAsset: false,
    viewImage: true,
    dropdownOptions: [
      {
        text: 'รายการ 1',
        value: 1,
      },
    ],
    classTitle: 'text-gray-700',
  };
  public documentList: any = [];
  public documentAsset: any = [];
  public appraisalDocuments: any = [];
  public documentDeed: any = [];
  public taskCode!: taskCode;
  public auctionMenu!: AuctionMenu;
  constructor(
    private logger: LoggerService,
    private routerService: RouterService,
    public auctionService: AuctionService,
    private taskService: TaskService,
    private buddhistEraPipe: BuddhistEraPipe
  ) {}

  ngOnInit(): void {
    this.logger.info('AuctionProcessingDocumentComponent -> ngOnInit');
    this.prepareMasAppointment();
    this.initDate();
    this.prepareDocument();
  }

  initDate() {
    this.auctionMenu = this.auctionService?.auctionMenu as AuctionMenu;
    this.isOpened =
      this.taskService.taskDetail.taskCode === taskCode.R2E09_11_01 ||
      this.auctionMenu === AuctionMenu.VIEW_OWNERSHIP_TRNASFER_DATE_TIME;
    this.isOpened1 = this.isOpened;
  }

  prepareMasAppointment() {
    const appointmentInfo = this.auctionService.appointmentInfo.sort(
      (a: any, b: any) => a.appointmentRound - b.appointmentRound
    );
    for (let index = 0; index < appointmentInfo?.length; index++) {
      const ap = appointmentInfo[index] as AuctionConveyanceAppointmentInfoResponseExtend;
      let appointmentList = [];
      appointmentList = [{ ...ap }];
      let appointment = {
        ...ap,
        expand: ap.isLatest,
        details: [
          {
            name: 'วันที่นัดโอนกรรมสิทธิ์',
            value: this.buddhistEraPipe.transform(ap?.masAppointDate, 'DD/MM/YYYY') || '',
          },
        ],
        iconClass: ap.isLatest ? 'fill-krungthai-green' : 'fill-gray',
        appointmentList: appointmentList,
      };
      this.mainList.push(appointment);
    }
  }

  prepareDocument() {
    let documents = this.auctionService?.conveyanceDocument;
    // เอกสารประกอบชุดทรัพย์
    this.documentAsset = documents?.conveyanceDeedGroupUploadDocuments?.map((m: any) => {
      m.appraisalDate = m.uploadTimestamp;
      return m;
    });
    // เอกสารสิทธิ์
    for (let index = 0; index < documents?.deedDocuments.length; index++) {
      const deed = documents.deedDocuments[index];
      for (let index = 0; index < deed.documents?.length; index++) {
        const de = deed.documents?.[index];
        let value = {
          ...deed,
          ...de,
          viewImage: true,
          appraisalDate: de.uploadTimestamp,
          relatedCollateral: {
            collateralId: deed.collateralId,
            collateralDetails: deed.collateralsDescription,
          },
          documentNo: deed.collateralDocNo,
          storeOrganizationName: de.storeOrgName,
          uploadUserId: de.storeOrgCode,
        };
        this.documentDeed.push(value);
      }
    }

    //รายงานการประเมินราคา
    for (let index = 0; index < documents?.appraisalDocuments?.length; index++) {
      const app = documents.appraisalDocuments[index];
      for (let index = 0; index < app?.documents?.length; index++) {
        const doc = app?.documents?.[index];
        let value = {
          ...app,
          ...doc,
          viewImage: true,
          appraisalDate: doc.uploadTimestamp,
          relatedCollateral: {
            collateralId: app.collateralId,
            collateralDetails: app?.collateralsDescription,
          },
          documentNo: app?.collateralDocNo,
        };
        this.appraisalDocuments.push(value);
      }
    }

    this.docAssetConfig.ready = this.documentAsset?.every((e: any) => e.imageId);
    this.reportConfig.ready = this.appraisalDocuments?.every((e: any) => e.imageId);
    this.deedConfig.ready = this.documentDeed?.every((e: any) => e.imageId);
  }

  async onClickProperty(element: any) {
    const destination = this.auctionService.routeCorrection('property-detail');
    this.routerService.navigateTo(destination, {
      fsubbidnum: element.fsubbidnum,
      aucRef: element?.aucRef || this.auctionService.aucRef,
      npaStatus: element.npaStatus,
    });
  }
}
