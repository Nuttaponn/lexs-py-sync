import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { MAIN_ROUTES } from '@app/shared/constant/routes.constant';
import { Utils } from '@app/shared/utils/util';
import { CustomerDto, MeLexsUserDto, PageOfCustomerDto } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import {
  AdvanceSearchOption,
  SearchConditionRequest,
} from '@shared/components/search-controller/search-controller.model';
import { MasterDataService } from '@shared/services/master-data.service';
import { RouterService } from '@shared/services/router.service';
import { SessionService } from '@shared/services/session.service';
import { DropDownConfig, PaginatorActionConfig, PaginatorResultConfig, SimpleSelectOption } from '@spig/core';
import { SubSink } from 'subsink';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit, OnDestroy {
  /** Common */
  private customerInfomation!: PageOfCustomerDto;
  public tabIndex = 0;
  private orderOptions = [
    // customerId
    { text: this.translate.instant('CUSTOMER.ORDER_BY_CUSTOMER_ID_ASC'), value: '0_ASC' },
    { text: this.translate.instant('CUSTOMER.ORDER_BY_CUSTOMER_ID_DESC'), value: '0_DESC' },
    // response unit
    { text: this.translate.instant('CUSTOMER.ORDER_BY_RESPONSE_UNIT_ASC'), value: '1_ASC' },
    { text: this.translate.instant('CUSTOMER.ORDER_BY_RESPONSE_UNIT_DESC'), value: '1_DESC' },
    // response amd unit
    { text: this.translate.instant('CUSTOMER.ORDER_BY_AMD_UNIT_ASC'), value: '2_ASC' },
    { text: this.translate.instant('CUSTOMER.ORDER_BY_AMD_UNIT_DESC'), value: '2_DESC' },
    // exp date
    { text: this.translate.instant('CUSTOMER.ORDER_BY_EXP_DATE_ASC'), value: '3_ASC' },
    { text: this.translate.instant('CUSTOMER.ORDER_BY_EXP_DATE_DESC'), value: '3_DESC' },
  ];
  private sortByOptions: string[] = ['customerId', 'responseUnit', 'amdUnit', 'prescriptionDate'];
  private currentSortBy: string[] = ['customerId'];
  private currentSortOrder: string = 'ASC';
  private configDropdown: DropDownConfig = { iconName: 'icon-Sorting', searchPlaceHolder: '' };

  public displayedColumns: string[] = [
    'cifNo',
    'fullName',
    'noOfAccount',
    'noOfBill',
    'amountOfLitigation',
    'dpd',
    'cFinalStage',
    'expireDate',
    'loanType',
    'responseUnit',
    'responseAMDUnit',
  ];
  public trackBy = (_index: number, item: CustomerDto) => {
    return `${_index}-${item.cifNo}`;
  };

  /** My customer tab */
  public isMyCust: boolean = false;
  public myCustSearch: SearchConditionRequest = {};
  public myCustSortingCtrl: UntypedFormControl = new UntypedFormControl('0_ASC');
  public myCustSortingConfig: DropDownConfig = {
    ...this.configDropdown,
    ...{ searchWith: 'text' },
  };
  public myCustSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  private myCrrentPage: number = 0;
  public dataCustomer: Array<CustomerDto> = [];
  public custPageResultConfig!: PaginatorResultConfig;
  public custPageActionConfig!: PaginatorActionConfig;

  /** Team customer tab */
  public isTeamCust: boolean = false;
  public teamCustSearch: SearchConditionRequest = {};
  public teamCustSortingCtrl: UntypedFormControl = new UntypedFormControl('0_ASC');
  public teamCustSortingConfig: DropDownConfig = {
    ...this.configDropdown,
    ...{ searchWith: 'text' },
  };
  public teamCustSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  private teamCrrentPage: number = 0;
  public dataTeam: Array<CustomerDto> = [];
  public teamPageResultConfig!: PaginatorResultConfig;
  public teamPageActionConfig!: PaginatorActionConfig;

  /** Orgz customer tab */
  public isOrgzCust: boolean = false;
  public orgzCustSearch: SearchConditionRequest = {};
  public orgzCustSortingCtrl: UntypedFormControl = new UntypedFormControl('0_ASC');
  public orgzCustSortingConfig: DropDownConfig = {
    ...this.configDropdown,
    ...{ searchWith: 'text' },
  };
  public orgzCustSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  private orgzCrrentPage: number = 0;
  public dataOrg: Array<CustomerDto> = [];
  public orgPageResultConfig!: PaginatorResultConfig;
  public orgPageActionConfig!: PaginatorActionConfig;

  /** Completed customer tab */
  public isCompCust: boolean = false;
  public compCustSearch: SearchConditionRequest = {};
  public compCustSortingCtrl: UntypedFormControl = new UntypedFormControl('0_ASC');
  public compCustSortingConfig: DropDownConfig = {
    ...this.configDropdown,
    ...{ searchWith: 'text' },
  };
  public compCustSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  private compCrrentPage: number = 0;
  public dataComp: Array<CustomerDto> = [];
  public compPageResultConfig!: PaginatorResultConfig;
  public compPageActionConfig!: PaginatorActionConfig;

  public dataScopeCode: string = '';
  private currentUser?: MeLexsUserDto;
  public advanceOptions!: AdvanceSearchOption;
  private subs = new SubSink();

  public reload = false;

  constructor(
    private customerService: CustomerService,
    private sessionService: SessionService,
    private routerService: RouterService,
    private masterDataService: MasterDataService,
    private translate: TranslateService,
    private activeRoute: ActivatedRoute
  ) {
    this.subs.add(
      this.sessionService.viewAsFetchData.subscribe(async value => {
        value && (await this.fetchInquiryCustomer());
      }),
      this.routerService.onReloadUrl.subscribe(async value => {
        if (value === MAIN_ROUTES.CUSTOMER) {
          // reset search data
          this.myCustSearch = {};
          this.myCustSortingCtrl.setValue('0_ASC');
          this.myCustSortingCtrl.updateValueAndValidity();
          this.teamCustSearch = {};
          this.teamCustSortingCtrl.setValue('0_ASC');
          this.teamCustSortingCtrl.updateValueAndValidity();
          this.orgzCustSearch = {};
          this.orgzCustSortingCtrl.setValue('0_ASC');
          this.orgzCustSortingCtrl.updateValueAndValidity();
          this.compCustSearch = {};
          this.compCustSortingCtrl.setValue('0_ASC');
          this.compCustSortingCtrl.updateValueAndValidity();
          // reload data
          this.tabIndex = 0;
          this.reload = true;
          const requestTab = this.getSearchResultByTab(this.tabIndex);
          await this.inquiryCustomers(requestTab, false);
          this.reload = false;
        }
      })
    );
  }

  ngOnInit() {
    this.advanceOptions = this.masterDataService.advanceOptions || {};
    this.currentUser = this.sessionService.currentUser;
    this.dataScopeCode = this.currentUser?.dataScopeCode || '';
    switch (this.dataScopeCode) {
      case 'SELF':
        this.isMyCust = true;
        this.isCompCust = true;
        break;
      case 'TEAM':
        this.isMyCust = true;
        this.isTeamCust = true;
        this.isCompCust = true;
        break;
      case 'ORGANIZATION':
        this.isMyCust = true;
        this.isTeamCust = true;
        this.isOrgzCust = true;
        this.isCompCust = true;
        break;
    }
    this.subs.add(
      this.activeRoute.data.subscribe(value => {
        if (value && value['pageOfCustomerDto']) {
          this.customerInfomation = value['pageOfCustomerDto'] as PageOfCustomerDto;
          const { resultConfig, actionConfig } = Utils.setPagination(
            this.customerInfomation.pageable,
            this.customerInfomation.numberOfElements,
            this.customerInfomation.totalPages,
            this.customerInfomation.totalElements
          );
          this.setPaginationContentByTab(resultConfig, actionConfig, this.customerInfomation.content);
        } else {
          this.customerInfomation = {};
          const { resultConfig, actionConfig } = Utils.setPagination();
          this.setPaginationContentByTab(resultConfig, actionConfig, this.customerInfomation.content);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  async fetchInquiryCustomer() {
    let requestTab: SearchConditionRequest;
    requestTab = this.getSearchResultByTab(this.tabIndex);
    await this.inquiryCustomers(requestTab, false);
  }

  async onTabChanged(event: MatTabChangeEvent) {
    if (this.tabIndex === Number(event.tab.textLabel)) return;
    this.tabIndex = Number(event.tab.textLabel);
    await this.inquiryCustomers({
      page: this.getCurrentPageTab(this.tabIndex),
    });
  }

  async inquiryCustomers(request: SearchConditionRequest, isDownload: boolean = false) {
    request = { ...request, ...this.setPageInquiry() };
    const resultTabs = this.getSearchResultByTab(this.tabIndex);
    request = { ...request, ...resultTabs };
    if (isDownload) {
      await this.customerService.inquiryCustomersDownload(request, this.translate.instant('CUSTOMER.ALL_CUSTOMERS'));
    } else {
      this.customerInfomation = await this.customerService.inquiryCustomers(request);
      // set data for table
      const { resultConfig, actionConfig } = Utils.setPagination(
        this.customerInfomation.pageable,
        this.customerInfomation.numberOfElements,
        this.customerInfomation.totalPages,
        this.customerInfomation.totalElements
      );
      this.setPaginationContentByTab(resultConfig, actionConfig, this.customerInfomation.content);
    }
  }

  setPaginationContentByTab(
    resultConfig: PaginatorResultConfig,
    actionConfig: PaginatorActionConfig,
    content?: CustomerDto[]
  ) {
    switch (this.tabIndex) {
      case 1:
        this.dataTeam = content || [];
        this.teamPageResultConfig = resultConfig;
        this.teamPageActionConfig = actionConfig;
        break;
      case 2:
        this.dataOrg = content || [];
        this.orgPageResultConfig = resultConfig;
        this.orgPageActionConfig = actionConfig;
        break;
      case 3:
        this.dataComp = content || [];
        this.compPageResultConfig = resultConfig;
        this.compPageActionConfig = actionConfig;
        break;
      default:
        this.dataCustomer = content || [];
        this.custPageResultConfig = resultConfig;
        this.custPageActionConfig = actionConfig;
        break;
    }
  }

  async onSearchResult(event: SearchConditionRequest, tabIndex: number) {
    switch (tabIndex) {
      case 0:
        this.myCustSearch = { ...event };
        await this.inquiryCustomers(this.myCustSearch);
        break;
      case 1:
        this.teamCustSearch = { ...event };
        await this.inquiryCustomers(this.teamCustSearch);
        break;
      case 2:
        this.orgzCustSearch = { ...event };
        await this.inquiryCustomers(this.orgzCustSearch);
        break;
      case 3:
        this.compCustSearch = { ...event };
        await this.inquiryCustomers(this.compCustSearch);
        break;
    }
  }

  getSearchResultByTab(tabIndex: number): SearchConditionRequest {
    switch (tabIndex) {
      case 1:
        this.teamCustSearch.tab = 'TEAM';
        this.teamCustSearch.sortBy = this.currentSortBy;
        this.teamCustSearch.sortOrder = this.currentSortOrder;
        return this.teamCustSearch;
      case 2:
        this.orgzCustSearch.tab = 'ORG';
        this.orgzCustSearch.sortBy = this.currentSortBy;
        this.orgzCustSearch.sortOrder = this.currentSortOrder;
        return this.orgzCustSearch;
      case 3:
        this.compCustSearch.tab = 'CLOSED';
        this.compCustSearch.sortBy = this.currentSortBy;
        this.compCustSearch.sortOrder = this.currentSortOrder;
        return this.compCustSearch;
      default:
        this.myCustSearch.tab = 'USER';
        this.myCustSearch.sortBy = this.currentSortBy;
        this.myCustSearch.sortOrder = this.currentSortOrder;
        return this.myCustSearch;
    }
  }

  getCurrentPageTab(tabIndex: number) {
    switch (tabIndex) {
      case 1:
        return this.teamCrrentPage;
      case 2:
        return this.orgzCrrentPage;
      case 3:
        return this.compCrrentPage;
      default:
        return this.myCrrentPage;
    }
  }

  setPageInquiry() {
    return {
      size: 10,
      sortBy: this.currentSortBy,
      sortOrder: this.currentSortOrder,
    } as SearchConditionRequest;
  }

  async pageEvent(event: number, tabIndex: number) {
    switch (tabIndex) {
      case 1:
        this.teamCrrentPage = event - 1;
        break;
      case 2:
        this.orgzCrrentPage = event - 1;
        break;
      case 3:
        this.compCrrentPage = event - 1;
        break;
      default:
        this.myCrrentPage = event - 1;
        break;
    }
    let request = this.getSearchResultByTab(this.tabIndex) as SearchConditionRequest;
    request.page = event - 1;
    await this.inquiryCustomers(request);
  }

  async onSaveFile() {
    await this.inquiryCustomers({}, true);
  }

  async sortSelected(event: any) {
    const _sortValue = event.split('_');
    this.currentSortBy[0] = this.sortByOptions[_sortValue[0]];
    this.currentSortOrder = _sortValue[1];
    const request = this.getSearchResultByTab(this.tabIndex) as SearchConditionRequest;
    await this.inquiryCustomers(request);
  }

  onClickCIFNo(value: string) {
    this.routerService.navigateTo('/main/customer/detail', { customerId: value });
  }
}
