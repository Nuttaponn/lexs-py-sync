// import { CanDeactivateFn } from '@angular/router';

// export const preferenceGuard: CanDeactivateFn = (component, currentRoute, currentState, nextState) => {
//   return true;
// };

import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { RouterService } from '@app/shared/services/router.service';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from '@app/shared/models';
import { PreferenceService } from './preference.service';
import { LoggerService } from '@app/shared/services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class PreferenceGuard {
  constructor(
    private preferenceService: PreferenceService,
    private routerService: RouterService,
    private logger: LoggerService,
  ) {}
  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!!this.routerService.eventPopstate) {
      return true;
    } else {
      return component.canDeactivate ? component.canDeactivate() : true;
    }
  }
}
