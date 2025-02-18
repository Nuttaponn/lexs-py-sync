import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EXECUTION_TABS_INFO } from '@app/shared/constant';
import { ITabNav } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { SubSink } from 'subsink';
import { ExecutionInfoService } from './execution-info.service';

@Component({
  selector: 'app-execution-info',
  templateUrl: './execution-info.component.html',
  styleUrls: ['./execution-info.component.scss'],
})
export class ExecutionInfoComponent implements OnInit {
  private subs = new SubSink();
  public tabsInfo: ITabNav[] = EXECUTION_TABS_INFO;
  public tabIndex = 0;

  constructor(
    private executionInfoService: ExecutionInfoService,
    private routerService: RouterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.route.queryParams.subscribe(value => {
        if (!!value['_underSubIndex']) {
          this.onRouterLink(this.tabsInfo[Number(value['_underSubIndex'])]);
        } else {
          const indexFromFullPath = this.tabsInfo.find(i => i.fullPath === this.routerService.nextUrl)?.index;
          const indexFromService = this.executionInfoService.currentTab;
          const _underSubIndex = indexFromFullPath || indexFromService || 0;
          this.onRouterLink(this.tabsInfo[_underSubIndex]);
        }
      })
    );
  }

  onRouterLink(item: ITabNav) {
    this.tabIndex = item.index;
    this.executionInfoService.currentTab = this.tabIndex;
    this.routerService.navigateTo(item.fullPath);
  }
}
