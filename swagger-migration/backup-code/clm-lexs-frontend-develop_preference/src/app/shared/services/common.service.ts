import { Inject, Injectable } from '@angular/core';
import { ExceptionService, RetryOptions } from '@spig/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  dapaLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(@Inject(ExceptionService) private exceptionService: ExceptionService) {}

  startDopaLoading() {
    this.dapaLoading$.next(true);
  }

  stopDopaLoading() {
    this.dapaLoading$.next(false);
  }

  exceptionRetryDialog<T>(fn: (cnt: number) => Promise<T> | Observable<T>, options: RetryOptions = {}): Promise<T> {
    const mergedOptions = Object.assign(
      {
        retryDialogOptions: {
          rightButtonLabel: 'Retry',
          leftButtonLabel: 'OK',
          type: 'xsmall',
        },
        alertDialogOptions: {
          rightButtonLabel: 'OK',
        },
      },
      options
    );
    this.exceptionService.defaultErrorMessage = 'Problem connecting to the server.';
    return this.exceptionService.retry(fn, mergedOptions);
  }

  exceptionNoRetryDialog<T>(fn: (cnt: number) => Promise<T> | Observable<T>, options: RetryOptions = {}): Promise<T> {
    options.shouldRetry = () => false;
    return this.exceptionRetryDialog(fn, options);
  }
}
