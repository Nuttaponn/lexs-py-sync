import { OverlayModule } from '@angular/cdk/overlay';
import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { stompConfig } from '@app/app.module';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { AuditLogModule } from '@app/shared/components/common-tabs/audit-log/audit-log.module';
import { DebtRelatedInfoTabModule } from '@app/shared/components/debt-related-info-tab/debt-related-info-tab.module';
import { SessionService } from '@app/shared/services/session.service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { TranslateModule } from '@ngx-translate/core';
import {
  Configuration,
  DatepickerModule,
  DropdownModule,
  EXCEPTION_CONFIG,
  ErrorMsgModule,
  LOGIN_SCREEN_OPTIONS,
  PaginatorModule,
  STOMP_OPTIONS,
  SearchComboBoxModule,
  SpigIconModule,
} from '@spig/core';

export const UnittestImports = [
  MatTooltipModule,
  OverlayModule,
  MatToolbarModule,
  MatSidenavModule,
  PaginatorModule,
  MatDividerModule,
  MatButtonModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatCardModule,
  MatTabsModule,
  MatTableModule,
  SpigIconModule.forRoot(),
  MatIconModule,
  BrowserAnimationsModule,
  NoopAnimationsModule,
  BrowserModule,
  FormsModule,
  ReactiveFormsModule,
  TranslateModule.forRoot(),
  MatSnackBarModule,
  MatDialogModule,
  ErrorMsgModule,
  DropdownModule,
  DatepickerModule,
  MatRadioModule,
  MatFormFieldModule,
  MatInputModule,
  ErrorMsgModule.forRoot(),
  RouterModule.forRoot([]),
  NgIdleKeepaliveModule.forRoot(),
  SearchComboBoxModule,
  AuditLogModule,
  DebtRelatedInfoTabModule,
];

export const UnittestProviders = [
  Configuration,
  { provide: STOMP_OPTIONS, useFactory: stompConfig },
  LawsuitService,
  {
    provide: EXCEPTION_CONFIG,
    useValue: [
      { code: 'NOT_AUTHORIZED', message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง หรือไม่มีชื่อผู้ใช้นี้' },
      { code: 'AD_UNAVAILABLE', message: 'ไม่สามารถเข้าสู่ระบบได้ในขณะนี้ โปรดลองใหม่อีกครั้งในภายหลัง' },
      { code: 'USER_LOCKED', message: 'กรอกผิดเกินจำนวนที่กำหนด กรุณาปลดล็อค' },
      { code: 'USER_INVALID_BRANCH', message: 'คุณไม่มีสิทธิเข้าใช้งาน ไม่สามารถเข้าสู่ระบบได้' },
      { code: 'USER_INSUFFICIENT_ROLE', message: 'คุณไม่มีสิทธิเข้าใช้งาน ไม่สามารถเข้าสู่ระบบได้' },
      { code: 'USER_ON_LEAVE', message: 'คุณไม่มีสิทธิเข้าใช้งาน ไม่สามารถเข้าสู่ระบบได้' },
    ],
    multi: true,
  },
  { provide: APP_BASE_HREF, useValue: '/' },
  SessionService,
  {
    provide: LOGIN_SCREEN_OPTIONS,
    useValue: {
      appTitle: false,
      welcomeHeader: false,
      showCampaign: false,
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
  provideHttpClient(withInterceptorsFromDi()),
  // RouterService
];
