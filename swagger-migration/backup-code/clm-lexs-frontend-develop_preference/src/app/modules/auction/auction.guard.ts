import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { RouterService } from '@app/shared/services/router.service';
import { Observable } from 'rxjs';
import { AuctionService } from './auction.service';
import { CanComponentDeactivate } from '@app/shared/models';

@Injectable({
  providedIn: 'root',
})
export class AuctionGuard {
  constructor(
    private auctionService: AuctionService,
    private routerService: RouterService
  ) {}
  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.routerService.nextUrl.indexOf('/auction') === -1) {
      this.auctionService.clearData();
    }
    if (!!this.routerService.eventPopstate) {
      return true;
    } else {
      return component.canDeactivate ? component.canDeactivate() : true;
    }
  }
}
