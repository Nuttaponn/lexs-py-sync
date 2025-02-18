import { InjectionToken } from '@angular/core';
import { DialogOptions } from '../dialogs/dialog.model';

export interface LoginScreenOptions {
  allowConcurrent?: boolean;
  appLogo?: boolean;
  appTitle?: boolean;
  welcomeHeader?: boolean;
  copyright?: boolean;
  labelUserId?: boolean;
  labelPassword?: boolean;
  toggleShowPassword?: boolean;
  remarkText?: boolean;
  contactInfo?: boolean;
  showCampaign?: boolean;
  alwaysEnableButton?: boolean;
  errorAsTooltip?: boolean;
  forceLogoutAlertCountdown?: number;
  showAlertAfterForcedLogout?: boolean;
  forceLoginCustomDialog?: DialogOptions;
}

export const LOGIN_SCREEN_OPTIONS = new InjectionToken<LoginScreenOptions>('loginScreenOption');

export const LoginScreenOptions = {
  applyDefault(opt: LoginScreenOptions) {
    const defaultOptions: LoginScreenOptions = {
      allowConcurrent: false,
      appLogo: true,
      appTitle: true,
      welcomeHeader: true,
      copyright: true,
      labelUserId: true,
      labelPassword: true,
      toggleShowPassword: true,
      remarkText: false,
      contactInfo: false,
      showCampaign: true,
      errorAsTooltip: false,
      forceLogoutAlertCountdown: 20,
      showAlertAfterForcedLogout: false,
    };
    return Object.assign(defaultOptions, opt);
  },
};
