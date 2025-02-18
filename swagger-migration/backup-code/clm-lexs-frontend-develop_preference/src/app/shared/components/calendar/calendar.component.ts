import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { CalendarEvent, Day } from '@app/shared/constant/calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  // example events
  // {
  //   'Sat Aug 19 2023': [{
  //     labelStyle: 'status-pending',
  //     text: 'จำนวนรายการที่นัดเข้ามา 6/11'
  //   }],
  //   'Fri Aug 18 2023': [{
  //     labelStyle: 'status-success',
  //     text: 'จำนวนรายการที่นัดเข้ามา 0/11'
  //   }]
  // }

  // month: 0 - 11
  @Input() month: number = new Date().getMonth();
  @Input() year: number = new Date().getFullYear();
  @Input() selectedDate: Date | undefined = undefined;
  @Input() set events(val: { [key: string]: Array<CalendarEvent> }) {
    this._events = val;
    this.initDayRows();
  }
  @Input() minDate: Date | undefined = undefined;
  @Input() maxDate: Date | undefined = undefined;

  private _events!: { [key: string]: Array<CalendarEvent> };
  @Output() selection = new EventEmitter<Date>();
  @Output() monthChange = new EventEmitter<string>();

  private days: Array<Day> = [];
  public rows: Array<Array<Day>> = [];
  public monthControl: UntypedFormControl = new UntypedFormControl(new Date());
  constructor() {}

  initDayRows() {
    if (this.minDate) this.minDate.setHours(0, 0, 0, 0);
    if (this.maxDate) this.maxDate.setHours(23, 59, 59, 999);

    this.days = [];
    this.rows = [];
    const today = new Date();
    const firstDayOfMonth = new Date(this.year, this.month, 1);
    const lastDayOfLastMonth = new Date(this.year, this.month, 0);
    const lastDayOfCurrentMonth = new Date(this.year, this.month + 1, 0);

    const lastDayOfMonthNumber = lastDayOfCurrentMonth.getDate();
    const lastDayOfLastMonthNumber = lastDayOfLastMonth.getDate();

    // 6 = sat, 0 = sun
    const dowFirstDayOfMonth = firstDayOfMonth.getDay();
    const dowLastDayOfMonth = lastDayOfCurrentMonth.getDay();

    // fill in first row of days of the previous month
    const firstRow = [];
    for (let i = dowFirstDayOfMonth - 1; i >= 0; i--) {
      let date =
        this.month === 0
          ? new Date(this.year - 1, 11, lastDayOfLastMonthNumber - i)
          : new Date(this.year, this.month - 1, lastDayOfLastMonthNumber - i);
      firstRow.push({
        dateNumber: lastDayOfLastMonthNumber - i,
        date: date,
        events: this._events[date.toDateString()],
        isOfCurrentMonth: false,
        isAfterMinDate: this.minDate ? date >= this.minDate || date === this.minDate : true,
        isBeforeMaxDate: this.maxDate ? date <= this.maxDate || date === this.maxDate : true,
        isToday: today.toDateString() === date.toDateString(),
        cssClass: this.getCssClass(this._events[date.toDateString()]),
      });
    }

    this.days = [...firstRow];

    for (let i = 0; i < lastDayOfMonthNumber; i++) {
      const date = new Date(this.year, this.month, i + 1);
      this.days.push({
        dateNumber: i + 1,
        date: date,
        events: this._events[date.toDateString()],
        isOfCurrentMonth: true,
        isAfterMinDate: this.minDate ? date >= this.minDate || date === this.minDate : true,
        isBeforeMaxDate: this.maxDate ? date <= this.maxDate || date === this.maxDate : true,
        isToday: today.toDateString() === date.toDateString(),
        cssClass: this.getCssClass(this._events[date.toDateString()]),
      });
    }

    // fill last row with days of the next month
    for (let i = 0; i < 6 - dowLastDayOfMonth; i++) {
      let date = this.month === 11 ? new Date(this.year + 1, 0, i + 1) : new Date(this.year, this.month + 1, i + 1);
      this.days.push({
        dateNumber: i + 1,
        date: date,
        events: this._events[date.toDateString()],
        isOfCurrentMonth: false,
        isAfterMinDate: this.minDate ? date >= this.minDate || date === this.minDate : true,
        isBeforeMaxDate: this.maxDate ? date <= this.maxDate || date === this.maxDate : true,
        isToday: today.toDateString() === date.toDateString(),
        cssClass: this.getCssClass(this._events[date.toDateString()]),
      });
    }

    // separate days into rows
    let currentRow = -1;
    for (let i = 0; i < this.days.length; i++) {
      if (i % 7 === 0 || i === 0) {
        this.rows.push([this.days[i]]);
        currentRow++;
      } else {
        this.rows[currentRow].push(this.days[i]);
      }
    }
  }

  getCssClass(events: Array<CalendarEvent>) {
    if (events?.some(s => s.holiday)) {
      return 'holiday';
    } else {
      return '';
    }
  }

  onDateSelect(date: Date) {
    this.selectedDate = date;
    this.selection.emit(date);

    if (date.getMonth() !== this.month) {
      this.month = date.getMonth();
      this.year = date.getFullYear();
      this.monthControl.setValue(date);
      this.initDayRows();
    }

    console.log('onDateSelect :: ', this.selectedDate.toDateString());
  }

  onMonthChange(date: Date) {
    this.month = date.getMonth();
    this.year = date.getFullYear();
    this.initDayRows();
    const month = ('0' + (this.month + 1)).slice(-2);
    this.monthChange.emit(month + '' + this.year);
  }

  goToToday() {
    this.month = new Date().getMonth();
    this.year = new Date().getFullYear();
    this.selectedDate = new Date();
    this.monthControl.setValue(new Date());
    this.selection.emit(this.selectedDate);
    this.initDayRows();
  }

  isDateEqual(day1: Date | undefined, day2: Date | undefined) {
    if (!day1 || !day2) return false;
    return (
      day1.getDate() === day2.getDate() &&
      day1.getMonth() === day2.getMonth() &&
      day1.getFullYear() === day2.getFullYear()
    );
  }
}
