import { AttendanceDTO, LessonDTO } from '../../../../models/api/data-contracts';
import { AuthService } from '../../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LessonService } from '../../../../services/lesson/lesson.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { ROUTES_KEYS } from '../../../../../shared/config/routes-keys.config';

@Component({
  selector: 'app-lessons-page',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RouterModule,
  ],
  templateUrl: './lessons-page.component.html',
  styleUrl: './lessons-page.component.scss'
})
export class LessonsPageComponent implements OnInit {

  ROUTES_KEYS = ROUTES_KEYS
  lessons: LessonDTO[] = []
  isAdmin: Observable<boolean>
  maxDate = new Date

  constructor(
    _authService: AuthService,
    private _lessonService: LessonService,
  ) {
    this.isAdmin = _authService.isAdmin()
  }

  async ngOnInit(): Promise<void> {
    this._lessonService.findByOptions({ maxRecentLessons: 100 }).subscribe({
      next: lessonsReponse => this.lessons = lessonsReponse
    })
  }

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
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

  findLessonsByPeriod(startDate: string, endDate: string) {
    if (!endDate) {
      endDate = startDate
    }
    this._lessonService.findByOptions({ startDate: startDate, endDate: endDate }).subscribe({
      next: lessonsReponse => this.lessons = lessonsReponse
    })
  }
}
