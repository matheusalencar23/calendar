import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CalendarInputComponent } from './calendar-input/calendar-input.component';
import { FormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeBr from '@angular/common/locales/br';

registerLocaleData(localeBr, 'pt-Br');

@NgModule({
  declarations: [AppComponent, CalendarInputComponent],
  imports: [BrowserModule, FormsModule],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt-Br',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
