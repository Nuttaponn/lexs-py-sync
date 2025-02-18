import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Configuration, TokenService } from '@spig/core';
import { Observable } from 'rxjs';
import { ErrorHandlingService } from './shared/services/error-handling.service';
import { LoggerService } from './shared/services/logger.service';
import { NotificationService } from './shared/services/notification.service';
import { RouterService } from './shared/services/router.service';
import { SessionService } from './shared/services/session.service';

export interface CanComponentDeactivate {
  canDeactivate: (state: RouterStateSnapshot) => Observable<boolean> | Promise<boolean> | boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AppGuard {
  constructor(
    private configuration: Configuration,
    private logger: LoggerService,
    private notificationService: NotificationService,
    private errorHandlingService: ErrorHandlingService,
    private tokenService: TokenService,
    private sessionService: SessionService,
    private routerService: RouterService
  ) {}

  canDeactivate(
    component: CanComponentDeactivate,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (
      (nextState.url === '/login' || nextState.url === '/') &&
      this.configuration.lookupCredential('token') &&
      !!!this.sessionService.isLogout
    ) {
      this.logger.info('App deactivate - to go to root');
      return this.notificationService.warningDialog('LOGOUT.TITLE', 'COMMON.APP_UNLOAD').then(res => {
        if (res) {
          this.errorHandlingService
            .invokeNoRetry(() => this.tokenService.logout())
            .then(() => {
              this.sessionService.clearCurrentUser();
              this.sessionService.isLogout = true;
              return true;
            });
          return false;
        } else {
          this.routerService.addHistory();
          return false;
        }
      });
    }
    return true;
  }
}
