import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PREFERENCE_CASE_TABS_INFO, TASK_ROUTES } from '@app/shared/constant';
import { ITabNav } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { RouterService } from '@app/shared/services/router.service';
import { SubSink } from 'subsink';
import { PreferenceCaseInfoService } from './preference-case-info.service';
import { AuctionService } from '@app/modules/auction/auction.service';

@Component({
  selector: 'app-preference-case-info',
  templateUrl: './preference-case-info.component.html',
  styleUrl: './preference-case-info.component.scss'
})
export class PreferenceCaseInfoComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  public tabsInfo: ITabNav[] = PREFERENCE_CASE_TABS_INFO;
  public tabIndex = 0;

  constructor(
    private preferenceCaseInfoService: PreferenceCaseInfoService,
    private routerService: RouterService,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private auctionService: AuctionService
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.route.queryParams.subscribe(value => {
        this.logger.info('PreferenceCaseInfoComponent :: Subscribe ActivatedRoute :: ', value);
        // ต้องไม่ route มาจาก และ ไป /main/task/detial
        if (
          !this.routerService.nextUrl.includes(TASK_ROUTES.DETAIL) &&
          !this.routerService.previousUrl.includes(TASK_ROUTES.DETAIL)
        ) {
          if (!!value['_subIndex']) {
            const _subIndex = !!value['_subIndex'] ? Number(value['_subIndex']) : 0;
            this.onRouterLink(this.tabsInfo[_subIndex], { ...value });
          } else {
            const indexFromFullPath = this.tabsInfo.find(i => i.fullPath === this.routerService.nextUrl)?.index;
            const indexFromService = this.preferenceCaseInfoService.currentTab;
            const _subIndex = indexFromFullPath || indexFromService || 0;
            this.onRouterLink(this.tabsInfo[_subIndex]);
          }
        }
      })
    );

    // Set auctionCaseTypeCode to 0002
    this.auctionService.auctionCaseTypeCode = '0002';
  }

  onRouterLink(item: ITabNav, params?: any) {
    this.tabIndex = item.index;
    this.preferenceCaseInfoService.currentTab = this.tabIndex;
    this.routerService.navigateTo(item.fullPath, params);
  }

  ngOnDestroy(): void {
    this.preferenceCaseInfoService.currentTab = 0;
    this.subs.unsubscribe();

    // Clear auctionCaseTypeCode
    this.auctionService.auctionCaseTypeCode = '';
  }
}
