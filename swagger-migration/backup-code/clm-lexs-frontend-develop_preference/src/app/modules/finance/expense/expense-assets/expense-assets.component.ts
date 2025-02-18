import { Component, Input, OnInit, ViewChild, QueryList, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BuddhistEraPipe, DropDownConfig } from '@spig/core';
import { CollateralCaseLexsStatus, CollateralStatus, DEFAULT_DROPDOWN_CONFIG } from '@app/shared/constant';
import { Mode, TMode } from '@app/shared/models';
import { CollateralsAssetDto, ExpenseTransactionDto, NameValuePair, SeizureLedsInfo } from '@lexs/lexs-client';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import {
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { ExpenseService } from '../../services/expense.service';
import { ActivatedRoute } from '@angular/router';
import { IExpenseDocument } from '../expense-detail-view/expense-detail-view.component';
import { NotificationService } from '@app/shared/services/notification.service';
import { coerceString } from '@app/shared/utils';

interface ICollateralsAsset extends CollateralsAssetDto {
  disabled?: boolean;
}

@Component({
  selector: 'app-expense-assets',
  templateUrl: './expense-assets.component.html',
  styleUrls: ['./expense-assets.component.scss'],
})
export class ExpenseAssetsComponent implements OnInit, AfterViewChecked {
  @Input() mode!: TMode;
  @Input() dataForm!: UntypedFormGroup;
  @Input() transaction: ExpenseTransactionDto | undefined;
  @Input() submitted!: boolean;

  @ViewChild('paginator') paginator!: any;
  @ViewChild(MatTable) table!: QueryList<any>;

  public LEXS_STATUS = CollateralCaseLexsStatus;
  public today = new Date();

  public legalExecutionDepartmentOptionsConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: this.translate.instant('COMMON.LABEL_LEGAL_EXECUTION_DEPARTMENT'),
  };

  public seizureDateDropdownConfig: DropDownConfig = {
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: this.translate.instant('FINANCE.EXPENSE_ASSETS.SEIZURE_TIMESTAMP'),
  };

  public collateralStatusOptionsConfig: DropDownConfig = {
    defaultValue: 'ALL',
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: this.translate.instant('FINANCE.EXPENSE_ASSETS.COLLATERAL_STATUS'),
    searchPlaceHolder: '',
    searchWith: '',
  };

  public collateralSortingOptionsConfig: DropDownConfig = {
    ...DEFAULT_DROPDOWN_CONFIG,
    defaultValue: '1',
    iconName: 'icon-Sorting',
    labelPlaceHolder: 'เลขที่หลักประกัน: จากน้อยไปมาก',
  };

  public collateralSortingOrderOptions = [
    { text: 'เลขที่หลักประกัน: จากน้อยไปมาก', value: '1' },
    { text: 'เลขที่หลักประกัน: จากมากไปน้อย', value: '2' },
  ];
  private currentSort: string = '1';
  private isShowOnlySelectedAssets: boolean = false;
  private currentCollateralStatusFilter: string = 'ALL';

  public collateralStatusFormControl: UntypedFormControl = new UntypedFormControl(
    this.collateralStatusOptionsConfig.defaultValue
  );
  public collateralSortingFormControl: UntypedFormControl = new UntypedFormControl(
    this.collateralSortingOptionsConfig.defaultValue
  );

  public expenseAssetsColumns: string[] = [
    'checkbox',
    'no',
    'collateralId',
    'collateralTypeDesc',
    'collateralSubTypeDesc',
    'documentNo',
    'collateralDetails',
    'ownerFullName',
    'totalAppraisalValue',
    'collateralCmsStatus',
    'collateralCaseLexStatus',
    'seizureStatus',
  ];

  public selection = new SelectionModel<ICollateralsAsset>(true, []);
  public selectionId = new SelectionModel<string>(true, []);
  public disabledAll: boolean = false;

  public expenseAssetsList = new MatTableDataSource<ICollateralsAsset>([]);
  public disabledCollateralIds: string[] = [];
  private filteredDataNoPaging: ICollateralsAsset[] = [];
  private sortedData: ICollateralsAsset[] = [];
  public collateralsInitialized: boolean = false;

  public allLeds: SeizureLedsInfo[] = [];
  public legalExecutionDepartmentOptions: NameValuePair[] = [];
  public seizureDateOptions: NameValuePair[] = [];
  public allSeizureDateOptions: { [key: number]: { id: number; seizureTimestamp: string }[] } = {};
  private prevLedId: number = 0;

  public collateralStatusOptions: NameValuePair[] = [];

  public pageIndex: number = 1;
  public pageSize: number = 10;

  public documentsList: IExpenseDocument[] = [];
  public cifId: string | undefined;

  public get isAllSelected(): boolean {
    return this.expenseAssetsList.data.filter(data => !data.disabled).length === this.selectionId.selected.length;
  }

  public get isSearchFormValid(): boolean {
    const assetsCheckDateValid = this.getSearchFormControls('assetsCheckDate')?.valid || false;
    const ledValid = this.getSearchFormControls('actualLed')?.valid || false;
    const seizureDateValid = this.getSearchFormControls('seizureDateLedId')?.valid || false;
    return assetsCheckDateValid && ledValid && seizureDateValid;
  }

  public get isShowEmptyTable(): boolean {
    return (
      (!this.isSearchFormValid && this.mode !== Mode.VIEW) ||
      !this.expenseAssetsList.filteredData ||
      this.expenseAssetsList.filteredData.length === 0
    );
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private notificationService: NotificationService,
    private expenseService: ExpenseService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private buddhistEraPipe: BuddhistEraPipe
  ) {}

  async ngOnInit(): Promise<void> {
    this.selection.clear();
    this.initCollateralStatusOption();

    if (this.mode !== Mode.VIEW) {
      await this.initLedIdOptions();
    }

    if (this.mode !== Mode.ADD) {
      this.initDataForm();
    }
    if (this.mode === Mode.VIEW) {
      this.expenseAssetsColumns = this.expenseAssetsColumns.slice(1, this.expenseAssetsColumns.length);
      this.expenseAssetsList.data = this.dataForm.controls['collaterals'].value;
      this.initData();
    }
    if (this.mode === Mode.EDIT) {
      // collaterals list
      await this.onCollateralOptionsChange(true);
    }
    if (this.mode !== Mode.VIEW && (this.transaction?.id || this.selection.selected.length > 0)) {
      this.dataForm.controls['collaterals'].markAsDirty();
      this.dataForm.controls['documents'].markAsDirty();
    }
  }

  initDataForm() {
    const currentLed = this.allLeds.filter(
      led => led.id === this.transaction?.seizureLedId || led.id?.toString() === this.transaction?.objectId
    )[0];
    this.dataForm.controls['assetsCheckDate'].setValue(this.transaction?.assetInspectionDate);
    this.dataForm.controls['actualLed'].setValue(this.transaction?.actualLed || currentLed.ledName);
    this.dataForm.controls['led'].setValue(currentLed);
    // this.dataForm.controls['seizureDateLedId'].setValue(this.transaction?.seizureTimestamp)
    this.dataForm.controls['collaterals'].setValue(this.transaction?.collaterals);
    this.dataForm.controls['documents'].setValue(this.transaction?.expenseDocumentDtoList || []);
    this.documentsList = this.dataForm.controls['documents'].value;
  }

  async initCollateralStatusOption() {
    const options = [...CollateralStatus];
    options[0].name = 'สถานะทรัพย์(LEXS)';
    this.collateralStatusOptions = options.map(it => ({
      name: coerceString(it.name),
      value: coerceString(it.value),
    }));
    // const collateralStatusOptionData = (await this.masterDataService.collateralStatus()).collateralStatus as NameValuePair[]
    // this.collateralStatusOptions = [{ name: 'ทั้งหมด', value: 'ALL' } as NameValuePair].concat(collateralStatusOptionData)
  }

  async initLedIdOptions() {
    const ledIdData = await this.expenseService.getExpenseLitigationCaseSeizure(
      this.route.snapshot.queryParams['litigationCaseId'] || this.transaction?.litigationCaseId,
      this.route.snapshot.queryParams['seizureType'] || this.transaction?.seizureType
    );
    const ledObject: { [key: string]: SeizureLedsInfo } = {};
    ledIdData.seizureLedsInfoList?.forEach(led => {
      if (led.ledId && !ledObject[led.ledId]) {
        ledObject[led.ledId] = led;
      }
    });
    this.legalExecutionDepartmentOptions =
      Object.values(ledObject)?.map(s => ({
        name: s.ledName,
        value: s.ledName,
      })) || [];
    this.allLeds = ledIdData.seizureLedsInfoList || [];
    this.seizureDateOptions = [];

    /** setup date object to pull data from */
    this.allLeds.forEach(led => {
      if (!led.id || !led.ledId || !led.seizureTimestamp) return;
      if (this.allSeizureDateOptions[led.ledId]) {
        if (!this.allSeizureDateOptions[led.ledId].map(led => led.seizureTimestamp).includes(led.seizureTimestamp)) {
          this.allSeizureDateOptions[led.ledId].push({
            id: led.id,
            seizureTimestamp: led.seizureTimestamp,
          });
        }
      } else {
        this.allSeizureDateOptions[led.ledId] = [
          {
            id: led.id,
            seizureTimestamp: led.seizureTimestamp,
          },
        ];
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
        this.changeDetectorRef.detectChanges();
      });
    }
  }

  async initData() {
    this.setCollateralDisable();
    const data = this.sort(this.expenseAssetsList.data, this.currentSort);
    this.filteredDataNoPaging = data;
    this.sortedData = data;
    this.resetPageIndex();
    this.sliceDataTable(data, 0, this.pageSize);
    this.checkDisableAll();
  }

  async onCollateralOptionsChange(isInit: boolean) {
    if (this.dataForm.controls['documents'].dirty || this.dataForm.controls['collaterals'].dirty) {
      const confirmChange = await this.notificationService.warningDialog(
        'FINANCE.CONFIRM_CHANGE_DIALOG_TITLE',
        'FINANCE.EXPENSE_ASSETS.DATA_CHANGE_WARNING',
        'FINANCE.CONFIRM_CHANGE_DIALOG_TITLE',
        'icon-Check-Square-Free-Fill'
      );
      if (!confirmChange) return;
    }

    if (this.dataForm.controls['actualLed'].value && this.dataForm.controls['actualLed'].value !== '') {
      // initialize seizure date list (seizure led id list)
      const currentLed = this.allLeds.filter(led => led.ledName === this.dataForm.controls['actualLed'].value)[0];
      if (currentLed.ledId !== this.prevLedId) {
        // reselecting led => set new seizure date options then get collaterals and documents
        if (currentLed && currentLed.ledId) {
          this.seizureDateOptions = this.allSeizureDateOptions[currentLed.ledId].map(date => ({
            name: this.buddhistEraPipe.transform(date.seizureTimestamp, 'DD/MM/yyyy'),
            value: date.id?.toString(),
          }));
          // setTimeout to fix the issue of the selected options not being shown in the UI
          setTimeout(async () => {
            if (!isInit) {
              this.dataForm.controls['seizureDateLedId']?.setValue(
                this.seizureDateOptions[0].value
              ); /** value = currentLed.id */
            } else {
              this.dataForm.controls['seizureDateLedId']?.setValue(
                this.transaction?.seizureLedId?.toString()
              ); /** value = currentLed.id */
            }
            await this.getCollateralsAndDocuments(isInit);
          }, 1);
        }

        this.dataForm.controls['actualLed'].markAsTouched();
        this.dataForm.controls['actualLed'].updateValueAndValidity();
        this.dataForm.controls['seizureDateLedId'].markAsTouched();
        this.dataForm.controls['seizureDateLedId'].updateValueAndValidity();
        this.dataForm.updateValueAndValidity();

        this.prevLedId = currentLed.ledId || 0;
      } else {
        // reselecting seizure date/asset inspection date => get collaterals and documents
        await this.getCollateralsAndDocuments(isInit);
      }
    }
  }

  async getCollateralsAndDocuments(isInit: boolean) {
    if (
      this.dataForm.controls['actualLed'].value &&
      this.dataForm.controls['actualLed'].value !== '' &&
      this.dataForm.controls['assetsCheckDate'].value &&
      this.dataForm.controls['assetsCheckDate'].value !== '' &&
      this.dataForm.controls['seizureDateLedId'].value &&
      this.dataForm.controls['seizureDateLedId'].value !== ''
    ) {
      const res = await this.expenseService.postExpenseCollateralsAssets(
        this.route.snapshot.queryParams['expenseRateId'],
        {
          assetInspectionDate: this.dataForm.controls['assetsCheckDate'].value,
          seizureLedId: parseInt(this.dataForm.controls['seizureDateLedId'].value) || 0 /** value = currentLed.id */,
        }
      );
      if (res) {
        this.resetPageIndex();
        this.expenseAssetsList.data = res.collaterals || [];
        this.disabledCollateralIds = [];
        if (!isInit) {
          this.selection.clear();
          this.selectionId.clear();
          this.dataForm.controls['collaterals'].setValue([]);
        }
        this.dataForm.controls['collaterals'].value?.forEach((c: ICollateralsAsset) => {
          this.selection.select(res.collaterals?.find(r => r.collateralId === c.collateralId) || {});
          this.selectionId.select(c.collateralId || '');
        });
        this.dataForm.controls['collaterals'].markAsUntouched();
        this.dataForm.controls['collaterals'].markAsPristine();
        this.initData();
      }

      const currentLed = this.allLeds.filter(
        led => led.id === parseInt(this.dataForm.controls['seizureDateLedId'].value)
      )[0];
      // get customer id and documents
      const documentRes = await this.expenseService.getInitialLitigationDetail(
        this.route.snapshot.queryParams['expenseRateId'],
        this.route.snapshot.queryParams['litigationId'],
        this.route.snapshot.queryParams['litigationCaseId'],
        this.dataForm.controls['seizureDateLedId'].value,
        this.route.snapshot.queryParams['seizureObjectType']
      );
      this.cifId = documentRes.customerId;

      if (!isInit) {
        // initialize documents
        this.documentsList =
          documentRes.expenseDocumentDtoList?.map(d => ({
            ...d,
            isUpload: d.imageId ? true : false,
          })) || [];
        this.dataForm.controls['documents'].setValue(this.documentsList);
        this.dataForm.controls['documents'].markAsUntouched();
        this.dataForm.controls['documents'].markAsPristine();
        this.dataForm.controls['led'].setValue({
          ...currentLed,
          objectType: documentRes.objectType,
        });
        this.dataForm.updateValueAndValidity();
      }
    }
  }

  onDocumentChange(event: IExpenseDocument[]) {
    this.dataForm.controls['documents'].setValue(event);
    this.dataForm.controls['documents'].markAsTouched();
    this.dataForm.controls['documents'].markAsDirty();
    this.dataForm.markAsDirty();
    this.dataForm.updateValueAndValidity();
  }

  private setCollateralDisable() {
    // disable any invalid collaterals upon initialization
    this.expenseAssetsList.data.forEach(col => {
      if (
        (this.route.snapshot.queryParams['transactionId'] &&
          col.existExpenseTransactionId &&
          col.existExpenseTransactionId !== parseInt(this.route.snapshot.queryParams['transactionId'])) ||
        (!this.route.snapshot.queryParams['transactionId'] && col.existExpenseTransactionId)
      ) {
        this.selection.deselect(col);
        this.selectionId.deselect(col.collateralId?.toString() || '0');
        col.disabled = true;
        this.disabledCollateralIds.push(col.collateralId || '');
        this.dataForm.controls['collaterals'].setValue(this.selection.selected);
      } else {
        col.disabled = false;
      }
    });
    this.dataForm.updateValueAndValidity();
  }

  private checkDisableAll() {
    this.disabledAll = this.expenseAssetsList.filteredData.every(f => f.disabled);
  }

  onCheckboxChange(row: ICollateralsAsset) {
    this.selection.toggle(row);
    this.selectionId.toggle(row.collateralId || '');
    this.dataForm.controls['collaterals'].setValue(this.selection.selected);
    this.dataForm.controls['collaterals'].markAsTouched();
    this.dataForm.controls['collaterals'].markAsDirty();
    this.dataForm.markAsDirty();
    this.dataForm.updateValueAndValidity();
    if (this.isShowOnlySelectedAssets) {
      this.filter(this.currentCollateralStatusFilter, this.isShowOnlySelectedAssets);
      const totalPages = Math.ceil(this.filteredDataNoPaging.length / this.pageSize);
      if (this.pageIndex > totalPages) {
        this.sliceDataTable(this.filteredDataNoPaging, this.pageIndex - 2, this.pageIndex - 1 + this.pageSize);
      } else {
        this.sliceDataTable(this.filteredDataNoPaging, this.pageIndex - 1, this.pageIndex - 1 + this.pageSize);
      }
    }
  }

  toggleAllRows() {
    if (this.selection.selected.length !== this.filteredDataNoPaging.filter(d => !d.disabled).length) {
      this.filteredDataNoPaging.forEach(d => {
        this.selection.select(d);
        this.selectionId.select(d.collateralId || '');
      });
    } else {
      this.selection.clear();
      this.selectionId.clear();
    }
    this.dataForm.controls['collaterals'].setValue(this.selection.selected);
    this.dataForm.controls['collaterals'].markAsTouched();
    this.dataForm.controls['collaterals'].markAsDirty();
    this.dataForm.markAsDirty();
    this.dataForm.updateValueAndValidity();
    if (this.isShowOnlySelectedAssets) {
      this.filter(this.currentCollateralStatusFilter, this.isShowOnlySelectedAssets);
      this.resetPageIndex();
      this.sliceDataTable(this.filteredDataNoPaging, 0, this.pageSize);
    }
  }

  onCheckShowOnlySelected(event: any) {
    this.isShowOnlySelectedAssets = event.checked;
    this.filter(this.currentCollateralStatusFilter, event.checked);
    this.resetPageIndex();
    this.sliceDataTable(this.filteredDataNoPaging, 0, this.pageSize);
  }

  onSelectedCollateralStatus(event: string) {
    this.currentCollateralStatusFilter = event;
    this.filter(event, this.isShowOnlySelectedAssets);
    this.resetPageIndex();
    this.sliceDataTable(this.filteredDataNoPaging, 0, this.pageSize);
  }

  onSortSelected(event: string) {
    this.currentSort = event;
    const data = this.sort(this.filteredDataNoPaging, event);
    this.resetPageIndex();
    this.sliceDataTable(data, 0, this.pageSize);
    // also sort the main data for future use
    this.sortedData = this.sort(this.expenseAssetsList.data, event);
  }

  onPaginatorEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.sliceDataTable(this.filteredDataNoPaging, event.startLabel ? event.startLabel - 1 : 0, event.fromLabel);
  }
  private resetPageIndex() {
    if (this.paginator) {
      this.paginator['pageIndex'] = 1;
    }
    this.pageIndex = 1;
  }

  sliceDataTable(allData: any[], start?: number, end?: number) {
    const data = [...allData];
    this.expenseAssetsList.filteredData = data.slice(start ? start : 0, end ? end : this.pageSize);
  }

  filter(collateralStatus: string, onlySelected: boolean) {
    if (onlySelected) {
      const selected = this.sortedData.filter(d => this.selectionId.isSelected(d.collateralId || ''));
      this.filteredDataNoPaging = selected;
    } else {
      this.filteredDataNoPaging = this.sortedData;
    }
    if (collateralStatus !== 'ALL') {
      if (collateralStatus !== 'ALL') {
        const filteredData = this.sortedData.filter(
          col => col.collateralCaseLexStatus?.toUpperCase() === collateralStatus
        );
        this.filteredDataNoPaging = filteredData;
      } else {
        this.filteredDataNoPaging = this.sortedData;
      }
    }
  }

  sort(data: ICollateralsAsset[], sortBy: string): ICollateralsAsset[] {
    const sortedExpenseAssetsList = data.sort((a: any, b: any) => {
      if (sortBy === '1') {
        return a.collateralId - b.collateralId;
      } else {
        return b.collateralId - a.collateralId;
      }
    });
    return sortedExpenseAssetsList;
  }

  getSearchFormControls(fieldName: string) {
    return this.dataForm.get(fieldName);
  }
}
