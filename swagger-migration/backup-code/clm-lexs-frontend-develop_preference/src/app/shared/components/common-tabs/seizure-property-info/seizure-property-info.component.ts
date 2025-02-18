import { Component, OnDestroy, OnInit } from '@angular/core';
import { SEIZURE_PROPERTY_TABS_INFO, TASK_ROUTES } from '@app/shared/constant';
import { ITabNav } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { SeizurePropertyInfoService } from './seizure-property-info.service';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-seizure-property-info',
  templateUrl: './seizure-property-info.component.html',
  styleUrls: ['./seizure-property-info.component.scss'],
})
export class SeizurePropertyInfoComponent implements OnInit, OnDestroy {
  public tabsInfo: ITabNav[] = SEIZURE_PROPERTY_TABS_INFO;
  public tabIndex = 0;
  private subs = new SubSink();
  constructor(
    private routerService: RouterService,
    private seizurePropertyInfoService: SeizurePropertyInfoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.tabIndex = this.seizurePropertyInfoService.currentTab;
    this.subs.add(
      this.route.queryParams.subscribe(value => {
        // ต้องไม่ route มาจาก และ ไป /main/task/detial
        if (
          !this.routerService.nextUrl.includes(TASK_ROUTES.DETAIL) &&
          !this.routerService.previousUrl.includes(TASK_ROUTES.DETAIL)
        ) {
          if (!!value['_underSubIndex']) {
            let _underSubIndex = !!value['_underSubIndex'] ? Number(value['_underSubIndex']) : 0;
            this.onRouterLink(this.tabsInfo[_underSubIndex]);
          } else {
            const indexFromFullPath = this.tabsInfo.find(i => i.fullPath === this.routerService.nextUrl)?.index;
            const indexFromService = this.seizurePropertyInfoService.currentTab;
            const _underSubIndex = indexFromFullPath || indexFromService || 0;
            this.onRouterLink(this.tabsInfo[_underSubIndex]);
          }
        }
      })
    );
  }

  onRouterLink(item: ITabNav) {
    this.tabIndex = item.index || 0;
    this.seizurePropertyInfoService.currentTab = this.tabIndex;
    this.routerService.navigateTo(item.fullPath);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
