import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { LoggerService } from '@app/shared/services/logger.service';
import { RouterService } from '@app/shared/services/router.service';
import { Observable } from 'rxjs';
import { TaskService } from '../task/services/task.service';
import { WithdrawnSeizurePropertyService } from './withdrawn-seizure-property.service';
import { CanComponentDeactivate } from '@app/shared/models';

@Injectable({
  providedIn: 'root',
})
export class WithdrawnSeizurePropertyGuard {
  constructor(
    private logger: LoggerService,
    private routerService: RouterService,
    private withdrawnSeizurePropertyService: WithdrawnSeizurePropertyService,
    private taskService: TaskService
  ) {}

  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.logger.info(
      'WithdrawnSeizurePropertyGuard :: canDeactivate prepare for clear data ',
      this.routerService.nextUrl
    );
    if (this.routerService.nextUrl.indexOf('/create-property-group') === -1) {
      this.withdrawnSeizurePropertyService.clearData();
      this.taskService.taskDetail = {};
    }
    if (!!this.routerService.eventPopstate) {
      return true;
    } else {
      return component.canDeactivate ? component.canDeactivate() : true;
    }
  }
}
