import { LessonDTO, LessonStatus } from '../../../../models/api/data-contracts';
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
import { NgbAccordionModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { Utils } from '../../../../../shared';

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
    NgbCollapseModule,
    NgbAccordionModule,
  ],
  templateUrl: './lessons-page.component.html',
  styleUrl: './lessons-page.component.scss'
})
export class LessonsPageComponent implements OnInit {

  ROUTES_KEYS = ROUTES_KEYS
  lessons: LessonDTO[] = []
  isAdmin: Observable<boolean>

  startDate: Date
  endDate: Date

  unfinishedLessons: LessonDTO[] = []
  finishedLessons: LessonDTO[] = []
  groupedUnfinishedLessons: { key: string, lessons: LessonDTO[] }[] = [];
  groupedFinishedLessons: { key: string, lessons: LessonDTO[] }[] = [];

  constructor(
    _authService: AuthService,
    private _lessonService: LessonService,
  ) {
    this.isAdmin = _authService.isAdmin()
    const today = new Date
    this.startDate = new Date(today)
    this.startDate.setDate(today.getDate() - 15)
    this.endDate = new Date(today)
    this.endDate.setDate(today.getDate() + 1)
  }

  async ngOnInit(): Promise<void> {
    this.findLessonsByPeriod(this.startDate, this.endDate)
  }

  private _sortLessons(direction: 'asc' | 'desc' = 'asc') {
    return (a: LessonDTO, b: LessonDTO) => {
      if (a.active === b.active) {
        const dateA = new Date(a?.date || '')
        const dateB = new Date(b?.date || '')
        return direction === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
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
    this.lessons = (await firstValueFrom(this._lessonService.findByOptions({ startDate: this.formatDate(startDate), endDate: this.formatDate(endDate) })))
    this.splitLessons(this.lessons)
  }

  splitLessons(lessons: LessonDTO[]) {
    this.finishedLessons = lessons.filter(lesson => {
      return lesson.status === LessonStatus.FINALIZED
    }).sort(this._sortLessons('desc'))

    this.unfinishedLessons = lessons.filter(lesson => {
      return lesson.status !== LessonStatus.FINALIZED
    }).sort(this._sortLessons('asc'))

    this.groupUnfinishedLessons()
    this.groupFinishedLessons()
  }

  filterLessons(filter: string) {
    if (!filter || filter === '') {
      this.splitLessons(this.lessons)
      return
    }
    filter = filter.toLowerCase()
    const filteredLessons = this.lessons.filter(lesson => {
      return lesson.classroomName?.toLowerCase().includes(filter)
        || lesson.topic?.toLowerCase().includes(filter)
        || lesson.number?.toString() === filter
    })

    this.splitLessons(filteredLessons)
  }

  groupUnfinishedLessons() {
    const map = new Map<string, LessonDTO[]>();
    for (const lesson of this.unfinishedLessons) {
      if (!lesson.number) {
        continue
      }
      let key

      if (Utils.isPast(lesson.date)) {
        key = 'Aulas passadas'
      } else if (Utils.isFuture(lesson.date)) {
        key = 'Aulas futuras'
      } else {
        key = 'Aulas do dia'
      }

      if (!map.has(key)) {
        map.set(key, [])
      }
      map.get(key)!.push(lesson);
    }
    this.groupedUnfinishedLessons = []
    map.forEach((lessons: LessonDTO[], key: string) => {
      this.groupedUnfinishedLessons.push({ key: key, lessons: lessons })
    })
  }

  groupFinishedLessons() {
    const map = new Map<string, LessonDTO[]>();
    for (const lesson of this.finishedLessons) {
      if (!lesson.number) {
        continue
      }
      const key = '' + lesson.number
      if (!map.has(key)) {
        map.set(key, [])
      }
      map.get(key)!.push(lesson);
    }
    this.groupedFinishedLessons = []
    map.forEach((lessons: LessonDTO[], key: string) => {
      this.groupedFinishedLessons.push({ key: key, lessons: lessons })
    })
  }

  getQueryParamsLessonUnit(groupKey: any) {
    const paramLessonNumber = ROUTES_KEYS.units.params.lessonNumber
    const paramStartDate = ROUTES_KEYS.units.params.startDate
    const paramEndDate = ROUTES_KEYS.units.params.endDate

    return {
      [paramLessonNumber]: groupKey,
      [paramStartDate]: this.formatDate(this.startDate),
      [paramEndDate]: this.formatDate(this.endDate)
    };
  }

}
