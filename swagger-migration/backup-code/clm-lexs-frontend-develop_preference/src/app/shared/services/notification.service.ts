import { Inject, Injectable } from '@angular/core';
import { DialogOptions, DialogsService, FlashBannerOptions } from '@spig/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public setting: FlashBannerOptions;
  public dialogSetting: DialogOptions;

  constructor(@Inject(DialogsService) private dialog: DialogsService) {
    this.setting = {
      type: 'info', // info' | 'warning' | 'error' | 'primary'
      horizontalPosition: 'right', // 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: 'top', // 'top' | 'bottom'
      iconClass: 'icon-xs icon-green', // change icon style
      iconName: 'icon-Mark', // change icon
      disabledIcon: false, // show/hide icon
      buttonText: 'Button', // change button text
      dismissTimeout: 3000, // change timeout
      iconCrossClass: '', // don't put anything in here
      contentCssClasses: ['flash-banner-info'],
    };

    // 'type' can be: 'center' | 'xxsmall' | 'xsmall' | 'small' | 'normal' | 'large' | 'xlarge'
    // 'icon' can be: 'none' | 'info' | 'success' | 'alert' | 'error' | 'warning'
    this.dialogSetting = {
      type: 'xsmall',
      title: '',
      message: '',
      canDismiss: true,
      dismissTimeout: 0,
      contentCssClasses: [],
      leftButtonClass: '',
      rightButtonClass: '', //  'error'
      autoFocus: true,
    };
  }

  openSnackbarSuccess(msg?: any, options?: FlashBannerOptions) {
    this.setting.type = 'info';
    this.setting.iconClass = 'icon-xs icon-green';
    this.setting.iconName = 'icon-Mark';
    this.setting.buttonText = 'COMMON.BUTTON_ACKNOWLEDGE';
    options = Object.assign(this.setting, options);
    this.dialog.showFlashBanner(msg, options);
  }

  openSnackbarError(msg?: any, options?: FlashBannerOptions) {
    this.setting.type = 'error';
    this.setting.iconClass = 'icon-xs icon-red';
    this.setting.iconName = 'icon-Error';
    this.setting.buttonText = 'COMMON.BUTTON_ACKNOWLEDGE';
    options = Object.assign(this.setting, options);
    this.dialog.showFlashBanner(msg, options);
  }

  openSnackbarWarning(msg?: any, options?: FlashBannerOptions) {
    this.setting.type = 'warning';
    this.setting.iconClass = 'icon-xs icon-yellow';
    this.setting.iconName = 'icon-Notification';
    this.setting.buttonText = 'COMMON.BUTTON_ACKNOWLEDGE';
    options = Object.assign(this.setting, options);
    this.dialog.showFlashBanner(msg, options);
  }

  openSnackbarPrimary(msg?: any, options?: FlashBannerOptions) {
    this.setting.type = 'primary';
    this.setting.iconClass = 'icon-xs icon-blue';
    this.setting.iconName = 'icon-Arrow-Sync';
    this.setting.buttonText = 'COMMON.BUTTON_ACKNOWLEDGE';
    options = Object.assign(this.setting, options);
    this.dialog.showFlashBanner(msg, options);
  }

  // banner
  openGeneralBanner(msg?: any, options?: FlashBannerOptions) {
    this.setting.contentCssClasses = ['flash-banner-info-large'];
    this.setting.type = 'general';
    this.setting.iconClass = 'icon-xs icon-white';
    this.setting.iconName = 'icon-Notification';
    options = Object.assign(this.setting, options);
    this.dialog.showFlashBanner(msg, options);
  }

  openErrorBanner(msg?: any, options?: FlashBannerOptions) {
    this.setting.contentCssClasses = ['flash-banner-info-large'];
    this.setting.type = 'error';
    this.setting.iconClass = 'icon-xs icon-red';
    this.setting.iconName = 'icon-Notification';
    options = Object.assign(this.setting, options);
    this.dialog.showFlashBanner(msg, options);
  }

  openWarningBanner(msg?: any, options?: FlashBannerOptions) {
    this.setting.contentCssClasses = ['flash-banner-info-large'];
    this.setting.type = 'warning';
    this.setting.iconClass = 'icon-xs icon-yellow';
    this.setting.iconName = 'icon-Notification';
    options = Object.assign(this.setting, options);
    this.dialog.showFlashBanner(msg, options);
  }

  openSuccessBanner(msg?: any, options?: FlashBannerOptions) {
    this.setting.type = 'info';
    this.setting.iconClass = 'icon-xs icon-green';
    this.setting.iconName = 'icon-Mark';
    this.setting.contentCssClasses = ['flash-banner-info-large'];
    options = Object.assign(this.setting, options);
    this.dialog.showFlashBanner(msg, options);
  }

  private async openDialog(title?: string, msg?: string, options?: DialogOptions) {
    // First clone default setting
    const mergedOpts = { ...this.dialogSetting };
    mergedOpts.type = mergedOpts.type || 'xsmall';
    mergedOpts.title = title;
    mergedOpts.message = msg;
    options = Object.assign(mergedOpts, options);
    return await this.dialog.alert(msg || '', options);
  }

  async warningDialog(
    title?: string,
    msg?: string,
    rightBtnLabel?: string,
    rightBtnIcon?: string,
    rightButtonClass?: string
  ) {
    const opts: DialogOptions = {
      iconName: 'icon-Error',
      iconClass: 'icon-xmedium fill-red',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      leftButtonClass: 'long-button',
      rightButtonLabel: rightBtnLabel || 'COMMON.BUTTON_OK',
      rightButtonClass: rightButtonClass || 'long-button',
      autoFocus: false,
    };
    if (rightBtnIcon) {
      opts.buttonIconName = rightBtnIcon;
    }
    return await this.openDialog(title, msg, opts);
  }

  async alertDialog(
    title?: string,
    msg?: string,
    rightBtnLabel?: string,
    rightBtnIcon?: string,
    customOptions?: DialogOptions
  ) {
    const opts: DialogOptions = {
      iconName: 'icon-Dismiss-Fill',
      iconClass: 'icon-xmedium fill-red',
      buttonIconName: rightBtnIcon || 'icon-Selected',
      rightButtonLabel: rightBtnLabel || 'COMMON.BUTTON_ACKNOWLEDGE',
      leftButtonClass: 'long-button',
      rightButtonClass: 'long-button',
      ...customOptions,
    };
    return await this.openDialog(title, msg, opts);
  }

  async showCustomDialog(_dialogSetting: DialogOptions = {}) {
    const mergedOpts = { ...this.dialogSetting };
    mergedOpts.type = _dialogSetting.type || 'xsmall';
    mergedOpts.title = _dialogSetting.title;
    mergedOpts.iconName = _dialogSetting.iconName || 'icon-Information';
    mergedOpts.steps = _dialogSetting?.steps || [];
    mergedOpts.iconClass = _dialogSetting.iconClass; // TODO: pls move to config on need to hide || 'hideIcon';
    mergedOpts.component = _dialogSetting.component;
    mergedOpts.rightButtonLabel = _dialogSetting.rightButtonLabel || 'COMMON.BUTTON_OK';
    mergedOpts.panelCssClasses = _dialogSetting.autoWidth === false ? [] : ['custom-dialog-auto-width'];
    mergedOpts.disableRightButton = _dialogSetting.disableRightButton || false;
    mergedOpts.cancelEvent = _dialogSetting.cancelEvent || false;
    mergedOpts.autoFocus = _dialogSetting.autoFocus || false;
    mergedOpts.hideIcon = _dialogSetting.hideIcon || false;
    if (_dialogSetting.buttonIconName) {
      mergedOpts.buttonIconName = _dialogSetting.buttonIconName;
    }
    if (_dialogSetting.leftButtonLabel) {
      mergedOpts.leftButtonLabel = _dialogSetting.leftButtonLabel;
    }
    if (_dialogSetting.optionBtnLabel) {
      mergedOpts.optionBtnLabel = _dialogSetting.optionBtnLabel;
      mergedOpts.optionBtnIcon = _dialogSetting.optionBtnIcon;
      mergedOpts.optionBtnClass = _dialogSetting.optionBtnClass;
    }
    if (_dialogSetting.context) {
      mergedOpts.context = _dialogSetting.context;
    }
    if (_dialogSetting.panelCssClasses) {
      mergedOpts.panelCssClasses.push(..._dialogSetting.panelCssClasses);
    }
    if (_dialogSetting.backButtonLabel) {
      mergedOpts.backButtonLabel = _dialogSetting.backButtonLabel;
      mergedOpts.backButtonClass = 'long-button';
      mergedOpts.backIconName =
        _dialogSetting.backIconName !== '' ? _dialogSetting.backIconName || _dialogSetting.backIconName : undefined;
      mergedOpts.contentCssClasses = _dialogSetting.contentCssClasses
        ? _dialogSetting.contentCssClasses.concat(['space_between'])
        : [''];
    } else {
      mergedOpts.contentCssClasses = _dialogSetting.contentCssClasses ? _dialogSetting.contentCssClasses : [''];
    }
    mergedOpts.leftButtonClass = _dialogSetting.leftButtonClass || 'long-button';
    mergedOpts.rightButtonClass = _dialogSetting.rightButtonClass || 'long-button';
    mergedOpts.rightIconButtonClass = _dialogSetting.rightIconButtonClass || '';

    return await this.dialog.show(mergedOpts);
  }

  private async openCenterAlignedDialog(title?: any, msg?: any, options?: DialogOptions) {
    // First clone default setting
    const mergedOpts = { ...this.dialogSetting };
    mergedOpts.type = 'center';
    mergedOpts.title = title;
    mergedOpts.message = msg;
    options = Object.assign(mergedOpts, options);
    return await this.dialog.openDialog(options);
  }

  async confirmCreateCenterAlignedDialog(title?: string, msg?: string, rightBtnLabel?: string, rightBtnIcon?: string) {
    const opts: DialogOptions = {
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      leftButtonClass: 'long-button',
      buttonIconName: rightBtnIcon || 'icon-Stack',
      rightButtonLabel: rightBtnLabel || 'COMMON.BUTTON_CONFIRM',
      rightButtonClass: 'long-button',
    };
    return await this.openCenterAlignedDialog(title, msg, opts);
  }

  async confirmRemoveCenterAlignedDialog(title?: string, msg?: string, options?: DialogOptions) {
    const opts: DialogOptions = {
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      leftButtonClass: options?.leftButtonClass || 'long-button',
      buttonIconName: options?.buttonIconName || 'icon-Bin',
      rightButtonLabel: options?.rightButtonLabel || 'COMMON.BUTTON_CONFIRM',
      rightButtonClass: options?.rightButtonClass || 'mat-warn long-button',
      rightIconButtonClass: options?.rightIconButtonClass || '',
      autoFocus: options?.autoFocus,
      contentCssClasses: options?.contentCssClasses || [],
    };
    return await this.openCenterAlignedDialog(title, msg, opts);
  }

  async confirmRemoveLeftAlignedDialog(title?: string, msg?: string, options?: DialogOptions) {
    const opts: DialogOptions = {
      iconName: options?.iconName || 'icon-Information',
      iconClass: options?.iconClass || 'icon-xmedium fill-red',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      leftButtonClass: options?.leftButtonClass || 'long-button',
      buttonIconName: options?.buttonIconName || 'icon-Bin',
      rightButtonLabel: options?.rightButtonLabel || 'COMMON.BUTTON_CONFIRM',
      rightButtonClass: options?.rightButtonClass || 'mat-warn long-button',
      rightIconButtonClass: options?.rightIconButtonClass || '',
      autoFocus: options?.autoFocus,
      contentCssClasses: options?.contentCssClasses || [],
    };
    return await this.openDialog(title, msg, opts);
  }

  closeAll() {
    return this.dialog.closeAll();
  }

  /**
   * General Confirm Dialog
   * @param title
   * @param msg
   * @param options
   * @returns
   */
  async confirm(title: string, msg: string, options?: DialogOptions) {
    const opts: DialogOptions = {
      iconName: options?.iconName || 'icon-Error',
      iconClass: options?.iconClass || 'icon-xmedium fill-red',
      buttonIconName: options?.buttonIconName || '',
      leftButtonClass: options?.leftButtonClass || '',
      leftButtonLabel: options?.leftButtonLabel || 'COMMON.BUTTON_CANCEL',
      rightButtonLabel: options?.rightButtonLabel || 'COMMON.BUTTON_CONFIRM',
      rightButtonClass: options?.rightButtonClass || '',
      rightIconButtonClass: options?.rightIconButtonClass || '',
      autoFocus: options?.autoFocus || true,
      type: options?.type || 'xsmall',
      contentCssClasses: options?.contentCssClasses || [],
    };

    return await this.openDialog(title, msg, opts);
  }
}
