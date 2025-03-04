import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ROUTES_KEYS } from '../../../../../shared/config/routes-keys.config';
import { LessonService } from '../../../../services/lesson/lesson.service';
import { AttendanceDTO, LessonDTO } from '../../../../models/api/data-contracts';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lessons-page',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDividerModule, MatIconModule, RouterModule],
  templateUrl: './lessons-page.component.html',
  styleUrl: './lessons-page.component.scss'
})
export class LessonsPageComponent implements OnInit {

  ROUTES_KEYS = ROUTES_KEYS

  lessons: LessonDTO[] = []

  constructor(
    private _lessonService: LessonService
  ) { }

  async ngOnInit(): Promise<void> {
    await setTimeout(() => { }, 0)
    this._lessonService.findAllLessons({maxRecentLessons: 100}).subscribe({
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
}
