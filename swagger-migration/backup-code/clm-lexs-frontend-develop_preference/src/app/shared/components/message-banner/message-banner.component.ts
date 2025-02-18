import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-message-banner',
  templateUrl: './message-banner.component.html',
  styleUrls: ['./message-banner.component.scss'],
})
export class MessageBannerComponent implements OnInit {
  public displayMessage!: string;
  @Input()
  set message(val: string) {
    const _displayMsg = this.translate.instant(val);
    if (_displayMsg.indexOf('startbold') !== -1 && _displayMsg.indexOf('endbold') !== -1) {
      this.displayMessage = _displayMsg.replace('startbold', '<span class="bold">').replace('endbold', '</span>');
    } else if (_displayMsg.indexOf('startBlack70') !== -1 && _displayMsg.indexOf('endBlack70') !== -1) {
      this.displayMessage = _displayMsg
        .replace('startBlack70', '<span class="fill-black-70">')
        .replace('endBlack70', '</span>');
    } else {
      this.displayMessage = _displayMsg;
    }
  }

  @Input() subMessage: Array<any> = [];
  @Input() type!: string;
  @Input() size!: string; // large
  @Input() icon!: string;
  @Input() actionButton!: string;
  @Input() actionButtonIcon!: string;
  @Input() actionButtonBorder: boolean = true;
  @Input() actionButtonClass: string = '';
  @Input() iconClass: string = '';
  @Input() toolTipParams: any[] = [];
  @Output() actionButtonHandler = new EventEmitter<any>();
  @Input() messageClass: Array<string> | string = [];
  @Input() messageContainerClass: Array<string> | string = ['full-width'];

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.type = this.type || 'fail';
    this.size = this.size || 'auto';
    if (['warn-normal', 'fail', 'warn'].includes(this.type) && !this.icon) {
      this.icon = 'icon-Error';
    } else {
      this.icon = this.icon || 'icon-Information';
    }
  }

  actionButtonClicked(): void {
    this.actionButtonHandler.emit({ name: 'Action button clicked' });
  }
}
