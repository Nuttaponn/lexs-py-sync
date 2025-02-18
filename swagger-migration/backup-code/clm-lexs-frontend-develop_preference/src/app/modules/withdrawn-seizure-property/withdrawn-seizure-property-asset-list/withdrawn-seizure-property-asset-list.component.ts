import { SelectionModel } from '@angular/cdk/collections';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import {
  CollateralCaseLexsStatus,
  CollateralTypes,
  DEFAULT_DROPDOWN_CONFIG,
  WITHDRAWN_LEXS_TYPES,
} from '@app/shared/constant';
import {
  ContactConfig,
  IUploadMultiFile,
  IUploadMultiInfo,
  PropertyConfig,
  WithDrawnSeizureConfig,
} from '@app/shared/models';
import {
  Assets,
  Collaterals,
  LitigationCasePersonDto,
  PersonForLitigationCaseDto,
  WithdrawConsentDocuments,
  WithdrawSeizureCollateralInfo,
} from '@lexs/lexs-client';
import { DropDownConfig, PaginatorActionConfig, PaginatorResultConfig, SimpleSelectOption } from '@spig/core';
import { WithdrawnSeizurePropertyUploadDocumentComponent } from './withdrawn-seizure-property-upload-document/withdrawn-seizure-property-upload-document.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AucCollateralColType } from '@app/modules/auction/auction.model';
@Component({
  selector: 'app-withdrawn-seizure-property-asset-list',
  templateUrl: './withdrawn-seizure-property-asset-list.component.html',
  styleUrls: ['./withdrawn-seizure-property-asset-list.component.scss'],
})
export class WithdrawnSeizurePropertyAssetListComponent implements OnInit {
  public TABLE_FILTER_KEY = {
    TYPE: 'collateralType',
    STATUS: 'status',
    TYPE_ASSET: 'assetType',
    STATUS_ASSET: 'collateralCaseLexStatus',
  };

  public isOpened: boolean = true;
  public isContactOpened: boolean = true;
  public isAddNewContact = false;
  public isUpdated = true;
  public collateralsSource = new MatTableDataSource<WithdrawSeizureCollateralInfo>([]);
  public collateralsSourceAsset = new MatTableDataSource<Assets>([]);

  public pageSize = 10;
  public pageIndex: number = 1;
  public startIndex: number = 1;
  public endIndex: number = 1;
  public pageSizeAsset = 10;
  public pageIndexAsset: number = 1;
  public startIndexAsset: number = 1;
  public endIndexAsset: number = 1;
  public assetConfig: PropertyConfig = {};
  public propertyConfig: PropertyConfig = {};
  public stepIndex: number = 0;
  public contactConfigEdit: ContactConfig = {};
  public contactConfigView: ContactConfig = {};
  public dropdownFilterTypeConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'ประเภททรัพย์',
    defaultValue: 'All',
  };
  public dropdownFilterStatusConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Filter',
    labelPlaceHolder: 'สถานะทรัพย์(LEXS)',
    defaultValue: 'All',
  };
  public dropdownSortConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Sorting',
    labelPlaceHolder: 'เลขที่หลักประกัน: จากน้อยไปมาก',
  };
  public dropdownNoSortConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    iconName: 'icon-Sorting',
    labelPlaceHolder: 'เลขที่เอกสารสิทธิ์: จากน้อยไปมาก',
  };
  public typeFilterOption: SimpleSelectOption[] = [];
  public typeAssetFilterOption: SimpleSelectOption[] = [];
  public statusFilterOption: SimpleSelectOption[] = [];
  public sortOption: SimpleSelectOption[] = [
    { text: 'เลขที่หลักประกัน: จากน้อยไปมาก', value: '1' },
    { text: 'เลขที่หลักประกัน: จากมากไปน้อย', value: '2' },
  ];

  public sortNoOption: SimpleSelectOption[] = [
    { text: 'เลขที่เอกสารสิทธิ์: จากน้อยไปมาก', value: '1' },
    { text: 'เลขที่เอกสารสิทธิ์: จากมากไปน้อย', value: '2' },
  ];

  @Input() public title: string = '';
  @Input() public tablePropertyControl: UntypedFormControl = new UntypedFormControl();
  @Input() public tablePropertyAssetControl: UntypedFormControl = new UntypedFormControl();
  @Input() public contactDDLControl: UntypedFormControl = new UntypedFormControl();
  @Input() public collateralColumns: string[] = [];
  @Input() public assetColumns: string[] = [];
  @Input() public lgPersonColumn: string[] = [];
  @Input() public contactTypeOptions: PersonForLitigationCaseDto[] = [];
  @Input() public collaterals: Collaterals[] = [];
  @Input() public asset: Assets[] = [];
  @Input() public consentDocuments: Array<WithdrawConsentDocuments> = [];
  @Input() public contactPersons: PersonForLitigationCaseDto[] = [];
  @Input() public config: WithDrawnSeizureConfig = {};
  @Input() public defaultSelect: string[] = [];
  @Input() public defaultSelectAsset: string[] = [];
  @Input() public excludeProperty: string[] = [];
  @Input() public excludeAsset: string[] = []; // Asset = ทรัพย์นอกจำนอง
  @Input() uploadMultiInfo: IUploadMultiInfo = {
    cif: '',
    litigationId: '',
  };

  @Input() formGroup!: UntypedFormGroup;
  @Input() formGroupAsset!: UntypedFormGroup;

  @Output() onAddMoreProperty = new EventEmitter<any>();
  @Output() onAddMorePropertyAsset = new EventEmitter<any>();
  @Output() onAddMoreContact = new EventEmitter<any>();
  @Output() onDeleteGroup = new EventEmitter<any>();
  @Output() onEditProperty = new EventEmitter<any>();
  @Output() onEditPropertyAsset = new EventEmitter<any>();
  @Output() onDeletePropery = new EventEmitter<any>();
  @Output() onDeleteProperyAsset = new EventEmitter<any>();
  @Output() onEditContact = new EventEmitter<any>();
  @Output() onDeleteContact = new EventEmitter<any>();
  @Output() onUpdateSelectContact = new EventEmitter<any>();
  @Output() onUpdateSelectProperty = new EventEmitter<any>();
  @Output() onUpdateSelectPropertyAsset = new EventEmitter<any>();
  @Output() onDownLoadForm = new EventEmitter<any>();
  @Output() onUploadFileEvent = new EventEmitter<any>();

  public paginatorConfig: PaginatorActionConfig = {
    previousLabel: 'previousLabel',
    totalPages: 100,
  };
  public paginatorResultConfig: PaginatorResultConfig = {};
  public persons: LitigationCasePersonDto[] = [];
  public selection = new SelectionModel<string>(true, []);
  public selectionAsset = new SelectionModel<string>(true, []);

  public propertyContact: UntypedFormControl = new UntypedFormControl('N/A');
  public typeFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public statusFilterControl: UntypedFormControl = new UntypedFormControl('All');
  public typeFilterControlAsset: UntypedFormControl = new UntypedFormControl('All');
  public statusFilterControlAsset: UntypedFormControl = new UntypedFormControl('All');
  public sortFilterControl: UntypedFormControl = new UntypedFormControl('1');
  public sortNoFilterControl: UntypedFormControl = new UntypedFormControl('1');
  public expanded: boolean = true;
  public expandedOther: boolean = true;
  public expandedContact: boolean = true;
  public expandedDocument: boolean = true;
  public expandedDocumentOther: boolean = true;
  public expandedDocumentAll: boolean = true;
  public tabIndex: number = 0;
  public allCurrentData: any[] = [];
  public allCurrentDataAsset: any[] = [];

  @ViewChildren(MatTable) table!: QueryList<any>;
  @ViewChild('paginator') paginator!: any;
  @ViewChild('paginator1') paginator1!: any;
  get isEditMode() {
    return this.propertyConfig?.mode === 'EDIT';
  }

  get isEditModeAsset() {
    return this.assetConfig?.mode === 'EDIT';
  }
  get isAddMode() {
    return this.propertyConfig?.mode === 'ADD';
  }

  get hasSoldItem() {
    return this.collateralsSource?.data.some(it => it.status === this.LEXS_STATUS.SOLD);
  }

  get hasSoldIteAsset() {
    return this.collateralsSourceAsset?.data.some(it => it.collateralCaseLexStatus === this.LEXS_STATUS.SOLD);
  }

  public control: UntypedFormGroup = this.initForm();

  private filterDictionary = new Map<string, string>();
  private filterDictionaryAsset = new Map<string, string>();

  public documentUpload: IUploadMultiFile[] = [];
  public documentUploadAsset: IUploadMultiFile[] = [];
  public LEXS_STATUS = CollateralCaseLexsStatus;

  @ViewChild(WithdrawnSeizurePropertyUploadDocumentComponent, { static: false })
  childComp!: WithdrawnSeizurePropertyUploadDocumentComponent;

  public sumTotalAppraisalValue = 0;
  public sumTotalAppraisalValueAsset = 0;
  constructor(
    private fb: UntypedFormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.propertyConfig = { ...this.config.propertyConfig };
    this.stepIndex = this.config.stepIndex || 0;
    this.contactConfigEdit = { ...this.config.contactConfig, mode: 'EDIT' };
    this.contactConfigView = { ...this.config.contactConfig, mode: 'VIEW', hideTitle: true };
    this.initDefaultFilterOption();
    console.log('this.collateralColumns', this.collateralColumns);
    if (this.collaterals && this.collaterals.length > 0) {
      if (this.defaultSelect && this.defaultSelect.length > 0) {
        this.selection.select(...this.defaultSelect);
        console.log(' this.selection', this.selection);
        console.log('this.defaultSelect', this.defaultSelect);
        this.collaterals = this.collaterals.filter(it => !this.defaultSelect.includes(it.collateralId || ''));
      }
      if (this.excludeProperty && this.excludeProperty.length > 0) {
        console.log('this.excludeProperty', this.excludeProperty);
        console.log(
          'this.collaterals.filter(it => !this.excludeProperty.includes(it.collateralId))',
          this.collaterals.filter(it => !this.excludeProperty.includes(it.collateralId || ''))
        );
        this.collaterals = this.collaterals.filter(it => !this.excludeProperty.includes(it.collateralId || ''));
        console.log('this.collaterals', this.collaterals);
      }

      this.collateralsSource.data = this.collaterals
        ? this.collaterals.map((it, index) => {
            return <WithdrawSeizureCollateralInfo>{
              orderNumber: '' + (index + 1),
              ...it,
            };
          })
        : [];

      if (this.propertyConfig?.hasAction === true && this.collateralsSource.data.length > 0) {
        this.collateralColumns = [...this.collateralColumns, AucCollateralColType.action];
      }
      if (this.propertyConfig?.hasSelect === true && this.collateralsSource.data.length > 0) {
        this.collateralColumns = ['selection'].concat(this.collateralColumns);
      }
      this.collateralsSource.filterPredicate = (record, filter) => {
        let map = new Map(JSON.parse(filter));
        let isMatch = false;
        for (let [key, value] of map) {
          if (key === this.TABLE_FILTER_KEY.TYPE) {
            value =
              value === 'All' ? value : CollateralTypes.find(d => d.collateralTypeCode === value)?.collateralTypeDesc;
          }
          isMatch = value == 'All' || record[key as keyof WithdrawSeizureCollateralInfo] == value;
          if (!isMatch) return false;
        }
        return isMatch;
      };
      // this.collateralsSource.filteredData = this.collateralsSource.data.slice(0, 10);
      this.allCurrentData = [...this.collateralsSource.data];
      this.sliceDataTable(this.collateralsSource.data);
      this.sortSelected('1');
    }
    if (this.consentDocuments.length > 0) {
      this.documentUpload = this.consentDocuments
        ?.filter(v => v.documentOf === 'COL')
        .map(row => {
          const obj = {
            documentTemplateId: row.document?.documentTemplate?.documentTemplateId,
            documentTemplate: row.document?.documentTemplate,
            uploadRequired: true,
            uploadDate: row.document?.imageId ? row.updateTimestamp : '',
            imageId: row.document?.imageId,
            removeDocument: true,
            attributes: {
              collateralIds: row.collList,
              collateralOwnerName: row.ownerName,
              ledName: row.ledName,
              id: row.id,
            },
          } as IUploadMultiFile;
          return obj;
        });
      this.documentUploadAsset = this.consentDocuments
        ?.filter(v => v.documentOf === 'NCOL')
        .map(row => {
          const obj = {
            documentTemplateId: row.document?.documentTemplate?.documentTemplateId,
            documentTemplate: row.document?.documentTemplate,
            uploadRequired: true,
            uploadDate: row.document?.imageId ? row.updateTimestamp : '',
            imageId: row.document?.imageId,
            removeDocument: true,
            attributes: {
              collateralIds: row.collList,
              collateralOwnerName: row.ownerName,
              ledName: row.ledName,
              id: row.id,
            },
          } as IUploadMultiFile;
          return obj;
        });

      if (this.documentUpload.length === 0 && this.formGroup) {
        console.log('file oeidkfo');
        this.formGroup.get('file')?.setValue(true);
      }
      if (this.documentUploadAsset.length === 0 && this.formGroupAsset) {
        console.log('filesAsset okimeod');
        this.formGroupAsset.get('file')?.setValue(true);
      }
    }

    //TODO: CollateralTypes should be use from masterDataService na kub
    // variable = await this.masterDataService.getCollateralTypeOptions([...excepted type code...])

    this.assetConfig = { ...this.config.assetConfig };
    if (this.asset && this.asset.length > 0) {
      if (this.defaultSelectAsset && this.defaultSelectAsset.length > 0) {
        this.selectionAsset.select(...this.defaultSelectAsset);
        this.asset = this.asset.filter(it => !this.defaultSelectAsset.includes(it.assetId?.toString() || ''));
      }
      // edit later
      if (this.excludeAsset && this.excludeAsset.length > 0) {
        this.asset = this.asset.filter(it => !this.excludeAsset.includes(it.assetId?.toString() || ''));
      }
      this.collateralsSourceAsset.data = this.asset
        ? this.asset.map((it, index) => {
            return <Assets>{
              orderNumber: '' + (index + 1),
              ...it,
            };
          })
        : [];

      if (this.assetConfig?.hasAction === true && this.collateralsSourceAsset.data.length > 0) {
        this.assetColumns = [...this.assetColumns, AucCollateralColType.action];
      }
      if (this.assetConfig?.hasSelect === true && this.collateralsSourceAsset.data.length > 0) {
        this.assetColumns = ['selection'].concat(this.assetColumns);
      }
      this.collateralsSourceAsset.filterPredicate = (record, filter) => {
        let map = new Map(JSON.parse(filter));
        let isMatch = false;
        for (let [key, value] of map) {
          if (key === this.TABLE_FILTER_KEY.TYPE) {
            value =
              value === 'All' ? value : CollateralTypes.find(d => d.collateralTypeCode === value)?.collateralTypeDesc;
          }
          isMatch = value == 'All' || record[key as keyof Assets] == value;
          if (!isMatch) return false;
        }
        return isMatch;
      };

      this.allCurrentDataAsset = [...this.collateralsSourceAsset.data];
      this.sliceDataTableAsset(this.collateralsSourceAsset.data);
      this.sortSelectedAsset('1');
    }

    setTimeout(() => {
      this.cdr.detectChanges();
    });
    console.log('propertyConfig?.hasEditContact', this.propertyConfig?.hasEditContact);
  }

  private initDefaultFilterOption() {
    const propertyType = [
      CollateralTypes[0].collateralTypeCode,
      CollateralTypes[1].collateralTypeCode,
      CollateralTypes[2].collateralTypeCode,
      CollateralTypes[3].collateralTypeCode,
      CollateralTypes[4].collateralTypeCode,
      CollateralTypes[5].collateralTypeCode,
      CollateralTypes[6].collateralTypeCode,
      CollateralTypes[8].collateralTypeCode,
    ];

    const assetType = [
      CollateralTypes[0].collateralTypeCode,
      CollateralTypes[1].collateralTypeCode,
      CollateralTypes[2].collateralTypeCode,
      CollateralTypes[3].collateralTypeCode,
      CollateralTypes[4].collateralTypeCode,
    ];

    this.typeFilterOption = [
      {
        text: 'ประเภททรัพย์',
        value: 'All',
      },
    ].concat(
      CollateralTypes.filter(d => propertyType.includes(d.collateralTypeCode)).map(it => {
        return {
          text: `${it.collateralTypeDesc}`,
          value: it.collateralTypeCode,
        };
      })
    );

    this.typeAssetFilterOption = [
      {
        text: 'ประเภททรัพย์',
        value: 'All',
      },
    ].concat(
      CollateralTypes.filter(d => assetType.includes(d.collateralTypeCode)).map(it => {
        return {
          text: `${it.collateralTypeDesc}`,
          value: it.collateralTypeCode,
        };
      })
    );
    this.statusFilterOption = [
      {
        text: 'สถานะทรัพย์(LEXS)',
        value: 'All',
      },
    ].concat(
      WITHDRAWN_LEXS_TYPES.map(it => {
        return { text: `${it.text}`, value: it.value };
      })
    );
  }

  editProperty(element: any) {
    this.onEditProperty.emit(element);
  }

  deleteProperty(element: any) {
    this.onDeletePropery.emit(element);
  }

  addMoreProperty() {
    this.onAddMoreProperty.emit();
  }

  editPropertyAsset(element: any) {
    this.onEditPropertyAsset.emit(element);
  }

  deletePropertyAsset(element: any) {
    this.onDeleteProperyAsset.emit(element);
  }

  addMorePropertyAsset() {
    this.onAddMorePropertyAsset.emit();
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      const _selectedColaterals = this.selection.selected.filter(m => {
        return this.collateralsSource.filteredData.findIndex(data => data.collateralId === m) === -1;
      }) as string[];
      this.selection.clear();
      this.selection.select(..._selectedColaterals);
      this.calculateSumAppraisalValue();
    } else {
      const _selectedColaterals = this.collateralsSource.filteredData.map(m => {
        return m.collateralId;
      }) as string[];
      this.selection.select(..._selectedColaterals);
      this.calculateSumAppraisalValue();
    }
    this.onUpdateSelectProperty.emit(this.selection);
  }

  toggleAllRowsAsset() {
    if (this.isAllSelectedAsset()) {
      const _selectedAssets = this.selectionAsset.selected.filter(m => {
        return this.collateralsSourceAsset.filteredData.findIndex(data => data.assetId?.toString() === m) === -1;
      }) as string[];
      this.selectionAsset.clear();
      this.selectionAsset.select(..._selectedAssets);
      this.calculateSumAppraisalValueAsset();
    } else {
      const _selectedAssets = this.collateralsSourceAsset.filteredData.map(m => {
        return m.assetId?.toString();
      }) as string[];
      this.selectionAsset.select(..._selectedAssets);
      this.calculateSumAppraisalValueAsset();
    }
    this.onUpdateSelectPropertyAsset.emit(this.selectionAsset);
  }

  isAllSelected() {
    return this.collateralsSource.filteredData.every((item: any) => {
      return this.selection.selected.includes(item.collateralId);
    });
  }

  isAllSelectedAsset() {
    return this.collateralsSourceAsset.filteredData.every((item: any) => {
      return this.selectionAsset.selected.includes(item.assetId?.toString());
    });
  }

  hasValue() {
    return this.collateralsSource.filteredData.some((item: any) => {
      return this.selection.selected.includes(item.collateralId);
    });
  }

  hasValueAsset() {
    return this.collateralsSourceAsset.filteredData.some((item: any) => {
      return this.selectionAsset.selected.includes(item.assetId.toString());
    });
  }
  onCheckboxChange(row: WithdrawSeizureCollateralInfo) {
    row.collateralId && this.selection.toggle(row.collateralId);
    this.calculateSumAppraisalValue();
    this.onUpdateSelectProperty.emit(this.selection);
    // this.ngOnInit()
  }

  onCheckboxChangeAsset(row: Assets) {
    row.assetId && this.selectionAsset.toggle(row.assetId.toString());
    this.calculateSumAppraisalValueAsset();
    this.onUpdateSelectPropertyAsset.emit(this.selectionAsset);
    // this.ngOnInit()
  }

  deleteGroup() {
    this.onDeleteGroup.emit();
  }

  initForm() {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: [null, Validators.required],
      tel: [null, [Validators.required, Validators.minLength(10)]],
    });
  }

  saveContact(event: any) {
    this.onUpdateSelectContact.emit(event);
  }

  addMoreContact() {
    this.onAddMoreContact.emit();
  }

  deleteContact(element: any) {
    this.onDeleteContact.emit(element);
  }

  editContact(element: any) {
    this.onEditContact.emit(element);
  }

  indexTable(data: any) {
    let index = data + this.startIndex;
    return index;
  }

  indexTableAsset(data: any) {
    let index = data + this.startIndexAsset;
    return index;
  }

  applyFilter(value: string, filter: any) {
    this.resetPageIndex();
    this.filterDictionary.set(filter, value);
    let jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.collateralsSource.filter = jsonString;
    this.allCurrentData = [...this.collateralsSource.filteredData];
    this.sliceDataTable(this.collateralsSource.filteredData);
  }

  applyFilterAsset(value: string, filter: any) {
    this.resetPageIndexAsset();
    // manual filter because assetType BE model is number not string
    if (filter === 'assetType') {
      if (value !== 'All') {
        this.collateralsSourceAsset.filteredData = this.collateralsSourceAsset.data.filter(
          it => it.assetType?.toString() === value
        );
      } else {
        this.collateralsSourceAsset.filteredData = this.collateralsSourceAsset.data;
      }
    } else {
      this.filterDictionaryAsset.set(filter, value);
      let jsonString = JSON.stringify(Array.from(this.filterDictionaryAsset.entries()));
      this.collateralsSourceAsset.filter = jsonString;
    }
    this.allCurrentDataAsset = [...this.collateralsSourceAsset.filteredData];
    this.sliceDataTableAsset(this.collateralsSourceAsset.filteredData);
  }

  resetPageIndex() {
    if (this.paginator) {
      this.paginator['pageIndex'] = 1;
    }
    this.pageIndex = 1;
    this.startIndex = 1;
    this.endIndex = 1;
  }

  resetPageIndexAsset() {
    if (this.paginator) {
      this.paginator1['pageIndex'] = 1;
    }
    this.pageIndexAsset = 1;
    this.startIndexAsset = 1;
    this.endIndexAsset = 1;
  }

  async sortSelected(event: any) {
    this.resetPageIndex();
    let seizureListInfoObject;
    console.log('event', event);
    if (event === '1') {
      seizureListInfoObject = this.allCurrentData.sort((a: any, b: any) => {
        const result = a.collateralId.toString().localeCompare(b.collateralId.toString(), 'en', { numeric: true });
        return result;
      });
    } else {
      seizureListInfoObject = this.allCurrentData.sort((a: any, b: any) => {
        const result = a.collateralId.toString().localeCompare(b.collateralId.toString(), 'en', { numeric: true });
        return -result;
      });
    }

    this.collateralsSource.filteredData = seizureListInfoObject;
    this.collateralsSource.filterPredicate = (record, filter) => {
      let map = new Map(JSON.parse(filter));
      let isMatch = false;
      for (let [key, value] of map) {
        if (key === this.TABLE_FILTER_KEY.TYPE) {
          value =
            value === 'All' ? value : CollateralTypes.find(d => d.collateralTypeCode === value)?.collateralTypeDesc;
        }
        isMatch = value == 'All' || record[key as keyof WithdrawSeizureCollateralInfo] == value;
        if (!isMatch) return false;
      }
      return isMatch;
    };
    this.sliceDataTable(this.collateralsSource.filteredData);
  }

  sliceDataTable(allData: any[], start?: number, end?: number) {
    const data = [...allData];
    this.collateralsSource.filteredData = data.slice(start ? start : 0, end ? end : 10);
  }

  sliceDataTableAsset(allData: any[], start?: number, end?: number) {
    const data = [...allData];
    this.collateralsSourceAsset.filteredData = data.slice(start ? start : 0, end ? end : 10);
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

  async sortSelectedAsset(event: any) {
    let seizureListInfoObject;
    this.resetPageIndexAsset();
    if (event === '1') {
      seizureListInfoObject = this.allCurrentDataAsset.sort((a: any, b: any) => {
        const result = a.documentNo.toString().localeCompare(b.documentNo.toString(), 'en', { numeric: true });
        return result;
      });
    } else {
      seizureListInfoObject = this.allCurrentDataAsset.sort((a: any, b: any) => {
        const result = a.documentNo.toString().localeCompare(b.documentNo.toString(), 'en', { numeric: true });
        return -result;
      });
    }
    this.collateralsSourceAsset.filteredData = seizureListInfoObject;
    this.collateralsSourceAsset.filterPredicate = (record, filter) => {
      let map = new Map(JSON.parse(filter));
      let isMatch = false;
      for (let [key, value] of map) {
        if (key === this.TABLE_FILTER_KEY.TYPE_ASSET) {
          value =
            value === 'All' ? value : CollateralTypes.find(d => d.collateralTypeCode === value)?.collateralTypeDesc;
        }
        isMatch = value == 'All' || record[key as keyof Assets] == value;
        if (!isMatch) return false;
      }
      return isMatch;
    };
    this.sliceDataTableAsset(this.collateralsSourceAsset.filteredData);
  }

  onPaging(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.startIndex = e.startLabel || 0;
    this.endIndex = e.fromLabel || 0;
    this.sliceDataTable(this.allCurrentData, e.startLabel ? e.startLabel - 1 : 0, e.fromLabel);
  }

  onPagingAsset(e: PageEvent) {
    this.pageIndexAsset = e.pageIndex;
    this.startIndexAsset = e.startLabel || 0;
    this.endIndexAsset = e.fromLabel || 0;
    this.sliceDataTableAsset(this.allCurrentDataAsset, e.startLabel ? e.startLabel - 1 : 0, e.fromLabel);
  }

  downLoadForm() {
    this.onDownLoadForm.emit();
  }

  uploadFileEvent(e: any) {
    this.onUploadFileEvent.emit(e);
  }

  calculateSumAppraisalValue() {
    const selectedCollaterals = this.collaterals.filter(it => this.selection.selected.includes(it.collateralId || ''));
    if (selectedCollaterals.length > 0) {
      this.sumTotalAppraisalValue = selectedCollaterals
        .map(it => it.totalAppraisalValue)
        .reduce((pre, cur) => {
          return Number(pre) + Number(cur);
        }) as number;
    } else {
      this.sumTotalAppraisalValue = 0;
    }
  }

  calculateSumAppraisalValueAsset() {
    const selectedAssets = this.asset.filter(it => this.selectionAsset.selected.includes(it.assetId?.toString() || ''));
    if (selectedAssets.length > 0) {
      this.sumTotalAppraisalValueAsset = selectedAssets
        .map(it => it.totalAppraisalValue)
        .reduce((pre, cur) => {
          return Number(pre) + Number(cur);
        }) as number;
    } else {
      this.sumTotalAppraisalValueAsset = 0;
    }
  }
  get getControls() {
    console.log('getControls() formGroup', this.formGroup);
    if (!this.formGroup) return new UntypedFormControl();
    return this.formGroup.get('file') as UntypedFormControl;
  }

  get getControlsAsset() {
    console.log('getControlsAsset() formGroupAsset', this.formGroupAsset);
    if (!this.formGroupAsset) return new UntypedFormControl();
    return this.formGroupAsset.get('file') as UntypedFormControl;
  }

  expandPanel() {
    this.expanded = !this.expanded;
  }
  expandPanelOther() {
    this.expandedOther = !this.expandedOther;
  }
  expandPanelContact() {
    this.expandedContact = !this.expandedContact;
  }

  expandPanelDocument() {
    this.expandedDocument = !this.expandedDocument;
  }
  expandPanelDocumentOther() {
    this.expandedDocumentOther = !this.expandedDocumentOther;
  }

  expandPanelDocumentAll() {
    this.expandedDocumentAll = !this.expandedDocumentAll;
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.tabIndex = event.index;
  }
}
