import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import {
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { DocumentListDialogComponent } from '@app/shared/components/common-dialogs/document-list-dialog/document-list-dialog.component';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { CollateralTypes } from '@app/shared/constant';
import { IUploadMultiFile } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { AssetInvestigationInspectionAssets, NameValuePair } from '@lexs/lexs-client';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-investigate-property-results-table',
  templateUrl: './investigate-property-results-table.component.html',
  styleUrls: ['./investigate-property-results-table.component.scss'],
})
export class InvestigatePropertyResultsTableComponent implements OnInit, AfterViewChecked {
  @Input() tabIndex: number = 0;
  @Input() mode: 'ASSET' | 'VENHICLE' = 'ASSET';
  @Input() inspectionAssets: Array<AssetInvestigationInspectionAssets> = [];
  @Input() tabIndexChange!: Subject<number>;

  propertyTypeConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: 'FINANCE.HEAD_COLUMN_PROPERTY_TYPE',
    defaultValue: 'ALL',
  };
  propertyStatusConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: 'CUSTOMER.COMMON_LABEL_MARGIN_STATUS_FOUND',
    defaultValue: 'ALL',
  };
  docNoSortingConfig: DropDownConfig = {
    iconName: 'icon-Sorting',
    labelPlaceHolder: '',
  };
  public propertyTypeOptions: Array<NameValuePair> = [];
  public propertyStatusOptions: Array<NameValuePair> = [
    { name: 'สถานะทรัพย์ที่สืบพบ', value: 'ALL' },
    { name: 'ไม่มี', value: 'ไม่มี' },
    { name: 'ถูกยึด', value: 'ถูกยึด' },
    { name: 'ถูกอายัด', value: 'ถูกอายัด' },
    { name: 'ถูกเวนคืน', value: 'ถูกเวนคืน' },
    { name: 'ห้ามโอนกรรมสิทธิ์', value: 'ห้ามโอนกรรมสิทธิ์' },
  ];
  public docNoSortingOptions: SimpleSelectOption[] = [
    { text: 'เลขที่เอกสารสิทธิ์: จากน้อยไปมาก', value: 'DOCUMENT_ASC' },
    { text: 'เลขที่เอกสารสิทธิ์: จากมากไปน้อย', value: 'DOCUMENT_DESC' },
  ];
  public registrationNumberSortingOptions: SimpleSelectOption[] = [
    { text: 'เลขทะเบียนรถ: จากน้อยไปมาก', value: 'registrationNumber_ASC' },
    { text: 'เลขทะเบียนรถ: จากมากไปน้อย', value: 'registrationNumber_DESC' },
  ];
  public vehnicleTypeOptions: Array<NameValuePair> = [
    { name: 'ประเภทยานพาหนะ', value: 'ALL' },
    { name: 'รถยนต์ หรือทะเบียนรถ', value: '1' },
    { name: 'รถจักรยานยนต์ หรือทะเบียนรถ', value: '2' },
  ];
  public propertyType: UntypedFormControl = new UntypedFormControl('ALL');
  public propertyStatus: UntypedFormControl = new UntypedFormControl('ALL');
  public docNo: UntypedFormControl = new UntypedFormControl('DOCUMENT_ASC');
  columns: string[] = [];
  columnsLands: string[] = [
    'order',
    'propertyType',
    'propertySubType',
    'documentNo',
    'propertyDetail',
    'propertyOwner',
    'appraisalPrice',
    'bindingStatus',
    'propertyResultStatus',
    'action',
  ];
  columnsTransport: string[] = [
    'order',
    'vehicleType',
    'owner',
    'vehicleAddress',
    'vehicleRegistration',
    'appraisalPrice',
    'bindingStatus',
    'propertyResultStatus',
    'action',
  ];
  public pageSize = 10;
  public pageIndex: number = 1;
  dataTest = [
    {
      test: '01',
    },
  ];
  public dataSource: MatTableDataSource<AssetInvestigationInspectionAssets> =
    new MatTableDataSource<AssetInvestigationInspectionAssets>();
  @ViewChild('paginator') paginator!: any;
  @ViewChildren(MatTable) table!: QueryList<any>;

  filterDictionary = new Map<string, string>();
  rawFilterValue: any = {};
  allCurrentData: any[] = [];
  public filteredValue: string = '';
  public TABLE_FILTER_KEY = {
    collTypeCode: 'collTypeCode',
    assetStatus: 'assetStatus',
    collSubTypeCode: 'collSubTypeCode',
  };

  constructor(
    private cdf: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.columns = this.tabIndex === 0 ? this.columnsLands : this.columnsTransport;
    this.dataSource = new MatTableDataSource<AssetInvestigationInspectionAssets>(this.inspectionAssets);
    if (this.mode === 'VENHICLE') {
      const _options = this.vehnicleTypeOptions;
      this.propertyTypeOptions = _options;
      this.docNoSortingOptions = this.registrationNumberSortingOptions;
      this.docNo.setValue('registrationNumber_ASC');
    } else {
      const _options = CollateralTypes.filter(it => ['1', '2', '3', '4', '5'].includes(it.collateralTypeCode)).map(
        it => {
          return {
            name: it.collateralTypeDesc,
            value: it.collateralTypeCode,
          } as NameValuePair;
        }
      );
      this.propertyTypeOptions = [{ name: 'ประเภททรัพย์', value: 'ALL' } as NameValuePair].concat(_options);
      this.docNo.setValue('DOCUMENT_ASC');
    }

    this.dataSource.filterPredicate = this.getPredicate();
    this.allCurrentData = [...this.dataSource.data];
    this.sliceDataTable(this.dataSource.data);
    this.tabIndexChange.subscribe(v => {
      this.dataSource = new MatTableDataSource<AssetInvestigationInspectionAssets>(this.inspectionAssets);
      this.propertyType.setValue('ALL');
      this.propertyStatus.setValue('ALL');
      if (this.mode === 'VENHICLE') {
        this.docNo.setValue('registrationNumber_ASC');
      } else {
        this.docNo.setValue('DOCUMENT_ASC');
      }
      this.dataSource.filterPredicate = this.getPredicate();
      this.allCurrentData = [...this.dataSource.data];
      this.sliceDataTable(this.dataSource.data);
    });
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
        this.cdf.detectChanges();
      });
    }
  }

  onSort(event: any) {
    const [type, order] = event.split('_');
    this.sort(type, order);
  }

  sort(type: string, order: string) {
    const dataSorted = this.dataSource.filteredData.sort((a, b) => {
      switch (type) {
        case 'DOCUMENT':
          return order === 'ASC'
            ? (a.documentNo as string).localeCompare(b.documentNo as string, 'en', { numeric: true })
            : (b.documentNo as string).localeCompare(a.documentNo as string, 'en', { numeric: true });
        default:
          return order === 'ASC'
            ? (a.registrationNumber as string).localeCompare(b?.registrationNumber as string, 'en', { numeric: true })
            : (b.registrationNumber as string).localeCompare(a?.registrationNumber as string, 'en', { numeric: true });
      }
    });
    this.dataSource.filteredData = [...dataSorted];
  }

  async documentListDialog() {
    const context = {
      documentList: [],
    };
    await this.notificationService.showCustomDialog({
      component: DocumentListDialogComponent,
      type: 'xlarge',
      iconName: 'icon-Document-Text',
      title: 'AUCTION_DETAIL.AUCTION_PAYMENT.DOCUMENT_LIST',
      rightButtonLabel: 'COMMON.BUTTON_ACKNOWLEDGE',
      buttonIconName: 'icon-Selected',
      context: context,
    });
  }

  async onClickAssetDocuments(element: any) {
    const documentList: IUploadMultiFile[] = (element.assetDocuments ?? []).map((dto: any) => {
      return {
        ...dto,
        uploadDate: dto.docDate,
        imageId: dto.docRefId,
        documentTemplate: {
          ...dto.documentTemplate,
          searchType: dto?.documentTemplate?.searchType,
        },
      } as IUploadMultiFile;
    });

    const context = {
      documentList,
    };
    await this.notificationService.showCustomDialog({
      component: DocumentListDialogComponent,
      type: 'large',
      iconName: 'icon-Document-Text',
      title: 'AUCTION_DETAIL.AUCTION_PAYMENT.DOCUMENT_LIST',
      rightButtonLabel: 'COMMON.BUTTON_ACKNOWLEDGE',
      buttonIconName: 'icon-Selected',
      context: context,
      autoWidth: false,
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

  onFilter(e?: any, filterType?: string) {
    console.log(e);
    this.filteredValue = e;
    this.resetPageIndex();
    this.applyFilter(e, filterType);
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

  getPredicate() {
    let fun = (record: any, filter: any) => {
      let map = new Map(JSON.parse(filter));
      let isMatch = false;
      for (let [key, value] of map) {
        isMatch = value == 'ALL' || record[key as keyof any] == value;
        if (!isMatch) return false;
      }
      return isMatch;
    };
    return fun;
  }

  getUniqueListByValue(arr: NameValuePair[]) {
    return [...new Map(new Set(arr.map(item => [item['value'], item]))).values()];
  }
}
