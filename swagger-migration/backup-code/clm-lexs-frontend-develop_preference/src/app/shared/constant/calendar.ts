export interface Day {
  dateNumber: number;
  date: Date;
  events: CalendarEvent[];
  isOfCurrentMonth: boolean;
  isAfterMinDate: boolean;
  isBeforeMaxDate: boolean;
  isToday: boolean;
  cssClass: string;
}
export interface CalendarEvent {
  labelStyle: string;
  text: string;
  date?: Date;
  holiday: boolean;
  holidayName: string;
}
