import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { DEFAULT_DROPDOWN_CONFIG } from '@app/shared/constant';
import { taskCodeList } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { AuctionService } from '../../auction.service';
import { AUCTION_RESULT_MAPPING, AuctionResultSubmitStatus, TYPE_BUYER_MAPPING } from '../../auction.const';
import { AucBiddingResult, AuctionBiddingResultResponse, MeLexsUserDto } from '@lexs/lexs-client';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';

@Component({
  selector: 'app-auction-appointment-date-table',
  templateUrl: './auction-appointment-date-table.component.html',
  styleUrls: ['./auction-appointment-date-table.component.scss'],
})
export class AuctionAppointmentDateTableComponent implements OnInit {
  public displayedColumns: string[] = [
    'INDEX',
    'PROPERTY_SET_NUMBER',
    'SAVEDATE',
    'AUCTION_RESULT',
    'TYPE_BUYER',
    'REMARK',
    'STATUS',
  ];
  public collateralGroupOption: SimpleSelectOption[] = [];
  public deedNoFilterOption: SimpleSelectOption[] = [];
  public assetNoFilterOption: SimpleSelectOption[] = [];
  public dropdownFilterGroupConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'ชุดทรัพย์',
  };
  public dropdownFilterDocumentConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'ผลการขายทอดตลาด',
  };
  public dropdownResultConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'ประเภทผู้ซื้อ',
  };

  public TABLE_FILTER_KEY = {
    FSUBBIDNUM: 'fsubbidnum',
    AUCRESULT: 'aucResult',
    BUYERTYPE: 'buyerType',
  };
  public TRANSLATE_PREFIX = {
    RESULT_BUYER_TYPE: 'RESULT_BUYER_TYPE.',
    MAPPING_RESULT_LABEL: 'MAPPING_RESULT_LABEL.',
  };
  public assetFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public statusFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public typeFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public filterDictionary = new Map<string, string>();
  public currentUser?: MeLexsUserDto;
  public TASK_CODE_LIST = taskCodeList;
  @Input() data!: AuctionBiddingResultResponse | undefined;
  public pageSize = 10;
  public pageIndex: number = 1;
  public startIndex: number = 1;
  public endIndex: number = 1;
  public collateralsSource = new MatTableDataSource<any>([]);
  public aucBiddingResults: AucBiddingResult[] = [];
  public aucBiddingId!: number | undefined;
  @ViewChild('paginator') paginator!: any;
  public allCurrentData: any[] = [];
  public auctionResult = AUCTION_RESULT_MAPPING;
  public typeBuyer = TYPE_BUYER_MAPPING;
  public AUCTION_RESULT_SUBMIT_STATUS = AuctionResultSubmitStatus;

  public MAPPING_RESULT_LABEL = new Map<string, string>([
    ['NO_BIDDER', 'ไม่มีผู้สนใจซื้อ'],
    ['OBJECTION', 'มีผู้ค้านราคา'],
    ['OTHER', 'อื่นๆ'],
    ['UNLAWFUL_NOTICE', 'ส่งหมายไม่ชอบ'],
    ['', '-'],
  ]);

  constructor(
    private sessionService: SessionService,
    private routerService: RouterService,
    private auctionService: AuctionService
  ) {}

  ngOnInit(): void {
    console.log('data', this.data);
    this.currentUser = this.sessionService.currentUser;
    this.aucBiddingResults = this.data?.aucBiddingResults !== undefined ? this.data?.aucBiddingResults : [];
    this.aucBiddingId = this.data?.aucBiddingId;
    this.collateralsSource.data = this.aucBiddingResults
      ?.sort((a: any, b: any) => {
        const result = a.fsubbidnum.toString().localeCompare(b.fsubbidnum.toString(), 'en', { numeric: true });
        return result;
      })
      .map(it => {
        return <any>{
          ...it,
          buyerType: it.buyerType ? it.buyerType : '',
        };
      });
    this.collateralsSource.filterPredicate = this.getPredicate();
    this.collateralsSource.filteredData = this.collateralsSource.data.slice(0, 10);
    console.log('this.collateralsSource.filteredData', this.collateralsSource.filteredData);
    this.collateralGroupOption = this.collateralsSource.filteredData
      .sort((a: any, b: any) => {
        const result = a.fsubbidnum.toString().localeCompare(b.fsubbidnum.toString(), 'en', { numeric: true });
        return result;
      })
      .map(it => {
        return {
          text: it.fsubbidnum ? `ชุดทรัพย์ที่ ${it.fsubbidnum}` : '-',
          value: it.fsubbidnum ? it.fsubbidnum : '-',
        } as SimpleSelectOption;
      });
    this.deedNoFilterOption = this.collateralsSource.filteredData.map(it => {
      return {
        text: it.aucResult ? this.auctionResult.get(it.aucResult) : 'งดขาย',
        value: it.aucResult ? it.aucResult : '',
      } as SimpleSelectOption;
    });
    this.assetNoFilterOption = this.collateralsSource.filteredData.map(it => {
      return {
        text: it.buyerType ? this.typeBuyer.get(it.buyerType) : '-',
        value: it.buyerType ? it.buyerType : '',
      } as SimpleSelectOption;
    });
    this.collateralGroupOption = this.getUniqueListByValue(this.collateralGroupOption);
    this.deedNoFilterOption = this.getUniqueListByValue(this.deedNoFilterOption);
    this.assetNoFilterOption = this.getUniqueListByValue(this.assetNoFilterOption);
    this.collateralGroupOption = [{ text: 'ชุดทรัพย์', value: 'All' } as SimpleSelectOption].concat(
      this.collateralGroupOption
    );
    this.deedNoFilterOption = [{ text: 'ผลการขายทอดตลาด', value: 'All' } as SimpleSelectOption].concat(
      this.deedNoFilterOption
    );
    this.assetNoFilterOption = [{ text: 'ประเภทผู้ซื้อ', value: 'All' } as SimpleSelectOption].concat(
      this.assetNoFilterOption
    );
    this.allCurrentData = [...this.collateralsSource.data];
    this.sliceDataTable(this.collateralsSource.data);
  }

  sliceDataTable(allData: any[], start?: number, end?: number) {
    const data = [...allData];
    this.collateralsSource.filteredData = data.slice(start ? start : 0, end ? end : 10);
    console.log('this.allCurrentData apply ', this.collateralsSource.filteredData);
  }

  async onClickItem(data: any) {
    // pass value to get API
    const destination = this.auctionService.routeCorrection('property-detail');
    this.routerService.navigateTo(destination, { fsubbidnum: data.fsubbidnum, aucRef: this.data?.aucRef });
  }

  onPaging(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.startIndex = e.startLabel || 0;
    this.endIndex = e.fromLabel || 0;
    this.sliceDataTable(this.allCurrentData, e.startLabel ? e.startLabel - 1 : 0, e.fromLabel);
  }

  applyFilter(value: string, filter: any) {
    if (this.paginator) {
      this.paginator['pageIndex'] = 1;
    }
    this.pageIndex = 1;
    this.startIndex = 1;
    this.endIndex = 1;
    this.filterDictionary.set(filter, value);
    let jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.collateralsSource.filter = jsonString;
    this.allCurrentData = [...this.collateralsSource.filteredData];
    this.sliceDataTable(this.collateralsSource.filteredData);
  }

  prependDefaultValue(text: string) {
    return { text: text, value: 'All' } as SimpleSelectOption;
  }

  getUniqueListByValue(arr: SimpleSelectOption[]) {
    return [...new Map(arr.map(item => [item['value'], item])).values()];
  }

  getPredicate() {
    let fun = (record: any, filter: any) => {
      let map = new Map(JSON.parse(filter));
      let isMatch = false;
      for (let [key, value] of map) {
        if (key === this.TABLE_FILTER_KEY.BUYERTYPE) {
          isMatch = value == 'All' || (record?.buyerType || '') === value || record?.buyerType === value;
        } else if (key === this.TABLE_FILTER_KEY.AUCRESULT) {
          isMatch = value == 'All' || (record?.aucResult || '') === value || record?.aucResult === value;
        } else {
          isMatch = value == 'All' || (record[key as keyof any] || '') == value;
        }
        if (!isMatch) return false;
      }
      return isMatch;
    };
    return fun;
  }

  actionClick(data: any) {
    const destination = this.auctionService.routeCorrection('appointment-date-detail');
    this.routerService.navigateTo(destination, {
      deedGroupId: data.deedGroupId,
      aucBiddingId: this.aucBiddingId,
      aucBiddingDeedGroupId: data.aucBiddingDeedGroupId,
    });
  }
}
