import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppHttpInterceptor } from './app.interceptor';

export const httpInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true }];
