import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RouterService } from '@shared/services/router.service';
import { InvestigatePropertyService } from '@modules/investigate-property/investigate-property.service';
import { CanComponentDeactivate } from '@app/shared/models/guard.model';

@Injectable({
  providedIn: 'root',
})
export class InvestigatePropertyGuard {
  constructor(
    private investigatePropertyService: InvestigatePropertyService,
    private routerService: RouterService
  ) {}
  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.routerService.nextUrl.indexOf('/auction/') === -1) {
      this.investigatePropertyService.clearData();
    }
    if (!!this.routerService.eventPopstate) {
      return true;
    } else {
      return component.canDeactivate ? component.canDeactivate() : true;
    }
  }
}
