import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { DialogIcon, DialogOptions, DialogType, FlashBannerOptions, FlashBannerType } from './dialog.model';
import { DialogComponent } from './dialog/dialog.component';
import { ExpandDialogComponent } from './expand-dialog/expand-dialog.component';
import { FlashBannerComponent } from './flash-banner/flash-banner.component';

@Injectable({
  providedIn: 'root',
})
export class DialogsService {
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  private iconClassMap: Record<DialogIcon, string> = {
    info: 'dialog-icon fill-red',
    success: 'dialog-icon fill-green',
    alert: 'dialog-icon fill-red',
    error: 'dialog-icon fill-red',
    warning: 'dialog-icon fill-yellow',
    none: 'dialog-icon',
  };

  closeAll() {
    return this.dialog.closeAll();
  }

  showFlashBanner(message: string, options?: FlashBannerOptions) {
    const defaultOptions: FlashBannerOptions = {
      type: 'warning',
      canDismiss: true,
      dismissTimeout: 3000,
      message,
    };
    options = Object.assign(defaultOptions, options);
    options.iconName = options.iconName ? options.iconName : this.getFlashBannerIconName(options.type);

    return this.snackBar.openFromComponent(FlashBannerComponent, {
      data: options,
      duration: options.dismissTimeout,
      verticalPosition: options?.verticalPosition || 'top',
      horizontalPosition: options?.horizontalPosition || 'center',
      panelClass: `${this.getFlashBannerClassName(options.type)}${
        options?.contentCssClasses?.toString()?.includes('large') ? '-large' : ''
      }`,
    });
  }

  async alert(message: string, options?: DialogOptions) {
    const defaultOptions: DialogOptions = {
      type: 'xsmall',
      icon: 'alert',
      message,
      rightButtonLabel: 'DIALOG.ALERT_BUTTON_OK',
      canDismiss: false,
      autoFocus: true,
    };
    const mergedOptions = Object.assign(defaultOptions, options);
    if (!!options?.icon) {
      mergedOptions.iconName = this.getIconName(options.icon);
      mergedOptions.iconClass = this.getIconClass(options.icon);
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      data: mergedOptions,
      panelClass: this.getDialogClassName(mergedOptions.type),
      id: this.getDialogClassName(mergedOptions.type) + (options?.spacificId || ''),
      disableClose: true,
      autoFocus: mergedOptions.autoFocus,
    });
    return await firstValueFrom(dialogRef.afterClosed());
  }

  async confirm(message: string, options?: DialogOptions): Promise<boolean> {
    const defaultOptions: DialogOptions = {
      type: 'xsmall',
      icon: 'alert',
      message,
      rightButtonLabel: 'DIALOG.CONFIRM_BUTTON_CONFIRM',
      leftButtonLabel: 'DIALOG.CONFIRM_BUTTON_CANCEL',
      canDismiss: true,
      autoFocus: true,
    };
    const mergedOptions = Object.assign(defaultOptions, options);
    if (!!options?.icon) {
      mergedOptions.iconName = this.getIconName(options.icon);
      mergedOptions.iconClass = this.getIconClass(options.icon);
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      data: mergedOptions,
      panelClass: this.getDialogClassName(mergedOptions.type),
      id: this.getDialogClassName(mergedOptions.type),
      disableClose: true,
      autoFocus: mergedOptions.autoFocus,
    });

    const res = await firstValueFrom(dialogRef.afterClosed());
    return res ? res : false;
  }

  async show(options: DialogOptions): Promise<any> {
    const defaultOptions: DialogOptions = {
      type: 'center',
      rightButtonLabel: 'DIALOG.SHOW_BUTTON',
      canDismiss: false,
    };
    const mrgedOptions = Object.assign(defaultOptions, options);
    if (!!options.icon) {
      mrgedOptions.iconName = this.getIconName(options.icon);
      mrgedOptions.iconClass = this.getIconClass(options.icon);
    }
    return await this.openDialog(mrgedOptions);
  }

  /**
   * Show dialog for expansion detail or list
   */
  async expand(options?: DialogOptions): Promise<object> {
    const configs: DialogOptions = {
      type: 'center',
      icon: 'error',
      iconName: this.getIconName('error'),
      iconClass: this.getIconClass('error'),
      rightButtonLabel: 'DIALOG.EXPAND_BUTTON',
      canDismiss: false,
      component: ExpandDialogComponent,
      ...options,
    };

    return await this.openDialog(configs);
  }

  async openDialog(configs: DialogOptions) {
    const panelClasses = [];
    panelClasses.push(this.getDialogClassName(configs.type));
    if (!!configs.panelCssClasses) {
      panelClasses.push(...configs.panelCssClasses);
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      data: configs,
      panelClass: panelClasses,
      id: this.getDialogClassName(configs.type),
      disableClose: true,
      autoFocus: configs.autoFocus ?? true,
    });

    return await firstValueFrom(dialogRef.afterClosed());
  }

  // Helper functions
  private getFlashBannerClassName(type?: FlashBannerType) {
    if (!type) {
      return '';
    }
    const map: Record<FlashBannerType, string> = {
      info: 'custom-snack-bar-container-info',
      warning: 'custom-snack-bar-container-warning',
      error: 'custom-snack-bar-container-error',
      primary: 'custom-snack-bar-container-primary',
      general: 'custom-snack-bar-container-general',
    };
    return map[type];
  }

  private getFlashBannerIconName(type?: FlashBannerType) {
    if (!type) {
      return '';
    }
    const map: Record<FlashBannerType, string> = {
      info: 'icon-Success',
      warning: 'icon-Error',
      error: 'icon-Error',
      primary: 'icon-Arrow-Sync',
      general: 'icon-Notification',
    };
    return map[type];
  }

  private getDialogClassName(type?: DialogType) {
    if (!type) {
      return '';
    }
    const map: Record<DialogType, string> = {
      center: 'custom-dialog-center',
      xxsmall: 'custom-dialog-xxsmall',
      min_xsmall: 'custom-dialog-min-xsmall',
      xsmall: 'custom-dialog-xsmall',
      small: 'custom-dialog-small',
      normal: 'custom-dialog-normal',
      large: 'custom-dialog-large',
      xlarge: 'custom-dialog-xlarge',
    };
    return map[type];
  }

  private getIconName(icon: DialogIcon) {
    const map: Record<DialogIcon, string> = {
      info: 'icon-Information',
      success: 'icon-Success',
      alert: 'icon-Warning',
      error: 'icon-Warning',
      warning: 'icon-Warning',
      none: '',
    };

    return map[icon];
  }

  private getIconClass(icon: DialogIcon) {
    if (!icon) return this.iconClassMap.none
    return this.iconClassMap[icon];
  }
}
