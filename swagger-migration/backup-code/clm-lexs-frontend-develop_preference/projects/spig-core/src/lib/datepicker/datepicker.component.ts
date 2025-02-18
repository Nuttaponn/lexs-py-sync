import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Injectable,
  Input,
  LOCALE_ID,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, UntypedFormControl, NgControl, ValidatorFn, Validators } from '@angular/forms';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  constructor(@Inject(LOCALE_ID) public override locale: string) {
    super(locale);
  }

  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.indexOf('/') > -1) {
      const str = value.split('/');
      const year = str[2];
      const month = str[1];
      const date = str[0];
      if (year === '' || year?.length !== 4 || month === '' || date === '') {
        return null;
      } else {
        return new Date(Number(year), Number(month) - 1, Number(date));
      }
    }
    return null;
  }

  override format(date: Date, displayFormat: Object): string {
    // override date format with DD/MM/YYYY
    const arrDate = date.toLocaleDateString(this.locale).split('/');
    return `${this._to2digit(arrDate[0])}/${this._to2digit(arrDate[1])}/${arrDate[2]}`;
  }

  private _to2digit(n: number | string) {
    return ('00' + n).slice(-2);
  }
}

@Component({
  selector: 'spig-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: LOCALE_ID, useValue: 'th-TH' },
  ],
})
export class DatepickerComponent implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {
  @ViewChild('picker') picker!: MatDatepicker<Date>;
  @ViewChild('datePickerInput') datePickerInput!: ElementRef;

  @Input() prefixIcon!: string;
  @Input() suffixIcon: string = 'icon-Date';
  @Input() startView = ['year', 'month', 'date'];
  @Input() isEndMonth = false;

  public dateControl: UntypedFormControl = new UntypedFormControl();
  public title: string = '';
  public _max: Date | null = null;
  public _min: Date | null = null;
  public captionText: string = '';
  private dateLocale = 'en-GB';

  public _classInput: string = '';
  @Input('classInput')
  set classInput(val: string) {
    this._classInput = val || this._classInput;
  }

  @Input('label')
  set label(value: string) {
    this.title = value;
  }
  @Input() placeholder!: string;
  @Input('caption')
  set caption(value: string) {
    this.captionText = value;
  }

  @Input('max')
  set max(value: Date | null) {
    this._max = value;
  }
  @Input('min')
  set min(value: Date | null) {
    this._min = value;
  }

  @Input('disabled') set disableControl(condition: boolean) {
    condition ? this.dateControl.disable() : this.dateControl.enable();
  }

  _readOnly: boolean = false;
  @Input('readOnly') set readOnly(condition: boolean) {
    this._readOnly = condition;
  }

  private _defaultDate!: Date | string;
  @Input('defaultDate')
  set defaultDate(val: Date | string) {
    this._defaultDate = val;
  }

  @Output('inputChange')
  inputChange = new EventEmitter<any>();
  dateSelectChange = new EventEmitter<any>();

  get dateCtrlTouched() {
    return this.dateControl?.touched || false;
  }

  get dateCtrlInvalid() {
    return this.dateControl?.invalid || false;
  }

  get touched() {
    return this.controlDirective?.control?.touched || false;
  }

  get invalid() {
    return this.controlDirective?.control?.invalid || false;
  }
  public _required: boolean = false;
  public hasRequired: boolean = false;
  private controlDirectiveSub!: Subscription | undefined;

  @Input('required')
  set requiredInput(val: boolean) {
    this._required = val || this._required;
  }

  constructor(
    @Self() @Optional() public controlDirective: NgControl,
    private translate: TranslateService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.controlDirective && (this.controlDirective.valueAccessor = this);
    this.dateLocale = (this.translate.currentLang || this.translate.defaultLang) !== 'th' ? 'en-GB' : 'th-TH';
    this.dateAdapter.setLocale(this.dateLocale);
  }

  /**
   * ControlValueAccessor Function
   */
  onChange: any = () => {};
  onTouch: any = () => {};
  writeValue(date: Date | string): void {
    if (!date) {
      return;
    }
    this.dateControl.setValue(date);
  }

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
    this.dateControl.setValidators(validators);
    this.dateControl.updateValueAndValidity({ emitEvent: false });

    this.controlDirectiveSub = this.controlDirective?.valueChanges?.subscribe(value => {
      if (value === null) {
        this.dateControl.reset();
        this.dateControl.clearValidators();
        this.dateControl.setValidators(this.controlDirective?.control?.validator || []);
        this.dateControl.updateValueAndValidity({ emitEvent: false });
      }
    });

    if (this._defaultDate) {
      this.writeValue(this._defaultDate);
    }

    /** Sets max to last second of day and min to first second of day.
     * This is to avoid validation fails whenever the user uses the application
     * before 7AM (if that's what they want).
     */
    if (this._max && (this._max instanceof Date)) this._max.setHours(23, 59, 59, 999);
    if (this._min && (this._min instanceof Date)) this._min.setHours(0, 0, 0, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultDate'] && changes['defaultDate']?.currentValue) {
      this.writeValue(changes['defaultDate']?.currentValue);
    }
  }

  ngOnDestroy() {
    this.controlDirectiveSub?.unsubscribe();
  }

  monthSelected(e: Date) {
    if (!this.startView.includes('date')) {
      this.onInputDate(e);
      this.onTouch();
      this.picker.close();
    }
  }

  dateInput(e: MatDatepickerInputEvent<Date>) {
    e.value && this.onInputDate(e.value);
  }

  onCopy(e: any) {
    e.preventDefault();
    return;
  }

  onInputDate(date: Date) {
    const offset = new Date().getTimezoneOffset();
    let plainText = '';
    if (date) {
      const dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      const mm = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
      const yyyy = date.getFullYear();
      plainText = `${mm}/${dd}/${yyyy}`;
    }
    const _date = Date.parse(plainText) - offset * 60 * 1000;
    let _dateISO = new Date(_date);
    if (this.isEndMonth) {
      _dateISO = new Date(_dateISO.setMonth(_dateISO.getMonth() + 1));
      _dateISO = new Date(_dateISO.setDate(_dateISO.getDate() - 1));
    }
    this.controlDirective?.control?.setValue(_dateISO);
    this.controlDirective?.control?.markAsDirty();
    const _dateISONoTime = this.getDateNoTime(_dateISO);

    const _maxNoTime: Date | null = this._max ? this.getDateNoTime(this._max) : null;
    const _minNoTime: Date | null = this._min ? this.getDateNoTime(this._min) : null;
    if(_maxNoTime && _dateISONoTime > _maxNoTime){
      this.controlDirective?.control?.setErrors({ max: true });
    }
    if(_minNoTime && _dateISONoTime < _minNoTime){
      this.controlDirective?.control?.setErrors({ min: true });
    }
    if (this._required && plainText == '') {
      this.controlDirective?.control?.setErrors({ required: true });
    }
    this.inputChange.emit(_dateISO);
  }

  private getDateNoTime(date: Date) {
    //fix error getFullYear() is not function
    const dateNew = new Date(date);

    return new Date(dateNew.getFullYear(),dateNew.getMonth(),dateNew.getDate())
  }

  datePaste(event: ClipboardEvent) {
    return;
    // const dateString = event.clipboardData?.getData('text');
    // if (dateString) {
    //   const dateParts = dateString.split('/');
    //   const date = new Date(
    //     +dateParts[2],
    //     +dateParts[1] - 1,
    //     +dateParts[0]
    //   );
    //   this.controlDirective?.control?.setValue(date);
    //   this.onChange(date);
    //   event.preventDefault();
    //   if (this._max && date > this._max) {
    //     this.controlDirective?.control?.setErrors({ max: true })
    //   }
    // }
  }

  onPickerClose() {
    this.onTouch();
  }

  /**
   * Disable state from form control
   * @param isDisabled
   */
  setDisabledState(isDisabled: boolean = false) {
    isDisabled ? this.dateControl.disable() : this.dateControl.enable();
  }
}
