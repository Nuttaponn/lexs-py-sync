import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { SubButtonModel } from '@app/shared/components/action-bar/action-bar.component';
import { AuditLogService } from '@app/shared/components/common-tabs/audit-log/audit-log.service';
import { DebtRelatedInfoTabService } from '@app/shared/components/debt-related-info-tab/debt-related-info-tab.service';
import { DocumentAccountService } from '@app/shared/components/document-preparation/document-account.service';
import { DocumentService } from '@app/shared/components/document-preparation/document.service';
import { CUSTOMER_TABS_INFO, Role } from '@app/shared/constant';
import { ITabNav } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { ActionOnScreen, SessionService } from '@app/shared/services/session.service';
import {
  AccountInfo,
  CollateralInfo,
  CustomerDetailDto,
  CustomerLitigationCaseDto,
  MeLexsUserDto,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { RouterService } from '@shared/services/router.service';
import { DialogOptions, LoaderService } from '@spig/core';
import { SubSink } from 'subsink';
import { CustomerService } from '../customer.service';
import { ModalOnRequestComponent } from './modal-on-request/modal-on-request.component';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
})
export class CustomerDetailComponent implements OnInit, OnDestroy {
  public accessPermissions = this.sessionService.accessPermissions();
  public actionOnScreen: ActionOnScreen = {
    canAdd: this.accessPermissions.mode.includes('ADD'),
    canEdit: this.accessPermissions.mode.includes('EDIT'),
    canDelete: this.accessPermissions.mode.includes('DELETE'),
  };
  public permissions = this.accessPermissions.permissions;

  public customerId!: string;
  public customerDetail!: CustomerDetailDto;
  public collateralInfo!: CollateralInfo;
  public accountInfo!: AccountInfo;
  public cases: Array<CustomerLitigationCaseDto> = [];
  public tabIndex = 0;
  public auditTabLabel: string = '';
  public currentUser?: MeLexsUserDto;
  public hasDocument: boolean = false;
  public subButtonList: Array<SubButtonModel> = [];
  public actionBar = {
    hasCease: true,
    hasDelayLitigation: true,
    hasDefermentExcution: true,
  };

  isShowMaker!: boolean;

  public tabsInfo: ITabNav[] = CUSTOMER_TABS_INFO;
  private subs = new SubSink();

  constructor(
    private routerService: RouterService,
    private notificationService: NotificationService,
    private customerService: CustomerService,
    private sessionService: SessionService,
    private translate: TranslateService,
    private auditLogService: AuditLogService,
    private documentService: DocumentService,
    private documentAccountService: DocumentAccountService,
    private loaderService: LoaderService,
    private debtRelatedInfoTabService: DebtRelatedInfoTabService,
    private router: Router,
    private route: ActivatedRoute,
    private lawsuitService: LawsuitService
  ) {
    this.subs.add(
      this.route.queryParams.subscribe(async value => {
        if (!!value['_tabIndex']) {
          this.tabIndex = value['_tabIndex'];
          this.saveCurrentTab(value['_tabIndex']);
          this.onRouterLink(this.tabsInfo[Number(value['_tabIndex'])], {
            _tabIndex: value['_tabIndex'],
            _subIndex: value['_subIndex'],
            _underSubIndex: value['_underSubIndex'],
          });
        }
      }),
      this.router.events.subscribe(val => {
        if (val instanceof NavigationStart) this.nextRouting = val.url;
      })
    );
  }

  ngOnInit() {
    this.currentUser = this.sessionService.currentUser;
    this.checkRole();
    this.customerDetail = { ...this.customerService.customerDetail } as CustomerDetailDto;
    this.customerId = this.customerDetail.customerId || '';
    this.collateralInfo = { ...this.customerDetail.collateralInfo } as CollateralInfo;
    this.accountInfo = { ...this.customerDetail.accountInfo } as AccountInfo;
    if (this.customerDetail.cases) {
      this.cases = this.customerDetail.cases;
    }
    this.auditTabLabel = this.translate.instant('CUSTOMER.HEAD_COLUMN_AUDIT_LOG_INFO');

    this.getCurrentTab();
    // this.routerService.navigateTo(this.tabsInfo[this.tabIndex].fullPath);
    this.onRouterLink(this.tabsInfo[this.tabIndex]);
    this.initSubButtons();
  }

  initSubButtons() {
    if (this.actionBar.hasDelayLitigation) {
      this.subButtonList.push({
        name: 'delay_litigation',
        icon: 'icon-Pause',
        text: 'LAWSUIT.BTN_DELAY_LITIGATION',
        disabled: false,
      });
    }
    if (this.actionBar.hasDefermentExcution) {
      this.subButtonList.push({
        name: 'deferment_excution',
        icon: 'icon-Pause',
        text: 'LAWSUIT.BTN_DEFERMANT_EXCUTION',
        disabled: false,
      });
    }
    if (this.actionBar.hasCease) {
      this.subButtonList.push({
        name: 'cease_litigation',
        icon: 'icon-Record-Stop',
        text: 'LAWSUIT.BTN_CEASE_LITIGATION',
        disabled: false,
      });
    }
    if (this.isShowMaker) {
      this.subButtonList.push({
        name: 'start_litigation',
        icon: 'icon-Flash',
        text: 'CUSTOMER.BTN_START_THE_LITIGATION_PROCESS',
        disabled: false,
      });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private getCurrentTab() {
    this.tabIndex = this.customerService.currentTab ?? 0;
    this.customerService.currentTab = this.tabIndex;
  }

  private checkRole(): void {
    this.isShowMaker = this.currentUser?.subRoleCode === Role.MAKER;
  }

  initData() {
    if (!!this.documentService.customer.documentInfo?.customerDocuments?.length) {
      this.documentService.currentDocPerson = this.documentService.getDocumentPerson();
      this.documentService.currentDocCol = this.documentService.getDocumentCollateral();

      this.documentAccountService.customer = this.documentService.customer;
      this.documentAccountService.filterRelevantAccountDocuments();
    }
    this.hasDocument = true;
    if (this.loaderService.state.loading) this.loaderService.exitLoad();
  }

  onRouterLink(item: ITabNav, params?: any) {
    if (item.path === 'nav-tab-debt-related-info-tab') {
      this.debtRelatedInfoTabService.loadCustomerDetail.next(true);
      this.debtRelatedInfoTabService.loadLitigationDetail.next(false);
      this.routerService.navigateTo(item.fullPath, { ...params });
    } else if (item.path === 'nav-tab-collateral-info-tab') {
      this.routerService.navigateTo(item.fullPath, { hasAsset: false, ...params });
    } else {
      this.routerService.navigateTo(item.fullPath, { ...params });
    }
    this.onTabNavChanged(item);
  }

  onTabNavChanged(element: ITabNav) {
    this.tabIndex = element.index;
    this.saveCurrentTab(element.index);
    if (element.path === 'nav-tab-audit-log-info-tab') {
      this.auditLogService.refreshLogType.next('CUSTOMER');
    }
    if (element.path === 'nav-tab-document-checklist-info-tab') {
      this.documentService.customer = this.customerService.customerDetail;
      if (!!this.documentService.customer) {
        if (!this.hasDocument) this.loaderService.enterLoad();
        this.initData();
      }
    }
  }

  private saveCurrentTab(tabIndex: number) {
    this.customerService.currentTab = tabIndex;
  }

  onBack(event: any) {
    this.routerService.back();
  }

  async onRequest(event: any) {
    const result = await this.modalOnRequest();
    const { errors } = result;
    if (errors) {
      const mgs = errors;
      this.notificationService.openSnackbarError(mgs);
    }
    if (result) {
      const mgs = `CIF number: ${result?.data?.customerId} ${this.translate.instant('CUSTOMER.ON_REQUEST_RESULT')}`;
      this.notificationService.openSnackbarSuccess(mgs);
    }
  }

  async modalOnRequest(): Promise<any> {
    const myContext = {
      ...this.customerDetail,
    };
    const dialogSetting: DialogOptions = {
      component: ModalOnRequestComponent,
      title: 'CUSTOMER.BTN_START_THE_LITIGATION_PROCESS',
      iconName: 'icon-Flash',
      rightButtonLabel: 'CUSTOMER.BTN_CONFIRM',
      buttonIconName: 'icon-Checkmark-Circle-Regular',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      context: myContext,
    };

    return await this.notificationService.showCustomDialog(dialogSetting);
  }

  setTabIndex(tabIndex: number) {
    this.tabIndex = tabIndex;
  }

  golink(value: any) {
    // clear data
    this.lawsuitService.currentLitigation = {};
    if (value.name === 'delay_litigation') {
      this.gotoDeferment();
    } else if (value.name === 'cease_litigation') {
      this.gotoCessation();
    } else if (value.name === 'deferment_excution') {
      this.goDefermentExecution();
    } else if (this.isShowMaker) {
      this.onRequest(value);
    }
  }

  navigateToLitigation(obj: any) {
    if (obj.lg) {
      this.routerService.navigateTo('/main/lawsuit/detail', {
        lgId: obj.lg,
      });
    }
  }

  public nextRouting: string = '';

  async canDeactivate() {
    this.documentService.clearData();
    this.customerService.clearData();

    return true;
  }

  async gotoDeferment() {
    this.routerService.navigateTo(`/main/lawsuit/deferment/defer`, {
      _btnAction: 'DEFERMENT',
      flagCustomer: true,
      defermentCategory: 'PROSECUTE',
      litigationId: '',
      customerId: this.customerDetail.customerId,
      routeFrom: 'CUSTOMER',
    });
  }

  async gotoCessation() {
    this.routerService.navigateTo(`/main/lawsuit/deferment/defer`, {
      btnAction: 'CESSATION',
      hasCeased: true,
      defermentCategory: 'PROSECUTE',
      customerId: this.customerId,
      routeFrom: 'CUSTOMER',
    });
  }

  async goDefermentExecution() {
    this.routerService.navigateTo(`/main/lawsuit/deferment/defer`, {
      btnAction: 'DEFERMENT',
      defermentCategory: 'EXECUTION',
      flagCustomer: true,
      litigationId: '',
      hasCeased: false,
      customerId: this.customerDetail.customerId,
    });
  }
}
