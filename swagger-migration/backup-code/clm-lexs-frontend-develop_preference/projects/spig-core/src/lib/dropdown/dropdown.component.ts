import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, UntypedFormControl, NgControl, ValidatorFn, Validators } from '@angular/forms';
import { MatOption, MatOptionSelectionChange } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { DropDownConfig } from './dropdown.model';

@Component({
  selector: 'spig-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements ControlValueAccessor, OnInit, OnDestroy {
  public isOpenSearch: boolean = false;
  @ViewChild('inputSearch', { static: false }) inputSearch!: MatInput;

  public transformX: string = '';
  public selectedItem = new UntypedFormControl();
  public selectForm = [] as any;
  public searchInput: string = '';
  public searchKeyup = new Subject<KeyboardEvent>();
  public disableSelect: boolean = false;
  public filteredOptions!: object[];
  public isMultiple: boolean = false;
  public iconName: string = '';
  public optionsList: any[] = this.options || [];
  public labelPlaceHolder!: string;
  public searchPlaceHolder!: string | undefined;
  public disableFloatLabel: boolean = false;
  public searchFilter!: string | null | 'DISABLE_SEARCH';
  public labelSelectAll: string = '';

  public limit = 100;
  public offset = 0;
  public singleWidth!: string;
  public multiWidth!: string;
  public classMaxWidth!: string;
  public classMultiMaxWidth!: string;

  public hasRequired: boolean = false;

  public valueField!: string;
  public displayWith!: string;
  protected searchWith!: string | ((value: object) => boolean);
  protected selectedOptionCallback!: Function;
  protected currentValue!: string | object;

  private controlDirectiveSub!: Subscription | undefined;
  public filterValue = '';
  private lastedSelectOption: string[] = [];
  private defaultValue = '';

  public multiSelected!: string;

  @ViewChild('allSelected') private allSelected!: MatOption;
  @ViewChild('dropdown', { static: false }) private dropdown!: ElementRef;
  @ViewChild('singleSelect') singleSelect!: MatSelect;
  @ViewChild('multiSelect') multiSelect!: MatSelect;

  public _required: boolean = false;
  @Input('required')
  set requiredInput(val: boolean) {
    this._required = val || this._required;
  }

  public _classInput: string = 'input-normal';
  @Input('classInput')
  set classInput(val: string) {
    this._classInput = val || this._classInput;
  }
  public _classIcon: string = 'icon icon-small';
  @Input('classIcon')
  set classIcon(val: string) {
    this._classIcon = val || this._classIcon;
  }

  @Input('config')
  set config(val: DropDownConfig) {
    if (val.enableSearch && val.enableSearch !== 'DISABLE_SEARCH') {
      this.searchFilter = val.enableSearch ? '' : null;
    } else {
      this.searchFilter = ''; // 'DISABLE_SEARCH'
    }
    this.displayWith = val.displayWith || 'text';
    this.valueField = val.valueField || 'value';
    this.searchWith = val.searchWith ? val.searchWith : val.displayWith || 'value';
    this.iconName = val.iconName || '';
    this.disableSelect = val.disableSelect || false;
    this.isMultiple = val.isMultiple || this.isMultiple;
    this.labelPlaceHolder = this.labelPlaceHolder || val.labelPlaceHolder || '';
    this.searchPlaceHolder = val.searchPlaceHolder;
    this.disableFloatLabel = val.disableFloatLabel || this.disableFloatLabel;
    this.labelSelectAll = val.selectAll || 'DROPDOWN.SELECT_ALL';
    this.limit = val.limitItems || this.limit;
    this.defaultValue = val.defaultValue || '';
  }

  /**
   * Inline palceholder and MUST overide labelPlaceHolder from config, inline has more priority;
   */
  @Input('placeholder')
  set placeholder(placeholder: string) {
    if (!placeholder) return;
    this.labelPlaceHolder = placeholder;
  }

  getNewItems() {
    const findSelected = this.lastedSelectOption.find(item => item === this.searchInput);
    this.optionsList = !!this.optionsList?.length ? this.optionsList : [];
    if (this.searchInput === '' || findSelected !== undefined) {
      this.filteredOptions = this.optionsList.slice(0, this.offset + this.limit);
      this.offset += this.limit;
    } else {
      const filterValue = this.searchInput;
      const searchWith = this.searchWith;
      if (!searchWith) {
        this.filteredOptions = this.optionsList
          .filter(option => option[this.valueField].includes(filterValue))
          .slice(0, this.offset + this.limit);
      } else if (typeof searchWith === 'string') {
        const _searchWith = searchWith !== this.valueField ? searchWith : this.valueField;
        this.filteredOptions = this.optionsList
          .filter(option => (option[_searchWith] ? option[_searchWith].includes(filterValue) : null))
          .slice(0, this.offset + this.limit);
      } else {
        this.filteredOptions = this.optionsList.filter(searchWith).slice(0, this.offset + this.limit);
      }
      this.offset += this.limit;
    }
  }

  @Input('options')
  set options(value: any[]) {
    this.optionsList = value;
    if (this.optionsList?.length === 0 || this.optionsList === undefined) {
      this.filteredOptions = [];
    } else {
      if (this.searchFilter !== 'DISABLE_SEARCH' && this.optionsList?.length > 7) {
        this.searchFilter = '';
        this.filteredOptions = this.optionsList;
      } else {
        if (this.searchFilter && this.searchFilter !== null && this.searchFilter !== 'DISABLE_SEARCH') {
          this.filter(this.searchFilter);
        } else {
          this.getNewItems();
        }
      }
    }
    this.updateControlValue();
  }

  @Output('selectedOption')
  selectedOption = new EventEmitter<any>();

  constructor(
    @Self() @Optional() public controlDirective: NgControl,
    private translate: TranslateService
  ) {
    this.controlDirective && (this.controlDirective.valueAccessor = this);
    this.setDefaultConfig();
  }

  /**
   * ControlValueAccessor Function
   */
  onChange: any = () => {};
  onTouch: any = () => {};
  writeValue(obj: any): void {}
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  ngOnInit(): void {
    const validators: ValidatorFn[] = this.controlDirective?.control?.validator
      ? [this.controlDirective?.control?.validator]
      : [];
    this.hasRequired = this.controlDirective?.control?.hasValidator(Validators.required) || false;
    this.controlDirective?.control?.setValidators(validators);
    this.controlDirective?.control?.updateValueAndValidity({ emitEvent: false });
    if (this.controlDirective?.control?.value !== undefined && this.controlDirective?.control?.value !== null) {
      const ctrlValue = this.controlDirective?.control?.value;
      if (!this.isMultiple) {
        const findOptionValue = this.filteredOptions.find((it: any) => it[this.valueField] === ctrlValue);
        this.selectedItem.setValue(findOptionValue);
        if (this.disableSelect && this.selectedItem.enabled) {
          this.selectedItem.disable();
        } else {
          this.selectedItem.enable();
        }
      } else {
        this.setMultiValue(ctrlValue);
      }
      this.selectedItem.updateValueAndValidity();
    }
    this.controlDirectiveSub = this.controlDirective?.valueChanges?.subscribe(value => {
      // clear searchFilter 'N/A' case
      if (value === this.defaultValue) {
        this.searchFilter = '';
        this.searchInput = '';
        this.filter(this.searchFilter);
      }
      // update value when parent have to use control.setValue(...)
      this.updateControlValue();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const ctrlValue = this.controlDirective?.control?.value;
    if (ctrlValue && this.optionsList && this.optionsList.length > 0) {
      const index = this.optionsList.findIndex((it: any) => it[this.valueField] === ctrlValue);
      if (index !== -1 && index > 100) {
        this.filteredOptions = this.optionsList.slice(0, this.offset + index + 1);
      }
    }
  }

  updateControlValue() {
    if (this.disableSelect && this.selectedItem.enabled) {
      this.selectedItem.disable();
    } else {
      this.selectedItem.enable();
    }
    const ctrlValue = this.controlDirective?.control?.value;
    if (!this.isMultiple) {
      const findOptionValue = this.filteredOptions.find((it: any) => it[this.valueField] === ctrlValue);
      this.selectedItem.setValue(findOptionValue);
      this.selectedItem.updateValueAndValidity();
    } else {
      this.setMultiValue(ctrlValue);
    }
  }

  setMultiValue(value: string | any[]) {
    if (value === null) {
      value = [];
    }
    if (Array.isArray(value)) {
      this.selectedItem.setValue([...value]);
      this.selectedItem.updateValueAndValidity();
      this.selectForm = value;
    }
    if (this.allSelected !== undefined && this.selectForm?.length && this.filteredOptions?.length) {
      this.allSelected.selected && this.allSelected.deselect();
      this.selectForm?.length === this.filteredOptions?.length && this.allSelected.select();
    }
  }

  onCloseSelector() {
    // handle search input
    this.isOpenSearch = false;
    if (!this.controlDirective?.control?.touched) {
      this.onTouch();
    }
    if (this.searchFilter !== null && this.searchFilter !== 'DISABLE_SEARCH') this.searchFilter = '';
    if (!this.isMultiple) {
      if (this.searchInput === '') {
        const item = this.filteredOptions.find(i => (i as any)[this.valueField] === this.defaultValue);
        !!item && this.onSelectedChangeCallback(item);
      } else {
        if (
          this.selectedItem.value &&
          this.selectedItem.value[this.valueField] !== '' &&
          this.selectedItem.value[this.valueField] !== this.defaultValue
        ) {
          if (this.searchInput !== '' && this.filteredOptions.length === 0) {
            // case search empty -> reset all
            this.searchInput = '';
            this.onSelectedChangeCallback({});
            this.filteredOptions = this.optionsList;
          } else {
            this.searchInput = this.selectedItem.value[this.displayWith];
          }
        } else {
          this.searchInput = '';
          if (this.filteredOptions.length > 0) {
            if ((this.filteredOptions[0] as any)[this.valueField] === this.defaultValue && !!!this.selectedItem.value) {
              this.onSelectedChangeCallback(this.filteredOptions[0]);
            }
          } else {
            this.filteredOptions = this.optionsList;
          }
        }
      }
    } else {
      if (this.selectForm.length !== 0 || this.selectedItem.value?.length !== 0) {
        this.searchInput = this.lastedSelectOption[0];
      } else {
        this.searchInput = '';
      }
    }
  }

  setDefaultConfig() {
    this.disableSelect = false;
    this.isMultiple = false;
    this.iconName = '';
    this.displayWith = 'text';
    this.valueField = 'value';
    this.searchPlaceHolder = 'DROPDOWN.SEARCH';
  }

  onKeyup() {
    if (this.isMultiple) {
      this.multiSelect.open();
    } else {
      this.singleSelect.open();
    }
  }

  calulateOverlayPosition() {
    const clientRect = this.dropdown.nativeElement.getBoundingClientRect();
    const selectRect = !this.isMultiple
      ? this.singleSelect.panel?.nativeElement.getBoundingClientRect()
      : this.multiSelect.panel?.nativeElement.getBoundingClientRect();
    const cdkOverlay = document.getElementsByClassName('cdk-overlay-pane');
    let indexOverlay = 0;
    if (cdkOverlay.length > 1 && cdkOverlay[0].getElementsByClassName('mat-dialog-container').length > 0) {
      indexOverlay = 1;
    } else {
      indexOverlay = 0;
    }
    const cdkPanelBottom = Number((document.getElementsByClassName('cdk-overlay-pane')[indexOverlay] as HTMLElement)?.style.bottom.replace('px', '' )) || 0;
    console.log("cdkPanelBottom :: ", cdkPanelBottom)
    if (selectRect?.bottom >= clientRect.top && cdkPanelBottom !== 0) {
      (document.getElementsByClassName('cdk-overlay-pane')[indexOverlay] as HTMLElement).style.bottom =
        cdkPanelBottom + (selectRect.bottom - clientRect.top) + 8 + 'px';
    }
    (document.getElementsByClassName('cdk-overlay-pane')[indexOverlay] as HTMLElement).style.paddingTop = '1vh';
    (document.getElementsByClassName('cdk-overlay-pane')[indexOverlay] as HTMLElement).style.paddingBottom = '1vh';
  }

  onClick() {
    if (this.disableSelect) {
      return;
    }
    const clientRect = this.dropdown.nativeElement.getBoundingClientRect();
    const maxWidth = Math.round(clientRect.width);
    if (this.filteredOptions.length > 0) {
      this.calulateTransformX(clientRect);
      this.calulateOverlayPosition();
    }
    // handle search input
    this.isOpenSearch = true;
    if (this.isMultiple) {
      this.multiWidth = maxWidth + 'px';
      this.multiSelect.open();
    } else {
      this.singleWidth = maxWidth + 'px';
      this.singleSelect.open();
    }
    // focus search input
    setTimeout(() => this.inputSearch.focus(), 0);
  }

  calulateTransformX(_clientRect: any) {
    const left = Math.round(_clientRect.left);
    const cdkPanelLeft = Math.round(
      document.getElementsByClassName('cdk-overlay-pane')[0]?.getBoundingClientRect().left
    );
    if (document.getElementsByClassName('cdk-global-overlay-wrapper')?.length > 0) {
      this.transformX = 'transformX-3';
    } else {
      let transformX;
      if (cdkPanelLeft > left) {
        transformX = (cdkPanelLeft - left) * -1;
      } else {
        transformX = left - cdkPanelLeft;
      }
      this.transformX = transformX < 0 ? 'transformX-minus' + transformX : 'transformX-' + transformX;
    }
  }

  listValueFn(value: any) {
    return value[this.valueField];
  }

  valueFn(val: any) {
    if (!val?.length) {
      return;
    } else {
      if (val[0] === 'selectall') {
        let obj: any = val[1];
        this.multiSelected =
          (val?.length === 1 || val?.length === 2) && obj
            ? `${obj[this.displayWith]}`
            : `${obj[this.displayWith]} (+${val?.length - 2})`;
      } else {
        let obj: any = val[0];
        this.multiSelected =
          val?.length === 1 && obj ? `${obj[this.displayWith]}` : `${obj[this.displayWith]} (+${val?.length - 1})`;
      }
    }
  }

  onSelectOption(option: MatOptionSelectionChange): void {
    if (option.isUserInput) {
      if (!option.source.selected) {
        this.lastedSelectOption = this.lastedSelectOption.filter(item => item !== option.source.viewValue);
      } else {
        !!!this.lastedSelectOption.find(item => item === option.source.viewValue) &&
          this.lastedSelectOption.push(option.source.viewValue);
      }
      option.source.value !== 'SEARCH_EVENT' && this.onSelectedChangeCallback(option.source.value);
      const selectedResult = option.source.value[this.displayWith];
      if (selectedResult !== '' && selectedResult !== this.defaultValue) this.searchInput = selectedResult;
    }
    if (!this.selectForm.length && this.multiSelect) this.clearSearchInput();
    this.valueFn(this.selectForm);
  }

  onSelectAllOption() {
    if (this.allSelected.selected) {
      this.selectForm = [];
      let mappingValue: any[] = ['selectall'];
      for (let index = 0; index < this.filteredOptions?.length; index++) {
        const option = this.filteredOptions[index];
        mappingValue.push(option);
      }
      this.selectForm = [...mappingValue];
      this.controlDirective?.control?.setValue(this.selectForm);
      this.selectedItem.setValue(this.selectForm);
      this.selectedOption.emit(this.selectForm);
    } else {
      this.selectedItem.setValue([]);
      this.selectForm = [];
      this.searchInput = '';
      this.controlDirective?.control?.setValue(this.selectForm);
      this.selectedOption.emit(this.selectForm);
    }
    this.valueFn(this.selectForm);
  }

  onSelectedChangeCallback(option: any) {
    if (this.isMultiple) {
      if (this.selectForm?.length === 0) {
        this.selectForm.push(option);
      } else {
        if (!this.selectForm.some((it: any) => it === option)) {
          this.selectForm.push(option);
        } else {
          this.selectForm = this.selectForm.filter((it: any) => it !== option);
        }
      }
      this.controlDirective?.control?.setValue(this.selectForm);
      this.selectedItem.setValue(this.selectForm);
      this.selectedOption.emit(this.selectForm);

      /** select all / deselect all */
      this.allSelected.selected && this.allSelected.deselect();
      this.selectForm?.length === this.filteredOptions?.length && this.allSelected.select();
    } else {
      if (this.valueField !== '') {
        this.controlDirective?.control?.setValue(option[this.valueField]);
        this.selectedItem.setValue(option[this.valueField]);
        this.selectedOption.emit(option[this.valueField]);
      } else {
        this.controlDirective?.control?.setValue({ ...option });
        this.selectedItem.setValue({ ...option });
        this.selectedOption.emit({ ...option });
      }
    }
    this.controlDirective?.control?.updateValueAndValidity();
    this.controlDirective?.control?.markAsDirty();
    this.selectedItem.updateValueAndValidity();
  }
  /*
   * Return search results
   */
  filter(value: string): void {
    this.filterValue = value;
    if (value === '') {
      this.filteredOptions = this.optionsList;
    } else {
      const searchWith = this.searchWith;
      if (!searchWith) {
        this.filteredOptions = this.optionsList.filter(option => option[this.valueField].includes(value));
      } else if (typeof searchWith === 'string') {
        const _searchWith = searchWith !== this.valueField ? searchWith : this.valueField;
        this.filteredOptions = this.optionsList.filter(option =>
          option[_searchWith] ? option[_searchWith].includes(value) : null
        );
      } else {
        this.filteredOptions = this.optionsList.filter(searchWith);
      }
    }
  }

  onSearchInput(value: string) {
    this.filter(value);
  }

  ngOnDestroy() {
    this.controlDirectiveSub?.unsubscribe();
  }

  isEmpty(object: any) {
    if (object) {
      if (Array.isArray(object)) {
        return object.length === 0;
      } else {
        return (this.valueField && object[this.valueField] === this.defaultValue) || object[this.valueField] === '';
      }
    }
    return true;
  }

  trackByIndexValue(index: number, item: any) {
    return `${index}-${item[this.valueField]}`;
  }

  public clearSearchInput(): void {
    this.searchFilter = '';
    this.searchInput = '';
    this.filter(this.searchFilter);
  }

  /**
   * Disable state from form control
   * @param isDisabled
   */
  setDisabledState(isDisabled: boolean = false) {
    this.disableSelect = isDisabled;
  }
}
