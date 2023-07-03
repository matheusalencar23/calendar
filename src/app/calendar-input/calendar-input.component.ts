import { formatDate } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-calendar-input',
  templateUrl: './calendar-input.component.html',
  styleUrls: ['./calendar-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalendarInputComponent),
      multi: true,
    },
  ],
})
export class CalendarInputComponent implements ControlValueAccessor {
  protected _value: any = '';
  protected _touched: boolean = false;
  protected _disabled: boolean = false;
  protected _onChange: any = () => {};
  protected _onTouch: any = () => {};

  currentDate!: Date;
  currentMonth!: number;
  currentYear!: number;
  weeks!: Array<Array<Date | null>>;
  opened: boolean = false;
  selectedDate?: Date;
  selectedRangeDate: Date[] = [];
  displayedValue: string = '';
  selectFirstDate: boolean = true;
  temporaryHoveredDate: Date | null = null;

  @Input('range') isRange: boolean = true;
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();

  constructor() {
    this.currentDate = new Date();
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.generateCalendar();
  }

  writeValue(value: any): void {
    console.log(value, typeof value);
    if (!this.isRange) this.selectedDate = value;
    else {
      this.selectedRangeDate = value;
    }
    this._value = value;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  onBlur(): void {
    if (!this._touched) {
      this._onTouch();
      this._touched = true;
    }
    this.blur.emit();
  }

  onFocus(): void {
    this.opened = true;
    this.focus.emit();
  }

  nextMonth(): void {
    if (this.currentMonth < 11) this.currentMonth++;
    else {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }

  previousMonth(): void {
    if (this.currentMonth > 0) this.currentMonth--;
    else {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  generateCalendar(): void {
    this.weeks = [];
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    const numberOfDays = lastDayOfMonth.getDate();
    let currentDay = 1;
    let currentWeek: Array<Date | null> = [];

    currentWeek = new Array(7).fill(null);
    while (currentDay <= numberOfDays) {
      const date = new Date(this.currentYear, this.currentMonth, currentDay);
      currentWeek[date.getDay()] = date;

      if (date.getDay() === 6) {
        this.weeks.push(currentWeek);
        currentWeek = new Array(7).fill(null);
      }
      currentDay++;
    }

    this.weeks.push(currentWeek);
  }

  selectDate(date: Date): void {
    if (!this.isRange) {
      this.selectedDate = date;
      this.displayedValue = this.formatDate(date);
      this.opened = false;
      this._onChange(this.selectedDate);
    } else {
      if (this.selectFirstDate) {
        this.selectedRangeDate = [date];
        this.selectFirstDate = false;
      } else {
        this.selectedRangeDate[1] = date;
        this.selectFirstDate = true;
        if (this.selectedRangeDate[0] > this.selectedRangeDate[1]) {
          this.selectedRangeDate = this.selectedRangeDate.reverse();
        }

        this.opened = false;
      }
      console.log('onchange', this.selectedRangeDate);

      this._onChange(this.selectedRangeDate);
      this.generateDisplayedDateRange();
    }
  }

  changeValue(event: string): void {
    if (
      /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i.test(event)
    ) {
      let [day, month, year] = event.split('/');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      this.selectedDate = date;
      this.currentDate = this.selectedDate;
      this.currentYear = parseInt(year);
      this.currentMonth = parseInt(month) - 1;
      this.generateCalendar();
    }
  }

  hoverDay(date: Date): void {
    console.log(date);
  }

  isSelected(day: Date | null): boolean {
    return !!(
      day &&
      ((this.selectedDate && this.compareDate(day, this.selectedDate)) ||
        (this.selectedRangeDate[0] &&
          this.compareDate(day, this.selectedRangeDate[0])) ||
        (this.selectedRangeDate[1] &&
          this.compareDate(day, this.selectedRangeDate[1])))
    );
  }

  isSecondarySelection(day: Date | null): boolean {
    return !!(
      this.isRange &&
      day &&
      !this.selectedRangeDate[1] &&
      this.temporaryHoveredDate &&
      ((day > this.selectedRangeDate[0] && day < this.temporaryHoveredDate) ||
        (day < this.selectedRangeDate[0] && day > this.temporaryHoveredDate))
    );
  }

  compareDate(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  formatDate(date: Date): string {
    return formatDate(date, 'dd/MM/yyyy', 'pt-Br');
  }

  generateDisplayedDateRange(): void {
    if (this.selectedRangeDate[0]) {
      const firstDate = this.formatDate(this.selectedRangeDate[0]);
      const secondaDate = this.selectedRangeDate[1]
        ? this.formatDate(this.selectedRangeDate[1])
        : '';
      this.displayedValue = `${firstDate} - ${secondaDate}`;
    }
  }
}
