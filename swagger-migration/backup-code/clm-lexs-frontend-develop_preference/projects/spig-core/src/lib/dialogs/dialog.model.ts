export type DialogIcon = 'none' | 'info' | 'success' | 'alert' | 'error' | 'warning';
export type DialogType = 'center' | 'xxsmall' | 'min_xsmall' | 'xsmall' | 'small' | 'normal' | 'large' | 'xlarge';
export type FlashBannerType = 'info' | 'warning' | 'error' | 'primary' | 'general';
export type MatSnackBarHorizontalPosition = 'start' | 'center' | 'end' | 'left' | 'right';
export type MatSnackBarVerticalPosition = 'top' | 'bottom';

export interface SimpleDialogOptions {
  icon?: DialogIcon;
}

export interface DialogOptions {
  spacificId?: string;
  type?: DialogType;
  icon?: DialogIcon;
  iconName?: string;
  iconClass?: string;
  title?: string;
  message?: string;
  canDismiss?: boolean;
  dismissTimeout?: number;
  backButtonLabel?: string;
  leftButtonLabel?: string;
  rightButtonLabel?: string;
  component?: any;
  context?: object | IExpandContext;
  contentCssClasses?: Array<string>;
  panelCssClasses?: Array<string>;
  backButtonClass?: string;
  leftButtonClass?: string;
  rightButtonClass?: string;
  rightIconButtonClass?: string;
  buttonIconName?: string;
  backIconName?: string;
  autoFocus?: boolean;
  disableRightButton?: boolean;
  cancelEvent?: boolean;
  optionBtnLabel?: string;
  optionBtnIcon?: string;
  optionBtnClass?: string;
  autoWidth?: boolean;
  hideIcon?: boolean;
  steps?: IDialogStep[]
}

export interface IDialogStep {
  index: number;
  label: string;
  active?: boolean;
}

export interface FlashBannerOptions {
  type?: FlashBannerType;
  canDismiss?: boolean;
  icon?: FlashBannerType;
  iconName?: string;
  iconClass?: string;
  iconCrossClass?: string;
  headline?: string;
  message?: string;
  dismissTimeout?: number;
  contentCssClasses?: Array<string>;
  buttonText?: string;
  horizontalPosition?: MatSnackBarHorizontalPosition;
  verticalPosition?: MatSnackBarVerticalPosition;
  disabledIcon?: boolean;
}

export interface IExpandContext {
  message: string;
  detailTitle?: string;
  descriptions: Array<string>;
  isExpand?: boolean;
}

export interface CustomDialogContent {
  dataContext(data: object): void;
  readonly returnData: any;
}
