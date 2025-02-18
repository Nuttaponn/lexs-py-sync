import { Component, OnInit } from '@angular/core';
import { EXTERNAL_DOC_TABS_INFO } from '@app/shared/constant';
import { ITabNav } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { RouterService } from '@app/shared/services/router.service';

@Component({
  selector: 'app-external-documents',
  templateUrl: './external-documents.component.html',
  styleUrls: ['./external-documents.component.scss'],
})
export class ExternalDocumentsComponent implements OnInit {
  public tabIndex = 0;
  public tabsInfo: ITabNav[] = EXTERNAL_DOC_TABS_INFO;

  constructor(
    private routerService: RouterService,
    private logger: LoggerService
  ) {}

  ngOnInit() {
    this.logger.info('ngOnInit ExternalDocumentsComponent');
    this.onRouterLink(this.tabsInfo.filter(it => it.index === 2)[0]);
  }

  onRouterLink(item: ITabNav) {
    this.routerService.navigateTo(item.fullPath);
    this.onTabNavChanged(item);
  }

  onTabNavChanged(element: ITabNav) {
    this.tabIndex = element.index;
  }
}
