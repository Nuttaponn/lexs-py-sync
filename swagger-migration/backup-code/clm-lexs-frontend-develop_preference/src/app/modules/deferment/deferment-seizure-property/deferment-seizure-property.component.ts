import { AfterViewChecked, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { DefermentCollateralStatus } from '@app/shared/constant';
import { ActionBar } from '@app/shared/models';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import {
  LitigationCollateralDeedGroupDto,
  LitigationsCollateralsDto,
  LitigationsDto,
  LitigationsRequest,
  NameValuePair,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig } from '@spig/core';
import { SubSink } from 'subsink';
import { DefermentService } from '../deferment.service';

@Component({
  selector: 'app-deferment-seizure-property',
  templateUrl: './deferment-seizure-property.component.html',
  styleUrls: ['./deferment-seizure-property.component.scss'],
})
export class DefermentSeizurePropertyComponent implements OnInit, AfterViewChecked {
  @ViewChild('paginator') paginator!: any;
  @ViewChildren(MatTable) table!: QueryList<any>;

  public dataSource = new MatTableDataSource<any>([]);
  /** Selection */
  public disabledAll: boolean = false;

  public isOpened: boolean = false;
  public taskCode: string = '';

  /* Sort and Filter */
  public collateralTypeConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'collateralTypeDesc',
    valueField: 'collateralTypeCode',
    labelPlaceHolder: 'AUCTION_LED_CARD.DEFERMENT_DEBT.TYPE_OF_COLLATERAL',
  };
  public collateralStatusConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: 'AUCTION_LED_CARD.DEFERMENT_DEBT.COLLATERAL_STATUS_S',
  };
  public lgConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: 'AUCTION_LED_CARD.DEFERMENT_DEBT.LAW_NUMBER',
  };
  public provinceConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'provinceDesc',
    valueField: 'provinceCode',
    labelPlaceHolder: 'AUCTION_LED_CARD.DEFERMENT_DEBT.PROVINCE',
  };
  public districtConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'districtDesc',
    valueField: 'districtCode',
    labelPlaceHolder: 'AUCTION_LED_CARD.DEFERMENT_DEBT.DISTRICT',
  };
  public docConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: 'AUCTION_LED_CARD.DEFERMENT_DEBT.TITLE_DOCUMENT_NUMBER',
  };
  public saleTypeConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: 'LAWSUIT.DEFERMENT.SALES_TYPE',
  };
  public ledConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    labelPlaceHolder: 'LAWSUIT.LEGAL_EXECUTION_OFFICE',
  };
  public sortingConfig: DropDownConfig = { iconName: 'icon-Sorting', searchPlaceHolder: '' };
  sortingForm: UntypedFormGroup = new UntypedFormGroup({});
  public collateralStatusOptions: NameValuePair[] = DefermentCollateralStatus.filter(e => e.value !== 'PENDING_SALE');
  public lgOptions: NameValuePair[] = [];
  public sortingOptions = [
    { text: 'เลขที่หลักประกัน: จากน้อยไปมาก', value: 'COLLATERAL_ASC' },
    { text: 'เลขที่หลักประกัน: จากมากไปน้อย', value: 'COLLATERAL_DESC' },
  ];
  public sortingAnnounceOptions = [
    { text: 'เลขที่กฎหมาย: จากน้อยไปมาก', value: 'LGID_ASC' },
    { text: 'เลขที่กฎหมาย: จากมากไปน้อย', value: 'LGID_DESC' },
  ];
  public defaultSort = 'COLLATERAL_ASC';
  public collateralTypeOptions: any = [{ collateralTypeDesc: 'ประเภทหลักประกัน', collateralTypeCode: 'ALL' }];
  public provinceOptions = [{ provinceDesc: 'จังหวัด', provinceCode: 'ALL' }];
  public districtOptions = [{ districtDesc: 'อำเภอ', districtCode: 'ALL' }];
  public saleTypeOptions: NameValuePair[] = [];
  public ledOptions: NameValuePair[] = [];
  public allDistricts = [];
  public title: string = this.translate.instant('LAWSUIT.DEFERMENT.CHOOSE_A_MORTGAGE');
  public actionBar: ActionBar = {
    hasSave: false,
    hasPrimary: true,
    hasCancel: false,
    hasReject: false,
    primaryText: 'บันทึกทรัพย์',
    primaryIcon: 'icon-save-primary',
  };
  private collaterals: Array<LitigationsCollateralsDto> = [];
  private selectedSeizureProperties: Array<any> = [];
  public initSelectedSeizureProperties: Array<any> = [];
  private _hasEdit = false;
  public hasUpload = false;

  public tableColumns: Array<string> = [
    'selection',
    'order',
    'collateralId',
    'collateralType',
    'collateralSubType',
    'collateralDetails',
    'totalAppraisalValue',
    'appraisalDate',
    'ownerName',
    'insurancePolicyNumber',
    'litigationId',
    'collateralCaseLexStatus',
  ];
  public tableColumnssale: Array<string> = [
    'selection',
    'order',
    'lawnaumber',
    'casenumber',
    'officeexecution',
    'assets',
    'amountproperty',
    'sell',
    'delayed',
  ];
  private subs = new SubSink();

  constructor(
    private fb: UntypedFormBuilder,
    private routerService: RouterService,
    private masterDataService: MasterDataService,
    private defermentService: DefermentService,
    private notificationService: NotificationService,
    private sessionService: SessionService,
    private translate: TranslateService,
    private route: ActivatedRoute
  ) {
    this.subs.add(
      this.route.queryParams.subscribe(
        value => (this.hasAnnounceAuction = value['hasAnnounceAuction'] === 'true' || false)
      ),
      this.route.queryParams.subscribe(value => (this.hasUpload = value['hasUpload'] === 'true' || false))
    );
  }
  public hasAnnounceAuction!: boolean;

  async ngOnInit(): Promise<void> {
    this.getLgOptions();
    this.initForm();
    await this.initData();
    this.setSelectedSeizure();
    this.setInitSelectedSeizure();
  }

  getLgOptions() {
    this.lgOptions.push({ name: 'เลขที่กฎหมาย', value: 'ALL' });
    for (let index = 0; index < this.defermentService.litigations.length; index++) {
      const element = this.defermentService.litigations[index];
      this.lgOptions.push({
        name: element,
        value: element,
      });
    }
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
      });
    }
  }

  async initData() {
    let customerId = this.defermentService.deferment.deferment?.customerId;
    this.title = this.hasAnnounceAuction
      ? this.translate.instant('LAWSUIT.DEFERMENT.CHOOSE_COLLATERAL_SET', { CIF_NO: customerId })
      : this.translate.instant('LAWSUIT.DEFERMENT.CHOOSE_A_MORTGAGE', { CIF_NO: customerId });
    let req: LitigationsRequest = {
      litigations: this.defermentService.litigations,
      defermentId: this.defermentService.deferment.deferment?.defermentId,
      hasAnnounceAuction: this.hasAnnounceAuction,
    };
    const collaterals = await this.defermentService.postForLitigationCollaterals(req);
    this.collaterals = this.hasAnnounceAuction ? collaterals.collateralDeedGroups || [] : collaterals.collaterals || [];
    try {
      if (this.hasAnnounceAuction) {
        this.getOptions();
      } else {
        const masterTypeOptions = await this.masterDataService.getCollateralTypeOptions();
        // 1, 2, 3, 4, 5, 6, 7, 9
        const availableCollateralTypes = ['1', '2', '3', '4', '5', '6', '7', '9'];
        this.collateralTypeOptions = this.collateralTypeOptions.concat(
          masterTypeOptions.filter((option: any) => availableCollateralTypes.includes(option.collateralTypeCode))
        );
        this.getProvice();
        this.getDistrict();
      }
    } catch (e) {}

    this.dataSource.data = [...this.collaterals];
    this.dataSource.filteredData = [...this.collaterals];

    this.filter(); // apply default filters
    // default sort
    if (this.hasAnnounceAuction) {
      this.onSortSelected('LGID_ASC');
    } else {
      this.onSortSelected('COLLATERAL_ASC');
    }
  }

  initForm() {
    this.sortingForm = this.fb.group({
      lgId: 'ALL',
      collateralTypeCode: 'ALL',
      provinceCode: 'ALL',
      districtCode: 'ALL',
      status: 'ALL',
      searchString: '',
      saleType: 'ALL',
      ledId: 'ALL',
      sort: this.hasAnnounceAuction ? 'LGID_ASC' : 'COLLATERAL_ASC',
    });
  }

  async getProvice() {
    await this.masterDataService.province();
    this.provinceOptions = this.provinceOptions.concat(this.masterDataService.provinceList);
  }
  async getDistrict() {
    await this.masterDataService.district();
    this.allDistricts = this.masterDataService.districtList;
    this.districtOptions = [{ districtDesc: 'อำเภอ', districtCode: 'ALL' }, ...this.masterDataService.districtList];
  }

  onFilter(type: string, value: string) {
    this.sortingForm.controls[type].setValue(value);
    if (type === 'provinceCode') {
      this.sortingForm.controls['districtCode'].setValue('ALL');
      this.districtOptions =
        value === 'ALL'
          ? [{ districtDesc: 'อำเภอ', districtCode: 'ALL' }, ...this.allDistricts]
          : [
              { districtDesc: 'อำเภอ', districtCode: 'ALL' },
              ...this.allDistricts.filter((d: any) => d.provinceCode === value || ''),
            ];
    }
    this.filter();
    this.setSelectedSeizure();
    this.setInitSelectedSeizure();
  }

  filter() {
    //verify with BE to sent code for filter
    const filteredData = this.dataSource.data.filter((c: LitigationsCollateralsDto) => {
      let lg = c?.litigations?.some((f: LitigationsDto) => f.litigationId === this.sortingForm.controls['lgId'].value);
      if (this.hasAnnounceAuction) {
        let ret =
          (this.sortingForm.controls['lgId'].value === 'ALL' ||
            (c as LitigationCollateralDeedGroupDto).litigationId === this.sortingForm.controls['lgId'].value) &&
          (this.sortingForm.controls['saleType'].value === 'ALL' ||
            (c as LitigationCollateralDeedGroupDto).saletypedesc ===
              this.getSaleTypeDesc(this.sortingForm.controls['saleType'].value)) &&
          (this.sortingForm.controls['ledId'].value === 'ALL' ||
            (c as LitigationCollateralDeedGroupDto)?.ledId === Number(this.sortingForm.controls['ledId'].value)) &&
          (this.sortingForm.controls['searchString'].value === '' ||
            (c as LitigationCollateralDeedGroupDto).aucLot?.includes(this.sortingForm.controls['searchString'].value) ||
            (c as LitigationCollateralDeedGroupDto).fsubbidnum?.includes(
              this.sortingForm.controls['searchString'].value
            ) ||
            (c as LitigationCollateralDeedGroupDto).blackCaseNo?.includes(
              this.sortingForm.controls['searchString'].value
            ) ||
            (c as LitigationCollateralDeedGroupDto).redCaseNo?.includes(
              this.sortingForm.controls['searchString'].value
            ) ||
            (c as LitigationCollateralDeedGroupDto).collaterals?.some(e => {
              return (
                e.collateralDocumentNo?.includes(this.sortingForm.controls['searchString'].value) ||
                e.collateralId?.includes(this.sortingForm.controls['searchString'].value)
              );
            }));
        return ret;
      } else {
        let ret =
          (this.sortingForm.controls['lgId'].value === 'ALL' || lg) &&
          (this.sortingForm.controls['collateralTypeCode'].value === 'ALL' ||
            c.collateralTypeCode === this.sortingForm.controls['collateralTypeCode'].value) &&
          (this.sortingForm.controls['districtCode'].value === 'ALL' ||
            c?.districtCode === this.sortingForm.controls['districtCode'].value) &&
          (this.sortingForm.controls['provinceCode'].value === 'ALL' ||
            c?.provinceCode === this.sortingForm.controls['provinceCode'].value) &&
          (this.sortingForm.controls['status'].value === 'ALL' ||
            c.lexsCollateralStatus === this.sortingForm.controls['status'].value) &&
          (this.sortingForm.controls['searchString'].value === '' ||
            c.collateralId?.includes(this.sortingForm.controls['searchString'].value) ||
            c.documentNo?.includes(this.sortingForm.controls['searchString'].value));
        return ret;
      }
    });
    this.dataSource.filteredData = [...filteredData];
    this.onSortSelected(this.sortingForm.value?.sort);
  }

  onSortSelected(value: string) {
    const [type, order] = value.split('_');
    this.sort(type, order);
  }

  sort(type: string, order: string) {
    const newData = this.dataSource.filteredData.sort((a, b) => {
      switch (type) {
        case 'COLLATERAL':
          return order === 'ASC'
            ? (a.collateralId as string).localeCompare(b.collateralId)
            : (b.collateralId as string).localeCompare(a.collateralId);
        case 'LGID':
          return order === 'ASC'
            ? (a.litigationId as string).localeCompare(b.litigationId)
            : (b.litigationId as string).localeCompare(a.litigationId);
        default:
          return order === 'ASC'
            ? (a.collateralId as string).localeCompare(b.collateralId)
            : (b.collateralId as string).localeCompare(a.collateralId);
      }
    });
    this.dataSource.filteredData = [...newData];
  }

  onSearch() {
    this.filter();
    this.setInitSelectedSeizure();
  }

  onSelectionChange(event: Array<any>) {
    this.selectedSeizureProperties = event;
  }

  async onBack(event: any) {
    if (this._hasEdit) {
      const _confirm = await this.sessionService.confirmExitWithoutSave();
      if (_confirm) {
        this.routerService.back();
      }
    } else {
      this.routerService.back();
    }
    this.defermentService.hasEdit = false;
  }

  async onSubmit() {
    if (this.hasAnnounceAuction) {
      if (
        JSON.stringify(this.defermentService.selectedCollateralSets) === JSON.stringify(this.selectedSeizureProperties)
      ) {
        this.defermentService.hasEdit = false;
      } else {
        this.defermentService.hasEdit = true;
      }
      this.defermentService.selectedCollateralSets = this.selectedSeizureProperties;
      if (this.defermentService.selectedCollateralSets.length > 0) {
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('LAWSUIT.DEFERMENT.CHOOSE_COLLATERAL_SET_SUCCESS')
        );
      }
    } else {
      if (
        JSON.stringify(this.defermentService.selectedSeizureProperties) ===
        JSON.stringify(this.selectedSeizureProperties)
      ) {
        this.defermentService.hasEdit = false;
      } else {
        this.defermentService.hasEdit = true;
      }
      this.defermentService.selectedSeizureProperties = this.selectedSeizureProperties;
      if (this.defermentService.selectedSeizureProperties.length > 0) {
        this.notificationService.openSnackbarSuccess(
          this.translate.instant('LAWSUIT.DEFERMENT.CHOOSE_A_MORTGAGE_SUCCESS')
        );
      }
    }
    this.defermentService.selectedCollateralFlag = true;
    this.routerService.back();
  }

  onClick(value: boolean) {
    this._hasEdit = value;
    this.defermentService.hasEdit = value;
  }

  async getOptions() {
    this.saleTypeOptions = await this.masterDataService.getSaleTypeDescOptions();
    this.ledOptions = await this.masterDataService.getLedOptions();
  }

  setInitSelectedSeizure() {
    let initData: LitigationsCollateralsDto[] | LitigationCollateralDeedGroupDto[] = [];
    if (this.hasAnnounceAuction) {
      initData = this.defermentService.selectedCollateralSets || [];
    } else {
      initData = this.defermentService.selectedSeizureProperties || [];
    }
    this.initSelectedSeizureProperties = initData ? [...initData] : [];
  }

  setSelectedSeizure() {
    let initData: LitigationsCollateralsDto[] | LitigationCollateralDeedGroupDto[] = [];
    if (this.hasAnnounceAuction) {
      initData = this.defermentService.selectedCollateralSets || [];
    } else {
      initData = this.defermentService.selectedSeizureProperties || [];
    }
    this.selectedSeizureProperties = initData ? [...initData] : [];
  }

  getSaleTypeDesc(saleTypeId: string) {
    return this.saleTypeOptions.find(e => e.value === saleTypeId)?.name || '';
  }
}
