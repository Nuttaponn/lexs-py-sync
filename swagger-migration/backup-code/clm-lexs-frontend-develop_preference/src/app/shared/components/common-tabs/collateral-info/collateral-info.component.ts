import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '@app/modules/customer/customer.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { MENU_ROUTE_PATH } from '@app/shared/constant';
import { TMode } from '@app/shared/models';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils';
import {
  CollateralInfo,
  CollateralInfoRequest,
  LitigationDetailDto,
  MeLexsUserDto,
  NameValuePair,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DropDownConfig, PaginatorResultConfig } from '@spig/core';
import { CollateralInfoService } from './collateral-info.service';
import { CollateralDtoHide, TYPE, TYPE_CODE } from './collateral.constant';
import { PermissionsOnCollateralInfoScreen } from './collateral.model';
import { MainCollateralComponent } from './main-collateral/main-collateral.component';

@Component({
  selector: 'app-collateral-info',
  templateUrl: './collateral-info.component.html',
  styleUrls: ['./collateral-info.component.scss'],
})
export class CollateralInfoComponent implements OnInit, AfterViewChecked {
  @Input() hasAsset: boolean = true;
  @Input() collateralInfo!: CollateralInfo;
  @Input() litigationId!: string;
  @Output() tabIndexChanged = new EventEmitter<any>();

  @ViewChildren(MatTable) table!: QueryList<any>;

  public pageResultConfig: PaginatorResultConfig = {
    fromIndex: 1,
    toIndex: 10,
    totalElements: 100,
  };
  pageActionConfig: any = {
    totalPages: 8,
    currentPage: 1,
    fromPage: 1,
    toPage: 5,
  };
  public statusOption: Array<any> = [{ name: 'สถานะหลักประกัน', value: 'ALL' }];
  public statusOptionAsset: Array<any> = [
    { name: 'สถานะหลักประกัน', value: 'ALL' },
    { name: 'ไม่ถูกอายัด/ยึด/ขาย', value: '' },
  ];

  public statusConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: 'สถานะหลักประกัน',
    labelPlaceHolder: 'สถานะหลักประกัน',
  };
  public collateralCtrl: UntypedFormControl = new UntypedFormControl('');

  TYPE_CODE = TYPE_CODE;
  TYPE = TYPE;
  currentUser: MeLexsUserDto = {};

  public assetsColumns: string[] = [
    'no',
    'collateralId',
    'collateralSubTypeDesc',
    'docCollateralId',
    'description',
    'totalAppraisalValue',
    'appraisalDate',
    'ownership',
    'insurancePolicyNumber',
    'lgId',
    'calculatedCollateralStatus',
  ];
  public nonAssetColumns: string[] = [
    'no',
    'description',
    'ownership',
    'calculatedCollateralStatus',
    'externalAssetStatusDesc',
    'actions',
  ];

  public collaterals: Array<CollateralDtoHide> = [];

  public permissionsOnScreen: PermissionsOnCollateralInfoScreen = {
    canAdd: false,
    canEdit: false,
    canDelete: false,
  };
  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private masterDataService: MasterDataService,
    public colService: CollateralInfoService,
    private lawsuitService: LawsuitService,
    private translate: TranslateService,
    private sessionService: SessionService,
    private taskService: TaskService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private routerService: RouterService
  ) {
    this.route.queryParams.subscribe(params => {
      this.hasAsset = params['hasAsset'];
      this.litigationId = params['litigationId'];
    });
  }

  async ngOnInit(): Promise<void> {
    await this.initData();
    this.verifyUserPermission();
  }

  async initData() {
    if (this.routerService.previousUrl.includes(MENU_ROUTE_PATH.CUSTOMER)) {
      this.collateralInfo = { ...this.customerService.customerDetail.collateralInfo } as CollateralInfo;
    } else if (this.routerService.previousUrl.includes(MENU_ROUTE_PATH.TASK)) {
      this.taskService.litigationDetail?.collateralInfo as CollateralInfo;
    } else {
      this.collateralInfo = { ...this.lawsuitService.currentLitigation.collateralInfo } as CollateralInfo;
    }

    let status = await this.masterDataService.collateralStatus();
    this.statusOption = this.statusOption.concat(status.collateralStatus) as Array<NameValuePair>;
    this.collaterals = this.colService.mappingDataToTable(this.collateralInfo?.collaterals);

    if (this.collateralInfo?.assets) {
      this.colService.currentAssets = Utils.deepClone(this.collateralInfo?.assets) as Array<CollateralDtoHide>;
    } else {
      this.colService.currentAssets = [];
    }
  }

  verifyUserPermission() {
    this.currentUser = this.sessionService.currentUser as MeLexsUserDto;
    if (
      this.currentUser.subRoleCode === 'VIEWER' ||
      (!!this.litigationId &&
        this.lawsuitService.currentLitigation.editStatus === LitigationDetailDto.EditStatusEnum.Pending) ||
      !this.taskService.editableData()
    ) {
      this.permissionsOnScreen = {
        canAdd: false,
        canEdit: false,
        canDelete: false,
      };
      return;
    }
    this.permissionsOnScreen = {
      canAdd: true,
      canEdit: true,
      canDelete: true,
    };
    return;
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
      });
    }
  }

  expandPanel(index: number, type: string) {
    type === 'Collateral'
      ? (this.collaterals[index].hide = !this.collaterals[index].hide)
      : (this.colService.currentAssets[index].hide = !this.colService.currentAssets[index].hide);
  }

  async openDialog(_mode: TMode, element: any = '') {
    /* Load address master data */
    await Promise.all([
      this.masterDataService.province(),
      this.masterDataService.district(),
      this.masterDataService.subdistrict(),
    ]);
    const dialogRef = this.dialog.open(MainCollateralComponent, {
      disableClose: true,
      autoFocus: true,
      data: {
        mode: _mode,
        title: _mode === 'ADD' ? 'เพิ่มข้อมูลทรัพย์นอกจำนอง' : element.collateralTypeDesc,
        type: element.collateralTypeCode,
        element: element,
        litigationId: this.litigationId,
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      // Refresh permission on screen again
      this.verifyUserPermission();
    });
  }

  // not use function
  navigate(lg: string) {
    this.tabIndexChanged.emit({ tabIndex: 0, lg: lg });
  }

  async removeDialog(index: number, element: any) {
    const res = await this.notificationService.confirmRemoveCenterAlignedDialog(
      'CUSTOMER.TITLE_REMOVE_ASSET',
      this.translate.instant('CUSTOMER.MESSAGE_REMOVE_ASSET', {
        asset_index: index + 1,
      }),
      this.translate.instant('CUSTOMER.LABEL_BTN_REMOVE_ASSET')
    );

    if (res) {
      const request = {
        assets: [{ ...element, updateFlag: 'D' }],
      } as CollateralInfoRequest;

      await this.lawsuitService.updateAssets(this.litigationId, request);
      // Refresh permission on screen again
      this.verifyUserPermission();
    }
  }
  pageEvent(event: number, item?: any) {
    item.currentPage = event;
    const fromIndex = (event - 1) * 10;
    const toIndex = event * 10;
    if (item.hasFilter) {
      item.data = item.dataFilter.slice(fromIndex, toIndex);
      item.toIndex = toIndex > item.dataFilter.length ? item.dataFilter.length : toIndex;
    } else {
      item.data = item._data.slice(fromIndex, toIndex);
      item.toIndex = toIndex > item._data.length ? item._data.length : toIndex;
    }
    item.fromIndex = fromIndex + 1;
  }

  filter(value?: any, item?: any) {
    item.currentPage = 1;
    item.fromIndex = 1;
    item.toIndex = 10;
    if (value !== 'ALL') {
      item.hasFilter = true;
      let dataFilter = item._data.filter(
        (f: any) => f?.calculatedCollateralStatus?.toUpperCase() === value?.toUpperCase()
      );
      item.data = dataFilter.length > 10 ? dataFilter.slice(0, 10) : dataFilter;
      item.dataFilter = dataFilter;
      item.totalElements = dataFilter.length;
    } else {
      item.hasFilter = false;
      item.dataFilter = item._data;
      item.data = item._data.length > 10 ? item._data.slice(0, 10) : item._data;
      item.totalElements = item._data.length;
    }
  }
}
