import { Component, OnDestroy, OnInit } from '@angular/core';
import { CustomDialogContent } from '../../dialogs/dialog.model';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription, timer, map, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'spig-login-alert',
  templateUrl: './login-alert.component.html',
  styleUrls: ['./login-alert.component.scss'],
})
export class LoginAlertComponent implements OnInit, OnDestroy, CustomDialogContent {
  timeout!: number;
  countDown!: Observable<number>;
  subs?: Subscription;
  message!: string;

  dataContext(data: any) {
    this.timeout = data.timeout;
  }
  returnData = true;

  constructor(
    private dialogRef: MatDialogRef<any>,
    private translate: TranslateService
  ) {
    this.message = this.translate.instant('LOGIN.FORCE_LOGOUT_MESSAGE');
  }

  ngOnInit() {
    // If set timeout = 0 means no countdown
    if (this.timeout > 0) {
      this.countDown = timer(0, 1000).pipe(
        map(it => this.timeout - it),
        take(this.timeout + 1)
      );
      this.subs = this.countDown.subscribe({ complete: () => this.dialogRef.close() });
    }
  }

  ngOnDestroy() {
    this.subs?.unsubscribe();
  }
}
