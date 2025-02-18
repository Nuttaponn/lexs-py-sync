import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '@app/modules/customer/customer.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { RouterService } from '@app/shared/services/router.service';
import {
  CustomerDetailDto,
  DefermentDto,
  DefermentExecLitigationRedCaseDetailDto,
  DefermentHeaderDetails,
  DefermentItem,
  LitigationDetailDto,
} from '@lexs/lexs-client';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';
import { SubSink } from 'subsink';
import { DefermentCategoryCode } from '../deferment.model';
import { DefermentService } from '../deferment.service';

@Component({
  selector: 'app-deferment-dashboard',
  templateUrl: './deferment-dashboard.component.html',
  styleUrls: ['./deferment-dashboard.component.scss'],
})
export class DefermentDashboardComponent implements OnInit, OnDestroy {
  public tabIndex = this.defermentService.dashboardTabIndex;
  public defermentRole = this.defermentService.dashboard?.defermentRole;
  public DefermentRoleEnum = DefermentDto.DefermentRoleEnum;
  public defermentColumn: string[] = [
    'no',
    'defermentDate',
    'approveDate',
    'lgid',
    'defermentCancelDate',
    'defermentReason',
    'defermentDeadline',
    'defermentDuration',
    'document',
    'defermentBy',
    'status',
    'command',
  ];
  public defermentListColumn: string[] = [
    'no',
    'defermentDate',
    'approveDate',
    'lgid',
    'defermentCancelDate',
    'defermentReason',
    'defermentDeadline',
    'defermentDuration',
    'document',
    'defermentBy',
  ];
  public defermentHistoryColumn: string[] = [
    'no',
    'defermentDate',
    'approveDate',
    'lgid',
    'defermentCancelDate',
    'defermentReason',
    'defermentDeadline',
    'defermentDuration',
    'document',
    'defermentBy',
    'status',
  ];
  public _btnAction!: string;
  public litigationId!: string;
  public hasCeased!: boolean;
  public flagCustomer!: boolean;
  public dataTable!: Array<DefermentItem>;
  private configDropdown: DropDownConfig = {
    iconName: 'icon-Filter',
    searchPlaceHolder: '',
    labelPlaceHolder: 'COMMON.LABEL_LITIGATION_ID',
  };

  public lgidSortingCtrl: UntypedFormControl = new UntypedFormControl('');
  public lgidSortingConfig: DropDownConfig = this.configDropdown;
  public lgidSortingOptions!: SimpleSelectOption[];
  public litigationDetail: LitigationDetailDto = {};
  public customerDetail: CustomerDetailDto = {};
  public data!: DefermentHeaderDetails;
  public defermentStatusEnum = DefermentItem.DefermentTaskStatusEnum;
  public defermentCategory: DefermentCategoryCode = 'PROSECUTE';
  public initialDataTable!: Array<DefermentItem>;
  public hidden: boolean = false;
  public actionOnScreen: any = {
    canSeePresent: true,
    canSeeApprove: true,
    canSeeHistory: true,
    canDelayExcution: false,
  };

  public nextRouting: string = '';
  private subs = new SubSink();

  constructor(
    private routerService: RouterService,
    private route: ActivatedRoute,
    private lawsuitService: LawsuitService,
    private defermentService: DefermentService,
    private customerService: CustomerService
  ) {
    this.subs.add(
      this.route.queryParams.subscribe(value => {
        this._btnAction = value['btnAction'] || 'DEFERMENT';
        this.defermentCategory = value['defermentCategory'] || 'PROSECUTE';
        this.litigationId = value['litigationId'] || this.lawsuitService.currentLitigation.litigationId;
        this.hasCeased = value['hasCeased'] || false;
        this.litigationDetail = value['litigationDetail'];
        this.flagCustomer = value['flagCustomer'];
      })
    );
    if (this.routerService.previousUrl.includes('/main/customer/detail')) {
      this.litigationDetail = {
        ...this.customerService.customerDetail,
        customerName: this.customerService.customerDetail.name,
      };
    } else {
      this.litigationDetail =
        Object.keys(this.lawsuitService.currentLitigation).length !== 0
          ? this.lawsuitService.currentLitigation
          : this.defermentService.currentLitigation;
    }
  }

  ngOnInit() {
    if (this.defermentRole === this.DefermentRoleEnum.Other) {
      this.tabIndex = 1;
    }
    this.defermentCategory = this.route.snapshot.queryParams['defermentCategory'];
    this.data = this.defermentService.dashboard.headerDetails as DefermentHeaderDetails;
    switch (this.tabIndex) {
      case 0:
        this.dataTable = this.defermentService.dashboard.defermentPresents as Array<DefermentItem>;
        break;
      case 1:
        this.dataTable = this.defermentService.dashboard.defermentApproves as Array<DefermentItem>;
        break;
      case 2:
        this.dataTable = this.defermentService.dashboard.defermentHistories as Array<DefermentItem>;
        break;
      default:
        this.dataTable = this.defermentService.dashboard.defermentPresents as Array<DefermentItem>;
        break;
    }
    this.initialDataTable = this.dataTable;
    this.mappingOptions(this.dataTable);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onBack(event: any) {
    if (this.routerService.previousUrl.includes('/main/customer/detail'))
      this.customerService.tempCustomerId = this.customerService.customerDetail.customerId;
    this.routerService.back();
  }

  mappingOptions(table: any) {
    let lgList: SimpleSelectOption[] = [];
    for (let index = 0; index < table.length; index++) {
      const f = table[index];
      for (let index = 0; index < f.litigationRedCaseDetail?.length; index++) {
        const m: DefermentExecLitigationRedCaseDetailDto = f.litigationRedCaseDetail[index];
        if (!lgList.find(f => f?.value === m?.litigationId))
          lgList.push({
            text: m.litigationId || '',
            value: m.litigationId || '',
          });
      }
    }
    this.lgidSortingOptions = lgList;
  }

  onTabChanged(event: MatTabChangeEvent) {
    const tabIndex = Number(event.tab.textLabel);
    switch (tabIndex) {
      case 0:
        this.dataTable = this.defermentService.dashboard.defermentPresents as Array<DefermentItem>;
        break;
      case 1:
        this.dataTable = this.defermentService.dashboard.defermentApproves as Array<DefermentItem>;
        break;
      case 2:
        this.dataTable = this.defermentService.dashboard.defermentHistories as Array<DefermentItem>;
        break;
      default:
        this.dataTable = this.defermentService.dashboard.defermentPresents as Array<DefermentItem>;
        break;
    }
    this.initialDataTable = this.dataTable;
    this.defermentService.dashboardTabIndex = tabIndex;
    this.tabIndex = tabIndex;
  }

  async canDeactivate() {
    const routesWithDataRemain = [
      '/main/lawsuit/deferment/defer',
      '/main/lawsuit/deferment/defer/main',
      '/main/lawsuit/deferment/defer/seizure-property',
      '/main/lawsuit/deferment/defer/debt-summary',
    ];
    if (routesWithDataRemain.some(path => this.routerService.nextUrl.startsWith(path))) {
      return true;
    } else {
      this.defermentService.clearData();
    }
    return true;
  }
}
