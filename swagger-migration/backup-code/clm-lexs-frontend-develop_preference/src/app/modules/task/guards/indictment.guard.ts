import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { CanComponentDeactivate } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import { RouterService } from '@app/shared/services/router.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndictmentGuard {
  constructor(
    private logger: LoggerService,
    private routerService: RouterService
  ) {}

  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.logger.info('IndictmentGuard :: canDeactivate prepare for clear data');
    if (!!this.routerService.eventPopstate) {
      return true;
    } else {
      return component.canDeactivate ? component.canDeactivate() : true;
    }
  }
}
