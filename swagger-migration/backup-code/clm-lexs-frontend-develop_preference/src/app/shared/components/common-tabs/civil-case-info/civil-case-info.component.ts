import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CIVIL_CASE_TABS_INFO, TASK_ROUTES } from '@app/shared/constant';
import { ITabNav } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { RouterService } from '@app/shared/services/router.service';
import { SubSink } from 'subsink';
import { CivilCaseInfoService } from './civil-case-info.service';

@Component({
  selector: 'app-civil-case-info',
  templateUrl: './civil-case-info.component.html',
  styleUrls: ['./civil-case-info.component.scss'],
})
export class CivilCaseInfoComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  public tabsInfo: ITabNav[] = CIVIL_CASE_TABS_INFO;
  public tabIndex = 0;

  constructor(
    private civilCaseInfoService: CivilCaseInfoService,
    private routerService: RouterService,
    private route: ActivatedRoute,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.route.queryParams.subscribe(value => {
        this.logger.info('CivilCaseInfoComponent :: Subscribe ActivatedRoute :: ', value);
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
            const indexFromService = this.civilCaseInfoService.currentTab;
            const _subIndex = indexFromFullPath || indexFromService || 0;
            this.onRouterLink(this.tabsInfo[_subIndex]);
          }
        }
      })
    );
  }

  onRouterLink(item: ITabNav, params?: any) {
    this.tabIndex = item.index;
    this.civilCaseInfoService.currentTab = this.tabIndex;
    this.routerService.navigateTo(item.fullPath, params);
  }

  ngOnDestroy(): void {
    this.civilCaseInfoService.currentTab = 0;
    this.subs.unsubscribe();
  }
}
