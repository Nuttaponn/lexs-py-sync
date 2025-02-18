import { InjectionToken } from '@angular/core';

export interface StompOptions {
  webSocketUrl: string;
  topicUrl: string;
}

export const STOMP_OPTIONS = new InjectionToken<StompOptions>('StompOptions');

export const StompOptions = {
  applyDefault(opt: StompOptions) {
    const defaultOptions = {
      webSocketUrl: '/v1/ws/websocket',
      topicUrl: '/v1/ws/topic',
    };
    return Object.assign(defaultOptions, opt);
  },
};
