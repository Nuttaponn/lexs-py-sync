import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, firstValueFrom, isObservable } from 'rxjs';
import { DialogOptions } from '../dialogs/dialog.model';
import { DialogsService } from '../dialogs/dialogs.service';

interface Error {
  code: string;
  sourceSystem?: string;
  message: string;
}

interface AlertMessage {
  messageTitle?: string;
  message: string;
}

export const EXCEPTION_CONFIG = new InjectionToken<ExceptionConfig[][]>('exceptionConfigs');
export interface ExceptionConfig {
  code?: string;
  sourceSystem?: string;
  message?: string;
  translate?: string;
}

export interface RetryOptions {
  handleAlert?: (e: any) => boolean;
  shouldRetry?: (e: any) => boolean | undefined;
  message?: string;
  alertDialogOptions?: DialogOptions;
  retryDialogOptions?: DialogOptions;
  callBack?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ExceptionService {
  private messages: Record<string, ExceptionConfig> = {};
  defaultErrorMessage = 'ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง';

  constructor(
    private dialogsService: DialogsService,
    private translate: TranslateService,
    @Inject(EXCEPTION_CONFIG) exceptionConfigs: ExceptionConfig[][]
  ) {
    for (const list of exceptionConfigs) {
      for (const config of list) {
        if (config.code) {
          if (config.sourceSystem) {
            if (config.message) {
              this.messages[config.sourceSystem + '|' + config.code] = { message: config.message };
            } else if (config.translate) {
              this.messages[config.sourceSystem + '|' + config.code] = { translate: config.translate };
            }
          } else {
            if (config.message) {
              this.messages[config.code] = { message: config.message };
            } else if (config.translate) {
              this.messages[config.code] = { translate: config.translate };
            }
          }
        } else {
          if (config.sourceSystem) {
            if (config.message) {
              this.messages[config.sourceSystem] = { message: config.message };
            } else if (config.translate) {
              this.messages[config.sourceSystem] = { translate: config.translate };
            }
          }
        }
      }
    }
  }

  async retry<T>(fn: (cnt: number) => Promise<T> | Observable<T>, options: RetryOptions = {}, i = 0): Promise<T> {
    try {
      const call = fn(i);
      return await (isObservable(call) ? firstValueFrom(call) : call);
    } catch (e: any) {
      const retry = options.shouldRetry && options.shouldRetry(e);
      if (typeof retry === 'undefined' ? this.isRetryable(e) : retry) {
        const message = options.message ? { message: options.message } : this.getErrorMessage(e);
        const retryDialogOptions = Object.assign(
          {
            rightButtonLabel: 'EXCEPTION_CONFIG.BUTTON_RIGHT',
            leftButtonLabel: 'EXCEPTION_CONFIG.BUTTON_LEFT',
            type: 'xsmall',
            icon: 'warning',
          },
          options.retryDialogOptions
        );
        if (message.messageTitle) {
          retryDialogOptions.title = message.messageTitle;
        }
        const result = await this.dialogsService.confirm(message.message, retryDialogOptions);
        if (result) {
          return await this.retry(fn, options, i + 1);
        } else {
          throw e;
        }
      } else {
        if (!options.handleAlert || !options.handleAlert(e)) {
          const message = this.getErrorMessage(e);
          const alertOptions: DialogOptions = {
            rightButtonLabel: 'EXCEPTION_CONFIG.BUTTON_OK',
            icon: 'warning',
            title: message.messageTitle ? message.messageTitle : undefined,
          };
          const result = await this.dialogsService.alert(message.message, alertOptions);
          if (options.callBack !== undefined) {
            options.callBack();
          }
        }
        throw e;
      }
    }
  }

  async noRetry<T>(fn: (cnt: number) => Promise<T> | Observable<T>, options: RetryOptions = {}): Promise<T> {
    options.shouldRetry = () => false;
    return await this.retry(fn, options);
  }

  // private isObservable<T>(call: Promise<T> | Observable<T>): call is Observable<T> {
  //   return (call as Observable<T>).toPromise !== undefined;
  // }

  getError(e: HttpErrorResponse): Error | undefined {
    if (!e || !e.error) {
      return;
    }
    if (e.error.errors instanceof Array) {
      return e.error.errors[0];
    }
    return e.error;
  }

  isRetryable(e: HttpErrorResponse) {
    // manual exception
    if (!e) {
      return true;
    }
    // connection error
    if (!e.status || e.status > 500) {
      return true;
    }
    // 400 - Bad request, 401 - Unauthorized, 403 - Forbiddne
    if (e.status === 400 || e.status === 401 || e.status === 403) {
      return false;
    }
    const error = this.getError(e);
    if (error) {
      // 3rd party
      if (error.sourceSystem) {
        return true;
      }
      // biz logic
      if (error.code) {
        return false;
      }
    }
    // other errors
    return true;
  }

  // Handle Error/Exception
  getErrorMessage(e: HttpErrorResponse, defaultMessage?: string): AlertMessage {
    let defaultMsg = null;
    if (defaultMessage) {
      defaultMsg = { message: defaultMessage };
    }

    const defaultTitle = this.translate.instant('EXCEPTION_CONFIG.TITLE_CONNECTION_ERROR');
    const defaultErrorMessage = {
      messageTitle: defaultTitle ? defaultTitle : null,
      message: this.translate.instant('EXCEPTION_CONFIG.MESSAGE_CONNECTION_ERROR'),
    };

    const error = this.getError(e);
    if (!!!error || (Object.keys(error).length === 0 && error.constructor === Object)) {
      return defaultMsg || defaultErrorMessage;
    }

    const errorConfig =
      this.messages[error.sourceSystem + '|' + error.code] ||
      this.messages[error.code] ||
      (error.sourceSystem ? this.messages[error.sourceSystem] : null);

    return errorConfig
      ? {
          messageTitle: errorConfig.translate
            ? this.translate.instant('EXCEPTION_CONFIG.TITLE_' + errorConfig.translate)
            : null,
          message: errorConfig.translate
            ? this.translate.instant('EXCEPTION_CONFIG.MESSAGE_' + errorConfig.translate)
            : errorConfig.message || this.translate.instant('EXCEPTION_CONFIG.MESSAGE_CONNECTION_ERROR'),
        }
      : defaultMsg || defaultErrorMessage;
  }

  getMessageMapByKey(key: string): AlertMessage | null {
    if (key) {
      const errMap = this.messages[key];
      return errMap
        ? {
            messageTitle: errMap.translate
              ? this.translate.instant('EXCEPTION_CONFIG.TITLE_' + errMap.translate)
              : null,
            message: errMap.translate
              ? this.translate.instant('EXCEPTION_CONFIG.MESSAGE_' + errMap.translate)
              : errMap.message,
          }
        : null;
    }
    return null;
  }

  async alertByCode(code: string, defaultMessage?: string) {
    const err = new HttpErrorResponse({ error: { code } });
    const message = this.getErrorMessage(err, defaultMessage);
    const alertOptions: DialogOptions = {
      rightButtonLabel: 'EXCEPTION_CONFIG.BUTTON_OK',
      title: message.messageTitle ? message.messageTitle : undefined,
      icon: 'warning',
    };
    await this.dialogsService.alert(message.message, alertOptions);
  }
}
