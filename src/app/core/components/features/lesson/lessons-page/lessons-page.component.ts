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
import { firstValueFrom, Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { ROUTES_KEYS } from '../../../../../shared/config/routes-keys.config';
import { LessonCardComponent } from "./lesson-card/lesson-card.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lessons-page',
  imports: [
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RouterModule,
    LessonCardComponent,
  ],
  templateUrl: './lessons-page.component.html',
  styleUrl: './lessons-page.component.scss'
})
export class LessonsPageComponent implements OnInit {

  ROUTES_KEYS = ROUTES_KEYS
  lessons: LessonDTO[] = []
  isAdmin: Observable<boolean>

  startDate: Date | undefined
  endDate: Date | undefined

  upcomingLessons: LessonDTO[] = []
  pastLessons: LessonDTO[] = []

  constructor(
    _authService: AuthService,
    private _lessonService: LessonService,
  ) {
    this.isAdmin = _authService.isAdmin()
  }

  async ngOnInit(): Promise<void> {
    this.lessons = (await firstValueFrom(this._lessonService.findByOptions({ maxRecentLessons: 100 }))).sort(this._sortLessons())
    this.splitLessonsByDate(this.lessons)
  }

  private _sortLessons() {
    return (a: LessonDTO, b: LessonDTO) => {
      if (a.active === b.active) {
        const dateA = new Date(a?.date || '')
        const dateB = new Date(b?.date || '')
        return dateB.getTime() - dateA.getTime();
      }
      return a.active ? -1 : 1
    }
  }

  formatDate(date: Date): string {
    const parsedDate = date instanceof Date ? date : new Date(date);
    return `${parsedDate.getUTCFullYear()}-${String(parsedDate.getUTCMonth() + 1).padStart(2, '0')}-${String(parsedDate.getUTCDate()).padStart(2, '0')}`;
  }

  async findLessonsByPeriod(startDate: Date | undefined, endDate: Date | undefined): Promise<void> {
    if (!startDate) {
      startDate = new Date
    }
    if (!endDate) {
      endDate = startDate
    }
    this.lessons = (await firstValueFrom(this._lessonService.findByOptions({ startDate: this.formatDate(startDate), endDate: this.formatDate(endDate) }))).sort(this._sortLessons())
    this.splitLessonsByDate(this.lessons)
  }

  splitLessonsByDate(lessons: LessonDTO[]) {
    const today = new Date().toISOString().split('T')[0]

    this.pastLessons = lessons.filter(lesson => {
      const lessonDate = lesson.date || ''
      return lessonDate < today
    })

    this.upcomingLessons = lessons.filter(lesson => {
      const lessonDate = lesson.date || ''
      return lessonDate >= today
    })
  }

  filterLessons(filter: string) {
    if (!filter || filter === '') {
      this.splitLessonsByDate(this.lessons)
      return
    }
    filter = filter.toLowerCase()
    const filteredLessons = this.lessons.filter(lesson => {
      return lesson.classroomName?.toLowerCase().includes(filter)
        || lesson.topic?.toLowerCase().includes(filter)
        || lesson.number?.toString() === filter
    })

    this.splitLessonsByDate(filteredLessons)
  }

}
