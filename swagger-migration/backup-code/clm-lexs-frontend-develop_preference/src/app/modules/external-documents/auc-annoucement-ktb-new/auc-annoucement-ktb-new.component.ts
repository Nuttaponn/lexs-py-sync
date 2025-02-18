import { AfterViewChecked, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { AuctionService } from '@app/modules/auction/auction.service';
import { AuctionMathchingStatus, AuctionStatus, MAIN_ROUTES } from '@app/shared/constant';
import { auctionActionCode, LexsUserPermissionCodes } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { NameValuePair, InquiryAnnouncesResponse, AuctionAnnounceSearchConditionRequest, AuctionCreateAnnounceSubmitRequest, AuctionCreateAnnounceSubmitResponse, AnnounceValidateResponse } from '@lexs/lexs-client';
import { BuddhistEraPipe, DialogOptions, DropDownConfig, SimpleSelectOption } from '@spig/core';
import { ExternalDocumentsService } from '../external-documents.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { SelectExpenseDialogComponent } from '@app/modules/auction/auction-add/select-expense-dialog/select-expense-dialog.component';
import { NewAuctionService } from '@app/modules/auction/auction-add/new-auction.service';
import { Utils } from '@app/shared/utils';
@Component({
  selector: 'app-auc-annoucement-ktb-new',
  templateUrl: './auc-annoucement-ktb-new.component.html',
  styleUrl: './auc-annoucement-ktb-new.component.scss'
})
export class AucAnnoucementKtbNewComponent implements OnInit, AfterViewChecked {
  /** options */
  DDL_DEFAULT = 'N/A';
  lotOptions: NameValuePair[] = [];
  setOptions: NameValuePair[] = [];
  orderNoOptions: NameValuePair[] = [];
  redCaseNoOptions: NameValuePair[] = [];
  legalExecutionOfficeOptions: NameValuePair[] = [];
  statusOptions: NameValuePair[] = [];
  defendantOptions: NameValuePair[] = [];
  public pageSize = 10;
  public pageIndex: number = 1;
  public dataSource = new MatTableDataSource<InquiryAnnouncesResponse>([]);

  public AUCTION_STATUS = AuctionMathchingStatus;
  public TABLE_FILTER_KEY = {
    aucLot: 'aucLot',
    aucSet: 'aucSet',
    fbidnum: 'fbidnum',
    redCaseNo: 'redCaseNo',
    lawCourtId: 'lawCourtId',
    matchingStatus: 'matchingStatus',
    defendantName: 'defendantName',
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
    { text: 'วันที่บันทึกประกาศ: จากล่าสุดไปเก่าสุด', value: 'ASC' },
    { text: 'วันที่บันทึกประกาศ: จากเก่าสุดไปล่าสุด', value: 'DESC' },
  ];
  public sortingControl: UntypedFormControl = new UntypedFormControl('ASC');

  filterDictionary = new Map<string, string>();
  rawFilterValue: any = {};
  /** displayColumns */
  displayedColumns: string[] = [
    'no',
    'datePublishedOnWeb',
    'lot',
    'set',
    'orderNo',
    'civilCourtName',
    'caseType',
    'redCaseNo',
    'defendant',
    'legalExecutionOffice',
    'status',
    'command',
  ];
  data: InquiryAnnouncesResponse[] = [];

  @ViewChildren(MatTable) table!: QueryList<any>;
  allCurrentData: any[] = [];
  @ViewChild('paginator') paginator!: any;

  constructor(
    private routerService: RouterService,
    private externalDocumentService: ExternalDocumentsService,
    private auctionService: AuctionService,
    private sessionService: SessionService,
    private notificationService: NotificationService,
    private buddhistEraPipe: BuddhistEraPipe,
    private newAuctionService: NewAuctionService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.processOnInit()
  }

  async processOnInit(existData?: InquiryAnnouncesResponse[]) {
    const matchStatus: string[] = [
      AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewAnnounce,
      AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewCase,
      AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewDeedgroup,
      AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewValidate,
    ]
    let response: InquiryAnnouncesResponse[] = []
    if (existData) {
      response = existData
    } else {
      response = await this.externalDocumentService.getAuctionAnnounces(
        [
          AuctionStatus.MATCHING
        ],
        matchStatus,
        undefined,
        ['LEXS']
      );
    }
    if (response) {
      this.dataSource.data = response
        .sort((a: any, b: any) => new Date(b.announceDate).getTime() - new Date(a.announceDate).getTime())
        .map(it => {
          return <InquiryAnnouncesResponse>{
            ...it,
            defendantName: it.defendantName?.trim(),
            ledOriginalName: it.ledOriginalName?.trim(),
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
        return { name: it.matchingStatusName, value: it.matchingStatusName } as NameValuePair;
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
    this.auctionService.previousIndexCollateralDetail = 0;
  }

  async onAddAnnouncement() {
    const dialogRes = await this.notificationService.showCustomDialog({
      component: SelectExpenseDialogComponent,
      // component: SubmitCancelMatchingDialogComponent,
      title: 'รายละเอียดคดีที่ต้องการจับคู่',
      iconName: '',
      hideIcon: true,
      rightButtonClass: '',
      buttonIconName: 'icon-Check-Square',
      rightButtonLabel: 'ตรวจสอบ',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      leftButtonClass: '',
      cancelEvent: true,
      iconClass: '',
      context: {
        // selectedCustomer: this.preferenceService.getForm().value.customerDto || null,
      },
    });

    if (dialogRes?.isCancel) return

    if (dialogRes) {
      const auctionCreateAnnounceSubmitResponse: AuctionCreateAnnounceSubmitResponse = dialogRes?.auctionCreateAnnounceSubmitResponse;

      const aucRef = auctionCreateAnnounceSubmitResponse.aucRef || 0;
      const matchStatus = AuctionMathchingStatus.PENDING_NEW_ANNOUNCE // # ??
      const res = await this.externalDocumentService.getAuctionAnnounces(
        [
          AuctionStatus.MATCHING
        ],
        [ matchStatus ],
        aucRef
      );

      this.actionClick(res[0]);
    }
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
      });
    }
  }

  actionClick(data: InquiryAnnouncesResponse) {
    let actionCode = '';
    switch (data.matchingStatus) {
      case AuctionMathchingStatus.PENDING_NEW_ANNOUNCE:
        actionCode = auctionActionCode.PENDING_NEW_ANNOUNCE;
        break;
      case AuctionMathchingStatus.PENDING_NEW_DEEDGROUP:
        actionCode = auctionActionCode.PENDING_NEW_DEEDGROUP;
        break;
      case AuctionMathchingStatus.PENDING_NEW_VALIDATE:
        actionCode = auctionActionCode.PENDING_NEW_VALIDATE;
        break;
      default:
        break;
    }

    this.auctionService.selectAnouncementDetail = data;
    this.routerService.navigateTo(`${MAIN_ROUTES.EXTERNAL_DOCUMENTS}/auction`, {
      litigationId: data.litigationId || '',
      litigationCaseId: data.litigationCaseId || '',
      mode: this.canEdit ? 'EDIT' : 'VIEW',
      actionCode,
      // actionType: taskCode.ON_REQUEST,
      auctionCaseTypeCode: data.caseType || '',
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

  onFilter(e: any) {
    this.resetPageIndex();
    this.applyFilter(e.value, e.filter);
    this.rawFilterValue = e.rawValue;
  }

  applyFilter(value: string, filter: any) {
    this.filterDictionary.set(filter, value);
    let jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
    this.allCurrentData = [...this.dataSource.filteredData];
    this.sliceDataTable(this.dataSource.filteredData);
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

  async onSaveFile() {
    const aucStatus = [AuctionStatus.MATCHING];
    const request: AuctionAnnounceSearchConditionRequest = {};
    const filname = 'ประกาศขายทอดตลาดที่เพิ่มใหม่';
    const sortOrder = '';
    const matchStatus: string[] = [AuctionMathchingStatus.PENDING_NEW_ANNOUNCE];
    const auctionAnnounceSource: string[] = ['LEXS'];
    const sortBy = ['announceDate'];
    await this.externalDocumentService.getAuctionAnnounceExcel(aucStatus, request, filname, sortOrder, matchStatus, auctionAnnounceSource, sortBy);
  }

  get canEdit() {
    return this.sessionService.hasPermission(LexsUserPermissionCodes.MATCH_ASSET_AUCTION);
  }

  async onDelete(item: InquiryAnnouncesResponse) {
    const announceDate = Utils.dateFormat(item.announceDate ?? '', 'DD/MM/YYYY')

    const optionsDialog: DialogOptions = {
      rightButtonLabel: 'ยืนยันลบประกาศ',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      buttonIconName: 'icon-Bin',
      rightButtonClass: '',
      leftButtonClass: 'long-button',
    };

    const isConfirm = await this.notificationService.confirmRemoveLeftAlignedDialog(
      'ยืนยันลบประกาศ',
      `ลบประกาศวันที่บันทึก ` + announceDate + '<br><br>',
      optionsDialog
    );

    if (!isConfirm) return

    const req: AuctionCreateAnnounceSubmitRequest = {
      headerFlag: AuctionCreateAnnounceSubmitRequest.HeaderFlagEnum.Delete,
    }
    try {
      await this.newAuctionService.postCreateAnnounceSubmit(Number(item.aucRef ?? 0), req);
      this.notificationService.openSnackbarSuccess(
        'ลบประกาศวันที่บันทึก ' + announceDate
      );

      this.allCurrentData = this.allCurrentData.filter(it => it.aucRef !== item.aucRef);

      this.resetPageIndex()
      await this.processOnInit(this.allCurrentData)
    } catch (error) {

    }

  }
}

