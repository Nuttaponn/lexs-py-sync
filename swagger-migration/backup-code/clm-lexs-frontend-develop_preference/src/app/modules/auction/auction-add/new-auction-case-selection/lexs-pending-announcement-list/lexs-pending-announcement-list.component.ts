import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DEFAULT_DROPDOWN_CONFIG } from '@app/shared/constant';
import { RouterService } from '@app/shared/services/router.service';
import { NameValuePair } from '@lexs/lexs-client';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';
import { LexsAnnouncementDto, exampleData } from '../../auction-add.interface';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';

@Component({
  selector: 'app-lexs-pending-announcement-list',
  // standalone: true,
  // imports: [],
  templateUrl: './lexs-pending-announcement-list.component.html',
  styleUrl: './lexs-pending-announcement-list.component.scss'
})
export class LexsPendingAnnouncementListComponent {
// ตัวอย่าง app-external-documents-search-controller
  // คดีหมายเลขแดง
  public TABLE_FILTER_KEY = {
    // aucLot: 'aucLot',
    // aucSet: 'aucSet',
    // fbidnum: 'fbidnum',
    redCaseNo: 'redCaseNo',
    lawCourtId: 'ledOriginalName',
    // matchingStatus: 'matchingStatusName',
    // aucStatusName: 'aucStatusName',
    // defendantName: 'defendantName',
  };

  public redCaseNoConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'EXTERNAL_DOCUMENTS_SEARCH_CONTROL.LABEL_RED_CASE_NO',
  };
  @Input() redCaseNoOptions: NameValuePair[] = [];

  // สำนักงานบังคับคดี
  public legalExecutionOfficeConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'EXTERNAL_DOCUMENTS_SEARCH_CONTROL.LEGAL_EXECUTION_OFFICE',
  };
  @Input() legalExecutionOfficeOptions: NameValuePair[] = [];

  // ตัวอย่าง app-auc-announcement-lexs-pending
  // วันที่ยึดทรัพย์: จากล่าสุดไปเก่าสุด
  public dropdownDocNoSortConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Sorting',
    labelPlaceHolder: 'วันที่ยึดทรัพย์: จากล่าสุดไปเก่าสุด',
  };

  public sortControl: UntypedFormControl = new UntypedFormControl('ASC');
  public docNoSortOption: SimpleSelectOption[] = [
    { text: 'วันที่ยึดทรัพย์: จากล่าสุดไปเก่าสุด', value: 'ASC' },
    { text: 'วันที่ยึดทรัพย์: จากเก่าสุดไปล่าสุด', value: 'DESC' },
  ];

  public searchCtrl!: UntypedFormGroup;
  public pageSize = 10;
  public pageIndex = 1;

  public tableColumns = ['selection', 'no', 'redCaseNo', 'ledName', 'civilCourtName', 'seizureDate', 'ledType'];

  public tableDataSource = new MatTableDataSource<LexsAnnouncementDto>([]);

  public selection = new SelectionModel<LexsAnnouncementDto>(true, []);

  constructor(
    private fb: FormBuilder,
    private routerService: RouterService,
  ) {}

  ngOnInit(): void {
    /** init search control */
    this.searchCtrl = this.initSearchControl(/*this._condition*/);

    // auc-announcement-lexs-pending.component.ts -> example data table with paging
    this.tableDataSource.data = exampleData;
    this.tableDataSource.filteredData = this.tableDataSource.data.slice(0, 10);
  }

  // Toggles all rows in the selection
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.tableDataSource.filteredData);
    }
  }

  // Checks if all rows are selected
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableDataSource.filteredData.length;
    return numSelected === numRows;
  }

  // Toggles the selection of a single row
  onCheckboxChange(row: LexsAnnouncementDto) {
    this.selection.toggle(row);
  }

  // Emits the selected items
  getSelectedItems(): LexsAnnouncementDto[] {
    return this.selection.selected;
  }

  onPaging(e: PageEvent) {
    this.pageIndex = e.startLabel || 0;
    this.sliceDataTable(this.tableDataSource.data, e.startLabel ? e.startLabel - 1 : 0, e.fromLabel);
  }

  sliceDataTable(allData: any[], start?: number, end?: number) {
    const data = [...allData];
    this.tableDataSource.filteredData = data.slice(start ? start : 0, end ? end : 10);
  }

  initSearchControl(/* condition?: AucAnnouncementKTBSearchConditionRequest */) {
    /*
    return this.fb.group({
      lot: (condition as AucAnnouncementKTBSearchConditionRequest)?.lot || 'N/A',
      set: (condition as AucAnnouncementKTBSearchConditionRequest)?.set || 'N/A',
      orderNo: (condition as AucAnnouncementKTBSearchConditionRequest)?.orderNo || 'N/A',
      redCaseNo: (condition as AucAnnouncementKTBSearchConditionRequest)?.redCaseNo || 'N/A',
      legalExecutionOffice: (condition as AucAnnouncementKTBSearchConditionRequest)?.legalExecutionOffice || 'N/A',
      status: (condition as AucAnnouncementKTBSearchConditionRequest)?.status || 'N/A',
      defendant: (condition as AucAnnouncementKTBSearchConditionRequest)?.defendant || 'N/A',
    });
    */
    return this.fb.group({
      redCaseNo: 'N/A',
      legalExecutionOffice: 'N/A',
    });
  }

  async onSelectedOption(_selectedBy?: string) {
    /*
    this.onSearch();
    let value = '';
    switch (_selectedBy) {
      case this.TABLE_FILTER_KEY.aucLot:
        value = this.searchCtrl.get('lot')?.value;
        break;
      case this.TABLE_FILTER_KEY.aucSet:
        value = this.searchCtrl.get('set')?.value;
        break;
      case this.TABLE_FILTER_KEY.fbidnum:
        value = this.searchCtrl.get('orderNo')?.value;
        break;
      case this.TABLE_FILTER_KEY.redCaseNo:
        value = this.searchCtrl.get('redCaseNo')?.value;
        break;
      case this.TABLE_FILTER_KEY.lawCourtId:
        value = this.searchCtrl.get('legalExecutionOffice')?.value;
        break;
      case this.TABLE_FILTER_KEY.matchingStatus:
      case this.TABLE_FILTER_KEY.aucStatusName:
        value = this.searchCtrl.get('status')?.value;
        break;
      case this.TABLE_FILTER_KEY.defendantName:
        value = this.searchCtrl.get('defendant')?.value;
        break;
      default:
        break;
    }
    const dataFilter = { filter: _selectedBy, value: value, rawValue: this.searchCtrl.getRawValue() };
    this.onApplyFilter.emit(dataFilter);
    */
  }

  async sortSelected(event: any) {
    /*
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
    */
  }

  navigateToSeizureProperty(data?: any) {
    /*
    this.routerService.navigateTo(`/main/lawsuit/seizure-property/execution-detail`, {
      litigationId: this.lawsuitService.currentLitigation.litigationId,
      litigationCaseId: this.litigationCaseId,
      seizureId: data?.seizureId || '0',
      seizureLedId: data?.seizureLedsId,
      createdTimestamp: null,
      hidelawyer: true,
      mode: 'VIEW',
      featureRequest: 'auction',
      supportType: data?.seizureType === 'NCOL' ? SeizureSupportTypeEnum.NON_MORTGAGE : '',
    });
    */
  }
}
