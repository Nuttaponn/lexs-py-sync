// Require for use SPIG lib
import { HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
// For set default behavior of Form field
import { MAT_RIPPLE_GLOBAL_OPTIONS, RippleGlobalOptions } from '@angular/material/core';
// App-specific modules
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from '@angular/material/form-field';
import { MatIconRegistry } from '@angular/material/icon';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Configuration as ClientConfig, LEXSAppClientApiModule } from '@lexs/lexs-client';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  BuddhistEraPipe,
  Configuration,
  EXCEPTION_CONFIG,
  IDLE_OPTIONS,
  LOGIN_SCREEN_OPTIONS,
  STOMP_OPTIONS,
  SpigCoreModule,
  SpigIconModule,
  SpigShareModule,
  TOKEN_OPTIONS,
} from '@spig/core';
import { Observable, forkJoin, map, of } from 'rxjs';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { httpInterceptorProviders } from './interceptors';
import { LoginModule as LEXSLogInModule } from './modules/login/login.module';
import { ERROR_CODE } from './shared/constant';
import { Utils } from './shared/utils/util';

// Register Locale Data
import { registerLocaleData } from '@angular/common';
import localeTh from '@angular/common/locales/th';
// TH - Register Locale Data
registerLocaleData(localeTh);

export function config() {
  console.warn(
    `%c%s`,
    `color: black; background-color: #fcf6bd; padding: 4px;font-weight: 100;font-family: Courier;font-size: 12px;`,
    'Initial app with API basepath as: ',
    environment.apiUrl
  );
  return new ClientConfig({ basePath: environment.apiUrl });
}

export function addSvgIconSet(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
  return () => {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/symbol-defs.svg'));
  };
}

class CustomLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    // TODO: LEXS don't have 2 language requirement. until requirement coming. (now support only Thai language)
    const _lang = 'th';
    if (lang !== 'en' && lang !== 'th') {
      return of({});
    }
    // Load translation files from SPIG core merge with app-specific file
    return forkJoin([
      this.http.get('/assets/i18n/spig_' + _lang + '.json'),
      this.http.get('/assets/i18n/' + _lang + '.json'),
      this.http.get('/assets/i18n/main/' + _lang + '.json'),
      this.http.get('/assets/i18n/configuration/' + _lang + '.json'),
      this.http.get('/assets/i18n/report/' + _lang + '.json'),
      this.http.get('/assets/i18n/dopa/' + _lang + '.json'),
      this.http.get('/assets/i18n/user/' + _lang + '.json'),
      this.http.get('/assets/i18n/customer/' + _lang + '.json'),
      this.http.get('/assets/i18n/lawsuit/' + _lang + '.json'),
      this.http.get('/assets/i18n/task/' + _lang + '.json'),
      this.http.get('/assets/i18n/court/' + _lang + '.json'),
      this.http.get('/assets/i18n/finance/' + _lang + '.json'),
      this.http.get('/assets/i18n/execution-warrant/' + _lang + '.json'),
      this.http.get('/assets/i18n/seizure-property/' + _lang + '.json'),
      this.http.get('/assets/i18n/withdrawn-seizure-property/' + _lang + '.json'),
      this.http.get('/assets/i18n/dashboard/' + _lang + '.json'),
      this.http.get('/assets/i18n/property/' + _lang + '.json'),
      this.http.get('/assets/i18n/auction/' + _lang + '.json'),
      this.http.get('/assets/i18n/external-documents/' + _lang + '.json'),
      this.http.get('/assets/i18n/investigate-property/' + _lang + '.json'),
    ]).pipe(
      map(data => {
        let res = {};
        data.forEach(obj => {
          res = Utils.deepMerge(res, obj);
        });
        return res;
      })
    );
  }
}

export function tokenConfig() {
  // Set 'enableWebSocket' = false only for local test purpose only
  return {
    enableWebSocket: !!!environment.isLocalMock ? true : false,
    notRequreUUIDWhenLogin: true,
    sendFlagWhenrevokeByTimeout: true,
    generateToken: '/v1/authentication/generate-token',
    refreshToken: '/v1/authentication/refresh-token',
    revokeToken: '/v1/authentication/revoke-token',
  };
}

export function stompConfig() {
  return {
    webSocketUrl: '/v1/ws/websocket',
    topicUrl: '/v1/ws/topic/',
  };
}

// For Global configurations of Material
const appearance: MatFormFieldDefaultOptions = {
  appearance: 'fill',
};

const globalRippleConfig: RippleGlobalOptions = {
  disabled: true,
  animation: {
    enterDuration: 0,
    exitDuration: 0,
  },
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SpigShareModule,
    SpigIconModule.forRoot(),
    SpigCoreModule.forRoot(),
    // NOTE: Normally we'd stick TranslateModule in `CoreModule` but the ability to lazy load
    // module translations and extend the main one only works if you set it up in the root `AppModule`.
    // Use the TranslateModule's config param "isolate: false" to allow child, lazy loaded modules to
    // extend the parent or root module's loaded translations.
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomLoader,
        deps: [HttpClient],
      },
      // isolate: true, // TODO: prepare for translate lazy loading
      extend: true,
    }),
    LEXSAppClientApiModule.forRoot(config),
    LEXSLogInModule,
    AppRoutingModule,
  ],
  providers: [
    httpInterceptorProviders,
    BuddhistEraPipe,
    { provide: Configuration, useFactory: config, multi: false },
    { provide: ClientConfig, useExisting: Configuration },
    { provide: STOMP_OPTIONS, useFactory: stompConfig },
    { provide: TOKEN_OPTIONS, useFactory: tokenConfig },
    {
      provide: IDLE_OPTIONS,
      useValue: {
        idle: 20 * 60,
        timeout: 30,
        keepAlive: 60,
        language: 'TH',
        showAsMinutes: false,
      },
    },
    {
      provide: APP_INITIALIZER,
      useFactory: addSvgIconSet,
      deps: [MatIconRegistry, DomSanitizer],
      multi: true,
    },
    {
      provide: LOGIN_SCREEN_OPTIONS,
      useValue: {
        appTitle: false,
        welcomeHeader: false,
        showCampaign: true,
        remarkText: true,
        contactInfo: true,
        copyright: false,
        errorAsTooltip: true,
        alwaysEnableButton: true,
        forceLogoutAlertCountdown: 0,
        showAlertAfterForcedLogout: true,
        forceLoginCustomDialog: {
          iconName: 'icon-Error',
          iconClass: 'large fill-red',
          contentCssClasses: ['force-login-content'],
        },
      },
    },
    // { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: appearance },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { subscriptSizing: 'dynamic' } },
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig },
    {
      provide: EXCEPTION_CONFIG,
      useValue: [
        { code: ERROR_CODE.NO_INTERNET, translate: ERROR_CODE.NO_INTERNET },
        { code: ERROR_CODE.IDLE_TIMEOUT, translate: ERROR_CODE.IDLE_TIMEOUT },
        { code: ERROR_CODE.FORCED_LOGOUT, translate: ERROR_CODE.FORCED_LOGOUT },
        { code: ERROR_CODE.NOT_AUTHORIZED, translate: ERROR_CODE.NOT_AUTHORIZED },
        { code: ERROR_CODE.AD_UNAVAILABLE, translate: ERROR_CODE.AD_UNAVAILABLE },
        { code: ERROR_CODE.NEW_VERSION, translate: ERROR_CODE.NEW_VERSION },
        { code: ERROR_CODE.TA0081, translate: ERROR_CODE.TA0081 },
        { code: ERROR_CODE.D025, translate: ERROR_CODE.D025 },
        { code: ERROR_CODE.D026, translate: ERROR_CODE.D026 },
        { code: ERROR_CODE.D020, translate: ERROR_CODE.D020 },
        { code: ERROR_CODE.I005, translate: ERROR_CODE.I005 },
        { code: ERROR_CODE.I002, translate: ERROR_CODE.I002 },
        { code: ERROR_CODE.D021, translate: ERROR_CODE.D021 },
        { code: ERROR_CODE.B001, translate: ERROR_CODE.B001 },
        { code: ERROR_CODE.B006, translate: ERROR_CODE.B006 },
        { code: ERROR_CODE.B009, translate: ERROR_CODE.B009 },
        { code: ERROR_CODE.F012, translate: ERROR_CODE.F012 },
        { code: ERROR_CODE.F013, translate: ERROR_CODE.F013 },
        { code: ERROR_CODE.F001, translate: ERROR_CODE.F001 },
        { code: ERROR_CODE.F014, translate: ERROR_CODE.F014 },
        { code: ERROR_CODE.F015, translate: ERROR_CODE.F015 },
        { code: ERROR_CODE.L007, translate: ERROR_CODE.L007 },
        { code: ERROR_CODE.L006, translate: ERROR_CODE.L006 },
        { code: ERROR_CODE.L013, translate: ERROR_CODE.L013 },
        { code: ERROR_CODE.L014, translate: ERROR_CODE.L014 },
        { code: ERROR_CODE.L015, translate: ERROR_CODE.L015 },
        { code: ERROR_CODE.L016, translate: ERROR_CODE.L016 },
        { code: ERROR_CODE.L017, translate: ERROR_CODE.L017 },
        { code: ERROR_CODE.L018, translate: ERROR_CODE.L018 },
        { code: ERROR_CODE.L019, translate: ERROR_CODE.L019 },
        { code: ERROR_CODE.L021, translate: ERROR_CODE.L021 },
        { code: ERROR_CODE.L023, translate: ERROR_CODE.L023 },
        { code: ERROR_CODE.L024, translate: ERROR_CODE.L024 },
        { code: ERROR_CODE.EWS001, translate: ERROR_CODE.EWS001 },
        { code: ERROR_CODE.EWS002, translate: ERROR_CODE.EWS002 },
        { code: ERROR_CODE.EWS003, translate: ERROR_CODE.EWS003 },
        { code: ERROR_CODE.SEI02, translate: ERROR_CODE.SEI02 },
        { code: ERROR_CODE.SEI05, translate: ERROR_CODE.SEI05 },
        { code: ERROR_CODE.S015, translate: ERROR_CODE.S015 },
        { code: ERROR_CODE.L025, translate: ERROR_CODE.L025 },
        { code: ERROR_CODE.L026, translate: ERROR_CODE.L026 },
        { code: ERROR_CODE.L027, translate: ERROR_CODE.L027 },
        { code: ERROR_CODE.D028, translate: ERROR_CODE.D028 },
        { code: ERROR_CODE.WWRIT001, translate: ERROR_CODE.WWRIT001 },
        { code: ERROR_CODE.WWRIT002, translate: ERROR_CODE.WWRIT002 },
        { code: ERROR_CODE.WWRIT003, translate: ERROR_CODE.WWRIT003 },
        { code: ERROR_CODE.WWRIT004, translate: ERROR_CODE.WWRIT004 },
        { code: ERROR_CODE.WWRIT005, translate: ERROR_CODE.WWRIT005 },
        { code: ERROR_CODE.WWRIT006, translate: ERROR_CODE.WWRIT006 },
        { code: ERROR_CODE.WWRIT009, translate: ERROR_CODE.WWRIT009 },
        { code: ERROR_CODE.WWRIT010, translate: ERROR_CODE.WWRIT010 },
        { code: ERROR_CODE.WWRIT011, translate: ERROR_CODE.WWRIT011 },
        { code: ERROR_CODE.WWRIT012, translate: ERROR_CODE.WWRIT012 },
        { code: ERROR_CODE.WWRIT013, translate: ERROR_CODE.WWRIT013 },
        { code: ERROR_CODE.WWRIT014, translate: ERROR_CODE.WWRIT014 },
        { code: ERROR_CODE.L028, translate: ERROR_CODE.L028 },
        { code: ERROR_CODE.L029, translate: ERROR_CODE.L029 },
        { code: ERROR_CODE.L030, translate: ERROR_CODE.L030 },
        { code: ERROR_CODE.L031, translate: ERROR_CODE.L031 },
        { code: ERROR_CODE.L032, translate: ERROR_CODE.L032 },
        { code: ERROR_CODE.L033, translate: ERROR_CODE.L033 },
        { code: ERROR_CODE.L034, translate: ERROR_CODE.L034 },
        { code: ERROR_CODE.L035, translate: ERROR_CODE.L035 },
        { code: ERROR_CODE.L036, translate: ERROR_CODE.L036 },
        { code: ERROR_CODE.EWS006, translate: ERROR_CODE.EWS006 },
        { code: ERROR_CODE.EWS007, translate: ERROR_CODE.EWS007 },
        { code: ERROR_CODE.EWS008, translate: ERROR_CODE.EWS008 },
        { code: ERROR_CODE.EWS009, translate: ERROR_CODE.EWS009 },
        { code: ERROR_CODE.EWS011, translate: ERROR_CODE.EWS011 },
        { code: ERROR_CODE.LD01, translate: ERROR_CODE.LD01 },
        { code: ERROR_CODE.LD03, translate: ERROR_CODE.LD03 },
        { code: ERROR_CODE.WRIT18, translate: ERROR_CODE.WRIT18 },
        { code: ERROR_CODE.N001, translate: ERROR_CODE.N001 },
        { code: ERROR_CODE.T001, translate: ERROR_CODE.T001 },
        { code: ERROR_CODE.A007, translate: ERROR_CODE.A007 },
        { code: ERROR_CODE.A008, translate: ERROR_CODE.A008 },
        { code: ERROR_CODE.DF002, translate: ERROR_CODE.DF002 },
        { code: ERROR_CODE.AT031, translate: ERROR_CODE.AT031 },
        { code: ERROR_CODE.AT032, translate: ERROR_CODE.AT032 },
        { code: ERROR_CODE.AT042, translate: ERROR_CODE.AT042 },
        { code: ERROR_CODE.AT043, translate: ERROR_CODE.AT043 },
        { code: ERROR_CODE.AT054, translate: ERROR_CODE.AT054 },
        { code: ERROR_CODE.MAS001, translate: ERROR_CODE.MAS001 },
        { code: ERROR_CODE.SEI06, translate: ERROR_CODE.SEI06 },
        { code: ERROR_CODE.SEI03, translate: ERROR_CODE.SEI03 },
        { code: ERROR_CODE.EAI004, translate: ERROR_CODE.EAI004 },
        { code: ERROR_CODE.EAI005, translate: ERROR_CODE.EAI005 },
        { code: ERROR_CODE.EAI007, translate: ERROR_CODE.EAI007 },
        { code: ERROR_CODE.AUC038, translate: ERROR_CODE.AUC038 },
        { code: ERROR_CODE.AUC055, translate: ERROR_CODE.AUC055 },
        { code: ERROR_CODE.AUC060, translate: ERROR_CODE.AUC060 },
      ],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
