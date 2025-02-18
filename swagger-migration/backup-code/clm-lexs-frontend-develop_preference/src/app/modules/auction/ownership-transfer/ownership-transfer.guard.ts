import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { CanComponentDeactivate } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OwnershipTransferGuard {
  constructor(private routerService: RouterService) {}
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
