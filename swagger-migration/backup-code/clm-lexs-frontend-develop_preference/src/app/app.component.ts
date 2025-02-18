import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Inject, Optional } from '@angular/core';
import { environment } from '@environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Configuration, TOKEN_OPTIONS, TokenOptions } from '@spig/core';
import { lastValueFrom } from 'rxjs';
import { LoggerService } from './shared/services/logger.service';
import { Utils } from './shared/utils/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'lexs';

  private tokenOptions: TokenOptions;

  // For handle Refresh or Back button of browser which try to unload current HTML page
  @HostListener('window:beforeunload', ['$event']) goToPage(e: any) {
    // Verify if there's Access token (already logged-in) then return false to force browser open confirmation dialog. If not then can return true to allow unload
    console.log('BEfore unload: ', this.configuration.lookupCredential('token'));

    return this.configuration.lookupCredential('token') ? false : true;
  }

  // Clear session data if close browser or reload browser
  @HostListener('window:unload', ['$event']) unloadHandler(event: Event) {
    // try to log out
    this.logoutBeforeUnload();
  }

  @HostListener('window:pagehide', ['$event'])
  onPageHide(e: any) {
    const condition = ['reload', 'navigate'];
    if (condition.some(el => this.navigationType.includes(el))) {
      this.logoutBeforeUnload();
    }
  }

  // Prevent right-click action
  @HostListener('contextmenu', ['$event'])
  onRightClick(e: any) {
    e.preventDefault();
  }

  private logoutBeforeUnload() {
    if (this.configuration.lookupCredential('token')) {
      const accessToken = this.configuration.lookupCredential('accessToken');

      const body = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'X-Request-Id': Utils.uuidv4(),
          'x-original-source-system': 'LEXS',
        },
        body: JSON.stringify({
          accessToken: accessToken,
          uuid: !!!this.tokenOptions.notRequreUUIDWhenLogin ? Utils.uuidv4() : undefined,
        }),
        keepalive: true,
      };
      fetch(this.configuration.basePath + this.tokenOptions.revokeToken, body);
      this.configuration.credentials = {};
    }
  }

  private get navigationType() {
    return window.performance.getEntriesByType('navigation').map(nav => nav['entryType']);
  }

  constructor(
    private configuration: Configuration,
    private translateService: TranslateService,
    private httpClient: HttpClient,
    private logger: LoggerService,
    @Optional() @Inject(TOKEN_OPTIONS) tokenOptions: TokenOptions
  ) {
    this.tokenOptions = TokenOptions.applyDefault(tokenOptions);

    /* Move step to set up default language from  TranslateModule.forRoot() in app.module into this very first component loaded
     *  to soleve issue of circular dependencies injection in HTTP interceptor (due to Interceptor inject SessionService which also inject TranslarteService)
     *  (https://stackoverflow.com/questions/67152273/angular-circular-dependency-when-inject-translateservice-to-interceptor)
     *   the initialization of the TranslateModule you depend on the HttpClient which mean the HttpClientModule needs to be initialized first.
     *   This causes the initialization of your HttpErrorInterceptor because interceptors are initialized with the HttpClientModule initialization.
     *   This causes a cyclic dependency since your interceptor needs the TranslateService
     */
    this.translateService.setDefaultLang('th');

    /** Application Version */
    this.appVersion();
  }

  ctrlShiftKey(e: KeyboardEvent, keyCode: string) {
    return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
  }

  @HostListener('document:keydown', ['$event']) handleKeyboardEvent(e: KeyboardEvent) {
    if (!environment.inspect) {
      return e.keyCode === 123 ||
        this.ctrlShiftKey(e, 'I') ||
        this.ctrlShiftKey(e, 'J') ||
        this.ctrlShiftKey(e, 'C') ||
        (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0))
        ? e.preventDefault()
        : true;
    }
    return true;
  }

  async appVersion() {
    const v: any = await lastValueFrom(this.httpClient.get(`/assets/version.json?t=${Date.now()}`));
    const version = (v && v['version']) || '';
    this.logger.isAppRunningInDebug();
    this.logger.info(`APPLICATION VERSION :::: ${version} ::::`);
  }
}
