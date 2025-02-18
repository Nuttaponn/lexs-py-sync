import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { DropDownConfig } from '@spig/core';
import { DetailsHeader } from '../auction.const';

@Component({
  selector: 'app-auction-header',
  templateUrl: './auction-header.component.html',
  styleUrls: ['./auction-header.component.scss'],
})
export class AuctionHeaderComponent implements OnInit {
  constructor() {}

  @Input() isMain: boolean = false;
  @Input() isMainSub: boolean = false;
  @Input() details: DetailsHeader[] = [];
  @Input() detailscash: any[] = [];
  @Input() numcash: number = 0;
  @Input() title: string = '';
  @Input() titleClass: string = '';
  @Input() ready: boolean | null = null;
  @Input() showIcon: boolean = false;
  @Input() expanded: boolean = false;
  @Input() iconClass: Array<string> | string = [];
  @Input() classInput: string = 'input-s icon';
  @Input() iconName: string = 'icon-Doc-circle';
  @Input() modeTransfer: boolean = false;
  @Input() fxLayoutGap: string = '16';

  configDropdown: DropDownConfig = {
    iconName: '',
    labelPlaceHolder: 'รายการ 1',
  };

  public dropdownControl: UntypedFormControl = new UntypedFormControl(0);

  /* For exception eg. 2 hardcode-Icons is needed in case of changing color problem */
  @Input() isExceptionalIcons: boolean = false;
  @Input() exceptionalIconNames: string[] = ['icon-Info-Green', 'icon-Info-Orange'];

  @Input() forFollowAccDoc: boolean = false; // LEX2-18039 only

  @Output() expand = new EventEmitter<any>();
  @Output() dropdownSelect = new EventEmitter<any>();

  nestIteration: number[] = [];
  currentDropdownValue: number = 0;

  ngOnInit() {
    console.log('ngOnInit : AuctionHeaderComponent');
  }

  expandPanel() {
    this.expand.emit();
    this.expanded = !this.expanded;
  }

  dropdownSelected(event: number) {
    this.dropdownSelect.emit(event);
    this.currentDropdownValue = event;
  }
}

export interface AuctionHeaderConfig {
  title: string;
  isMain: boolean;
  details: any[];
  isOpened: boolean;
  ready: boolean;
  showIcon: boolean;
  isExceptionalIcons: boolean;
  forFollowAccDoc: boolean;
  isMainSub: boolean;
}
