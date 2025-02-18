import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { environment } from '@environments/environment';
import { RouterService } from '@shared/services/router.service';
import { SessionService } from '@shared/services/session.service';
import { Configuration } from '@spig/core';
import { Observable } from 'rxjs';

const routesForBUOwner = ['/main/config', '/main/user'];

const routesForUserAdmin = ['/main/user'];

@Injectable({
  providedIn: 'root',
})
export class MainGuard {
  constructor(
    private configuration: Configuration,
    private routerService: RouterService,
    private sessionService: SessionService
  ) {}

  canActivateChild(): boolean | UrlTree {
    this.prepareAccessTokenIfExempt();
    if (environment.exemptAccessTokenVerify || !!this.configuration.credentials['accessToken']) {
      return true;
    } else {
      return this.routerService.parseUrl('/login');
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.prepareAccessTokenIfExempt();
    if (this.configuration.credentials['accessToken']) {
      if (
        (!routesForBUOwner.includes(state.url) && !routesForUserAdmin.includes(state.url)) ||
        (routesForBUOwner.includes(state.url) && this.sessionService.isBUOwner()) ||
        (routesForUserAdmin.includes(state.url) && this.sessionService.isUserAdmin())
      ) {
        return true;
      }
    }
    return this.routerService.navigateByUrl('/login');
  }

  prepareAccessTokenIfExempt() {
    if (!this.configuration.credentials['accessToken'] && environment.exemptAccessTokenVerify) {
      const savedToken = localStorage.getItem('access-token');
      if (!savedToken) {
        return;
      }
      this.configuration.credentials['accessToken'] = savedToken;
      this.configuration.credentials['token'] = 'Bearer ' + savedToken;

      // TODO: Reload user profile into service
      // xxx = JSON.parse(localStorage.getItem('current-user'));
    }
  }
}
