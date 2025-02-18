import { CommonModule } from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { DetailsHeader } from '@app/modules/auction/auction.const';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleSelectOption, DropDownConfig, SpigCoreModule, SpigShareModule } from '@spig/core';

@Component({
  selector: 'app-preference-header',
  standalone: true,
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    PipesModule,
  ],
  templateUrl: './preference-header.component.html',
  styleUrl: './preference-header.component.scss'
})
export class PreferenceHeaderComponent implements OnInit {
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

  @Input() customBtnTemplate: TemplateRef<any> | null = null;
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
