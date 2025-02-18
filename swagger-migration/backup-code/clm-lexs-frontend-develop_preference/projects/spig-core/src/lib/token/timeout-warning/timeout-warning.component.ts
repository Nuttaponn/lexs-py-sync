import { Component, Inject, Injector, OnDestroy, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Idle } from '@ng-idle/core';
import { merge, Observable, of, Subscription, map } from 'rxjs';
import { IdleOptions, IDLE_OPTIONS } from '../idle-options';

@Component({
  selector: 'spig-timeout-warning',
  templateUrl: './timeout-warning.component.html',
  styleUrls: ['./timeout-warning.component.scss'],
})
export class TimeoutWarningComponent implements OnDestroy {
  private timeoutSub: Subscription;
  seconds: Observable<number>;
  timeout = false;
  language: string = 'TH';
  showAsMinutes: boolean;

  constructor(
    private idle: Idle,
    private injector: Injector,
    private dialogRef: MatDialogRef<any>,
    @Optional() @Inject(IDLE_OPTIONS) idleOptions: IdleOptions
  ) {
    idleOptions = IdleOptions.applyDefault(idleOptions);
    this.language = idleOptions.language;
    this.showAsMinutes = idleOptions.showAsMinutes!;
    const countdown = this.getCurrentCountDown();
    this.seconds = merge<any>(of(countdown), this.idle.onTimeoutWarning).pipe(map(it => it - 1));
    this.timeoutSub = this.idle.onTimeout.subscribe(async _ => {
      this.timeout = true;
      const imp = await import('../token.service');
      const tokenService = this.injector.get(imp.TokenService);
      tokenService.logout('TIMEOUT');
      this.dialogRef.close('TIMEOUT');
    });
  }

  private getCurrentCountDown() {
    const timeout = this.idle['timeoutVal'];
    const diff = this.idle['getExpiryDiff'](timeout);
    const countdownMs = timeout * 1000 + diff;
    const countdown = Math.round(countdownMs / 1000);
    return Math.max(countdown, 1);
  }

  get returnData() {
    return this.timeout ? 'TIMEOUT' : 'MOVE';
  }

  get returnOptionData() {
    return 'LOGOUT';
  }

  ngOnDestroy() {
    this.timeoutSub.unsubscribe();
  }
}
