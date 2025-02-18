import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
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
import { TaskService } from '@app/modules/task/services/task.service';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { CollateralStatus, SeizureCollateralTypes } from '@app/shared/constant';
import { IUploadMultiFile, taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { CollType, LitigationCaseCollaterals, NameValuePair, NonPledgePropertiesAsset } from '@lexs/lexs-client';
import {
  AdvanceSearchOption,
  SearchConditionRequest,
} from '@shared/components/search-controller/search-controller.model';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';
import { SeizurePropertyService } from '../seizure-property.service';
import { Asset } from './seizure-list-info-non-pledge.model';
import { DocumentListDialogComponent } from '@app/shared/components/common-dialogs/document-list-dialog/document-list-dialog.component';
import { NotificationService } from '@app/shared/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-seizure-list-info',
  templateUrl: './seizure-list-info.component.html',
  styleUrls: ['./seizure-list-info.component.scss'],
})
export class SeizureListInfoComponent implements OnInit, AfterViewChecked, OnDestroy {
  public seizureListInfoObject = new MatTableDataSource<any>(
    this.litigationCaseService?.documentsCollaterals?.collaterals
  );
  public seizureList = new MatTableDataSource<any>(this.litigationCaseService?.documentsCollaterals?.collaterals);
  public documentsCollaterals: any = this.litigationCaseService.documentsCollaterals;
  @ViewChild('paginator') paginator!: any;
  @ViewChildren(MatTable) table!: QueryList<any>;

  public isOpened: boolean = true;
  public taskCode!: taskCode; // use for check editable when navigate from litigation detail screen.

  /** Selection */
  public selection = new SelectionModel<number | NonPledgePropertiesAsset>(true, []);
  public selectionPerPage = new Map<number, SelectionModel<number | NonPledgePropertiesAsset>>();
  // public currentPageSelection = new SelectionModel<number | NonPledgePropertiesAsset>(true);

  //config-dropdown
  private configDropdown: DropDownConfig = { iconName: 'icon-Sorting', searchPlaceHolder: '' };

  //order
  private orderOptions = [
    { text: 'เลขที่หลักประกัน: จากน้อยไปมาก', value: '1' },
    { text: 'เลขที่หลักประกัน: จากมากไปน้อย', value: '2' },
  ];

  public orderByDocumentNoOptions = [
    { text: 'เลขที่เอกสารสิทธิ์: จากน้อยไปมาก', value: '1' },
    { text: 'เลขที่เอกสารสิทธิ์: จากมากไปน้อย', value: '2' },
  ];

  // search-filter
  public tabIndex = 0;
  public advanceOptions!: AdvanceSearchOption;
  public myCustSearch: SearchConditionRequest = {};
  public teamCustSearch: SearchConditionRequest = {};
  public orgzCustSearch: SearchConditionRequest = {};
  public compCustSearch: SearchConditionRequest = {};
  public collateralTypeList!: Array<CollType>;
  public collateralStatusList!: Array<NameValuePair>;
  public myCustSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  public mode: string = 'VIEW'; // declare for navigate from litigation detail screen.

  public myCollateralTypeOptionsCtrl: UntypedFormControl = new UntypedFormControl('ALL');
  public myCollateralStatusList: UntypedFormControl = new UntypedFormControl('ALL');
  public myCustSortingCtrl: UntypedFormControl = new UntypedFormControl('1');
  public myCustSortingConfig: DropDownConfig = this.configDropdown;
  public getLitigationCase: any;
  public maxLength: number = this.documentsCollaterals?.collaterals?.length;
  public totalAppraisalValue: number = 0;
  public pageSize = 10;
  public pageIndex: number = 1;
  public dataSource = new MatTableDataSource<LitigationCaseCollaterals | NonPledgePropertiesAsset>(
    this.litigationCaseService?.documentsCollaterals?.collaterals
  );
  public pageData: Array<LitigationCaseCollaterals | NonPledgePropertiesAsset> = [];
  public disabledAll: boolean = false;
  public canEditCollaterals = false;

  get isNonePledgeTask() {
    return (
      [taskCode.R2E05_07_2A].includes(this.taskCode) ||
      this.seizurePropertyService.seizurePageType === SeizureCollateralTypes.NON_PLEDGE
    );
  }

  public TABLE_FILTER_KEY = {
    ASSET_TYPE: 'assetType',
    COLLATERAL_TYPE: 'collateralType',
    COLLATERAL_CASE_LEX_STATUS: 'collateralCaseLexStatus',
  };

  public filterDictionary = new Map<string, string>();
  public filteListrDictionary = new Map<string, string>();
  public startIndex: number = 1;
  public endIndex: number = 1;
  allCurrentData: any[] = [];

  constructor(
    public litigationCaseService: LitigationCaseService,
    private taskService: TaskService,
    private seizurePropertyService: SeizurePropertyService,
    private masterDataService: MasterDataService,
    private cdf: ChangeDetectorRef,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  columns: string[] = [
    'order',
    'collateralId',
    'collateralType',
    'collateralSubType',
    'documentNo',
    'collateralDetails',
    'ownerName',
    'totalAppraisalValue',
    'collateralCmsStatus',
    'collateralCaseLexStatus',
  ];

  nonPledgeAssetColumns: string[] = [
    // 'selection', // isSelected
    'orderWithElevationLeft', // ลำดับ
    'assetTypeDesc', // ประเภททรัพย์ +
    'assetSubTypeDesc', // ประเภทย่อย +
    'documentNo', // เลขที่เอกสารสิทธิ์
    'collateralDetails', // รายละเอียดทรัพย์
    'ownerName', // เจ้าของกรรมสิทธิ์
    'totalAppraisalValue', // ราคาประเมิน (บาท)
    'obligationStatus', // ภาระผูกพัน +
    'seizureStatus', // สถานะทรัพย์ที่สืบพบ +
    'collateralCaseLexStatus', // สถานะทรัพย์(LEXS)
    'assetDocuments', // รายการเอกสาร +
  ];

  statusConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    searchWith: 'text',
    labelPlaceHolder: 'เลขที่หลักประกัน: จากน้อยไปมาก',
  };

  statusConfigCollateralType: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'collateralTypeDesc',
    valueField: 'collateralTypeCode',
    searchWith: 'text',
    labelPlaceHolder: this.translate.instant('PROPERTY.COLLATERAL_TYPE'),
    defaultValue: 'ALL',
  };

  collateralList: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchWith: 'text',
    labelPlaceHolder: 'สถานะหลักประกัน(LEXS)',
    defaultValue: 'ALL',
  };

  seizurePageType = this.seizurePropertyService.seizurePageType;

  async ngOnInit(): Promise<void> {
    this.mode = this.seizurePropertyService.mode;
    this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    switch (this.seizurePageType) {
      case 'NON-PLEDGE':
        if (this.mode === 'VIEW' && !this.taskCode) {
          this.columns = this.nonPledgeAssetColumns;
          this.seizureListInfoObject = new MatTableDataSource<any>(
            this.litigationCaseService?.documentsCollaterals?.collaterals
          );
          this.seizureList = new MatTableDataSource<any>(this.litigationCaseService?.documentsCollaterals?.collaterals);
          this.dataSource = new MatTableDataSource<LitigationCaseCollaterals | NonPledgePropertiesAsset>(
            this.litigationCaseService?.documentsCollaterals?.collaterals || []
          ); // TODO: pallop recheck triplet of dataSource
          this.maxLength = this.litigationCaseService?.documentsCollaterals?.collaterals?.length || 0;
        } else {
          this.columns = this.nonPledgeAssetColumns;
          this.seizureListInfoObject = new MatTableDataSource<any>(this.seizurePropertyService?.seizureDTO?.assets);
          this.seizureList = new MatTableDataSource<any>(this.seizurePropertyService?.seizureDTO?.assets);
          this.dataSource = new MatTableDataSource<LitigationCaseCollaterals | NonPledgePropertiesAsset>(
            this.seizurePropertyService?.seizureDTO?.assets || []
          ); // TODO: pallop recheck triplet of dataSource
          this.maxLength = this.seizurePropertyService?.seizureDTO?.assets?.length || 0;
        }
        break;
    }

    this.initData();
    this.slice10();
    if (this.mode === 'EDIT') {
      if (this.taskService.taskDetail.taskCode === 'R2E05-01-2D') {
        await this.getLitigationCaseCollateralsSeizurePrepDraft();
        this.myCollateralStatusList.setValue('PLEDGE');
        this.myCollateralStatusList.updateValueAndValidity();
      } else if (this.isNonePledgeTask) {
        this.myCollateralStatusList.setValue('PLEDGE');
        this.myCollateralStatusList.updateValueAndValidity();
        this.setNonPledgeSelection();
      }
    } else if (
      this.mode === 'VIEW' &&
      this.seizurePropertyService.seizurePageType === SeizureCollateralTypes.NON_PLEDGE
    ) {
      this.myCollateralStatusList.setValue('PLEDGE');
      this.myCollateralStatusList.updateValueAndValidity();
    } else {
      this.reduceTotalAppraisalValue();
    }
    this.collateralTypeList = await this.masterDataService.getCollateralTypeOptions(['97', '98']);
    this.getCollateralStatus();
    this.checkDisableAll();
    this.seizureList.data = this.seizureList.data.sort((a: any, b: any) => {
      const result = (a.documentNo ? a.documentNo.toString() : '').localeCompare(
        b.documentNo ? b.documentNo.toString() : '',
        'en',
        {
          numeric: true,
        }
      );
      return result;
    });
    this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
      const result = (a.documentNo ? a.documentNo.toString() : '').localeCompare(
        b.documentNo ? b.documentNo.toString() : '',
        'en',
        { numeric: true }
      );
      return result;
    });
    this.seizureList.filterPredicate = this.getPredicate();
    this.dataSource.filterPredicate = this.getPredicate();
    this.sliceDataTable(this.seizureList.data);
    this.sliceDataTable(this.dataSource.data);
    this.allCurrentData = [...this.dataSource.data];
  }

  initData() {
    this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    this.mode = this.seizurePropertyService.mode || 'VIEW';
    if (this.mode !== 'VIEW') {
      if (!!this.taskCode) {
        if (this.taskCode === 'R2E05-01-2D') {
          this.columns = ['selection'].concat(this.columns);
          this.canEditCollaterals = true;
        } else if (
          this.isNonePledgeTask &&
          this.mode !== 'VIEW' &&
          ![taskCode.R2E05_08_3A, taskCode.R2E05_09_4].includes(this.taskCode)
        ) {
          this.columns = ['selection'].concat(this.nonPledgeAssetColumns);
          this.canEditCollaterals = true;
        }
        if (
          ![taskCode.R2E05_06_3F].includes(this.taskCode as taskCode) ||
          this.seizurePropertyService.seizurePageType === SeizureCollateralTypes.NON_PLEDGE
        ) {
          this.myCollateralStatusList.setValue('PLEDGE');
          this.myCollateralStatusList.updateValueAndValidity();
        }
      } else {
        this.columns = ['selection'].concat(this.columns);
        this.canEditCollaterals = true;
      }
    }
  }

  private slice10() {
    this.dataSource.filteredData = this.dataSource.data.slice(0, 10);
  }

  private checkDisableAll() {
    this.disabledAll = this.dataSource.filteredData.every(f => f.disabled);
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
        this.cdf.detectChanges();
      });
    }
  }

  private getCollateralStatus() {
    this.collateralStatusList = CollateralStatus;
  }

  private getListCollateralsDraft() {
    if (this.litigationCaseService.listCollaterals.length > 0) {
      this.getListCollateralsService();
    } else {
      if (this.getLitigationCase.collateralIdList.length > 0) {
        const listStates = this.seizurePropertyService?.selection?.selected.map((it: any) => it.collateralId);
        for (let index = 0; index < this.getLitigationCase.collateralIdList.length; index++) {
          this.seizureListInfoObject.data.forEach(row => {
            if (
              this.getLitigationCase.collateralIdList[index] == row.collateralId ||
              listStates.includes(row.collateralId)
            ) {
              if (!row.disabled) {
                this.selection.select(row);
              }
            }
          });
          this.checkList();
        }
        this.reduceTotalAppraisalValue();
      } else {
        if (this.mode === 'EDIT') {
          this.isCheckAll(true, true);
        } else {
          this.seizureListInfoObject.data = this.seizureListInfoObject.data?.filter(f =>
            this.getLitigationCase.collateralIdList?.includes(f?.relatedCollateral?.collateralId)
          );
        }
      }
    }
  }

  private getListCollateralsService() {
    if (this.litigationCaseService.listCollaterals.length > 0) {
      let listCollaterals = this.litigationCaseService.listCollaterals;
      for (let index = 0; index < listCollaterals.length; index++) {
        this.seizureListInfoObject.data.forEach(row => {
          if (listCollaterals[index] == row.collateralId) {
            this.selection.select(row);
          }
        });
        this.checkList();
      }
    }
  }

  private async getLitigationCaseCollateralsSeizurePrepDraft() {
    let litigationCaseId = this.taskService.taskDetail.litigationCaseId || '';
    this.getLitigationCase = await this.seizurePropertyService.getLitigationCaseCollateralsSeizurePrepDraft(
      Number(litigationCaseId)
    );
    this.getListCollateralsDraft();
  }

  private setNonPledgeSelection() {
    if (this.seizurePropertyService?.seizureDTO?.assets?.length || 0 > 0) {
      if ([taskCode.R2E05_07_2A].includes(this.taskCode)) {
        const listStates = this.seizurePropertyService?.selection?.selected.map((it: any) => it.assetId);
        this.seizurePropertyService?.seizureDTO?.assets?.forEach(it => {
          if (
            (it.isSelected === true &&
              !it.disabled &&
              !it.seizuredByLitigationId &&
              it.collateralCaseLexStatus !== 'SEIZURED') ||
            listStates.includes(it.assetId)
          ) {
            this.selection.select(it);
          }
        });

        this.checkList();
      } else {
        this.isCheckAll(true, true);
      }
    }
  }

  sortSelected(event: any) {
    let seizureListInfoObject;
    if (event == '1') {
      seizureListInfoObject = this.seizureListInfoObject.filteredData.sort(
        (a: any, b: any) => a.collateralId - b.collateralId
      );
    } else {
      seizureListInfoObject = this.seizureListInfoObject.filteredData.sort(
        (a: any, b: any) => b.collateralId - a.collateralId
      );
    }
    this.dataSource = new MatTableDataSource(seizureListInfoObject);
    this.seizureListInfoObject.filteredData = seizureListInfoObject;
    this.slice10();
    this.setPageIndex();
    this.dataSource.filterPredicate = this.getPredicate();
    this.sliceDataTable(this.dataSource.filteredData);
  }

  sortByDocumentNo(event: any) {
    let seizureListInfoObject;
    if (event == '1') {
      seizureListInfoObject = this.seizureListInfoObject.filteredData.sort((a: any, b: any) => {
        const result = (a.documentNo ? a.documentNo.toString() : '').localeCompare(
          b.documentNo ? b.documentNo.toString() : '',
          'en',
          { numeric: true }
        );
        return result;
      });
    } else {
      seizureListInfoObject = this.seizureListInfoObject.filteredData.sort(
        (a: any, b: any) => b.documentNo - a.documentNo
      );
      seizureListInfoObject = this.seizureListInfoObject.filteredData.sort((a: any, b: any) => {
        const result = (a.documentNo ? a.documentNo.toString() : '').localeCompare(
          b.documentNo ? b.documentNo.toString() : '',
          'en',
          { numeric: true }
        );
        return -result;
      });
    }
    this.dataSource = new MatTableDataSource(seizureListInfoObject);
    this.seizureListInfoObject.filteredData = seizureListInfoObject;
    this.slice10();
    this.setPageIndex();
    this.dataSource.filterPredicate = this.getPredicate();
    this.sliceDataTable(this.dataSource.filteredData);
  }

  filterCollateralType(event: any) {
    let seizureListInfoObject = [];
    switch (this.seizurePageType) {
      case 'NON-PLEDGE':
        seizureListInfoObject = this.seizureListInfoObject.data.filter((obj: any) => {
          return (
            (obj.assetType.toString() === event || event === 'ALL') &&
            (obj.assetType.toString() === this.myCollateralTypeOptionsCtrl.value ||
              this.myCollateralTypeOptionsCtrl.value === 'ALL')
          );
        });
        break;
      default:
        seizureListInfoObject = this.seizureListInfoObject.data.filter((obj: any) => {
          return (
            (obj.collateralType == event || event === 'ALL') &&
            (obj.collateralCaseLexStatus === this.myCollateralStatusList.value ||
              this.myCollateralStatusList.value === 'ALL')
          );
        });
        break;
    }

    this.dataSource = new MatTableDataSource(seizureListInfoObject);
    this.seizureListInfoObject.filteredData = seizureListInfoObject;
    this.sortSelected(this.myCustSortingCtrl.value);
    this.slice10();
    this.setPageIndex();
    this.checkDisableAll();
  }

  filterCollateralStatus(event: any) {
    let seizureListInfoObject = [];
    switch (this.seizurePageType) {
      case 'NON-PLEDGE':
        seizureListInfoObject = this.seizureListInfoObject.data.filter((obj: any) => {
          return (
            (obj.collateralCaseLexStatus === event || event === 'ALL') &&
            (obj.collateralType === this.myCollateralTypeOptionsCtrl.value ||
              this.myCollateralTypeOptionsCtrl.value === 'ALL')
          );
        });
        break;
      default:
        seizureListInfoObject = this.seizureListInfoObject.data.filter((obj: any) => {
          return (
            (obj.collateralCaseLexStatus == event || event === 'ALL') &&
            (obj.collateralType === this.myCollateralTypeOptionsCtrl.value ||
              this.myCollateralTypeOptionsCtrl.value === 'ALL')
          );
        });
        break;
    }
    this.dataSource = new MatTableDataSource(seizureListInfoObject);
    this.seizureListInfoObject.filteredData = seizureListInfoObject;
    this.sortSelected(this.myCustSortingCtrl.value);
    this.slice10();
    this.setPageIndex();
    this.checkDisableAll();
  }

  private setPageIndex() {
    if (this.paginator) {
      this.paginator['pageIndex'] = 1;
    }
    this.pageIndex = 1;
  }

  isAllSelected() {
    const numSelected = this.selectionPerPage.get(this.pageIndex)?.selected.length;
    const numRows = this.dataSource.filteredData.filter(
      row => !row.disabled && !row.seizuredByLitigationId && row.collateralCaseLexStatus !== 'SEIZURED'
    ).length;
    return numSelected === numRows;
  }

  masterToggle(event: any) {
    const _selection = new SelectionModel<number | NonPledgePropertiesAsset>(true, []);
    this.dataSource.filteredData.forEach((row: any) => {
      if (!row.disabled && event.checked && !row.seizuredByLitigationId && row.collateralCaseLexStatus !== 'SEIZURED') {
        this.selection.select(row);
        _selection.select(row);
      } else {
        this.selection.deselect(row);
        _selection.deselect(row);
      }
    });
    this.selectionPerPage.set(this.pageIndex, _selection);
    console.log(this.selectionPerPage);
    this.checkList();
  }

  checkList(e?: any) {
    switch (this.seizurePageType) {
      case 'NON-PLEDGE':
        if (['EDIT'].includes(this.mode) && this.taskCode && [taskCode.R2E05_07_2A].includes(this.taskCode)) {
          this.seizurePropertyService.hasEdit = true;
        }
        this.litigationCaseService.listCollaterals = this.selection.selected.map((m: any) => m.assetId?.toString());
        break;
      default:
        if (e) {
          this.seizurePropertyService.hasEdit = true;
        }
        this.litigationCaseService.listCollaterals = this.selection.selected.map((m: any) =>
          m.collateralId?.toString()
        );
        break;
    }
    this.reduceTotalAppraisalValue();
  }

  toggleSelection(row: any) {
    this.selection.toggle(row);
    if (this.selectionPerPage.has(this.pageIndex)) {
      this.selectionPerPage.get(this.pageIndex)?.toggle(row);
    } else {
      const _selection = new SelectionModel<number | NonPledgePropertiesAsset>(true, []);
      _selection.select(row);
      this.selectionPerPage.set(this.pageIndex, _selection);
    }
  }

  private reduceTotalAppraisalValue() {
    this.totalAppraisalValue = 0;
    let list: Array<any> = [];
    if (
      [taskCode.R2E05_01_2D, taskCode.R2E05_07_2A].includes(this.taskService.taskDetail.taskCode as taskCode) ||
      this.seizurePropertyService.mode === 'ADD'
    ) {
      list = this.selection.selected;
    } else if (
      [taskCode.R2E05_09_4, taskCode.R2E05_08_3A].includes(this.taskService.taskDetail.taskCode as taskCode) ||
      this.seizurePropertyService.seizurePageType === SeizureCollateralTypes.NON_PLEDGE
    ) {
      list = this.seizurePropertyService?.seizureDTO?.assets || [];
    } else {
      list = this.litigationCaseService?.documentsCollaterals?.collaterals || [];
    }
  }

  isCheckAll(data: boolean, fromDraft?: boolean) {
    if (data) {
      this.seizureListInfoObject.data.forEach(row => {
        if (!row.disabled && !row.seizuredByLitigationId && row.collateralCaseLexStatus !== 'SEIZURED') {
          this.selection.select(row);
        }
      });
      this.onSyncPageSelection();
    } else {
      this.selection.clear();
      this.selectionPerPage.clear();
    }
    this.checkList();
    if (!!!fromDraft) {
      this.seizurePropertyService.hasEdit = true;
    }
  }

  onPaging(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.dataSource.filteredData = this.dataSource.data.slice(e.startLabel ? e.startLabel - 1 : 0, e.fromLabel);
    this.onSyncPageSelection();
  }

  onSyncPageSelection(): void {
    const pageDataSet: any[] = this.dataSource.filteredData;
    const assetListId = pageDataSet.map(it => it.assetId);
    const collateralListId = pageDataSet.map(it => it.collateralId);
    const _selection = new SelectionModel<number | NonPledgePropertiesAsset>(true, []);
    this.selection.selected.forEach((selectedItem: any) => {
      console.log(selectedItem);
      if (
        (selectedItem.assetId && assetListId.includes(selectedItem.assetId)) ||
        (selectedItem.collateralId && collateralListId.includes(selectedItem.collateralId))
      ) {
        _selection.select(selectedItem);
      }
    });
    this.selectionPerPage.set(this.pageIndex, _selection);
  }

  isIndeterminate() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected > 0 && numSelected < numRows;
  }

  async onClickAssetDocuments(element: Asset) {
    const documentList: IUploadMultiFile[] = (element.assetDocuments ?? []).map(dto => {
      return {
        ...dto,
        uploadDate: dto.uploadTimestamp,
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

  getPredicate() {
    let fun = (record: any, filter: any) => {
      let map = new Map(JSON.parse(filter));
      let isMatch = false;
      for (let [key, value] of map) {
        isMatch = value == 'ALL' || (record[key as keyof any] || '') == value;
        if (!isMatch) return false;
      }
      return isMatch;
    };
    return fun;
  }

  applyFilter(value: string, filter: any) {
    this.filterDictionary.set(filter, value);
    let jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
    this.allCurrentData = [...this.dataSource.filteredData];
    this.sliceDataTable(this.dataSource.filteredData);
    this.setPageIndex();
    this.checkDisableAll();
  }

  sliceDataTable(allData: any[], start?: number, end?: number) {
    const data = [...allData];
    this.dataSource.filteredData = data.slice(start ? start : 0, end ? end : 10);
  }

  resetPageIndex() {
    if (this.paginator) {
      this.paginator['pageIndex'] = 1;
    }
    this.pageIndex = 1;
    this.startIndex = 1;
    this.endIndex = 1;
  }

  getTotalAppraisalValueSum(): number {
    return this.dataSource.filteredData.reduce((sum, current) => {
      const value = Number(current.totalAppraisalValue) || 0;
      return sum + value;
    }, 0);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log('Called once, before the instance is destroyed');
    this.seizurePropertyService.selection = this.selection;
  }
}
