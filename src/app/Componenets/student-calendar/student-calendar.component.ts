import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  CalendarModule,
  CalendarEvent,
  CalendarUtils,
  CalendarA11y,
  CalendarDateFormatter,
  CalendarEventTitleFormatter,
} from 'angular-calendar';
import {
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isToday,
} from 'date-fns';
import { TokenService } from '../../Services/token-service.service';
import { CalendarTeacherService } from '../../Services/calendar-teacher.service';

interface CustomCalendarEvent {
  session_name: string;
  room: string;
  start: number;

  period: string;
  date: string; // نستخدم هذا كـ تاريخ الحدث
  color?: { primary: string; secondary: string };
}

@Component({
  selector: 'app-student-calendar',
  standalone: true,
  imports: [CalendarModule, CommonModule],
  providers: [
    CalendarUtils,
    CalendarA11y,
    CalendarDateFormatter,
    CalendarEventTitleFormatter,
  ],
  templateUrl: './student-calendar.component.html',
  styleUrl: './student-calendar.component.css',
})
export class StudentCalendarComponent implements OnInit {
  myclams: any;
  viewDate: Date = new Date();
  user_id: string = '';
  month: number = this.viewDate.getMonth() + 1;
  year: number = this.viewDate.getFullYear();
  days: Array<{
    date: Date;
    isToday: boolean;
    isInMonth: boolean;
    events: CalendarEvent[];
  }> = [];
  events: CalendarEvent[] = []; // مصفوفة الأحداث
  private getRandomColor(): { primary: string; secondary: string } {
    const getRandomValue = () => Math.floor(Math.random() * 256);
    const randomColor = `rgb(${getRandomValue()}, ${getRandomValue()}, ${getRandomValue()})`;
    const secondaryColor = `rgba(${getRandomValue()}, ${getRandomValue()}, ${getRandomValue()}, 0.5)`;
    return { primary: randomColor, secondary: secondaryColor };
  }

  constructor(
    private myservce: TokenService,
    private cal_service: CalendarTeacherService
  ) {}

  ngOnInit() {
    this.generateDays();
    this.getEventsForCurrentMonth(); // جلب الأحداث عند تحميل المكون
  }

  generateDays() {
    const start = startOfWeek(startOfMonth(this.viewDate));
    const end = endOfWeek(endOfMonth(this.viewDate));
    this.days = [];

    for (
      let currentDate = start;
      currentDate <= end;
      currentDate = addDays(currentDate, 1)
    ) {
      this.days.push({
        date: currentDate,
        isToday: isToday(currentDate),
        isInMonth: isSameMonth(currentDate, this.viewDate),
        events: this.getEventsForDate(currentDate), // الحصول على الأحداث لهذا اليوم
      });
    }
  }

  getEventsForCurrentMonth() {
    this.myclams = this.myservce.getTokenClaims();
    this.user_id =
      this.myclams?.[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ];

    this.cal_service
      .get_student_data(this.user_id, this.month, this.year)
      .subscribe({
        next: (data: any) => {
          // استخدم any إذا كنت تواجه مشكلة في الأنواع
          console.log('Fetched events:', data);
          this.events = data.map((event: CustomCalendarEvent) => {
            const eventDate = new Date(event.date);
            const eventColor = this.getRandomColor();
            return {
              start: eventDate,
              end: eventDate,
              title: `${event.session_name} - ${event.period}`,
              color: eventColor,
              meta: {
                room: event.room,
                start: event.start,

                period: event.period,
                session_name: event.session_name, // إضافة class_name إلى الـ meta
              },
            } as CalendarEvent;
          });
          this.generateDays(); // تحديث الأيام بعد تحميل الأحداث
        },
        error: (err) => {
          console.error('Error fetching events:', err);
        },
      });
  }

  getEventsForDate(date: Date): CalendarEvent[] {
    // تصفية الأحداث بناءً على التاريخ
    return this.events.filter(
      (event) => event.start.toDateString() === date.toDateString()
    );
  }

  changeMonth(amount: number) {
    this.viewDate = addMonths(this.viewDate, amount);
    this.month = this.viewDate.getMonth() + 1;
    this.year = this.viewDate.getFullYear();
    this.getEventsForCurrentMonth();
    this.generateDays();
  }
}
