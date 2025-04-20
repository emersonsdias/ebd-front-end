import { Component, Input } from '@angular/core';
import { AttendanceDTO, LessonDTO, LessonStatus } from '../../../../../models/api/data-contracts';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { ROUTES_KEYS } from '../../../../../../shared/config/routes-keys.config';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../../services/auth/auth.service';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { Utils } from '../../../../../../shared';

@Component({
  selector: 'app-lesson-card',
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatDividerModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './lesson-card.component.html',
  styleUrl: './lesson-card.component.scss'
})
export class LessonCardComponent {

  @Input({ required: true }) lesson!: LessonDTO

  isAdmin: Observable<boolean>
  ROUTES_KEYS = ROUTES_KEYS

  constructor(
    _authService: AuthService,
  ) {
    this.isAdmin = _authService.isAdmin()
  }

  countPresentStudents(attendances: AttendanceDTO[] | undefined): number {
    if (!attendances) {
      return 0
    }
    return attendances.filter(a => a.present).length
  }

  countAbsentStudents(attendances: AttendanceDTO[] | undefined): number {
    if (!attendances) {
      return 0
    }
    return attendances.filter(a => !a.present).length
  }

  getIconByLessonStatus(lesson: LessonDTO): {name?: string, classCss?: string} {
    switch (lesson.status) {
      case LessonStatus.OPEN_ANY_DAY:
        return { name: 'lock_open', classCss: 'text-primary'}
      case LessonStatus.OPEN_SAME_DAY:
        if (this.isTodayLesson(lesson)) {
          return { name: 'edit_calendar', classCss: 'text-primary'}
        } else {
          return { name: 'event_busy', classCss: this.isPastLesson(lesson) ? 'text-warning' : '' }
        }
      case LessonStatus.CLOSED:
        return { name: 'lock', classCss: 'text-danger'}
      case LessonStatus.FINALIZED:
        return { name: 'task_alt', classCss: 'text-success'}
      default:
        return {}
    }
  }

  isTodayLesson(lesson: LessonDTO): boolean {
    return Utils.isToday(lesson.date)
  }

  isPastLesson(lessson: LessonDTO): boolean {
    return Utils.isPast(lessson.date)
  }

}
