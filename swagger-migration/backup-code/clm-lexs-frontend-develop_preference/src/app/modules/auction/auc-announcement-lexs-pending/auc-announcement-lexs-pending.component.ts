import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { DEFAULT_DROPDOWN_CONFIG } from '@app/shared/constant';
import { RouterService } from '@app/shared/services/router.service';
import { AuctionLexsSeizureDto, InquiryAnnouncesResponse } from '@lexs/lexs-client';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';
import { AuctionService } from '../auction.service';
import { SeizureSupportTypeEnum } from '@app/modules/seizure-property/models';

@Component({
  selector: 'app-auc-announcement-lexs-pending',
  templateUrl: './auc-announcement-lexs-pending.component.html',
  styleUrls: ['./auc-announcement-lexs-pending.component.scss'],
})
export class AucAnnouncementLexsPendingComponent implements OnInit {
  @Input() data: Array<AuctionLexsSeizureDto> = [];
  @Input() tableColumns: Array<any> = [];
  @Input() canHide = false;
  @Input() anouncementDetail: InquiryAnnouncesResponse | undefined;
  @Output() onUpdateSelectItem = new EventEmitter<any>();
  public isOpened: boolean = true;
  public redCaseFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public ledNameFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public sortControl: UntypedFormControl = new UntypedFormControl('ASC');
  public dropdownFilterGroupConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'คดีหมายเลขแดง',
    defaultValue: 'All',
  };
  public dropdownFilterDocumentConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'สำนักงานบังคับคดี',
    defaultValue: 'All',
  };

  public dropdownDocNoSortConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Sorting',
    labelPlaceHolder: 'วันที่ยึดทรัพย์: จากล่าสุดไปเก่าสุด',
  };

  public redCaseFilterNoOption: SimpleSelectOption[] = [];
  public ledNameFilterOption: SimpleSelectOption[] = [];
  public docNoSortOption: SimpleSelectOption[] = [
    { text: 'วันที่ยึดทรัพย์: จากล่าสุดไปเก่าสุด', value: 'ASC' },
    { text: 'วันที่ยึดทรัพย์: จากเก่าสุดไปล่าสุด', value: 'DESC' },
  ];

  public TABLE_FILTER_KEY = {
    RED_CASE_NO: 'redCaseNo',
    LED_NAME: 'ledId',
  };
  public pageSize = 10;
  public pageIndex: number = 1;
  public piningTableColumns: Array<string> = [];

  public selection = new SelectionModel<string>(true, []);
  public tableDataSource = new MatTableDataSource<AuctionLexsSeizureDto>([]);
  public filterDictionary = new Map<string, string>();

  public allCurrentData: AuctionLexsSeizureDto[] = [];
  @ViewChild('paginator') paginator!: any;

  constructor(
    private auctionService: AuctionService,
    private routerService: RouterService
  ) {}

  ngOnInit(): void {
    this.piningTableColumns = this.tableColumns.map(d => `pin-${d}`);
    this.tableDataSource.data = this.data.sort(
      (a: any, b: any) => new Date(b.seizureTimestamp).getTime() - new Date(a.seizureTimestamp).getTime()
    );
    this.tableDataSource.filterPredicate = this.getPredicate();
    this.tableDataSource.filteredData = this.tableDataSource.data.slice(0, 10);

    this.redCaseFilterNoOption = this.data.map(it => {
      return { text: it.redCaseNo, value: it.redCaseNo } as SimpleSelectOption;
    });
    this.ledNameFilterOption = this.data.map(it => {
      return { text: it.ledName, value: it.ledId } as SimpleSelectOption;
    });

    this.redCaseFilterNoOption = this.auctionService.getUniqueListByValue(this.redCaseFilterNoOption);
    this.ledNameFilterOption = this.auctionService.getUniqueListByValue(this.ledNameFilterOption);

    this.redCaseFilterNoOption = [{ text: 'คดีหมายเลขแดง', value: 'All' } as SimpleSelectOption].concat(
      this.redCaseFilterNoOption
    );
    this.ledNameFilterOption = [{ text: 'สำนักงานบังคับคดี', value: 'All' } as SimpleSelectOption].concat(
      this.ledNameFilterOption
    );

    this.tableDataSource.filterPredicate = this.getPredicate();
    this.allCurrentData = [...this.tableDataSource.data];
    this.sliceDataTable(this.tableDataSource.data);
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      const _selectedColaterals = this.tableDataSource.data.map(m => {
        return m.seizureLedId;
      }) as any[];
      this.selection.select(..._selectedColaterals);
    }
    this.onUpdateSelectItem.emit(this.selection);
  }

  isAllSelected() {
    return this.selection.selected.length === this.tableDataSource.data.length;
  }

  onCheckboxChange(row: any) {
    row.seizureLedId && this.selection.toggle(row.seizureLedId);
    this.onUpdateSelectItem.emit(this.selection);
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
    this.resetPageIndex();
    this.filterDictionary.set(filter, value);
    let jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.tableDataSource.filter = jsonString;
    this.allCurrentData = [...this.tableDataSource.filteredData];
    this.sliceDataTable(this.tableDataSource.filteredData);
  }

  async sortSelected(event: any) {
    let sortListObject;
    if (event == 'ASC') {
      sortListObject = this.allCurrentData.sort(
        (a: any, b: any) => new Date(b.seizureTimestamp).getTime() - new Date(a.seizureTimestamp).getTime()
      );
    } else {
      sortListObject = this.allCurrentData.sort(
        (b: any, a: any) => new Date(b.seizureTimestamp).getTime() - new Date(a.seizureTimestamp).getTime()
      );
    }
    this.tableDataSource = new MatTableDataSource(sortListObject);
    this.tableDataSource.filterPredicate = this.getPredicate();
    this.sliceDataTable(this.tableDataSource.filteredData);
  }

  sliceDataTable(allData: AuctionLexsSeizureDto[], start?: number, end?: number) {
    const data = [...allData];
    this.tableDataSource.filteredData = data.slice(start ? start : 0, end ? end : 10);
  }

  getPredicate() {
    let fun = (record: any, filter: any) => {
      let map = new Map(JSON.parse(filter));
      let isMatch = false;
      for (let [key, value] of map) {
        isMatch = value == 'All' || record[key as keyof AuctionLexsSeizureDto] == value;
        if (!isMatch) return false;
      }
      return isMatch;
    };
    return fun;
  }

  viewLedType(item: AuctionLexsSeizureDto) {
    this.routerService.navigateTo(`/main/lawsuit/seizure-property/execution-detail`, {
      litigationId: this.anouncementDetail?.litigationId,
      litigationCaseId: this.anouncementDetail?.litigationCaseId,
      seizureId: item.seizureId || '',
      seizureLedId: item.seizureLedId,
      createdTimestamp: null,
      hidelawyer: true,
      mode: 'VIEW',
      featureRequest: 'auction',
      supportType: item.seizureType === 'NCOL' ? SeizureSupportTypeEnum.NON_MORTGAGE : '',
    });
  }
}
