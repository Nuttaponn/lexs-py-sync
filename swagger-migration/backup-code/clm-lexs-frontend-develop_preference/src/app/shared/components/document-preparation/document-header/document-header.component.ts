import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { DetailsHeader } from '@app/modules/auction/auction.const';
import { DropDownConfig, SimpleSelectOption } from '@spig/core';

@Component({
  selector: 'app-document-header',
  templateUrl: './document-header.component.html',
  styleUrls: ['./document-header.component.scss'],
})
export class DocumentHeaderComponent implements OnInit {
  constructor() {}

  @Input() isMain: boolean = false;
  @Input() nestLevel: number = 0;
  @Input() details: DetailsHeader[] = [];
  @Input() title: string = '';
  @Input() readyForLitigation: boolean = false;
  @Input() readyForNotice: boolean = false;
  @Input() readyForAsset?: boolean = false;
  @Input() needsCopyForLitigation: boolean = false;
  @Input() forLitigation: boolean = false;
  @Input() forNoticeLetter: boolean = false;
  @Input() forAsset: boolean = false;
  @Input() showDropdown: boolean = false;
  @Input() dropdownOptions: SimpleSelectOption[] = [];
  @Input() expanded: boolean = false;
  @Input() forDoc: boolean = false;
  @Input() canShowIcon: boolean = true;
  @Input() readyForDoc: boolean | null = false;
  @Input() iconClass: Array<string> | string = [];
  @Input() classInput: string = 'input-s icon';
  @Input() hideDropdownIcon: boolean = false;

  @Input() customIcon: string | undefined;
  @Input() forGeneral?: boolean = false;
  @Input() ready?: boolean = false;
  @Input() classIcon: string = 'icon icon-xmedium default-cursor icon-hide-show';
  @Input() classTitle!: string;

  @Input() detailsAtFlexEnd?: boolean = false;

  configDropdown: DropDownConfig = {
    labelPlaceHolder: 'รายการ 1',
  };

  public dropdownControl: UntypedFormControl = new UntypedFormControl(0);
  _classInput: string = '';

  @Output() expand = new EventEmitter<any>();
  @Output() dropdownSelect = new EventEmitter<any>();

  nestIteration: number[] = [];
  currentDropdownValue: number = 0;

  ngOnInit() {
    for (let i = 0; i < this.nestLevel; i++) {
      this.nestIteration.push(0);
    }
    this.configDropdown.iconName = this.canShowIcon
      ? this.readyForLitigation && this.readyForNotice
        ? 'icon-Checkmark-Circle-Regular'
        : 'icon-Information'
      : 'N/A';
    this._classInput = this.classInput;
  }

  expandPanel() {
    this.expand.emit();
    this.expanded = !this.expanded;
  }

  dropdownSelected(event: number) {
    this.dropdownSelect.emit(event);
    this.currentDropdownValue = event;
  }

  get allReady() {
    return (
      (!this.forLitigation || this.readyForLitigation) &&
      (!this.forNoticeLetter || this.readyForNotice) &&
      (!this.forAsset || this.readyForAsset) &&
      (!this.forDoc || this.readyForDoc) &&
      (!this.forGeneral || this.ready)
    );
  }
}
