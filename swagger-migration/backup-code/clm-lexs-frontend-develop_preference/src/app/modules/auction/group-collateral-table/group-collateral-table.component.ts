import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';
import { TaskService } from '@app/modules/task/services/task.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { DEFAULT_DROPDOWN_CONFIG } from '@app/shared/constant/default-dropdown';
import { auctionActionCode } from '@app/shared/models/auction-announcement-action.model';
import { taskCode } from '@app/shared/models/task.model';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { DocumentDto } from '@lexs/lexs-client';
import moment from 'moment';
import { DropDownConfig, SimpleSelectOption } from 'projects/spig-core/src/lib/dropdown/dropdown.model';
import { RESOLUTION_MAPPING, SubmitAuctionResultAction } from '../auction.const';
import {
  CollateralTableGroupConfig,
  TableAuctionCollateralColumns,
  TableAuctionModel,
  columnNameType,
} from '../auction.model';
import { AuctionService } from '../auction.service';
import { SubmitResultNonebuyerDialogComponent } from '../submit-result-nonebuyer-dialog/submit-result-nonebuyer-dialog.component';
import { SubmitResultSuspendSaleDialogComponent } from '../submit-result-suspend-sale-dialog/submit-result-suspend-sale-dialog.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-group-collateral-table',
  templateUrl: './group-collateral-table.component.html',
  styleUrls: ['./group-collateral-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GroupCollateralTableComponent implements OnInit {
  @Input() mode = 'EDIT';
  @Input() data!: any;
  @Input() aucRef!: any;
  @Input() bidDate!: string | undefined;
  @Input() actionCode!: auctionActionCode;
  remark: string = '';
  @Input() tableConfig: CollateralTableGroupConfig = {};
  isExpandedAllRows = true;

  @Output() onUpdateSelectItem = new EventEmitter<any>();
  @Output() onHyperlinkClick = new EventEmitter<any>();
  @Output() onActionClick = new EventEmitter<any>();
  @Output() onUpdateData = new EventEmitter<any>();
  isOpened = false;
  public taskCode!: taskCode;
  config: any = { hasSelect: true, hasAction: true };
  public selection = new SelectionModel<string>(true, []);
  public collateralsSource = new MatTableDataSource<any>([]);
  public collateralsSourceList = new MatTableDataSource<any>([]);
  public collateralColumns = TableAuctionCollateralColumns;
  public pageSize = 10;
  public pageIndex: number = 1;
  public startIndex: number = 1;
  public endIndex: number = 1;

  public pageIndexList: number[] = [];
  public startIndexList: number[] = [];
  public endIndexList: number[] = [];

  isRequireSelectedItem = false;
  isSupendRequireSelectedItem = false;
  public propertyContact: UntypedFormControl = new UntypedFormControl('N/A');
  public typeFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public collateralDocNoFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public noConclusionFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public saleTypeFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public resolutionFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public collateralGroupOption: SimpleSelectOption[] = [];
  public dropdownFilterNoConclusionConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'มติประชุมครั้งที่',
  };
  public dropdownFilterGroupConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'ชุดทรัพย์',
  };
  public dropdownFilterDocumentConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'เลขที่เอกสารสิทธิ์',
  };
  public dropdownResultConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'มติที่ประชุม',
  };
  public dropdownFilterSaleTypeConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'ประเภทการขาย',
  };
  public noConclusionFilterOption: SimpleSelectOption[] = [{ text: '', value: '' }];
  public typeFilterOption: SimpleSelectOption[] = [{ text: '', value: '' }];
  public collateralDocNoFilterOption: SimpleSelectOption[] = [];
  public saleTypeFilterOption: SimpleSelectOption[] = [];
  public resultOption: SimpleSelectOption[] = [
    { text: 'อนุมัติซื้อทรัพย์', value: 'PURCHASE' },
    { text: 'อนุมัติไม่ซื้อทรัพย์', value: 'NOT_PURCHASE' },
  ];

  public TABLE_FILTER_KEY = {
    GROUP: 'deedGroupId',
    TYPE: 'collateralType',
    STATUS: 'status',
    RESOLUTION: 'resolution',
    MEETINGNO: 'meetingNo',
    SALE_TYPE: 'saletypedesc',
    FSUBBIDNUM: 'fsubbidnum',
    COLLATERAL_DOC_NO: 'collateralDocNo',
    ACTION: 'action',
  };

  public resolution = RESOLUTION_MAPPING;

  public remarkColumns = ['no', 'remark'];

  get displayAsset() {
    return (
      [auctionActionCode.R2E09_3, auctionActionCode.R2E09_3_16757].includes(this.actionCode) ||
      [taskCode.R2E09_06_12C, taskCode.R2E09_04_01_11].includes(this.taskCode)
    );
  }

  get displayDocumentNo() {
    return [taskCode.R2E09_06_12C, taskCode.R2E09_04_01_11].includes(this.taskCode);
  }

  get displayConclusion() {
    return (
      [auctionActionCode.R2E09_3, auctionActionCode.R2E09_3_16757].includes(this.actionCode) ||
      [taskCode.R2E09_06_12C, taskCode.R2E09_04_01_11].includes(this.taskCode)
    );
  }

  get displaySaleType() {
    return [taskCode.R2E09_06_12C, taskCode.R2E09_04_01_11].includes(this.taskCode);
  }

  get displayFn1() {
    return [taskCode.R2E09_06_12C, taskCode.R2E09_04_01_11].includes(this.taskCode);
  }

  get displayFn2() {
    return [auctionActionCode.R2E09_3].includes(this.actionCode);
  }

  get displayBtnAll() {
    return [auctionActionCode.R2E09_3_16757].includes(this.actionCode);
  }

  get isDataList() {
    return [auctionActionCode.R2E09_3_16757].includes(this.actionCode);
  }

  get displayTableNPA() {
    return (
      [auctionActionCode.R2E09_3].includes(this.actionCode) ||
      [taskCode.R2E09_06_12C, taskCode.R2E09_04_01_11].includes(this.taskCode)
    );
  }

  @Input() tableColumns!: TableAuctionModel[];

  public filterDictionary = new Map<string, string>();
  public filteListrDictionary = new Map<string, string>();
  allCurrentData: any[] = [];
  allCurrentDataList: any[] = [];
  @ViewChild('paginator') paginator!: any;

  isOpenedList: boolean[] = [];
  taskcodeEnum: taskCode = taskCode.R2E09_04_01_11;

  isOpenedAll: boolean[] = [];
  public columnNameMapper = new Map<any, string>([
    [columnNameType.orderNumber, 'ลำดับ'],
    [columnNameType.col1, 'ชุดทรัพย์'],
    [columnNameType.fsubbidnum, 'ชุดทรัพย์'],
    [columnNameType.col2, 'มติที่ประชุม'],
    [columnNameType.col3, 'วิธีการขาย'],
    [columnNameType.col4, 'กำหนดราคาซื้อต่ำสุด\n(บาท)'],
    [columnNameType.col5, 'กำหนดราคาซื้อสูงสุด\n(บาท)'],
    [columnNameType.col6, 'ราคาประเมิน\n(บาท)'],
    [columnNameType.totalAppraisalValue, 'ราคาประเมิน\n(บาท)'],
    [columnNameType.col7, 'ราคาอนุมัติ\nใช้ได้ถึงวันที่'],
    [columnNameType.effectiveDateTo, 'ราคาอนุมัติ\nใช้ได้ถึงวันที่'],
    [columnNameType.status, 'ผลการตรวจสอบ'],
    [columnNameType.col8, 'เอกสาร'],
    [columnNameType.npaResolutionDocument, 'เอกสาร'],
    [columnNameType.resolution, 'มติที่ประชุม'],
    [columnNameType.action, 'คำสั่ง'],
  ]);

  get totalSubmitResult() {
    return this.collateralsSource.data.filter((it: any) => it.action !== SubmitAuctionResultAction.UPDATE).length;
  }

  get totalPendingSubmitResult() {
    return this.collateralsSource.data.filter((it: any) => it.action === SubmitAuctionResultAction.UPDATE).length;
  }

  constructor(
    private logger: LoggerService,
    private notificationService: NotificationService,
    private taskService: TaskService,
    private auctionService: AuctionService,
    private routerService: RouterService,
    private documentService: DocumentService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.logger.info('GroupCollateralTableComponent -> ngOnInit');
    this.collateralColumns = this.tableColumns.filter(it => !it.hideCol).map(it => it.colName);

    this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    if (this.isDataList) {
      this.columnNameMapper = new Map<columnNameType, string>([
        [columnNameType.orderNumber, 'ลำดับ'],
        [columnNameType.col1, 'ชุดทรัพย์'],
        [columnNameType.fsubbidnum, 'ชุดทรัพย์'],
        [columnNameType.col2, 'มติที่ประชุม'],
        [columnNameType.saleTypeDesc, 'วิธีการขาย'],
        [columnNameType.col4, 'กำหนดราคาซื้อต่ำสุด\n(บาท)'],
        [columnNameType.col5, 'กำหนดราคาซื้อสูงสุด\n(บาท)'],
        [columnNameType.col6, 'ราคาประเมิน\n(บาท)'],
        [columnNameType.col7, 'ราคาอนุมัติ\nใช้ได้ถึงวันที่'],
        [columnNameType.status, 'ผลการตรวจสอบ'],
        [columnNameType.col8, 'เอกสาร'],
        [columnNameType.action, 'รายละเอียด'],
      ]);

      let temp = this.data.resolutions.map((it: any) => {
        return <any>{
          ...it,
          deedGroups: it.deedGroups
            .sort((a: any, b: any) => {
              const result = a?.fsubbidnum
                ?.toString()
                .localeCompare(b?.fsubbidnum?.toString(), 'en', { numeric: true });
              return result;
            })
            .map((x: any, i: number) => {
              return <any>{
                orderNumber: '' + (i + 1),
                ...x,
              };
            }),
        };
      });

      temp.forEach((x: any, index: any) => {
        let dataTemp = new MatTableDataSource<any>([]);
        let dTemp = x.deedGroups;
        x.deedGroups = dataTemp;
        x.deedGroups.data = dTemp;
        x.deedGroups.filterPredicate = this.getPredicate();
        this.allCurrentDataList[index] = [...x.deedGroups.data];
        x.deedGroups.filteredData = x.deedGroups.data.slice(0, 10);
        console.log('x.deedGroups.', x.deedGroups);
        this.pageIndexList.push(1);
        this.startIndexList.push(1);
        this.endIndexList.push(1);
      });
      console.log('this.allCurrentDataList', this.allCurrentDataList);
      console.log('this.collateralsSource.data', this.collateralsSource.data);
      this.collateralsSource.data = temp;
    } else if (this.taskCode === taskCode.R2E09_04_01_11) {
      this.collateralsSource.data = this.data.map((it: any, index: any) => {
        return <any>{
          orderNumber: '' + (index + 1),
          ...it,
        };
      });
    } else if (this.displayFn2) {
      this.columnNameMapper = new Map<columnNameType, string>([
        [columnNameType.orderNumber, 'ลำดับ'],
        [columnNameType.col1, 'ชุดทรัพย์'],
        [columnNameType.fsubbidnum, 'ชุดทรัพย์'],
        [columnNameType.col2, 'มติที่ประชุม'],
        [columnNameType.col3, 'วิธีการขาย'],
        [columnNameType.col4, 'กำหนดราคาซื้อต่ำสุด\n(บาท)'],
        [columnNameType.col5, 'กำหนดราคาซื้อสูงสุด\n(บาท)'],
        [columnNameType.col6, 'ราคาประเมิน\n(บาท)'],
        [columnNameType.col7, 'ราคาอนุมัติ\nใช้ได้ถึงวันที่'],
        [columnNameType.status, 'ผลการตรวจสอบ'],
        [columnNameType.col8, 'เอกสาร'],
        [columnNameType.action, 'รายละเอียด'],
      ]);
      this.collateralsSource.data = this.data?.deedGroupResolution.map((it: any, index: any) => {
        return <any>{
          orderNumber: '' + (index + 1),
          ...it,
        };
      });
    }

    if (!this.isDataList) {
      this.collateralsSource.data = this.collateralsSource.data.sort((a: any, b: any) => {
        const result = a.fsubbidnum?.toString().localeCompare(b.fsubbidnum?.toString(), 'en', { numeric: true });
        return result;
      });
    }

    this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    this.collateralsSource.filterPredicate = this.getPredicate();

    if (!this.isDataList) {
      this.allCurrentData = [...this.collateralsSource.data];
      this.sliceDataTable(this.collateralsSource.data);
    }

    if (this.isDataList) {
      this.collateralGroupOption = this.collateralsSource.data.flatMap((it: any) =>
        it.deedGroups.filteredData
          .sort((a: any, b: any) => {
            const result = a?.fsubbidnum?.toString().localeCompare(b?.fsubbidnum?.toString(), 'en', { numeric: true });
            return result;
          })
          .flatMap((c: any) => {
            return {
              text: c.fsubbidnum ? `ชุดทรัพย์ที่ ${c.fsubbidnum}` : '-',
              value: c.fsubbidnum,
            } as SimpleSelectOption;
          })
      );
      this.collateralGroupOption = this.collateralGroupOption
        .filter((thing, index, self) => self.findIndex(t => t.text === thing.text && t.value === thing.value) === index)
        .sort((a: any, b: any) => {
          const result = a.value.toString().localeCompare(b.value.toString(), 'en', { numeric: true });
          return result;
        });
      this.collateralGroupOption = [{ text: 'ชุดทรัพย์', value: 'All' } as SimpleSelectOption].concat(
        this.collateralGroupOption
      );

      this.resultOption = [{ text: 'มติที่ประชุม', value: 'All' } as SimpleSelectOption].concat(this.resultOption);
      let tempList = Array.from(new Map(this.collateralsSource.data.map(item => [item.meetingNo, item])).values());
      this.noConclusionFilterOption = tempList.map((it: any) => {
        return {
          text: it.meetingNo ? it.meetingNo : '-',
          value: it.meetingNo,
        } as SimpleSelectOption;
      });
      this.noConclusionFilterOption = [{ text: 'มติประชุมครั้งที่', value: 'All' } as SimpleSelectOption].concat(
        this.noConclusionFilterOption
      );
      this.isOpenedList = new Array(this.collateralsSource.data.length).fill(true);
    } else {
      this.collateralGroupOption = this.collateralsSource.data
        .sort((a: any, b: any) => {
          const result = a?.fsubbidnum?.toString().localeCompare(b?.fsubbidnum?.toString(), 'en', { numeric: true });
          return result;
        })
        .map((it: any) => {
          return {
            text: it.fsubbidnum ? `ชุดทรัพย์ที่ ${it.fsubbidnum}` : '-',
            value: it.fsubbidnum,
          } as SimpleSelectOption;
        });
      this.collateralGroupOption = [{ text: 'ชุดทรัพย์', value: 'All' } as SimpleSelectOption].concat(
        this.collateralGroupOption
      );

      if (this.taskCode === taskCode.R2E09_04_01_11) {
        this.resultOption = this.collateralsSource.data.map((it: any) => {
          return {
            text: it?.npaResolutionSummary?.resolution
              ? this.resolution.get(it?.npaResolutionSummary?.resolution)
              : '-',
            value: it?.npaResolutionSummary?.resolution || '',
          } as SimpleSelectOption;
        });
      }
      this.resultOption = [{ text: 'มติที่ประชุม', value: 'All' } as SimpleSelectOption].concat(this.resultOption);
      this.saleTypeFilterOption = this.collateralsSource.data.map((it: any) => {
        return {
          text: it?.saletypedesc ? it?.saletypedesc : '-',
          value: it?.saletypedesc || '',
        } as SimpleSelectOption;
      });
      this.saleTypeFilterOption = [{ text: 'วิธีการขาย', value: 'All' } as SimpleSelectOption].concat(
        this.saleTypeFilterOption
      );
      const deeds = this.collateralsSource.data.flatMap((it: any) => it.deeds);
      this.collateralDocNoFilterOption = deeds
        .sort((a: any, b: any) => {
          if (a?.collateralDocNo && b?.collateralDocNo) {
            const result = a?.collateralDocNo
              .toString()
              .localeCompare(b?.collateralDocNo.toString(), 'en', { numeric: true });
            return result;
          }
          return null;
        })
        .map((it: any) => {
          return {
            text: it?.collateralDocNo ? it?.collateralDocNo : '-',
            value: it?.collateralDocNo || '',
          } as SimpleSelectOption;
        });
      this.collateralDocNoFilterOption = [{ text: 'เลขที่เอกสารสิทธิ์', value: 'All' } as SimpleSelectOption].concat(
        this.collateralDocNoFilterOption
      );
    }
    this.collateralGroupOption = this.auctionService.getUniqueListByValue(this.collateralGroupOption);
    this.resultOption = this.auctionService.getUniqueListByValue(this.resultOption);
    this.saleTypeFilterOption = this.auctionService.getUniqueListByValue(this.saleTypeFilterOption);
    this.collateralDocNoFilterOption = this.auctionService.getUniqueListByValue(this.collateralDocNoFilterOption);

    console.log('tableColumns', this.tableColumns);
  }

  getPredicate() {
    let fun = (record: any, filter: any) => {
      let map = new Map(JSON.parse(filter));
      let isMatch = false;
      for (let [key, value] of map) {
        if (key === this.TABLE_FILTER_KEY.RESOLUTION) {
          isMatch =
            value == 'All' ||
            (record?.npaResolutionSummary?.resolution || '') === value ||
            record?.resolution === value;
        } else if (key === this.TABLE_FILTER_KEY.COLLATERAL_DOC_NO) {
          isMatch =
            value == 'All' || record?.deeds?.filter((it: any) => (it?.collateralDocNo || '') === value)?.length > 0;
        } else {
          isMatch = value == 'All' || (record[key as keyof any] || '') == value;
        }
        if (!isMatch) return false;
      }
      return isMatch;
    };
    return fun;
  }

  manageAllRow(flag: boolean) {
    this.isOpened = !flag;
    this.collateralsSource.filteredData = this.collateralsSource.data.map((it: any, index: any) => {
      return <any>{
        orderNumber: '' + (index + 1),
        ...it,
        expanded: this.isOpened,
      };
    });
  }

  manageAllTable() {
    this.isExpandedAllRows = !this.isExpandedAllRows;
    this.collateralsSource.filteredData = this.collateralsSource.data.map((it: any) => {
      return <any>{
        ...it,
        expanded: this.isExpandedAllRows,
      };
    });

    this.collateralsSource.filteredData.forEach((x: any) => {
      x.deedGroups.filteredData = x.deedGroups.data.map((y: any) => {
        return <any>{
          ...y,
          expanded: this.isExpandedAllRows,
        };
      });
    });
    this.isOpenedList = new Array(this.collateralsSource.filteredData.length).fill(this.isExpandedAllRows);
  }

  onClickHistory() {
    const destination = this.auctionService.routeCorrection('npa-history');
    this.routerService.navigateTo(destination, { aucRef: this.data.aucRef });
  }

  applyFilter(value: string, filter: any) {
    if (!this.isDataList) {
      this.resetPageIndex();
    } else {
      this.resetPageIndexList;
    }
    console.log('this.collateralsSource.data', this.collateralsSource.data);
    if (this.isDataList) {
      if (filter === 'fsubbidnum' || filter === 'resolution') {
        this.filteListrDictionary.set(filter, value);
        let jsonStringdeedGroupId = JSON.stringify(Array.from(this.filteListrDictionary.entries()));
        this.collateralsSource.data.forEach((it: any, index: any) => {
          it.deedGroups.filter = jsonStringdeedGroupId;
          this.allCurrentDataList[index] = [...it.deedGroups.filteredData];
          it.deedGroups.filteredData = it.deedGroups.filteredData.slice(0, 10);
        });
        console.log('this.collateralsSource', this.collateralsSource);
      } else {
        this.filterDictionary.set(filter, value);
        let jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
        this.collateralsSource.filter = jsonString;
        console.log('this.collateralsSource', this.collateralsSource);
      }
    } else {
      this.filterDictionary.set(filter, value);
      let jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
      this.collateralsSource.filter = jsonString;
      this.allCurrentData = [...this.collateralsSource.filteredData];
      this.sliceDataTable(this.collateralsSource.filteredData);
    }
  }

  async submitResulSuspendSale() {
    if (this.selection.selected.length === 0) {
      this.isSupendRequireSelectedItem = true;
      return;
    }
    const selectItems = this.data.filter((it: any) => {
      const matched = this.selection.selected.includes(it.deedGroupId || 0);
      return matched;
    });
    const response = await this.notificationService.showCustomDialog({
      component: SubmitResultSuspendSaleDialogComponent,
      title: `งดการขายทรัพย์`,
      iconName: 'icon-Selected',
      rightButtonLabel: 'ยืนยันงดขายทรัพย์',
      buttonIconName: 'icon-Check-Square',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      cancelEvent: true,
      type: 'xlarge',
      autoWidth: true,
      context: {
        selectItem: selectItems,
        auctionBiddingId: this.taskService.taskDetail.objectId,
      },
    });
    if (response && response.isSuccess) {
      this.notificationService.openSnackbarSuccess(
        this.translate.instant('MORE_THAN_1_SET_OF_ASSETS.SALES_REDUCTION_OF_ASSETS_DONE')
      );
      this.updateAuctionBiddingInfo();
    }
  }

  async submitResulNoneBuyer() {
    if (this.selection.selected.length === 0) {
      this.isRequireSelectedItem = true;
      return;
    }
    const currentDate = moment();
    const _bidDate = moment(this.bidDate);
    if (!currentDate.isSameOrAfter(_bidDate)) {
      await this.notificationService.alertDialog(
        'MORE_THAN_1_SET_OF_ASSETS.UNABLE_TO_RECORD_WITH_NO_INTERESTED_BUYERS',
        'MORE_THAN_1_SET_OF_ASSETS.RESULTS_CAN_ONLY_BE_RECORDED_ON_THE_SALES_DAY'
      );
      return;
    }
    const selectItems = this.data.filter((it: any) => {
      const matched = this.selection.selected.includes(it.deedGroupId || 0);
      return matched;
    });
    const response = await this.notificationService.showCustomDialog({
      component: SubmitResultNonebuyerDialogComponent,
      title: `MORE_THAN_1_SET_OF_ASSETS.RESULTS_DOES_NOT_HAVE_INTERESTED_PERSON_BIDDING`,
      iconName: 'icon-Selected',
      rightButtonLabel: `MORE_THAN_1_SET_OF_ASSETS.CONFIRM_REASON_RECORDING`,
      buttonIconName: 'icon-Check-Square',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      cancelEvent: true,
      autoWidth: true,
      context: {
        selectItem: selectItems,
        auctionBiddingId: this.taskService.taskDetail.objectId,
      },
    });
    if (response && response.isSuccess) {
      this.notificationService.openSnackbarSuccess(
        this.translate.instant('MORE_THAN_1_SET_OF_ASSETS.RECORDED_NO_INTEREST')
      );
      this.updateAuctionBiddingInfo();
    }
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      const _selectedColaterals = this.collateralsSource.data
        .filter(it => it.action === SubmitAuctionResultAction.UPDATE)
        .map(m => {
          return m.deedGroupId;
        }) as string[];
      this.selection.select(..._selectedColaterals);
    }
    this.isSupendRequireSelectedItem = false;
    this.isRequireSelectedItem = false;
    this.onUpdateSelectItem.emit(this.selection);
  }

  isAllSelected() {
    return (
      this.selection.selected.length ===
      this.collateralsSource.data.filter(it => it.action === SubmitAuctionResultAction.UPDATE).length
    );
  }

  onCheckboxChange(row: any) {
    row.deedGroupId && this.selection.toggle(row.deedGroupId);
    this.isSupendRequireSelectedItem = false;
    this.isRequireSelectedItem = false;
    this.onUpdateSelectItem.emit(this.selection);
  }

  async clickHyperLink(actionKey?: string, data?: any, col?: string) {
    this.onHyperlinkClick.emit({ actionKey: actionKey, data: data });
    if (col === 'fsubbidnum') {
      const destination = this.auctionService.routeCorrection('property-detail');
      this.routerService.navigateTo(destination, {
        fsubbidnum: data.fsubbidnum,
        aucRef: this.data?.aucRef || this.aucRef,
      });
    } else if (col === 'chronicleId' || col === 'npaResolutionDocument') {
      const response: any = await this.documentService.getDocument(
        data.chronicleId || data.npaResolutionSummary?.npaResolutionDocument,
        DocumentDto.ImageSourceEnum.Imp
      );
      if (!response) return;
      const fileName = 'มติที่ประชุม' ?? 'doc';
      this.documentService.openPdf(response, `${fileName}.${response?.type.split('/')[1]}`);
    }
  }

  async clickHyperLinkList(actionKey?: string, data?: any, col?: string) {
    this.onHyperlinkClick.emit({ actionKey: actionKey, data: data });
    if (col === 'fsubbidnum') {
      const destination = this.auctionService.routeCorrection('property-detail');
      this.routerService.navigateTo(destination, { fsubbidnum: data.fsubbidnum, aucRef: this.aucRef });
    } else if (col === 'chronicleId') {
      const response: any = await this.documentService.getDocument(
        data.chronicleId || '',
        DocumentDto.ImageSourceEnum.Imp
      );
      if (!response) return;
      const fileName = 'ประวัติมติ' ?? 'doc';
      this.documentService.openPdf(response, `${fileName}.${response?.type.split('/')[1]}`);
    }
  }

  actionClick(item: any) {
    this.onActionClick.emit(item);
  }

  toggleRow(element: { expanded: boolean }) {
    element.expanded = !element.expanded;
  }

  sliceDataTable(allData: any[], start?: number, end?: number) {
    const data = [...allData];
    this.collateralsSource.filteredData = data.slice(start ? start : 0, end ? end : 10);
  }

  resetPageIndex() {
    if (this.paginator) {
      this.paginator['pageIndex'] = 1;
    }
    this.pageIndex = 1;
    this.startIndex = 1;
    this.endIndex = 1;
  }
  resetPageIndexList() {
    if (this.paginator) {
      this.paginator['pageIndex'] = 1;
    }
    this.pageIndexList.forEach((x: any) => {
      x = 1;
    });
    this.startIndexList.forEach((x: any) => {
      x = 1;
    });
    this.endIndexList.forEach((x: any) => {
      x = 1;
    });
  }
  indexTable(data: any) {
    let index = data + this.startIndex;
    return index;
  }

  indexTableList(data: any, index: any) {
    let indexOfList = data + this.startIndexList[index];
    return indexOfList;
  }

  onPaging(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.startIndex = e.startLabel || 0;
    this.endIndex = e.fromLabel || 0;
    this.sliceDataTable(this.allCurrentData, e.startLabel ? e.startLabel - 1 : 0, e.fromLabel);
  }

  sliceDataTableList(allData: any[], indexData: any, start?: number, end?: number) {
    this.collateralsSource.data.forEach((x: any, index: any) => {
      if (index === indexData) {
        x.deedGroups.filteredData = x.deedGroups.data.slice(start ? start : 0, end ? end : 10);
      }
    });
  }

  onPagingList(e: PageEvent, index: any, data: any) {
    this.pageIndexList[index] = e.pageIndex;
    this.startIndexList[index] = e.startLabel || 0;
    this.endIndexList[index] = e.fromLabel || 0;
    this.sliceDataTableList(this.allCurrentDataList[index], index, e.startLabel ? e.startLabel - 1 : 0, e.fromLabel);
  }

  onFilter(e: any, filter: any) {
    this.applyFilter(e, filter);
  }

  onFilterNoneSubmitOnlyChange(e: MatCheckboxChange) {
    this.logger.info(e);
    if (e.checked) {
      this.onFilter('UPDATE', this.TABLE_FILTER_KEY.ACTION);
    } else {
      this.onFilter('All', this.TABLE_FILTER_KEY.ACTION);
    }
  }

  updateAuctionBiddingInfo() {
    this.onUpdateData.emit();
  }
}
