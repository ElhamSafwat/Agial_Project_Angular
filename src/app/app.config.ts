import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './Services/auth-interceptor.service';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
//using calendar
import {
  CalendarModule,
  CalendarUtils,
  DateAdapter,
  CalendarA11y,
  CalendarDateFormatter,
  CalendarEventTitleFormatter,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    //to send header in token
    provideHttpClient(withInterceptors([AuthInterceptor])),
    { provide: DateAdapter, useFactory: adapterFactory },
    // CalendarModule,
    CalendarUtils,
    CalendarA11y,
    CalendarDateFormatter,
    CalendarEventTitleFormatter,
  ],
};
