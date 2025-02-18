import { Component, Input, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { CIVIL_CASE_TAB_ROUTES, PREPARE_LAWSUIT_INFO_TAB_ROUTES, TASK_ROUTES } from '@app/shared/constant';
import { ITabNav, taskCode } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { DocumentAccountService } from '../../document-preparation/document-account.service';
import { DocumentService } from '../../document-preparation/document.service';
import { PrepareLawsuitService } from './prepare-lawsuit.service';

@Component({
  selector: 'app-prepare-lawsuit',
  templateUrl: './prepare-lawsuit.component.html',
  styleUrls: ['./prepare-lawsuit.component.scss'],
})
export class PrepareLawsuitComponent implements OnInit {
  @Input()
  set tabIndex(val: number) {
    this._tabIndex = val || this._tabIndex;
  }
  public _tabIndex: number = 0;
  public tabsInfo: ITabNav[] = [
    {
      index: 0,
      label: 'รายการตรวจสอบเอกสาร',
      prefix: CIVIL_CASE_TAB_ROUTES.PREPARE_LAWSUIT_INFO_TAB,
      path: 'nav-under-sub-tab-document-preparation-info-tab',
      fullPath: PREPARE_LAWSUIT_INFO_TAB_ROUTES.DOCUMENT_PREPARATION_INFO_TAB,
    },
    {
      index: 1,
      label: 'การบอกกล่าวทวงถาม',
      prefix: CIVIL_CASE_TAB_ROUTES.PREPARE_LAWSUIT_INFO_TAB,
      path: 'nav-under-sub-tab-notice-info-tab',
      fullPath: PREPARE_LAWSUIT_INFO_TAB_ROUTES.NOTICE_INFO_TAB,
    },
  ];
  @Input() activetabNavBar: boolean = true;

  private isFetchLgId = false;

  constructor(
    private documentService: DocumentService,
    private documentAccountService: DocumentAccountService,
    private lawsuitService: LawsuitService,
    private taskService: TaskService,
    private prepareLawsuitService: PrepareLawsuitService,
    private routerService: RouterService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isFetchLgId = this.documentService.customer !== this.lawsuitService?.currentLitigation;
    if (!!this.documentService.customer || this.isFetchLgId) {
      this.initData();
    }
    this.router.queryParams.subscribe(value => {
      // ต้องไม่ route มาจาก และ ไป /main/task/detial
      if (
        !this.routerService.nextUrl.includes(TASK_ROUTES.DETAIL) &&
        !this.routerService.previousUrl.includes(TASK_ROUTES.DETAIL)
      ) {
        this.onRouterLink(this.tabsInfo[!!value['_underSubIndex'] ? Number(value['_underSubIndex']) : 0]);
      }
    });
  }

  onRouterLink(item: ITabNav) {
    this._tabIndex = item.index;
    this.prepareLawsuitService.currentTab = this._tabIndex;
    this.routerService.navigateTo(item.fullPath);
  }

  initData() {
    let _taskCode = (this.taskService.taskDetail?.taskCode as taskCode) || '';
    let isRequiredActive =
      _taskCode === taskCode.SUBMIT_ORIGINAL_DOCUMENT || _taskCode === taskCode.RECEIPT_ORIGINAL_DOCUMENT;
    if (this.isFetchLgId) {
      this.documentService.customer = this.lawsuitService?.currentLitigation;
    }
    if (
      !this.documentService.currentDocPerson ||
      this.documentService.currentDocPerson.length == 0 ||
      this.isFetchLgId
    ) {
      this.documentService.currentDocPerson = this.documentService.getDocumentPerson(isRequiredActive);
    }
    if (!this.documentService.currentDocCol || this.documentService.currentDocCol.length == 0 || this.isFetchLgId) {
      this.documentService.currentDocCol = this.documentService.getDocumentCollateral(isRequiredActive);
    }
    if (
      !this.documentAccountService.currentDocAccount ||
      this.documentAccountService.currentDocAccount.length === 0 ||
      this.isFetchLgId
    ) {
      this.documentAccountService.customer = this.documentService.customer;
      this.documentAccountService.filterRelevantAccountDocuments();
      this.documentAccountService.filterActiveAccountDocuments();
    }
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.tabIndex = event.index;
  }
}
