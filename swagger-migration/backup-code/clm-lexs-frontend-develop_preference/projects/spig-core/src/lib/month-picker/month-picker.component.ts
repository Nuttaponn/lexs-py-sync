import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Injectable,
  Input,
  LOCALE_ID,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, ValidationErrors } from '@angular/forms';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { MatCalendarView, MatDatepicker } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: { month: 'short', year: 'numeric' },
  },
  display: {
    dateInput: 'input-custom',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  constructor(@Inject(LOCALE_ID) public override locale: string) {
    super(locale);
  }

  override format(date: Date, displayFormat: Object): string {
    return this._customFormat(date);
  }

  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.indexOf('/') > -1) {
      const str = value.split('/');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      return new Date(year, month, date);
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  private _customFormat(date: Date): string {
    let month = date.toLocaleString(this.locale, { month: 'long' });
    let year = date.getFullYear();
    return `${month} ${year + 543}`;
  }
}

@Component({
  selector: 'spig-month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: LOCALE_ID, useValue: 'th-TH' },
  ],
})
export class MonthPickerComponent implements OnInit, AfterViewInit {
  @ViewChild('datepicker') picker!: MatDatepicker<Date>;

  // for binding FormControl
  @Input() control!: UntypedFormControl;

  // for disable datetime picker
  @Input() public isDisabled = false;

  // for insert default date
  @Input() initialDate: Date = new Date();

  // for minimum date that can selected
  @Input() minDate: Date | undefined;
  // start of the month of the min date
  @Input() public minStartOfMonth: Date | undefined;

  // for maximum date that can selected
  @Input() maxDate: Date | undefined;
  // end of the month of the max date
  @Input() public maxEndOfMonth: Date | undefined;

  @Input() readonly: boolean = false;

  @Input() placeholder: string = '';

  @Output() inputChange = new EventEmitter<Date>();

  @Output() validatorError = new EventEmitter<ValidationErrors | null>();

  private dateSelected: boolean = false

  public dateControl = new UntypedFormControl();

  // set the start view of date picker;
  public startView: 'year' | 'multi-year' = 'year';

  public strValue: string = new Date().toISOString();

  constructor(
    private translate: TranslateService,
    private dateAdapter: DateAdapter<Date>,
    private cdRef: ChangeDetectorRef
  ) {
    this.dateAdapter.setLocale('th-TH-u-ca-bhuddist');
  }

  ngOnInit(): void {
    this.minStartOfMonth = this.minDate ? new Date(this.minDate?.getFullYear(), this.minDate?.getMonth(), 1) : undefined
    this.maxEndOfMonth = this.maxDate ? new Date(this.maxDate?.getFullYear(), this.maxDate?.getMonth() + 1, 0) : undefined

    if (this.control.value && Object.prototype.toString.call(this.control.value) !== '[object Date]') {
      const arrDateStr = this.control.value.split(' ');
      this.strValue = `${arrDateStr[0]} ${new Date(this.control.value).toLocaleString(
        this.translate.instant('DATE_LOCALE'),
        { month: 'short' }
      )} ${arrDateStr[2]}`;
      this.placeholder = '';
      this.dateControl = new UntypedFormControl();
    } else {
      this.dateControl = this.control || new UntypedFormControl(this.initialDate);
      this.handleDateChange(this.dateControl.value);
    }
    this.dateControl.statusChanges.subscribe(status => {
      status === 'INVALID' ? this.validatorError.emit(this.dateControl.errors) : this.validatorError.emit(null);
    });
    this.translate.onLangChange.subscribe(value => {
      this.dateAdapter.setLocale('th-TH-u-ca-bhuddist');
    });
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  handleDateChange(_date: Date) {
    this.strValue = _date?.toISOString() || '';
    this.inputChange.emit(_date || new Date());
    this.control.setValue(_date);
  }

  handleMonthSelect(_date: Event) {
    this.dateSelected = true
    this.handleDateChange(new Date(_date as unknown as string));
    this.picker.close();
  }

  openPicker() {
    this.dateSelected = false
    this.picker.open()
  }

  onViewChanged(event: MatCalendarView) {
    if (event === 'month') {
      if (!this.dateSelected) {
        this.picker.startView = 'multi-year'
        this.picker.close()
        setTimeout(() => this.picker.open(), 1)
      }
    } else {
      this.picker.startView = 'year'
    }
  }
}
