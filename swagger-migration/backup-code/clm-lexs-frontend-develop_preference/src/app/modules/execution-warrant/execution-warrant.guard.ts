import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { LoggerService } from '@app/shared/services/logger.service';
import { RouterService } from '@app/shared/services/router.service';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from '@app/shared/models';

@Injectable({
  providedIn: 'root',
})
export class ExecutionWarrantGuard {
  constructor(
    private logger: LoggerService,
    private routerService: RouterService
  ) {}

  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.logger.info('ExecutionWarrantGuard :: canDeactivate prepare for clear data');
    if (!!this.routerService.eventPopstate) {
      return true;
    } else {
      return component.canDeactivate ? component.canDeactivate() : true;
    }
  }
}
