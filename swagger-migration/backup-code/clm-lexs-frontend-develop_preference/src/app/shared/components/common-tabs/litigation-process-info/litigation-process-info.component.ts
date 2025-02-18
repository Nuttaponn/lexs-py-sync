import { Component, OnDestroy, OnInit } from '@angular/core';
import { LITIGATION_PROCESS_INFO_TABS_INFO, TASK_ROUTES } from '@app/shared/constant';
import { ITabNav } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { LitigationProcessInfoService } from './litigation-process-info.service';
import { SubSink } from 'subsink';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '@app/shared/services/logger.service';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';

@Component({
  selector: 'app-litigation-process-info',
  templateUrl: './litigation-process-info.component.html',
  styleUrls: ['./litigation-process-info.component.scss'],
})
export class LitigationProcessInfoComponent implements OnInit, OnDestroy {
  public tabsInfo: ITabNav[] = LITIGATION_PROCESS_INFO_TABS_INFO;
  public tabIndex = 0;

  private subs = new SubSink();

  constructor(
    private routerService: RouterService,
    private litigationProcessInfoService: LitigationProcessInfoService,
    private lawsuitService: LawsuitService,
    private route: ActivatedRoute,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit LitigationProcessInfoComponent');
    this.subs.add(
      this.route.queryParams.subscribe(value => {
        this.logger.info('LitigationProcessInfoComponent :: Subscribe ActivatedRoute :: ', value);
        // ต้องไม่ route มาจาก และ ไป /main/task/detial
        if (
          !this.routerService.nextUrl.includes(TASK_ROUTES.DETAIL) &&
          !this.routerService.previousUrl.includes(TASK_ROUTES.DETAIL)
        ) {
          if (!!value['_subIndex']) {
            const _subIndex = !!value['_subIndex'] ? Number(value['_subIndex']) : 0;
            this.onRouterLink(this.tabsInfo[_subIndex]);
          } else {
            const indexFromFullPath = this.tabsInfo.find(i => i.fullPath === this.routerService.nextUrl)?.index;
            const indexFromService = this.litigationProcessInfoService.currentTab;
            const _subIndex = indexFromFullPath || indexFromService || 0;
            this.onRouterLink(this.tabsInfo[_subIndex]);
          }
        }
      })
    );
  }

  onRouterLink(item: ITabNav) {
    this.tabIndex = item.index;
    this.litigationProcessInfoService.currentTab = this.tabIndex;
    if (item.path === 'debt-related-info-tab' || item.path === 'nav-sub-tab-debt-related-info-tab') {
      this.routerService.navigateTo(item.fullPath, { loadCustomerDetail: false, loadLitigationDetail: true });
    } else if (item.path === 'account-and-debt-info-tab' || item.path === 'nav-sub-tab-account-and-debt-info-tab') {
      this.routerService.navigateTo(item.fullPath, { isBtnSubAccount: true });
    } else if (item.path === 'collateral-info-tab' || item.path === 'nav-sub-tab-collateral-info-tab') {
      this.routerService.navigateTo(item.fullPath, {
        hasAsset: true,
        litigationId: this.lawsuitService.currentLitigation?.litigationId || '',
      });
    } else {
      this.routerService.navigateTo(item.fullPath);
    }
  }

  ngOnDestroy(): void {
    this.litigationProcessInfoService.currentTab = 0;
    this.subs.unsubscribe();
  }
}
