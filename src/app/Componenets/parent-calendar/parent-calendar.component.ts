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
  selector: 'app-parent-calendar',
  standalone: true,
  imports: [CalendarModule, CommonModule],
  providers: [
    CalendarUtils,
    CalendarA11y,
    CalendarDateFormatter,
    CalendarEventTitleFormatter,
  ],
  templateUrl: './parent-calendar.component.html',
  styleUrl: './parent-calendar.component.css',
})
export class ParentCalendarComponent implements OnInit {
  student_data: any;
  Parent_id: any;

  viewDate: Date = new Date();
  select_student_id: string = '';
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
  ) {
    if (localStorage.getItem('token') != null) {
      this.Parent_id = this.myservce.getUserId();
    }
  }
  ngOnInit(): void {
    this.generateDays();

    this.cal_service.getStudentname(this.Parent_id).subscribe({
      next: (data) => {
        this.student_data = data;
      },
      error: (err) => {
        console.error(err);
      },
    });
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
        events: this.getEventsForDate(currentDate),
      });
    }
  }

  getEventsForCurrentMonth() {
    this.cal_service
      .get_student_data(this.select_student_id, this.month, this.year)
      .subscribe({
        next: (data: any) => {
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
                session_name: event.session_name,
              },
            } as CalendarEvent;
          });
          this.generateDays();
        },
        error: (err) => {
          console.error('Error fetching events:', err);
        },
      });
  }

  getEventsForDate(date: Date): CalendarEvent[] {
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

  //to take id student that parent select it
  onStudentChange(event: any) {
    this.select_student_id = event.target.value;
    this.getEventsForCurrentMonth();
  }
}
