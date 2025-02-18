import { InjectionToken } from '@angular/core';

export interface IdleOptions {
  idle: number;
  timeout: number;
  keepAlive: number;
  language: string;
  showAsMinutes?: boolean;
}

export const IDLE_OPTIONS = new InjectionToken<IdleOptions>('idleOptions');

export const IdleOptions = {
  applyDefault(opt: IdleOptions) {
    const defaultOptions = {
      idle: 12 * 60,
      timeout: 3 * 60,
      keepAlive: 60,
      langauge: 'TH',
      showAsMinutes: true,
    };
    return Object.assign(defaultOptions, opt);
  },
};
