import { InjectionToken } from '@angular/core';

export interface TokenOptions {
  enableWebSocket?: boolean;
  generateToken: string;
  revokeToken: string;
  exchangeToken: string;
  refreshToken: string;
  generateSSOToken?: string;
  ssoBaseAuthUrl?: string;
  ssoRedirectUrl?: string;
  notRequreUUIDWhenLogin?: boolean;
  sendFlagWhenrevokeByTimeout?: boolean;
}

export const TOKEN_OPTIONS = new InjectionToken<TokenOptions>('TokenOptions');

export const TokenOptions = {
  applyDefault(opt: TokenOptions) {
    const defaultOptions = {
      enableWebSocket: true,
      generateToken: '/authentication/generateToken',
      revokeToken: '/authentication/revokeToken',
      exchangeToken: '/authentication/exchangeToken',
      refreshToken: '/authentication/refreshToken',
    };
    return Object.assign(defaultOptions, opt);
  },
};
