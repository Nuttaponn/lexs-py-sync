import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';
import { DEFAULT_DROPDOWN_CONFIG } from '@shared/constant';
import { UntypedFormControl } from '@angular/forms';
import { CollateralGroup, ExternalPaymentTrackingResponse, MeLexsUserDto } from '@lexs/lexs-client';
import { Mode, taskCodeList } from '@shared/models';
import { MatTableDataSource } from '@angular/material/table';
import { SessionService } from '@shared/services/session.service';
import { RouterService } from '@shared/services/router.service';
import { AuctionService } from '@modules/auction/auction.service';
import { PageEvent } from '@shared/components/paginator/paginator.component';
import { TYPE_BUYER_MAPPING } from '@modules/auction/auction.const';
import { AuctionDetailItemPaymentResultService } from '../auction-detail-item-payment-result/auction-detail-item-payment-result.service';

@Component({
  selector: 'app-auction-property-set-buyer',
  templateUrl: './auction-property-set-buyer.component.html',
  styleUrls: ['./auction-property-set-buyer.component.scss'],
})
export class AuctionPropertySetBuyerComponent implements OnInit {
  public isViewMode: boolean = false;
  public isOpened: boolean = true;
  displayedColumns: string[] = ['INDEX', 'PROPERTY_SET_NUMBER', 'BUYER_TYPE', 'BUYER', 'PRICE', 'ACTION'];

  public collateralGroupOption: SimpleSelectOption[] = [];
  public deedNoFilterOption: SimpleSelectOption[] = [];

  public sellTypeFilterOption: SimpleSelectOption[] | any[] = [];

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
  public dropdownSellTypeConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'ประเภทการขาย',
    defaultValue: 'All',
  };

  public TABLE_FILTER_KEY = {
    GROUP: 'fsubbidnum',
    DEEDNO: 'collateralDocNo',
    RESULT: 'saleTypeDesc',
  };

  public assetFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public statusFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public typeFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public filterDictionary = new Map<string, string>();
  public MODE = Mode;
  public currentUser?: MeLexsUserDto;
  public TASK_CODE_LIST = taskCodeList;
  public data: Array<CollateralGroup> = [];
  public allCurrentData: CollateralGroup[] = [];
  public aucRef!: any;
  public pageSize = 10;
  public pageIndex: number = 1;
  public startIndex: number = 1;
  public endIndex: number = 1;
  public dataSusses: number = 0;
  public dataNotSusses: number = 0;
  public aucBiddingId: number = 0;
  @ViewChild('paginator') paginator!: any;
  public collateralsSource: MatTableDataSource<CollateralGroup> = new MatTableDataSource<CollateralGroup>([]);
  public externalPaymentTracking: ExternalPaymentTrackingResponse | undefined;
  public typeBuyer = TYPE_BUYER_MAPPING;

  constructor(
    private sessionService: SessionService,
    private routerService: RouterService,
    private cdRef: ChangeDetectorRef,
    private auctionDetailItemPaymentResultService: AuctionDetailItemPaymentResultService,
    private auctionService: AuctionService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.sessionService.currentUser;
    this.externalPaymentTracking = this.auctionService.externalPaymentTrackingResponse;
    this.aucRef = this.externalPaymentTracking?.aucRef;
    this.data = this.externalPaymentTracking?.collateralGroups || [];
    this.aucBiddingId = this.externalPaymentTracking?.aucBiddingId || 0;
    this.collateralsSource.data = this.data.sort((a: any, b: any) => {
      const result = a.fsubbidnum.toString().localeCompare(b.fsubbidnum.toString(), 'en', { numeric: true });
      return result;
    });
    this.allCurrentData = [...this.collateralsSource.data];
    this.dataSusses = this.data.filter(m => m.paymentTrackingResult)?.length;
    this.dataNotSusses = this.data.filter(m => !m.paymentTrackingResult)?.length;
    this.collateralsSource.filterPredicate = this.getPredicate();
    this.collateralsSource.filteredData = this.collateralsSource.data.slice(0, 10);
    this.cdRef.detectChanges();
    this.collateralGroupOption = this.data.map(it => {
      return { text: `ชุดทรัพย์ที่ ${it.fsubbidnum}`, value: it.fsubbidnum } as SimpleSelectOption;
    });
    this.sellTypeFilterOption = this.data
      .filter(it => {
        it.saleTypeDesc;
      })
      ?.map(it => {
        return { text: it.saleTypeDesc, value: it.saleTypeDesc } as SimpleSelectOption;
      });
    this.deedNoFilterOption = this.data.flatMap(it => {
      return (
        it.collaterals?.flatMap(col => {
          return { text: col.collateralDocNo, value: col.collateralDocNo } as SimpleSelectOption;
        }) || []
      );
    });
    this.deedNoFilterOption = this.deedNoFilterOption.sort((a: any, b: any) => {
      const result = a.value.toString().localeCompare(b.value.toString(), 'en', { numeric: true });
      return result;
    });
    this.sellTypeFilterOption = this.data
      .filter(it => it.saleTypeDesc)
      ?.map(it => {
        return { text: it.saleTypeDesc, value: it.saleTypeDesc } as SimpleSelectOption;
      });
    this.collateralGroupOption = this.getUniqueListByValue(this.collateralGroupOption);
    this.deedNoFilterOption = this.getUniqueListByValue(this.deedNoFilterOption);
    this.sellTypeFilterOption = this.sellTypeFilterOption ? this.getUniqueListByValue(this.sellTypeFilterOption) : [];
    this.collateralGroupOption = [{ text: 'ชุดทรัพย์', value: 'All' } as SimpleSelectOption].concat(
      this.collateralGroupOption
    );
    this.deedNoFilterOption = [{ text: 'เลขที่เอกสารสิทธิ์', value: 'All' } as SimpleSelectOption].concat(
      this.deedNoFilterOption
    );
    this.sellTypeFilterOption = [{ text: 'วิธีการขาย', value: 'All' } as SimpleSelectOption].concat(
      this.sellTypeFilterOption
    );
  }

  onClickItem(data: any) {
    const destination = this.auctionService.routeCorrection('property-detail');
    this.routerService.navigateTo(destination, { fsubbidnum: data.fsubbidnum, aucRef: this.aucRef });
  }

  onViewDetailItem(data: any) {
    const destination = this.auctionService.routeCorrection('auction-item-payment-result');
    this.auctionDetailItemPaymentResultService.collateralGroup = data;
    this.auctionDetailItemPaymentResultService.getCollateralGroupForm(data);
    this.routerService.navigateTo(destination, {
      deedGroupId: data.deedGroupId,
      aucRef: this.aucRef,
      aucBiddingId: this.aucBiddingId,
      isViewMode: true,
      mode: 'VIEW',
    });
  }

  onEditDetailItem(data: any) {
    const destination = this.auctionService.routeCorrection('auction-item-payment-result');
    this.auctionDetailItemPaymentResultService.collateralGroup = data;
    this.auctionDetailItemPaymentResultService.getCollateralGroupForm(data);
    this.routerService.navigateTo(destination, {
      deedGroupId: data.deedGroupId,
      aucRef: this.aucRef,
      aucBiddingId: this.aucBiddingId,
      isViewMode: false,
      mode: 'EDIT',
    });
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

  getUniqueListByValue(arr: SimpleSelectOption[]) {
    return [...new Map(arr.map(item => [item['value'], item])).values()];
  }

  getPredicate() {
    let fun = (record: any, filter: any) => {
      let map = new Map(JSON.parse(filter));
      let isMatch = false;
      for (let [key, value] of map) {
        if (key === this.TABLE_FILTER_KEY.DEEDNO) {
          isMatch =
            value == 'All' ||
            record?.collaterals?.filter((it: any) => (it?.collateralDocNo || '') === value)?.length > 0;
        } else {
          isMatch = value == 'All' || (record[key as keyof any] || '') == value;
        }
        if (!isMatch) return false;
      }
      return isMatch;
    };
    return fun;
  }

  filterToggle(checked: boolean) {
    console.log('checkedcheckedchecked', checked);
    if (checked) {
      this.applyFilter('', 'paymentTrackingResult');
    } else {
      this.applyFilter('All', 'paymentTrackingResult');
    }
  }

  sliceDataTable(allData: any[], start?: number, end?: number) {
    const data = [...allData];
    this.collateralsSource.filteredData = data.slice(start ? start : 0, end ? end : 10);
  }
}
