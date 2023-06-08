import { formatDate } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-calendar-input',
  templateUrl: './calendar-input.component.html',
  styleUrls: ['./calendar-input.component.scss'],
})
export class CalendarInputComponent {
  currentDate!: Date;
  currentMonth!: number;
  currentYear!: number;
  weeks!: Array<Array<Date | null>>;
  opened: boolean = false;
  selectedDate?: Date;
  displayedDate: string = '';
  isRange: boolean = false;

  constructor(private elRef: ElementRef) {
    this.currentDate = new Date();
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.generateCalendar();
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

  selectDate(date: Date | null): void {
    if (date) {
      this.selectedDate = date;
      this.displayedDate = formatDate(date, 'dd/MM/yyyy', 'pt-Br');
    }
    this.opened = false;
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
}
