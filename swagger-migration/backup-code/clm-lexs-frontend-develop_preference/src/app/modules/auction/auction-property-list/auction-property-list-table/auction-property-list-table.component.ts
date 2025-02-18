import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { DEFAULT_DROPDOWN_CONFIG } from '@app/shared/constant';
import { taskCodeList } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { AuctionBiddingCollateralsSummaryResponse, DeedGroup, MeLexsUserDto } from '@lexs/lexs-client';
import { AuctionService } from '../../auction.service';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';

@Component({
  selector: 'app-auction-property-list-table',
  templateUrl: './auction-property-list-table.component.html',
  styleUrls: ['./auction-property-list-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AuctionPropertyListTableComponent implements OnInit {
  public displayedColumns: string[] = [
    'INDEX',
    'PROPERTY_SET_NUMBER',
    'PROPERTY_TOTAL',
    'SALES_TYPE',
    'OUTSIDER_COLLATERAL_PRICE',
    'SUBSTITUTE_COLLATERAL_PRICE',
    'EXPERT_VALUATION_PRICE',
    'EXECUTION_OFFICER_VALUATION_PRICE',
    'COMMITTEE_PROPERTY_VALUATION_PRICE',
    'ASSESSMENT_OFFICER_VALUATION_PRICE',
    'STATUS',
  ];

  public collateralGroupOption: SimpleSelectOption[] = [];
  public deedNoFilterOption: SimpleSelectOption[] = [];
  public assetNoFilterOption: SimpleSelectOption[] = [];
  public dropdownFilterGroupConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'ชุดทรัพย์',
    defaultValue: 'All',
  };
  public dropdownFilterDocumentConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'เลขที่เอกสารสิทธิ์',
    defaultValue: 'All',
  };
  public dropdownResultConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'เลขที่หลักประกัน',
    defaultValue: 'All',
  };
  public TABLE_FILTER_KEY = {
    GROUP: 'fsubbidnum',
    DEEDNO: 'collateralDocNo',
    RESULT: 'collateralId',
  };

  public assetFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public statusFilterControl: UntypedFormControl = new UntypedFormControl('All');

  public typeFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public filteListrDictionary = new Map<string, string>();

  public filterDictionary = new Map<string, string>();

  public currentUser?: MeLexsUserDto;
  public TASK_CODE_LIST = taskCodeList;
  @Input() data: AuctionBiddingCollateralsSummaryResponse | undefined;
  public pageSize = 10;
  public pageIndex: number = 1;
  public startIndex: number = 1;
  public endIndex: number = 1;

  public collateralsSource = new MatTableDataSource<any>([]);
  public collateralsSourceList = new MatTableDataSource<any>([]);
  public dataProperty: DeedGroup[] = [];
  @ViewChild('paginator') paginator!: any;
  public allCurrentData: any[] = [];

  constructor(
    private sessionService: SessionService,
    private routerService: RouterService,
    private auctionService: AuctionService
  ) {}

  ngOnInit(): void {
    console.log('data AuctionPropertyListTableComponent', this.data);
    this.currentUser = this.sessionService.currentUser;
    this.dataProperty = this.data?.deedGroups !== undefined ? this.data?.deedGroups : [];

    let tempData = this.dataProperty.map((it, index) => {
      return <any>{
        orderNumber: '' + (index + 1),
        ...it,
        idCheck: 'true', // check data
        deeds: it.deeds?.map((x: any, i: number) => {
          return <any>{
            orderNumber: '' + (i + 1),
            ...x,
            fsubbidnum: it.fsubbidnum,
          };
        }),
      };
    });

    tempData.forEach((x: any) => {
      let dataTemp = new MatTableDataSource<any>([]);
      let dTemp = x.deeds;
      x.deeds = dataTemp;
      x.deeds.data = dTemp;
      x.deeds.filterPredicate = this.getPredicate();
      x.deeds.filteredData = x.deeds.data.slice(0, 10);
    });
    this.collateralsSource.data = tempData;

    this.collateralsSource.data = this.collateralsSource.data.sort((a: any, b: any) => {
      const result = a.fsubbidnum.toString().localeCompare(b.fsubbidnum.toString(), 'en', { numeric: true });
      return result;
    });

    this.collateralsSource.filterPredicate = this.getPredicate();
    this.collateralsSource.filteredData = this.collateralsSource.data.slice(0, 10);
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
    this.deedNoFilterOption = this.collateralsSource.filteredData.flatMap((it: any) =>
      it.deeds.filteredData.flatMap((c: any) => {
        return {
          text: c.collateralDocNo ? c.collateralDocNo : '-',
          value: c.collateralDocNo ? c.collateralDocNo : '-',
        } as SimpleSelectOption;
      })
    );
    this.deedNoFilterOption = this.deedNoFilterOption.sort((a: any, b: any) => {
      const result = a.value.toString().localeCompare(b.value.toString(), 'en', { numeric: true });
      return result;
    });
    this.assetNoFilterOption = this.collateralsSource.filteredData.flatMap((it: any) =>
      it.deeds.filteredData.flatMap((c: any) => {
        return {
          text: c.collateralId ? c.collateralId : '-',
          value: c.collateralId ? c.collateralId : '-',
        } as SimpleSelectOption;
      })
    );
    this.assetNoFilterOption = this.assetNoFilterOption.sort((a: any, b: any) => {
      const result = a.value.toString().localeCompare(b.value.toString(), 'en', { numeric: true });
      return result;
    });
    this.collateralGroupOption = this.getUniqueListByValue(this.collateralGroupOption);
    this.deedNoFilterOption = this.getUniqueListByValue(this.deedNoFilterOption);
    this.assetNoFilterOption = this.getUniqueListByValue(this.assetNoFilterOption);
    this.collateralGroupOption = [{ text: 'ทุกชุดทรัพย์', value: 'All' } as SimpleSelectOption].concat(
      this.collateralGroupOption
    );
    this.deedNoFilterOption = [{ text: 'ทุกเลขที่เอกสารสิทธิ์', value: 'All' } as SimpleSelectOption].concat(
      this.deedNoFilterOption
    );
    this.assetNoFilterOption = [{ text: 'ทุกเลขที่หลักประกัน', value: 'All' } as SimpleSelectOption].concat(
      this.assetNoFilterOption
    );
    this.allCurrentData = [...this.collateralsSource.data];
    this.sliceDataTable(this.collateralsSource.data);
  }

  async onClickItem(data: any) {
    const destination = this.auctionService.routeCorrection('property-detail');
    this.routerService.navigateTo(destination, {
      fsubbidnum: data.fsubbidnum,
      aucRef: this.data?.aucRef,
      npaStatus: data.npaStatus,
    });
  }

  sliceDataTable(allData: any[], start?: number, end?: number) {
    const data = [...allData];
    this.collateralsSource.filteredData = data.slice(start ? start : 0, end ? end : 10);
    console.log('this.allCurrentData apply ', this.collateralsSource.filteredData);
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

    this.filteListrDictionary.set(filter, value);
    let jsonStringdeedGroupId = JSON.stringify(Array.from(this.filteListrDictionary.entries()));
    this.collateralsSource.data.forEach((it: any) => {
      it.deeds.filter = jsonStringdeedGroupId;
    });
    this.collateralsSource.filteredData = this.collateralsSource.data;
    this.collateralsSource.filteredData.forEach((it: any) => {
      it.idCheck = it.deeds.filteredData.length > 0 ? 'true' : 'false';
    });

    let valueFilter = 'true';
    this.filterDictionary.set('idCheck', valueFilter);
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
        isMatch = value == 'All' || record[key as keyof any] == value;
        if (!isMatch) return false;
      }
      return isMatch;
    };
    return fun;
  }
}
