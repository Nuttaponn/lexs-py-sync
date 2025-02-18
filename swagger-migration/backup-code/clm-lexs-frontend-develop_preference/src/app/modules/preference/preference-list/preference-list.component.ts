import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MAIN_ROUTES } from '@app/shared/constant';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { RouterService } from '@app/shared/services/router.service';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import {
  DropDownConfig,
  NameValuePair,
  PaginatorActionConfig,
  PaginatorResultConfig,
  SpigCoreModule,
  SpigShareModule,
} from '@spig/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SearchConditionRequest } from '@app/shared/components/search-controller/search-controller.model';
import { PreferenceService } from '../preference.service';
import { PagePreferenceGroupDto } from 'projects/lexs/lexs-client/src/model/pagePreferenceGroupDto';
import { PreferenceGroupDto } from 'projects/lexs/lexs-client/src/model/preferenceGroupDto';
import { PageableObject } from 'projects/lexs/lexs-client/src/model/pageableObject';
import { SearchTaskPreference } from '../preference.model';

@Component({
  selector: 'app-preference-list',
  standalone: true,
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    SharedModule,
    TranslateModule,
    PipesModule,
  ],
  templateUrl: './preference-list.component.html',
  styleUrl: './preference-list.component.scss',
})
export class PreferenceListComponent implements OnInit {
  private routerService = inject(RouterService);

  public tabIndex = 0;
  public ddlDocType: NameValuePair[] = [];
  public ddlDocTypeConfig: DropDownConfig = {
    iconName: 'icon-Filter',
    displayWith: 'name',
    valueField: 'value',
    searchPlaceHolder: '',
    searchWith: 'name',
    labelPlaceHolder: 'ประเภทหนังสือสั่งการ',
  };
  private currentSortBy: string[] = ['preferenceGroupNo'];//'customerId'
  private currentSortOrder: string = 'DESC';

  public displayedColumns: string[] = [
    'no',
    'docno',
    'docref',
    'docdate',
    'doctype',
    'doctype2',
    'username',
    'preferenceno',
    // 'status',
  ];
  tasks : PagePreferenceGroupDto={};

  public preferenceSearch: SearchTaskPreference = {
    tabName: 'PREFERENCE'
  };
  private preferenceCrrentPage: number = 0;
  public preferenceData: Array<PreferenceGroupDto> = [];
  public preferencePageResultConfig!: PaginatorResultConfig;
  public preferencePageActionConfig!: PaginatorActionConfig;

  public nonpreferenceSearch: SearchTaskPreference = {
    tabName: 'NOT_PREFERENCE'
  };
  private nonpreferenceCrrentPage: number = 0;
  public nonpreferenceData: Array<PreferenceGroupDto> = [];
  public nonpreferencePageResultConfig!: PaginatorResultConfig;
  public nonpreferencePageActionConfig!: PaginatorActionConfig;

  public allpreferenceSearch: SearchTaskPreference = {
    tabName: 'ALL'
  };
  private allpreferenceCrrentPage: number = 0;
  public allpreferenceData: Array<PreferenceGroupDto> = [];
  public allpreferencePageResultConfig!: PaginatorResultConfig;
  public allpreferencePageActionConfig!: PaginatorActionConfig;

  public searchCtrl!: UntypedFormGroup;
  getControl(name: string) {
    return this.searchCtrl.get(name);
  }

  constructor(private fb: UntypedFormBuilder,private preferenceService :PreferenceService) {}

  async ngOnInit(): Promise<void> {
    this.searchCtrl = this.initSearchControl();
    this.initDDL();

    let requestTab: SearchTaskPreference;
    requestTab = this.getSearchResultByTab(0);
    await this.inquiryPreference(requestTab);
  }

  initDDL(){
    let en = {} as NameValuePair;
    en.name = 'ทั้งหมด';
    en.value = 'ALL';
    this.ddlDocType.push(en);
    en = {} as NameValuePair;
    en.name = 'สั่งการยื่นบุริมสิทธิจำนอง';
    en.value = 'PREFERENCE';
    this.ddlDocType.push(en);
    en = {} as NameValuePair;
    en.name = 'สั่งการไม่ยื่นบุริมสิทธิจำนอง';
    en.value = 'NOT_PREFERENCE';
    this.ddlDocType.push(en);
  }

  initSearchControl() {
    return this.fb.group({
      docnumber_preference: [null,Validators.minLength(3)],
      litigationId_preference:  [null,Validators.minLength(3)],
      docnumber_not_preference:  [null,Validators.minLength(3)],
      litigationId_not_preference:  [null,Validators.minLength(3)],
      docnumber_all:  [null,Validators.minLength(3)],
      litigationId_all:  [null,Validators.minLength(3)],
      doctype: null,

    });
  }

  onTabChanged(event: MatTabChangeEvent) {
    if (this.tabIndex === Number(event.tab.textLabel)) return;

    this.searchCtrl = this.initSearchControl();

    this.tabIndex = Number(event.tab.textLabel);
    if(this.tabIndex===1)
      this.inquiryPreference({tabName :'NOT_PREFERENCE', page: this.getCurrentPageTab(this.tabIndex),});
    else if(this.tabIndex===2)
      this.inquiryPreference({tabName :'ALL', page: this.getCurrentPageTab(this.tabIndex),});
    else
      this.inquiryPreference({tabName :'PREFERENCE', page: this.getCurrentPageTab(this.tabIndex),});
  }

  sort(data: any) {
    if(!data)
      return;

    const newData = data.sort((a: any, b: any) => {
      return (b.preferenceGroupNo as string).localeCompare(a.preferenceGroupNo);
    });
    data = newData;
  }

  async inquiryPreference(request: SearchTaskPreference) {
    request = { ...request, ...this.setPageInquiry() };
    const resultTabs = this.getSearchResultByTab(this.tabIndex);
    request = { ...request, ...resultTabs };

    this.tasks = await this.preferenceService.inquiryPreferenceGroups(request.tabName,request.preferenceGroupNo,request.litigationId,request.size,request.page);

    const { resultConfig, actionConfig } = this.setPagination(
      this.tasks.pageable,
      this.tasks.numberOfElements,
      this.tasks.totalPages,
      this.tasks.totalElements
    );
    this.sort(this.tasks.content);
    this.setPaginationContentByTab(resultConfig, actionConfig, this.tasks.content);
  }

   setPagination(
      _pageable?: PageableObject,
      _numberOfElements: number = 1,
      _totalPages: number = 1,
      _totalElements: number = 0
    ) {
      const _pageNumberOffer =
        _pageable && _pageable.pageSize && _pageable.pageNumber ? _pageable.pageSize * _pageable.pageNumber : 0;
      const resultConfig = {
        fromIndex: _pageNumberOffer + 1,
        toIndex: _pageNumberOffer + _numberOfElements,
        totalElements: _totalElements,
      } as PaginatorResultConfig;
      const actionConfig = {
        totalPages: _totalPages,
        currentPage: (_pageable?.pageNumber || 0) + 1,
        fromPage: 1,
        toPage: _totalPages,
      } as PaginatorActionConfig;
      return { resultConfig, actionConfig };
    }

  setPageInquiry() {
    return {
      size: 10,
      sortBy: this.currentSortBy,
      sortOrder: this.currentSortOrder,
    } as SearchConditionRequest;
  }

  getCurrentPageTab(tabIndex: number) {
    switch (tabIndex) {
      case 1:
        return this.nonpreferenceCrrentPage;
      case 2:
        return this.allpreferenceCrrentPage;
      default:
        return this.preferenceCrrentPage;
    }
  }

  async pageEvent(event: number, tabIndex: number) {
    switch (tabIndex) {
      case 1:
        this.nonpreferenceCrrentPage = event - 1;
        break;
      case 2:
        this.allpreferenceCrrentPage = event - 1;
        break;
      default:
        this.preferenceCrrentPage = event - 1;
        break;
    }
    let request = this.getSearchResultByTab(this.tabIndex) as SearchTaskPreference;
    request.page = event - 1;
    await this.inquiryPreference(request);
  }

  getSearchResultByTab(tabIndex: number): SearchTaskPreference {
    switch (tabIndex) {
      case 1:
        this.nonpreferenceSearch.preferenceGroupNo = this.getControl('docnumber_not_preference')?.value;
        this.nonpreferenceSearch.litigationId = this.getControl('litigationId_not_preference')?.value;
        this.nonpreferenceSearch.sortBy = this.currentSortBy;
        this.nonpreferenceSearch.sortOrder = this.currentSortOrder;
        return this.nonpreferenceSearch;
      case 2:
        this.allpreferenceSearch.preferenceGroupNo = this.getControl('docnumber_all')?.value;
        this.allpreferenceSearch.litigationId = this.getControl('litigationId_all')?.value;
        this.allpreferenceSearch.tabName = this.getControl('doctype')?.value ? this.getControl('doctype')?.value : 'ALL';
        this.allpreferenceSearch.sortBy = this.currentSortBy;
        this.allpreferenceSearch.sortOrder = this.currentSortOrder;
        return this.allpreferenceSearch;
      default:
        this.preferenceSearch.preferenceGroupNo = this.getControl('docnumber_preference')?.value;
        this.preferenceSearch.litigationId = this.getControl('litigationId_preference')?.value;
        this.preferenceSearch.sortBy = this.currentSortBy;
        this.preferenceSearch.sortOrder = this.currentSortOrder;
        return this.preferenceSearch;
    }
  }

  setPaginationContentByTab(
    resultConfig: PaginatorResultConfig,
    actionConfig: PaginatorActionConfig,
    content?: PreferenceGroupDto[]
  ) {
    switch (this.tabIndex) {
      case 1:
        this.nonpreferenceData = content || [];
        this.nonpreferencePageResultConfig = resultConfig;
        this.nonpreferencePageActionConfig = actionConfig;
        break;
      case 2:
        this.allpreferenceData = content || [];
        this.allpreferencePageResultConfig = resultConfig;
        this.allpreferencePageActionConfig = actionConfig;
        break;
      default:
        this.preferenceData = content || [];
        this.preferencePageResultConfig = resultConfig;
        this.preferencePageActionConfig = actionConfig;
        break;
    }
  }

  actionClick(preferenceGroupNo: string) {
    this.routerService.navigateTo(`${MAIN_ROUTES.PREFERENCE}/detail`, { preferenceGroupNo: preferenceGroupNo });
  }

  navigateToLitigation(litigationId: string) {
    this.routerService.navigateTo('/main/lawsuit/detail', { litigationId: litigationId });
  }

  onKeyup(event: KeyboardEvent,tabIndex: number) {
    (event.code === 'Enter' || event.code === 'NumpadEnter') && this.searchCtrl.valid && this.onSearch(tabIndex);
  }

  onTextChange(tabIndex: number) {
    if(this.searchCtrl.valid)
      this.onSearch(tabIndex);
  }

  async onSelectedOption() {
    this.onSearch(2);
  }

  async onSearch(tabIndex: number) {
    if(this.searchCtrl.invalid)
      return;

    this.nonpreferenceCrrentPage = 0;
    this.allpreferenceCrrentPage = 0;
    this.preferenceCrrentPage = 0;

    let requestTab: SearchTaskPreference;
    requestTab = this.getSearchResultByTab(tabIndex);
    requestTab.page=0;
    await this.inquiryPreference(requestTab);
  }
}
