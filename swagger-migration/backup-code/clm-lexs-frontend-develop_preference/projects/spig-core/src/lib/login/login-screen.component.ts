import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { LoggerService } from '@app/shared/services/logger.service';
import { TranslateService } from '@ngx-translate/core';
import { DialogOptions } from '../dialogs/dialog.model';
import { DialogsService } from '../dialogs/dialogs.service';
import { ExceptionService } from '../service/exception.service';
import { TokenService } from '../token/token.service';
import { LoginAlertComponent } from './login-alert/login-alert.component';
import { LOGIN_SCREEN_OPTIONS, LoginScreenOptions } from './login-screen-options';

@Component({
  selector: 'spig-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss'],
})
export class LoginScreenComponent implements OnInit {
  screenOptions: LoginScreenOptions;

  constructor(
    private dialogsService: DialogsService,
    private tokenService: TokenService,
    private exceptionService: ExceptionService,
    private translate: TranslateService,
    @Inject(LOGIN_SCREEN_OPTIONS) loginScreenOptions: LoginScreenOptions,
    private logger: LoggerService
  ) {
    loginScreenOptions = LoginScreenOptions.applyDefault(loginScreenOptions);
    this.screenOptions = loginScreenOptions;
  }

  @ViewChild('usernameModel') usernameModel!: NgModel;
  @ViewChild('passwordModel') passwordModel!: NgModel;
  @ViewChild('tooltip') tooltip?: MatTooltip;
  @Input() usernameLength = -1;
  @Input() pwdLength = -1;
  // Set max length for input less than zero (incorrect data) to default as 'no max length'
  @Input() initAlertMessage?: string;

  @Output()
  loginSuccess = new EventEmitter();

  username!: string;
  password!: string;
  errorMessage: string = '';
  hide = true;
  isTooltipErrorType = false;

  login() {
    if (!!this.username && !!this.password) {
      return this.tryLogin(this.screenOptions.allowConcurrent ? 'authorize' : undefined);
    }
    if (!!this.screenOptions.alwaysEnableButton) {
      if (!!!this.username) {
        this.usernameModel.control.updateValueAndValidity();
        this.usernameModel.control.markAsTouched();
      }
      if (!!!this.password) {
        this.passwordModel.control.markAsTouched();
      }
    }
    return;
  }

  async ngOnInit() {
    this.password = '';
    if (this.screenOptions.showAlertAfterForcedLogout && this.initAlertMessage) {
      this.errorMessage = this.initAlertMessage;
      if (!this.screenOptions.errorAsTooltip) {
        await this.dialogsService.alert(this.errorMessage);
      } else {
        setTimeout(() => this.tooltip?.show(), 100);
      }
    }
  }

  private async tryLogin(mode?: 'authorize' | 'force') {
    this.errorMessage = '';
    try {
      // Call login service
      await this.tokenService.login(this.username, this.password, mode);
      this.loginSuccess.emit();
    } catch (e: any) {
      const error = this.exceptionService.getError(e);
      this.logger.error('[Login screen] error when try login: ', error);
      if (error && error.code === 'CONCURRENT_LOGIN') {
        await this.forceLogin();
        return;
      }

      // Handle Error
      const msg = this.exceptionService.getErrorMessage(e, 'POPUP');
      if (msg.message === 'POPUP' || (this.screenOptions.errorAsTooltip && this.exceptionService.isRetryable(e))) {
        this.isTooltipErrorType = true;
        this.errorMessage = this.exceptionService.getErrorMessage(e).message;
        if (!this.errorMessage) {
          this.errorMessage = this.translate.instant('LOGIN.ERROR_GENERAL');
        }
        if (!this.screenOptions.errorAsTooltip) {
          await this.dialogsService.alert(this.errorMessage);
        } else {
          setTimeout(() => this.tooltip?.show(), 100);
        }
      } else {
        this.isTooltipErrorType = false;
        this.usernameModel.control.setErrors({ invalid: true });
        this.passwordModel.control.setErrors({ invalid: true });
        this.errorMessage = msg.message;
      }
    }
  }

  private async forceLogin() {
    let opts: DialogOptions;
    if (!!!this.screenOptions.forceLoginCustomDialog) {
      opts = {
        component: LoginAlertComponent,
        context: {
          timeout: this.screenOptions.forceLogoutAlertCountdown,
        },
      };
    } else {
      opts = this.screenOptions.forceLoginCustomDialog;
      opts.panelCssClasses = ['custom-dialog-auto-width'];
      const msg = this.translate.instant('LOGIN.FORCE_LOGOUT_MESSAGE');
      if (!!msg) {
        opts.message = msg;
      }
    }
    opts.rightButtonLabel = 'LOGIN.FORCE_LOGOUT_RIGHT_BUTTON';
    opts.leftButtonLabel = 'LOGIN.FORCE_LOGOUT_LEFT_BUTTON';
    opts.autoFocus = false;
    const titleText = this.translate.instant('LOGIN.FORCE_LOGOUT_TITLE');
    if (!!titleText) {
      opts.title = titleText;
    }

    const result = await this.dialogsService.confirm('', opts);
    if (result) {
      await this.tryLogin('force');
    } else {
      this.password = '';
    }
  }

  valueChange() {
    if (this.usernameModel.control.value !== '') {
      this.errorMessage = '';
      this.usernameModel.control.setErrors(null);
    }
    if (this.passwordModel.control.value !== '') {
      this.errorMessage = '';
      this.passwordModel.control.setErrors(null);
    }
  }
}
