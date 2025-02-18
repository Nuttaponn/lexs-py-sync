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
import { ControlValueAccessor, UntypedFormControl, NgControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { distinctUntilChanged, map, Subject } from 'rxjs';
import { SearchComboBoxConfig } from './search-combo-box.model';

@Component({
  selector: 'spig-search-combo-box',
  templateUrl: './search-combo-box.component.html',
  styleUrls: ['./search-combo-box.component.scss'],
})
export class SearchComboBoxComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @ViewChild('searchbox', { static: false }) searchbox!: ElementRef;

  public searchInput = '';
  public searchKeyup = new Subject<KeyboardEvent>();

  public isOpen = false;
  public filteredOptions: object[] = [];

  // for sizing
  public itemViewSize = 50;
  public dropdownSize!: number;
  public dropdownWidthSize!: number;
  public dropdownLeftPx!: number;

  public labelPlaceHolder!: string;
  public searchPlaceHolder!: string;
  public icon!: string[];

  protected optionsList: object[] = this.options;
  protected valueField = '';
  protected displayWith!: string | ((value: any) => string);
  protected listWith!: string | ((value: object) => string);

  set value(val: string) {
    if (val !== undefined) {
      this.onChange(val);
      this.onTouch(val);
    }
  }

  get value() {
    return this.value;
  }

  @Input('config')
  set config(val: SearchComboBoxConfig) {
    this.icon = val.icon || ['icon-Search'];
    this.listWith = val.listWith || 'text';
    this.displayWith = val.displayWith || 'text';
    this.valueField = val.valueField || 'value';
    this.labelPlaceHolder = val.labelPlaceHolder || '';
    this.searchPlaceHolder = val.searchPlaceHolder || '';
  }

  @Input('options')
  set options(value: any[]) {
    this.optionsList = value;
    this.filteredOptions = this.optionsList;
    this.filteredOptions.length > 0 && this.handleDropdownSize();
  }

  @Input() resultControl!: UntypedFormControl;
  @Input() resultInvalid: boolean = false;

  @Output('selectedOption')
  selectedOption = new EventEmitter<Object>();

  @Output('onClick')
  clickIcon = new EventEmitter<Event>();

  @Output('onBlur')
  blur = new EventEmitter<Event>();

  constructor(@Self() @Optional() public controlDirective: NgControl) {
    this.controlDirective && (this.controlDirective.valueAccessor = this);
    this.setDefaultConfig();
  }

  get _touched() {
    return this.controlDirective?.control?.touched || false;
  }

  get _invalid() {
    return this.controlDirective?.control?.invalid || false;
  }

  get _resultTouched() {
    return this.resultControl?.touched || false;
  }

  get _resultInvalid() {
    return this.resultControl?.invalid || false;
  }

  ngOnInit(): void {
    this.searchKeyup
      .pipe(
        map(event => (event.target as HTMLInputElement).value),
        distinctUntilChanged()
      )
      .subscribe(text => {
        this.value = this.searchInput;
        this.controlDirective?.control?.markAsDirty();
      });
    if (this.controlDirective?.control?.value) {
      const ctrlValue = this.controlDirective?.control?.value;
      this.searchInput = ctrlValue;
      this.value = this.searchInput;
    }
  }

  ngOnChange(changes: SimpleChanges) {
    // replace value options chagned
    if (changes['options']) {
      this.optionsList = [...changes['options'].currentValue];
      this.filteredOptions = [...changes['options'].currentValue];
    }
  }

  ngAfterViewInit(): void {
    const _clientRect = this.searchbox?.nativeElement?.getBoundingClientRect();
    this.dropdownWidthSize = _clientRect?.width || 0;
    this.dropdownLeftPx = _clientRect?.left || 0;
  }

  ngOnDestroy(): void {
    this.searchKeyup.unsubscribe();
  }

  /**
   * ControlValueAccessor Function
   */
  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(obj: any): void {
    if (obj && typeof obj === 'string') {
      this.searchInput = obj;
    } else {
      const value = this.listFn(obj);
      this.onChange(value);
      this.searchInput = value;
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  /**
   * Calulate Size Dropdown
   */
  handleDropdownSize() {
    if (this.optionsList.length === 1) {
      const padTopBottom = 24,
        wordPerLine = 22,
        textHeight = 22;
      const text = Array.isArray(this.optionsList) ? this.listFn(this.optionsList[0]) : '';
      const estimateHeight = textHeight * Math.floor(text.length / wordPerLine) + padTopBottom;
      this.dropdownSize = text.length > wordPerLine ? estimateHeight : 48;
    } else if (this.optionsList.length < this.itemViewSize) {
      const length = this.optionsList.length > 0 ? this.optionsList.length : 5;
      this.dropdownSize = length > 0 ? 48 * length : 240;
    } else if (this.optionsList.length >= this.itemViewSize) {
      this.dropdownSize = 240;
    }
  }

  /**
   * Combo Box Function
   */
  setDefaultConfig() {
    this.listWith = 'text';
    this.displayWith = 'text';
    this.valueField = 'value';
    this.labelPlaceHolder = '';
    this.searchPlaceHolder = 'Please specify';
  }

  listFn(value: any) {
    if (typeof this.listWith === 'string') {
      return value ? value[this.listWith] : '';
    } else {
      return this.listWith(value);
    }
  }

  toggleOpen(event?: Event) {
    this.clickIcon.emit(event);
    this.isOpen = !this.isOpen;
  }

  /*
   * Handle option select event
   */
  onSelectOption(option: MatOptionSelectionChange): void {
    if (option.isUserInput) {
      this.isOpen = false;
      option.source.deselect();
      this.onSelectedChangeCallback(option.source.value);
      this.writeValue(option.source.value);
    }
  }

  onSelectedChangeCallback(option: object) {
    this.selectedOption.emit({ ...option });
  }

  onBlur(event: any) {
    this.blur.emit(event);
  }
}
