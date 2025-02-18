import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { CanComponentDeactivate } from '@app/shared/models';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { RouterService } from '@app/shared/services/router.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard {
  constructor(
    private userService: UserService,
    private routerService: RouterService
  ) {}

  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.userService.clearData();
    if (!!this.routerService.eventPopstate) {
      return true;
    } else {
      return component.canDeactivate ? component.canDeactivate() : true;
    }
  }
}
