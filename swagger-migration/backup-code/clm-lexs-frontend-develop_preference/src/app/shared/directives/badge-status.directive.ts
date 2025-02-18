import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

export enum BadgeStatus {
  Normal = 'status-normal',
  Warning = 'status-pending',
  Success = 'status-success',
  Info = 'status-info',
  Fail = 'status-failed',
}

export const defaultStatusMapper: Map<string, string> = new Map([
  ['COMPLETE', BadgeStatus.Success],
  ['COMPLETED', BadgeStatus.Success],
  ['SUCCESS', BadgeStatus.Success],
  ['SEIZURED', BadgeStatus.Success],
  ['PAYMENT_COMPLETED', BadgeStatus.Warning],
  ['PENDING', BadgeStatus.Warning],
  ['PENDING_PAYMENT', BadgeStatus.Warning],
  ['PLUDGED', BadgeStatus.Normal],
  ['PLEDGE', BadgeStatus.Normal],
  ['FAILED', BadgeStatus.Fail],
  ['R2E06-05-E_COMPLETE', BadgeStatus.Success],
  ['E-FILING', BadgeStatus.Success],
  ['NON-E-FILING', BadgeStatus.Fail],
  ['UNKNOWN', BadgeStatus.Warning],
  ['PENDING_RECEIPT_VERIFICATION', BadgeStatus.Success],
  ['PENDING_RECEIPT_UPDATE', BadgeStatus.Success],
  ['PENDING_RECEIPT_UPLOAD', BadgeStatus.Success],
  ['RECEIPT_VERIFICATION_COMPLETED', BadgeStatus.Success],
]);

/**
 * Adding status badge color base on giving status,
 * the status should have only one color pre-defined.
 */
@Directive({
  selector: '[appBadgeStatus]',
})
export class BadgeStatusDirective {
  private _statusName = 'EMPTY';
  private _statusMapper = defaultStatusMapper;

  @Input()
  set appBadgeStatus(status: string) {
    if (status === this._statusName) return;
    if (!status) return;

    this._statusName = status.toUpperCase();
    const className = this.getClass(this._statusName);
    this.applyClass(className);
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  private getClass(name: string) {
    return this._statusMapper.get(name) || BadgeStatus.Warning;
  }

  private applyClass(className: string) {
    this.renderer.setAttribute(this.el.nativeElement, 'data-status', this._statusName);
    this.renderer.addClass(this.el.nativeElement, className);
  }
}
