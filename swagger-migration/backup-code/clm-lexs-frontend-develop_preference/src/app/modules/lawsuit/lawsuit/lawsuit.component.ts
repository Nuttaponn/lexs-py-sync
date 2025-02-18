import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { MAIN_ROUTES } from '@app/shared/constant';
import { Utils } from '@app/shared/utils/util';
import {
  LitigationControllerService,
  LitigationDto,
  MeLexsUserDto,
  PageOfCustomerDto,
  PageOfLitigationDto,
} from '@lexs/lexs-client';
import { ConfirmMergeLgComponent } from '@modules/lawsuit/confirm-merge-lg/confirm-merge-lg.component';
import { LawsuitService } from '@modules/lawsuit/lawsuit.service';
import { TranslateService } from '@ngx-translate/core';
import {
  AdvanceSearchOption,
  SearchConditionRequest,
} from '@shared/components/search-controller/search-controller.model';
import { ErrorHandlingService } from '@shared/services/error-handling.service';
import { MasterDataService } from '@shared/services/master-data.service';
import { NotificationService } from '@shared/services/notification.service';
import { RouterService } from '@shared/services/router.service';
import { ActionOnScreen, SessionService } from '@shared/services/session.service';
import {
  DialogOptions,
  DropDownConfig,
  PaginatorActionConfig,
  PaginatorResultConfig,
  SimpleSelectOption,
} from '@spig/core';
import { lastValueFrom } from 'rxjs';
import { SubSink } from 'subsink';
import { ModalAssignLawsuitComponent } from '../modal-assign-lawsuit/modal-assign-lawsuit.component';

interface IPageSelection {
  page: number;
  indexSelected: number[];
  litigationDtos: IExtendLitigationDto[];
}

interface IExtendLitigationDto extends LitigationDto {
  index: number;
}
@Component({
  selector: 'app-lawsuit',
  templateUrl: './lawsuit.component.html',
  styleUrls: ['./lawsuit.component.scss'],
})
export class LawsuitComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChildren(MatTable) table!: QueryList<any>;

  public accessPermissions = this.sessionService.accessPermissions();
  public actionOnScreen: ActionOnScreen = {
    canAdd: this.accessPermissions.mode.includes('ADD'),
    canEdit: this.accessPermissions.mode.includes('EDIT'),
    canDelete: this.accessPermissions.mode.includes('DELETE'),
    canApprove: this.accessPermissions.mode.includes('APPROVE'),
  };
  public hasCreateLegalAssignment =
    (this.actionOnScreen.canEdit || this.actionOnScreen.canApprove) &&
    this.accessPermissions.permissions.includes('CREATE_LEGAL_ASSIGNMENT');
  public hasCreateLawsuit =
    (this.actionOnScreen.canEdit || this.actionOnScreen.canApprove) &&
    this.accessPermissions.permissions.includes('CREATE_LAWSUIT');

  /** Common */
  private lawsuitInfomation!: PageOfLitigationDto;
  public tabIndex = 0;
  private orderOptions = [
    // lawsuitId
    { text: this.translateService.instant('LAWSUIT.ORDER_BY_LG_ID_ASC_SHORTENED'), value: '0_ASC' },
    { text: this.translateService.instant('LAWSUIT.ORDER_BY_LG_ID_DESC_SHORTENED'), value: '0_DESC' },
    // kbdUserId
    { text: this.translateService.instant('LAWSUIT.ORDER_BY_KDN_AO_ASC_SHORTENED'), value: '1_ASC' },
    { text: this.translateService.instant('LAWSUIT.ORDER_BY_KDN_AO_DESC_SHORTENED'), value: '1_DESC' },
    // exp date
    { text: this.translateService.instant('LAWSUIT.ORDER_BY_EXP_DATE_ASC_SHORTENED'), value: '2_ASC' },
    { text: this.translateService.instant('LAWSUIT.ORDER_BY_EXP_DATE_DESC_SHORTENED'), value: '2_DESC' },
  ];
  private sortByOptions: string[] = ['litigationId', 'kbdUserId', 'prescriptionDate'];
  private currentSortBy: string[] = ['litigationId'];
  private currentSortOrder: string = 'ASC';
  private configDropdown: DropDownConfig = { iconName: 'icon-Sorting', searchPlaceHolder: '' };

  public selectedColumns: string[] = [
    'select',
    'lgId',
    'cifNo',
    'decidedCaseNo',
    'duedate',
    'dpd',
    'lawyer',
    'responseId',
    'ao',
    'escort',
    'flag',
  ];
  public nonSelectedColumns: string[] = [
    'lgId',
    'cifNo',
    'decidedCaseNo',
    'duedate',
    'dpd',
    'lawyer',
    'responseId',
    'ao',
    'escort',
    'flag',
  ];
  public displayedColumns: string[] = [];
  public trackBy = (_index: number, item: IExtendLitigationDto) => {
    return `${_index}-${item.litigationId}`;
  };

  /** My lawsuit tab */
  public isMyLawsuit: boolean = false;
  public myLawsuitSearch: SearchConditionRequest = {};
  public myLawsuitSortingCtrl: UntypedFormControl = new UntypedFormControl('0_ASC');
  public myLawsuitSortingConfig: DropDownConfig = {
    ...this.configDropdown,
    ...{ searchWith: 'text' },
  };
  public myLawsuitSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  private myCrrentPage: number = 0;
  public dataLawsuit: Array<IExtendLitigationDto> = [];
  public custPageResultConfig!: PaginatorResultConfig;
  public custPageActionConfig!: PaginatorActionConfig;

  /** Team lawsuit tab */
  public isTeamLawsuit: boolean = false;
  public teamLawsuitSearch: SearchConditionRequest = {};
  public teamLawsuitSortingCtrl: UntypedFormControl = new UntypedFormControl('0_ASC');
  public teamLawsuitSortingConfig: DropDownConfig = {
    ...this.configDropdown,
    ...{ searchWith: 'text' },
  };
  public teamLawsuitSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  private teamCrrentPage: number = 0;
  public dataTeam: Array<IExtendLitigationDto> = [];
  public teamPageResultConfig!: PaginatorResultConfig;
  public teamPageActionConfig!: PaginatorActionConfig;

  /** Orgz lawsuit tab */
  public isOrgzLawsuit: boolean = false;
  public orgzLawsuitSearch: SearchConditionRequest = {};
  public orgzLawsuitSortingCtrl: UntypedFormControl = new UntypedFormControl('0_ASC');
  public orgzLawsuitSortingConfig: DropDownConfig = {
    ...this.configDropdown,
    ...{ searchWith: 'text' },
  };
  public orgzLawsuitSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  private orgzCrrentPage: number = 0;
  public dataOrg: Array<IExtendLitigationDto> = [];
  public orgPageResultConfig!: PaginatorResultConfig;
  public orgPageActionConfig!: PaginatorActionConfig;

  /** Completed lawsuit tab */
  public isCompLawsuit: boolean = false;
  public compLawsuitSearch: SearchConditionRequest = {};
  public compLawsuitSortingCtrl: UntypedFormControl = new UntypedFormControl('0_ASC');
  public compLawsuitSortingConfig: DropDownConfig = {
    ...this.configDropdown,
    ...{ searchWith: 'text' },
  };
  public compLawsuitSortingOptions: SimpleSelectOption[] = [...this.orderOptions];
  private compCrrentPage: number = 0;
  public dataComp: Array<IExtendLitigationDto> = [];
  public compPageResultConfig!: PaginatorResultConfig;
  public compPageActionConfig!: PaginatorActionConfig;

  public dataScopeCode: string = '';
  public currentUser?: MeLexsUserDto;
  public advanceOptions!: AdvanceSearchOption;

  public selection = new SelectionModel<IExtendLitigationDto>(true, []);
  public allSelection: LitigationDto[] = [];
  pageSelections: IPageSelection[] = [];

  private subs = new SubSink();

  public reload = false;

  constructor(
    private lawsuitService: LawsuitService,
    private sessionService: SessionService,
    private routerService: RouterService,
    private masterDataService: MasterDataService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private errorHandlingService: ErrorHandlingService,
    private litigationControllerService: LitigationControllerService,
    private activeRoute: ActivatedRoute,
    private cdf: ChangeDetectorRef
  ) {
    this.subs.add(
      this.sessionService.viewAsFetchData.subscribe(async value => {
        value && (await this.fetchInquiryLawsuits());
      }),
      this.routerService.onReloadUrl.subscribe(async value => {
        if (value === MAIN_ROUTES.LAWSUIT) {
          // reset search data
          this.myLawsuitSearch = {};
          this.myLawsuitSortingCtrl.setValue('0_ASC');
          this.myLawsuitSortingCtrl.updateValueAndValidity();
          this.teamLawsuitSearch = {};
          this.teamLawsuitSortingCtrl.setValue('0_ASC');
          this.teamLawsuitSortingCtrl.updateValueAndValidity();
          this.orgzLawsuitSearch = {};
          this.orgzLawsuitSortingCtrl.setValue('0_ASC');
          this.orgzLawsuitSortingCtrl.updateValueAndValidity();
          this.compLawsuitSearch = {};
          this.compLawsuitSortingCtrl.setValue('0_ASC');
          this.compLawsuitSortingCtrl.updateValueAndValidity();
          // reload data
          this.tabIndex = 0;
          this.reload = true;
          const requestTab = this.getSearchResultByTab(this.tabIndex);
          await this.inquiryLawsuits(requestTab, false);
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
        this.isMyLawsuit = true;
        this.isCompLawsuit = true;
        break;
      case 'TEAM':
        this.isMyLawsuit = true;
        this.isTeamLawsuit = true;
        this.isCompLawsuit = true;
        break;
      case 'ORGANIZATION':
        this.isMyLawsuit = true;
        this.isTeamLawsuit = true;
        this.isOrgzLawsuit = true;
        this.isCompLawsuit = true;
        break;
    }

    this.displayedColumns =
      this.tabIndex !== 3 && (this.hasCreateLegalAssignment || this.hasCreateLawsuit)
        ? this.selectedColumns
        : this.nonSelectedColumns;

    this.subs.add(
      this.activeRoute.data.subscribe(value => {
        if (value && value['pageOfLitigationDto']) {
          this.lawsuitInfomation = value['pageOfLitigationDto'] as PageOfCustomerDto;
          const { resultConfig, actionConfig } = Utils.setPagination(
            this.lawsuitInfomation.pageable,
            this.lawsuitInfomation.numberOfElements,
            this.lawsuitInfomation.totalPages,
            this.lawsuitInfomation.totalElements
          );
          this.setPaginationContentByTab(resultConfig, actionConfig, this.lawsuitInfomation.content);
        } else {
          this.lawsuitInfomation = {};
          const { resultConfig, actionConfig } = Utils.setPagination();
          this.setPaginationContentByTab(resultConfig, actionConfig, this.lawsuitInfomation.content);
        }
      })
    );

    this.lawsuitService.currentTab = 0;
  }

  ngAfterViewChecked(): void {
    if (this.table.length > 0) {
      this.table.forEach(child => {
        child.updateStickyColumnStyles();
        this.cdf.detectChanges();
      });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  async fetchInquiryLawsuits() {
    let requestTab: SearchConditionRequest;
    requestTab = this.getSearchResultByTab(this.tabIndex);
    await this.inquiryLawsuits(requestTab, false);
  }

  async onTabChanged(event: MatTabChangeEvent) {
    if (this.tabIndex === Number(event.tab.textLabel)) return;
    this.tabIndex = Number(event.tab.textLabel);
    let request = this.getSearchResultByTab(this.tabIndex) as SearchConditionRequest;
    request.page = this.getCurrentPageByTab(this.tabIndex);
    await this.inquiryLawsuits(request);
  }

  async inquiryLawsuits(
    request: SearchConditionRequest,
    isDownload: boolean = false,
    isClearRelatedSelectionProp = true
  ) {
    request = { ...request, ...this.setPageInquiry() };
    const resultTabs = this.getSearchResultByTab(this.tabIndex);
    request = { ...request, ...resultTabs };
    if (isDownload) {
      await this.lawsuitService.inquiryLitigationsDownload(
        request,
        this.translateService.instant('LAWSUIT.ALL_LAWSUITS')
      );
    } else {
      this.lawsuitInfomation = await this.lawsuitService.inquiryLawsuits(request);
      // set data for table
      const { resultConfig, actionConfig } = Utils.setPagination(
        this.lawsuitInfomation.pageable,
        this.lawsuitInfomation.numberOfElements,
        this.lawsuitInfomation.totalPages,
        this.lawsuitInfomation.totalElements
      );
      this.setPaginationContentByTab(resultConfig, actionConfig, this.lawsuitInfomation.content);
    }

    if (isClearRelatedSelectionProp) {
      this.clearRelatedSelectionProp();
    }
  }

  async onSearchResult(event: SearchConditionRequest, tabIndex: number) {
    switch (tabIndex) {
      case 1:
        this.teamLawsuitSearch = { ...event };
        break;
      case 2:
        this.orgzLawsuitSearch = { ...event };
        break;
      case 3:
        this.compLawsuitSearch = { ...event };
        break;
      default:
        this.myLawsuitSearch = { ...event };
        break;
    }
    await this.inquiryLawsuitByTab(tabIndex);
  }

  private async inquiryLawsuitByTab(tabIndex: number) {
    switch (tabIndex) {
      case 1:
        await this.inquiryLawsuits(this.teamLawsuitSearch);
        break;
      case 2:
        await this.inquiryLawsuits(this.orgzLawsuitSearch);
        break;
      case 3:
        await this.inquiryLawsuits(this.compLawsuitSearch);
        break;
      default:
        await this.inquiryLawsuits(this.myLawsuitSearch);
        break;
    }
  }

  getSearchResultByTab(tabIndex: number): SearchConditionRequest {
    this.selection.clear();
    switch (tabIndex) {
      case 1:
        this.teamLawsuitSearch.tab = 'TEAM';
        this.teamLawsuitSearch.sortBy = this.currentSortBy;
        this.teamLawsuitSearch.sortOrder = this.currentSortOrder;
        return this.teamLawsuitSearch;
      case 2:
        this.orgzLawsuitSearch.tab = 'ORG';
        this.orgzLawsuitSearch.sortBy = this.currentSortBy;
        this.orgzLawsuitSearch.sortOrder = this.currentSortOrder;
        return this.orgzLawsuitSearch;
      case 3:
        this.displayedColumns = this.nonSelectedColumns; // WIP: Backend Fix return empty array no error
        this.compLawsuitSearch.tab = 'CLOSED';
        this.compLawsuitSearch.sortBy = this.currentSortBy;
        this.compLawsuitSearch.sortOrder = this.currentSortOrder;
        return this.compLawsuitSearch;
      default:
        this.myLawsuitSearch.tab = 'USER';
        this.myLawsuitSearch.sortBy = this.currentSortBy;
        this.myLawsuitSearch.sortOrder = this.currentSortOrder;
        return this.myLawsuitSearch;
    }
  }

  getCurrentPageByTab(tabIndex: number) {
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

  getCurrentPageDtos(tabIndex: number): Array<IExtendLitigationDto> {
    switch (tabIndex) {
      case 1:
        return this.dataTeam;
      case 2:
        return this.dataOrg;
      case 3:
        return this.dataComp;
      default:
        return this.dataLawsuit;
    }
  }

  setPageInquiry() {
    return {
      size: 10,
      sortBy: this.currentSortBy,
      sortOrder: this.currentSortOrder,
    } as SearchConditionRequest;
  }

  saveDataToPageSelections(tabIndex: number) {
    const pageNow = this.getCurrentPageByTab(tabIndex);

    const index = this.pageSelections.findIndex(obj => obj.page === pageNow);
    if (index >= 0) {
      this.pageSelections[index].indexSelected = this.selection.selected.map(dto => dto.index) ?? [];
      this.pageSelections[index].litigationDtos = this.selection.selected ?? [];
    } else {
      this.pageSelections.push({
        page: pageNow,
        indexSelected: this.selection.selected.map(dto => dto.index) ?? [],
        litigationDtos: this.selection.selected ?? [],
      });
    }
  }

  selectionToggleTick(tabIndex: number, currentPage: number) {
    const pageDtos = this.getCurrentPageDtos(tabIndex);
    const result = this.pageSelections.find(obj => obj.page === currentPage);
    if (!result) return;

    result.indexSelected.forEach(i => this.selection.select(pageDtos[i]));
  }

  async pageEvent(event: number, tabIndex: number) {
    this.saveDataToPageSelections(tabIndex);

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
    let request = this.getSearchResultByTab(
      this.tabIndex
    ) as SearchConditionRequest; /* Set new pageNumber to requestObj */
    request.page = event - 1;
    await this.inquiryLawsuits(request, false, false);

    this.selectionToggleTick(tabIndex, request.page);
  }

  async onSaveFile() {
    await this.inquiryLawsuits({}, true);
  }

  async sortSelected(event: any) {
    const _sortValue = event.split('_');
    this.currentSortBy[0] = this.sortByOptions[_sortValue[0]];
    this.currentSortOrder = _sortValue[1];
    const request = this.getSearchResultByTab(this.tabIndex) as SearchConditionRequest;
    await this.inquiryLawsuits(request);
  }

  groupBy(objArray: Array<any>, property: string) {
    return objArray.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) acc[key] = [];
      acc[key].push(obj);
      return acc;
    }, {});
  }

  setAllSelection() {
    this.allSelection = [];
    this.pageSelections.forEach(pageSelection => {
      this.allSelection = this.allSelection.concat(pageSelection.litigationDtos);
    });
  }

  async onClickBtnMergeLgId(tabIndex: number) {
    this.saveDataToPageSelections(tabIndex);
    this.setAllSelection();

    if (this.allSelection.length < 2) {
      this.notificationService.alertDialog(
        'LAWSUIT.DIALOG_ALERT_MERGE_LG_NO_SELECTED',
        'LAWSUIT.DIALOG_ALERT_CONTENT_MERGE_LG_NO_SELECTED'
      );
      return;
    }

    const grouped = this.groupBy(this.allSelection, 'customerId');
    if (Object.keys(grouped).length > 1) {
      this.notificationService.alertDialog(
        'LAWSUIT.DIALOG_ALERT_MERGE_LG_BLOCKED',
        'LAWSUIT.DIALOG_ALERT_CONTENT_MERGE_LG_BLOCKED'
      );
      return;
    }

    let selectedLgId: string[] = [];
    this.allSelection.forEach(data => {
      if (!!data.litigationId) selectedLgId.push(data.litigationId);
    });

    const resultConfirmDialog = await this.showConfirmMergeLg(selectedLgId); //resultConfirmDialog

    if (!resultConfirmDialog) return;

    try {
      const res: any = await this.errorHandlingService.invokeNoRetry(() =>
        lastValueFrom(this.litigationControllerService.mergeLitigation(selectedLgId))
      ); //, { notShowAsSnackBar: true }

      if (res?.litigationId) {
        this.notificationService.openSnackbarSuccess(
          `${this.translateService.instant('LAWSUIT.NOTIFICATION_MERGE_ID_SUCCESS')} ${
            res.litigationId
          } ${this.translateService.instant('COMMON.LABEL_FINISHED')}`
        );
        await this.inquiryLawsuitByTab(this.tabIndex);
      } else {
        this.notificationService.alertDialog(
          'LAWSUIT.DIALOG_ALERT_MERGE_LG_BLOCKED',
          this.getmessage(res?.errors[0]?.description)
        );
      }
    } catch (e: any) {
      this.notificationService.alertDialog(
        'LAWSUIT.DIALOG_ALERT_MERGE_LG_BLOCKED',
        this.getmessage(e?.error?.errors[0]?.description)
      );
    }
  }

  getmessage(errorMsg: string) {
    let strmsg = this.translateService.instant('LAWSUIT.DIALOG_ALERT_CONTENT_MERGE_LG_BLOCKED') + '<br>';

    const arr = errorMsg.split(',');
    for (let i of arr) {
      strmsg += '<li>' + i + '</li>';
    }
    return '<ul>' + strmsg + '</ul>';
  }

  async showConfirmMergeLg(expectedLg_Id: string[]): Promise<any> {
    const resMergedAccounts = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.litigationControllerService.inquiryMergedAccounts(expectedLg_Id))
    );

    const expectedLgId = expectedLg_Id.sort()[0] ?? '';
    const myContext = {
      icontents: this.allSelection as LitigationDto[],
      expectedLgId,
      resMergedAccounts,
    };
    const dialogSetting: DialogOptions = {
      component: ConfirmMergeLgComponent,
      title: 'LAWSUIT.DIALOG_CONFIRM_TITLE_MERGE_LG',
      iconName: 'icon-Merge',
      rightButtonLabel: 'LAWSUIT.DIALOG_CONFIRM_BTN_MERGE_LG',
      buttonIconName: 'icon-Merge',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      context: myContext,
    };

    const resDialog = await this.notificationService.showCustomDialog(dialogSetting);
    return resDialog;
  }

  async onClickBtnAssignLawsuit() {
    this.saveDataToPageSelections(this.tabIndex);
    this.setAllSelection();
    if (this.allSelection.length < 1) {
      this.notificationService.alertDialog(
        'LAWSUIT.DIALOG_ALERT_ASSIGN_LG_NO_SELECTED',
        'LAWSUIT.DIALOG_ALERT_CONTENT_ASSIGN_LG_NO_SELECTED'
      );
    } else {
      const result = await this.modalAssignLawsuit();
      if (result) {
        await this.inquiryLawsuitByTab(this.tabIndex);
        const mgs = `${this.translateService.instant('LAWSUIT.SUIT_ASSIGN_TO')} ${
          result?.data?.fullName
        } ${this.translateService.instant('COMMON.LABEL_FINISHED')}`;
        this.notificationService.openSnackbarSuccess(mgs);
        this.selection.clear();
      } else {
        return;
      }
    }
  }

  clearRelatedSelectionProp() {
    this.selection.clear();
    this.pageSelections = [];
    this.allSelection = [];
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: IExtendLitigationDto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.litigationId ?? '' + 1}`;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    // const numRows = this.dataSource.length;
    let numRows = null;
    switch (this.tabIndex) {
      case 1:
        numRows = this.dataTeam.length;
        break;
      case 2:
        numRows = this.dataOrg.length;
        break;
      case 3:
        numRows = this.dataComp.length;
        break;
      default:
        numRows = this.dataLawsuit.length;
        break;
    }
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    switch (this.tabIndex) {
      case 1:
        this.selection.select(...this.dataTeam);
        break;
      case 2:
        this.selection.select(...this.dataOrg);
        break;
      case 3:
        this.selection.select(...this.dataComp);
        break;
      default:
        this.selection.select(...this.dataLawsuit);
        break;
    }
  }

  onClickLG(element: LitigationDto) {
    this.routerService.navigateTo('/main/lawsuit/detail', {
      litigationId: element.litigationId,
      blackCaseNo: element.blackCaseNo,
      _tabIndex: 0,
      _subIndex: 0,
      _underSubIndex: 0,
    });
  }

  async modalAssignLawsuit(): Promise<any> {
    const myContext = {
      icontents: this.allSelection as LitigationDto[],
    };
    const dialogSetting: DialogOptions = {
      component: ModalAssignLawsuitComponent,
      title: 'LAWSUIT.BTN_ASSIGN_LAWSUIT',
      iconName: 'icon-Stack-Arrow-Forward',
      rightButtonLabel: 'LAWSUIT.BTN_ASSIGN_LAWSUIT',
      buttonIconName: 'icon-Stack-Arrow-Forward',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      context: myContext,
    };

    return await this.notificationService.showCustomDialog(dialogSetting);
  }

  setPaginationContentByTab(
    resultConfig: PaginatorResultConfig,
    actionConfig: PaginatorActionConfig,
    content?: LitigationDto[]
  ) {
    const tempData: LitigationDto[] = content || [];
    switch (this.tabIndex) {
      case 1:
        this.displayedColumns =
          this.hasCreateLegalAssignment || this.hasCreateLawsuit ? this.selectedColumns : this.nonSelectedColumns;
        this.dataTeam = [];
        tempData.forEach((element: LitigationDto, index) => {
          this.dataTeam.push({ ...element, index });
        });
        this.teamPageResultConfig = resultConfig;
        this.teamPageActionConfig = actionConfig;
        break;
      case 2:
        this.displayedColumns =
          this.hasCreateLegalAssignment || this.hasCreateLawsuit ? this.selectedColumns : this.nonSelectedColumns;
        this.dataOrg = [];
        tempData.forEach((element: LitigationDto, index) => {
          this.dataOrg.push({ ...element, index });
        });
        this.orgPageResultConfig = resultConfig;
        this.orgPageActionConfig = actionConfig;
        break;
      case 3:
        this.displayedColumns = this.nonSelectedColumns;
        this.dataComp = [];
        tempData.forEach((element: LitigationDto, index) => {
          this.dataComp.push({ ...element, index });
        });
        this.compPageResultConfig = resultConfig;
        this.compPageActionConfig = actionConfig;
        break;
      default:
        this.displayedColumns =
          this.hasCreateLegalAssignment || this.hasCreateLawsuit ? this.selectedColumns : this.nonSelectedColumns;
        this.dataLawsuit = [];
        tempData.forEach((element: LitigationDto, index) => {
          this.dataLawsuit.push({ ...element, index });
        });
        this.custPageResultConfig = resultConfig;
        this.custPageActionConfig = actionConfig;
        break;
    }
  }
}
