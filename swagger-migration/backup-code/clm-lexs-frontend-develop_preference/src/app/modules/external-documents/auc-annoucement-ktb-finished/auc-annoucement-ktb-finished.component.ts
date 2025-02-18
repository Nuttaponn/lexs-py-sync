import { AfterViewChecked, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import {
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { AuctionService } from '@app/modules/auction/auction.service';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { AuctionMathchingStatus, AuctionStatus, MAIN_ROUTES } from '@app/shared/constant';
import { LexsUserPermissionCodes, auctionActionCode } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { AuctionAnnounceSearchConditionRequest, InquiryAnnouncesResponse } from '@lexs/lexs-client';
import {
  DropDownConfig,
  NameValuePair,
  PaginatorActionConfig,
  PaginatorResultConfig,
  SimpleSelectOption,
} from '@spig/core';
import { ExternalDocumentsService } from '../external-documents.service';

@Component({
  selector: 'app-auc-annoucement-ktb-finished',
  templateUrl: './auc-annoucement-ktb-finished.component.html',
  styleUrls: ['./auc-annoucement-ktb-finished.component.scss'],
})
export class AucAnnoucementKtbFinishedComponent implements OnInit, AfterViewChecked {
  /** options */
  DDL_DEFAULT = 'N/A';
  lotOptions: NameValuePair[] = [];
  setOptions: NameValuePair[] = [];
  orderNoOptions: NameValuePair[] = [];
  redCaseNoOptions: NameValuePair[] = [];
  legalExecutionOfficeOptions: NameValuePair[] = [];
  statusOptions: NameValuePair[] = [];
  defendantOptions: NameValuePair[] = [];
  allCurrentData: any[] = [];
  public pageSize = 10;
  public pageIndex: number = 1;
  public dataSource = new MatTableDataSource<InquiryAnnouncesResponse>([]);

  public AUCTION_STATUS = AuctionStatus;
  public TABLE_FILTER_KEY = {
    aucLot: 'aucLot',
    aucSet: 'aucSet',
    fbidnum: 'fbidnum',
    redCaseNo: 'redCaseNo',
    lawCourtId: 'lawCourtId',
    matchingStatus: 'matchingStatus',
    defendantName: 'defendantName',
    aucStatus: 'aucStatus',
  };
  /** sorting */
  private configDropdown: DropDownConfig = {
    iconName: 'icon-Sorting',
    searchPlaceHolder: '',
    searchWith: 'text',
    labelPlaceHolder: 'EXTERNAL_DOCUMENTS_SEARCH_CONTROL.DATE_PUBLISHED_ON_WEB_SORTING',
  };
  public sortingConfig: DropDownConfig = this.configDropdown;
  public sortingOptions: SimpleSelectOption[] = [
    { text: 'วันที่ประกาศขึ้นเว็บ: จากล่าสุดไปเก่าสุด', value: 'ASC' },
    { text: 'วันที่ประกาศขึ้นเว็บ: จากเก่าสุดไปล่าสุด', value: 'DESC' },
  ];
  public sortingControl: UntypedFormControl = new UntypedFormControl('ASC');
  public filteredValue: string = '';
  filterDictionary = new Map<string, string>();
  rawFilterValue: any = {};
  /** displayColumns */
  displayedColumns: string[] = [
    'no',
    'datePublishedOnWeb',
    'lot',
    'set',
    'orderNo',
    'courtName',
    'caseType',
    'redCaseNo',
    'defendant',
    'legalExecutionOffice',
    'status',
    'command',
  ];
  data: InquiryAnnouncesResponse[] = [];

  public pageResultConfig!: PaginatorResultConfig;
  public pageActionConfig!: PaginatorActionConfig;
  public auctionStatusMapper = new Map<AuctionStatus, string>([
    [AuctionStatus.NOT_PROCEED, 'status-info'],
    [AuctionStatus.NPA_SUBMIT, 'status-success'],
    [AuctionStatus.ADJUST_SUBMIT, 'status-success'],
    [AuctionStatus.PROCEED, 'status-success'],
    [AuctionStatus.NPA_RECEIVE, 'status-success'],
    [AuctionStatus.COMPLETE, 'status-success'],
    [AuctionStatus.APPRAISAL, 'status-success'],
  ]);

  @ViewChildren(MatTable) table!: QueryList<any>;
  @ViewChild('paginator') paginator!: any;

  hasSubmitPermission = false;

  constructor(
    private routerService: RouterService,
    private externalDocumentService: ExternalDocumentsService,
    private auctionService: AuctionService,
    private sessionService: SessionService
  ) {}

  async ngOnInit(): Promise<void> {
    const response: InquiryAnnouncesResponse[] = await this.externalDocumentService.getAuctionAnnounces([
      AuctionStatus.NOT_PROCEED,
      AuctionStatus.NPA_SUBMIT,
      AuctionStatus.ADJUST_SUBMIT,
      AuctionStatus.PROCEED,
      AuctionStatus.APPRAISAL,
      AuctionStatus.NPA_RECEIVE,
      AuctionStatus.AUCTION,
      AuctionStatus.COMPLETE,
    ]);
    if (response) {
      this.dataSource.data = response
        .sort((a: any, b: any) => new Date(b.announceDate).getTime() - new Date(a.announceDate).getTime())
        .map(it => {
          return <InquiryAnnouncesResponse>{
            ...it,
            defendantName: it.defendantName?.trim(),
          };
        });
      this.lotOptions = response.map(it => {
        return { name: it.aucLot, value: it.aucLot } as NameValuePair;
      });
      this.setOptions = response.map(it => {
        return { name: it.aucSet, value: it.aucSet } as NameValuePair;
      });
      this.orderNoOptions = response.map(it => {
        return { name: it.fbidnum, value: it.fbidnum } as NameValuePair;
      });
      this.redCaseNoOptions = response.map(it => {
        return { name: it.redCaseNo, value: it.redCaseNo } as NameValuePair;
      });
      this.legalExecutionOfficeOptions = response.map(it => {
        return { name: it.ledOriginalName?.trim(), value: it.ledOriginalName?.trim() } as NameValuePair;
      });
      this.statusOptions = response.map(it => {
        return { name: it.aucStatusName, value: it.aucStatusName } as NameValuePair;
      });
      this.defendantOptions = response.map(it => {
        return { name: it.defendantName?.trim(), value: it.defendantName?.trim() } as NameValuePair;
      });

      this.lotOptions = this.getUniqueListByValue(this.lotOptions);
      this.setOptions = this.getUniqueListByValue(this.setOptions);
      this.orderNoOptions = this.getUniqueListByValue(this.orderNoOptions);
      this.redCaseNoOptions = this.getUniqueListByValue(this.redCaseNoOptions);
      this.legalExecutionOfficeOptions = this.getUniqueListByValue(this.legalExecutionOfficeOptions);
      this.statusOptions = this.getUniqueListByValue(this.statusOptions);
      this.defendantOptions = this.getUniqueListByValue(this.defendantOptions);

      this.lotOptions.unshift(this.prependDefaultValue('Lot'));
      this.setOptions.unshift(this.prependDefaultValue('ชุดที่'));
      this.orderNoOptions.unshift(this.prependDefaultValue('ลำดับที่'));
      this.redCaseNoOptions.unshift(this.prependDefaultValue('คดีหมายเลขแดง'));
      this.legalExecutionOfficeOptions.unshift(this.prependDefaultValue('สำนักงานบังคับคดี'));
      this.statusOptions.unshift(this.prependDefaultValue('สถานะ'));
      this.defendantOptions.unshift(this.prependDefaultValue('จำเลย'));
    }

    this.dataSource.filterPredicate = this.getPredicate();
    this.allCurrentData = [...this.dataSource.data];
    this.sliceDataTable(this.dataSource.data);
    this.initPermission();
    this.auctionService.previousIndexCollateralDetail = 0;
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
      });
    }
  }

  pageEvent(event: number) {
    this.pageActionConfig.currentPage = event;
  }

  actionClick(data: InquiryAnnouncesResponse) {
    let actionCode = '';
    let mode = '';
    switch (data.matchingStatus) {
      case AuctionMathchingStatus.PENDING_NEW_ANNOUNCE:
      case AuctionMathchingStatus.PENDING_NEW_DEEDGROUP:
      case AuctionMathchingStatus.PENDING_NEW_VALIDATE:
        actionCode = auctionActionCode.PENDING_NEW_DEEDGROUP;
        mode = 'VIEW';
        break;
      default:
        mode = [AuctionStatus.NPA_SUBMIT, AuctionStatus.ADJUST_SUBMIT, AuctionStatus.PROCEED].includes(
          data.aucStatus as AuctionStatus
        ) || !this.hasSubmitPermission
          ? 'VIEW'
          : 'EDIT';
        actionCode = auctionActionCode.R2E09_2_A
        break;
    }

    this.auctionService.selectAnouncementDetail = data;
    this.routerService.navigateTo(`${MAIN_ROUTES.EXTERNAL_DOCUMENTS}/auction`, {
      litigationId: data.litigationId || '',
      litigationCaseId: data.litigationCaseId || '',
      mode,
      actionCode,
      auctionCaseTypeCode: data?.caseType || '',
    });
  }

  sliceDataTable(allData: any[], start?: number, end?: number) {
    const data = [...allData];
    this.dataSource.filteredData = data.slice(start ? start : 0, end ? end : 10);
  }

  private resetPageIndex() {
    if (this.paginator) {
      this.paginator['pageIndex'] = 1;
    }
    this.pageIndex = 1;
  }

  onPaging(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.sliceDataTable(this.allCurrentData, e.startLabel ? e.startLabel - 1 : 0, e.fromLabel);
  }

  applyFilter(value: string, filter: any) {
    this.filterDictionary.set(filter, value);
    let jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
    this.allCurrentData = [...this.dataSource.filteredData];
    this.sliceDataTable(this.dataSource.filteredData);
  }

  onFilter(e: any) {
    console.log(e);
    this.filteredValue = e.value;
    this.resetPageIndex();
    this.applyFilter(e.value, e.filter);
    this.rawFilterValue = e.rawValue;
  }

  async sortSelected(event: any) {
    let sortListObject;
    this.resetPageIndex();
    if (event == 'ASC') {
      sortListObject = this.allCurrentData.sort(
        (a: any, b: any) => new Date(b.announceDate).getTime() - new Date(a.announceDate).getTime()
      );
    } else {
      sortListObject = this.allCurrentData.sort(
        (b: any, a: any) => new Date(b.announceDate).getTime() - new Date(a.announceDate).getTime()
      );
    }
    this.dataSource = new MatTableDataSource(sortListObject);
    this.dataSource.filterPredicate = this.getPredicate();
    this.sliceDataTable(this.dataSource.filteredData);
  }

  prependDefaultValue(text: string) {
    return { name: text, value: this.DDL_DEFAULT };
  }
  getPredicate() {
    let fun = (record: any, filter: any) => {
      let map = new Map(JSON.parse(filter));
      let isMatch = false;
      for (let [key, value] of map) {
        if (key === this.TABLE_FILTER_KEY.matchingStatus) {
          key = this.TABLE_FILTER_KEY.aucStatus;
        }
        isMatch = value == this.DDL_DEFAULT || record[key as keyof InquiryAnnouncesResponse] == value;
        if (!isMatch) return false;
      }
      return isMatch;
    };
    return fun;
  }

  getUniqueListByValue(arr: NameValuePair[]) {
    return [...new Map(new Set(arr.map(item => [item['value'], item]))).values()];
  }

  getAucStatus(aucStatusName: string) {
    const allAuctionStatus = [
      AuctionStatus.NOT_PROCEED,
      AuctionStatus.ADJUST_SUBMIT,
      AuctionStatus.PROCEED,
      AuctionStatus.APPRAISAL,
      AuctionStatus.NPA_SUBMIT,
      AuctionStatus.NPA_RECEIVE,
      AuctionStatus.AUCTION,
      AuctionStatus.COMPLETE,
    ];
    switch (aucStatusName) {
      case 'ไม่ดำเนินการ':
        return [AuctionStatus.NOT_PROCEED];
      case 'เสร็จสิ้น (แก้ไขใบประกาศ)':
        return [AuctionStatus.ADJUST_SUBMIT];
      case 'เสร็จสิ้น (ทรัพย์นอกจำนอง)':
        return allAuctionStatus.filter(el => el !== AuctionStatus.NOT_PROCEED && el !== AuctionStatus.ADJUST_SUBMIT);
      case 'เสร็จสิ้น (ส่งมติ NPA)':
        return allAuctionStatus.filter(el => el !== AuctionStatus.NOT_PROCEED && el !== AuctionStatus.ADJUST_SUBMIT);
      default:
        return allAuctionStatus;
    }
  }
  async onSaveFile() {
    const aucStatus = this.getAucStatus(this.filteredValue);
    let request: AuctionAnnounceSearchConditionRequest = {};
    if (this.filteredValue === 'เสร็จสิ้น (ทรัพย์นอกจำนอง)' || this.filteredValue === 'เสร็จสิ้น (ส่งมติ NPA)') {
      request = { ...request, isNonPledgeAsset: this.filteredValue === 'เสร็จสิ้น (ทรัพย์นอกจำนอง)' ? true : false };
    }
    const filname = 'ใบประกาศที่เสร็จสิ้น';
    const sortOrder = '';
    const matchStatus: string[] = [];
    const auctionAnnounceSource: string[] = [];
    const sortBy = ['announceDate'];
    await this.externalDocumentService.getAuctionAnnounceExcel(aucStatus, request, filname, sortOrder, matchStatus, auctionAnnounceSource, sortBy);
  }

  initPermission() {
    this.hasSubmitPermission = this.sessionService.hasPermission(LexsUserPermissionCodes.AUCTION_ANNOUNCE_INACTIVE);
  }
}
