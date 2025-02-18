import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogOptions, ExceptionService } from '@spig/core';
import { Observable } from 'rxjs';
import { ERROR_CODE } from '../constant';
import { LoggerService } from './logger.service';
import { NotificationService } from './notification.service';

/*
 * Options for handle error message display
 * by default, display error message as snack bar message with type 'error'
 *
 *   snackBarMessage: message to be displayed on snack bar
 *   snackBarType: can select to display specific type of snack bar message ('info' | 'warning' | 'error' | 'primary')
 *
 */
export interface ErrorHandlerOptions {
  snackBarMessage?: string;
  snackBarType?: string;
  snackBarButtonLabel?: string;
  notShowAsSnackBar?: boolean;
  errorCallBack?: (e: any) => void;
  disableErrorDisplay?: boolean;
  showDialogForSpecificCodes?: Array<string>;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  private alertOptions?: ErrorHandlerOptions;

  constructor(
    @Inject(ExceptionService) private exceptionService: ExceptionService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private looger: LoggerService
  ) {}

  async invokeNoRetry<T>(fn: (cnt: number) => Promise<T> | Observable<T>, options?: ErrorHandlerOptions): Promise<T> {
    const defaultErrorHandlerOptions: ErrorHandlerOptions = {
      snackBarType: 'error',
      snackBarMessage: this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'),
      snackBarButtonLabel: this.translate.instant('COMMON.BUTTON_ACKNOWLEDGE'),
      notShowAsSnackBar: false,
    };
    this.alertOptions = { ...defaultErrorHandlerOptions };
    if (options) {
      this.alertOptions = Object.assign(this.alertOptions, options);
    }

    return await this.exceptionService.noRetry(fn, { handleAlert: this.handleErrorAlert });
  }

  handleErrorAlert = (e: HttpErrorResponse) => {
    this.looger.error('Handle error alert ', e);

    if (this.alertOptions) {
      if (this.alertOptions.disableErrorDisplay) return true;
      // If found 'Business error' or set options to not display as snack bar .then invoke callback function
      const err = this.exceptionService.getError(e);
      if (err?.code === ERROR_CODE.WRIT18) {
        // pendding deferment case
        this.notificationService.closeAll();
        this.showAlertMessage(err, { spacificId: err?.code });
      } else {
        if (this.alertOptions.notShowAsSnackBar) {
          // show dialog with error message
          if (this.alertOptions.errorCallBack) {
            this.alertOptions.errorCallBack(e);
          } else {
            this.showAlertMessage(err);
          }
        } else {
          if (!!this.alertOptions.showDialogForSpecificCodes && !!err) {
            if (this.alertOptions.showDialogForSpecificCodes?.includes(err.code)) {
              this.showAlertMessage(err);
            } else {
              this.showToastMessage(err);
            }
          } else {
            // show toast with error message by default
            this.showToastMessage(err);
          }
        }
      }
    }

    // always retrun true to prevent ExceptionService to show alert pop-up dialog
    return true;
  };

  async showAlertMessage(err: any, option?: DialogOptions) {
    const msgByKey = err
      ? this.getMessageMapByKey(err.code)
      : { messageTitle: 'EXCEPTION_CONFIG.TITLE_COMMON_ERROR', message: 'EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR' };
    await this.notificationService.alertDialog(msgByKey?.messageTitle, msgByKey?.message);
  }

  showToastMessage(err: any) {
    if (this.alertOptions) {
      // show toast with error message
      const _snackBarMessage = err ? this.getMessageMapByKey(err.code)?.message : this.alertOptions.snackBarMessage;
      // If msg = NO_TOAST_EXCEPTION will be hide toast error message
      if (_snackBarMessage && this.translate.instant(_snackBarMessage) === 'NO_TOAST_EXCEPTION') return true;
      switch (this.alertOptions.snackBarType) {
        case 'info':
          this.notificationService.openSnackbarSuccess(_snackBarMessage || this.alertOptions.snackBarMessage, {
            buttonText: this.alertOptions.snackBarButtonLabel,
          });
          break;
        case 'warning':
          this.notificationService.openSnackbarWarning(_snackBarMessage || this.alertOptions.snackBarMessage, {
            buttonText: this.alertOptions.snackBarButtonLabel,
          });
          break;
        case 'primary':
          this.notificationService.openSnackbarPrimary(_snackBarMessage || this.alertOptions.snackBarMessage, {
            buttonText: this.alertOptions.snackBarButtonLabel,
          });
          break;
        default:
          this.notificationService.openSnackbarError(_snackBarMessage || this.alertOptions.snackBarMessage, {
            buttonText: this.alertOptions.snackBarButtonLabel,
          });
          break;
      }
    }
    return;
  }

  getMessageMapByKey(key: string) {
    return (
      this.exceptionService.getMessageMapByKey(key) || {
        messageTitle: this.translate.instant('EXCEPTION_CONFIG.TITLE_COMMON_ERROR'),
        message: this.translate.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'),
      }
    );
  }
}
