import { HttpClient } from '@angular/common/http';
import { EventEmitter, Inject, Injectable, Optional } from '@angular/core';
import { Configuration } from '../api-client/configuration';
import { DocumentInterruptSource, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom, Subscription, filter, take } from 'rxjs';
import { DialogsService } from '../dialogs/dialogs.service';
import { StompClient } from '../service/stomp-client.service';
import { IdleOptions, IDLE_OPTIONS } from './idle-options';
import { TimeoutWarningComponent } from './timeout-warning/timeout-warning.component';
import { TokenOptions, TOKEN_OPTIONS } from './token-options';

// Interface to be moved into Native Service
export interface DeviceInfo {
  nativeAppVersion: string;
  os: string;
  osVersion: string;
  uuid: string;
  deviceName: string;
}
// End: Interface from Native Service

interface TokenResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  tokenType: string;
  sessionState: string;
  lastSuccessLogin: string;
}

type LogoutType = 'TIMEOUT' | 'LOGOUT' | 'FORCE_LOGOUT';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private deviceInfo!: DeviceInfo;
  private tokenResponse!: TokenResponse;
  private wsSubscription!: Subscription;
  private idleSubscription!: Subscription;
  private pingSubscription!: Subscription;
  private tokenOptions: TokenOptions;

  start = new EventEmitter();
  stop = new EventEmitter<LogoutType>();
  roles: string[] = [];
  private enableWebSocket?: boolean;
  private generateTokenUrl: string;
  private revokeTokenUrl: string;
  private exchangeTokenUrl: string;
  private refreshTokenUrl: string;
  private generateSSOTokenUrl?: string;
  private ssoRedirectUrl?: string;
  private ssoBaseAuthUrl?: string;
  private langauage: string;

  constructor(
    private httpClient: HttpClient,
    private configuration: Configuration,
    private stompClient: StompClient,
    private idle: Idle,
    private keepalive: Keepalive,
    private dialogsService: DialogsService,
    private translate: TranslateService,
    @Optional() @Inject(IDLE_OPTIONS) idleOptions: IdleOptions,
    @Optional() @Inject(TOKEN_OPTIONS) tokenOptions: TokenOptions
  ) {
    // set idle
    idleOptions = IdleOptions.applyDefault(idleOptions);
    idle.setIdle(idleOptions.idle);
    idle.setTimeout(idleOptions.timeout);
    idle.setInterrupts([
      new DocumentInterruptSource('mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll'),
    ]);
    this.langauage = idleOptions.language;
    keepalive.interval(idleOptions.keepAlive);

    this.tokenOptions = TokenOptions.applyDefault(tokenOptions);
    this.generateTokenUrl = this.tokenOptions.generateToken;
    this.refreshTokenUrl = this.tokenOptions.refreshToken;
    this.exchangeTokenUrl = this.tokenOptions.exchangeToken;
    this.revokeTokenUrl = this.tokenOptions.revokeToken;
    if (this.tokenOptions.enableWebSocket) {
      this.enableWebSocket = this.tokenOptions.enableWebSocket;
    }
    if (this.tokenOptions.generateSSOToken) {
      this.generateSSOTokenUrl = this.tokenOptions.generateSSOToken;
    }
    if (this.tokenOptions.ssoRedirectUrl) {
      this.ssoRedirectUrl = this.tokenOptions.ssoRedirectUrl;
    }
    if (this.tokenOptions.ssoBaseAuthUrl) {
      this.ssoBaseAuthUrl = this.tokenOptions.ssoBaseAuthUrl;
    }
  }

  async login(username: string, password: string, mode?: 'authorize' | 'force') {
    this.stopMonitoring();

    if (!this.deviceInfo) {
      this.deviceInfo = await this.getDeviceInfo();
    }
    const body = {
      username,
      password,
      uuid: !!!this.tokenOptions.notRequreUUIDWhenLogin ? this.deviceInfo.uuid : undefined,
      mode,
    };
    this.tokenResponse = await lastValueFrom(
      this.httpClient.post<TokenResponse>(`${this.configuration.basePath + this.generateTokenUrl}`, body)
    );
    this.configuration.credentials['accessToken'] = this.tokenResponse.accessToken;
    this.configuration.credentials['Authorization'] = this.tokenResponse.accessToken;
    this.configuration.credentials['token'] = 'Bearer ' + this.tokenResponse.accessToken;
    this.configuration.credentials['lastSuccessLogin'] = this.tokenResponse.lastSuccessLogin;
    this.parseToken(this.configuration.lookupCredential('accessToken') || '');

    this.startMonitoring();
  }

  async exchangeToken(attributes: any) {
    this.stopMonitoring();

    if (!this.deviceInfo) {
      this.deviceInfo = await this.getDeviceInfo();
    }
    const body = {
      refreshToken: this.tokenResponse.refreshToken,
      attributes,
      uuid: !!!this.tokenOptions.notRequreUUIDWhenLogin ? this.deviceInfo.uuid : undefined,
    };
    this.tokenResponse = await lastValueFrom(
      this.httpClient.post<TokenResponse>(`${this.configuration.basePath + this.exchangeTokenUrl}`, body)
    );
    this.configuration.credentials['accessToken'] = this.tokenResponse.accessToken;
    this.configuration.credentials['Authorization'] = this.tokenResponse.accessToken;
    this.configuration.credentials['token'] = 'Bearer ' + this.tokenResponse.accessToken;
    this.configuration.credentials['lastSuccessLogin'] = this.tokenResponse.lastSuccessLogin;
    this.parseToken(this.configuration.lookupCredential('accessToken') || '');

    this.startMonitoring();
  }

  async ssoToken(token: string) {
    this.stopMonitoring();
    try {
      if (!this.deviceInfo) {
        this.deviceInfo = await this.getDeviceInfo();
      }
      const body = {
        refreshToken: token,
        uuid: !!!this.tokenOptions.notRequreUUIDWhenLogin ? this.deviceInfo.uuid : undefined,
      };
      this.tokenResponse = await lastValueFrom(
        this.httpClient.post<TokenResponse>(`${this.configuration.basePath + this.refreshTokenUrl}`, body, {
          headers: { 'Ignore-Loading': 'true' },
        })
      );
      this.configuration.credentials['accessToken'] = this.tokenResponse.accessToken;
      this.configuration.credentials['Authorization'] = this.tokenResponse.accessToken;
      this.configuration.credentials['token'] = 'Bearer ' + this.tokenResponse.accessToken;
      this.parseToken(this.configuration.lookupCredential('accessToken') || '');
      this.startMonitoring();
    } catch (e: any) {
      if (e && (e.status === 401 || e.status === 422)) {
        this.stopMonitoring('FORCE_LOGOUT');
      }
      throw e;
    }
  }

  private parseToken(token: string) {
    try {
      const firstDot = token.indexOf('.');
      const lastDot = token.lastIndexOf('.');
      const body = token.substring(firstDot + 1, lastDot);
      const text = atob(body);
      const data = JSON.parse(text);
      this.roles = data.roles || [];
    } catch (e: any) {}
  }

  private startMonitoring() {
    this.idle.watch();
    this.start.next(null);

    this.pingSubscription = this.keepalive.onPing.subscribe(() => this.refresh());

    if (this.enableWebSocket) {
      this.wsSubscription = this.stompClient
        .listen('session/' + this.tokenResponse.sessionState)
        .pipe(
          filter(data => data.type === 'MESSAGE'),
          take(1)
        )
        .subscribe(data => this.stopMonitoring('FORCE_LOGOUT'));
    }

    this.idleSubscription = this.idle.onIdleStart.subscribe(async () => {
      this.idle.clearInterrupts();
      if (this.idle.getTimeout() > 0) {
        const result = await this.dialogsService.show({
          type: 'small',
          iconName: 'icon-Error',
          iconClass: 'icon-red icon-small-xl',
          title: this.translate.instant('TIMEOUT_WARNING.TITLE'),
          rightButtonLabel: this.langauage === 'TH' ? 'อยู่ในระบบต่อไป' : 'Continue',
          buttonIconName: 'icon-Direction-Right',
          optionBtnLabel: this.langauage === 'TH' ? 'ออกจากระบบ' : 'Logout',
          optionBtnIcon: 'icon-Exit',
          optionBtnClass: 'timeout-warning-secondary-button',
          component: TimeoutWarningComponent,
        });
        this.idle.setInterrupts([
          new DocumentInterruptSource(
            'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll'
          ),
        ]);
        if (result === 'TIMEOUT') {
          this.stop.next('TIMEOUT');
        } else if (result === 'LOGOUT') {
          this.logout(result);
        } else {
          this.idle.watch();
        }
      } else {
        console.log('Configured to timeout immediately when idle start');
        // No count down , immediately timeout when idle start
        this.idle.clearInterrupts();
        this.logout('TIMEOUT');
        this.stop.next('TIMEOUT');
      }
    });
  }

  private stopMonitoring(type?: LogoutType) {
    this.roles = [];
    this.idle.stop();

    // timeout event will invoke after dialog was closed
    if (type && type !== 'TIMEOUT') {
      this.stop.next(type);
    }
    if (this.pingSubscription) {
      this.pingSubscription.unsubscribe();
    }
    if (this.enableWebSocket && this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    if (this.idleSubscription) {
      this.idleSubscription.unsubscribe();
    }
  }

  async refresh() {
    try {
      const body = {
        refreshToken: this.tokenResponse.refreshToken,
        uuid: !!!this.tokenOptions.notRequreUUIDWhenLogin ? this.deviceInfo.uuid : undefined,
      };
      this.tokenResponse = await lastValueFrom(
        this.httpClient.post<TokenResponse>(`${this.configuration.basePath + this.refreshTokenUrl}`, body, {
          headers: { 'Ignore-Loading': 'true' },
        })
      );
      this.configuration.credentials['accessToken'] = this.tokenResponse.accessToken;
      this.configuration.credentials['Authorization'] = this.tokenResponse.accessToken;
      this.configuration.credentials['token'] = 'Bearer ' + this.tokenResponse.accessToken;
    } catch (e: any) {
      if (e && (e.status === 401 || e.status === 422 || e.status === 403)) {
        this.stopMonitoring('FORCE_LOGOUT');
      }
      throw e;
    }
  }

  async logout(type: LogoutType = 'LOGOUT'): Promise<TokenResponse> {
    if (!this.deviceInfo) {
      this.deviceInfo = await this.getDeviceInfo();
    }
    const body: any = {
      accessToken: this.configuration.lookupCredential('accessToken'),
      uuid: !!!this.tokenOptions.notRequreUUIDWhenLogin ? this.deviceInfo.uuid : undefined,
    };
    if (type === 'TIMEOUT') {
      if (!!!this.tokenOptions.sendFlagWhenrevokeByTimeout) {
        body.eventType = 'LOGOUT_TIMEOUT';
      } else {
        body.isTerminate = true;
      }
    }

    this.stopMonitoring(type);

    return await lastValueFrom(
      this.httpClient.post<TokenResponse>(`${this.configuration.basePath + this.revokeTokenUrl}`, body)
    );
  }

  async getSSOUrl() {
    if (this.generateSSOTokenUrl) {
      try {
        const body = {
          refreshToken: this.tokenResponse.refreshToken,
          uuid: !!!this.tokenOptions.notRequreUUIDWhenLogin ? this.deviceInfo.uuid : undefined,
        };
        const tokenResponse = await lastValueFrom(
          this.httpClient.post<TokenResponse>(`${this.ssoBaseAuthUrl + this.generateSSOTokenUrl}`, body)
        );

        let finalUrl = this.ssoRedirectUrl || '';
        finalUrl = finalUrl.replace('{accessToken}', tokenResponse.accessToken);
        finalUrl = finalUrl.replace('{refreshToken}', tokenResponse.refreshToken);
        return finalUrl;
      } catch (e: any) {}
    }
    return null;
  }

  private tmpUUID: string | undefined;
  // Helper function to be replaced with Native service Get DeviceID
  getDeviceInfo(): Promise<DeviceInfo> {
    // let uuid = localStorage.getItem('uuid');
    let uuid = this.tmpUUID;
    if (!uuid) {
      uuid = this.uuidv4();
      // localStorage.setItem('uuid', uuid);
      this.tmpUUID = uuid;
    }
    return Promise.resolve({
      nativeAppVersion: '1.0',
      os: 'Mock',
      osVersion: '1.0',
      uuid,
      deviceName: 'Mock',
    });
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      // tslint:disable:no-bitwise
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
      // tslint:enable:no-bitwise
    });
  }
}
