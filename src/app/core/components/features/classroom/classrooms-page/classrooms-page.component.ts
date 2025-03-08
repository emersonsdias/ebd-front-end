import { ClassroomDTO, LessonDTO } from '../../../../models/api/data-contracts';
import { ClassroomService } from '../../../../services/classroom/classroom.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ROUTES_KEYS } from '../../../../../shared/config/routes-keys.config';

@Component({
  selector: 'app-classrooms-page',
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    RouterModule,
  ],
  templateUrl: './classrooms-page.component.html',
  styleUrl: './classrooms-page.component.scss'
})
export class ClassroomsPageComponent implements OnInit {

  ROUTES_KEYS = ROUTES_KEYS
  classrooms = new MatTableDataSource<ClassroomDTO>([])
  displayedColumns: string[] = [
    'name',
    'ageRange',
    'students',
    'teachers',
    'lessons',
    'lastLesson',
    'nextLesson',
    'createdAt',
    'updatedAt',
  ]


  constructor(
    private _classroomService: ClassroomService
  ) { }

  async ngOnInit(): Promise<void> {
    this._classroomService.findAll().subscribe({
      next: classroomsResponse => this.classrooms.data = classroomsResponse
    })
  }

  findLastLesson(lessons: LessonDTO[] | undefined): LessonDTO | undefined {
    if (!lessons) {
      return undefined
    }
    const today = new Date().toISOString().split("T")[0];

    return lessons
      .filter(lesson => lesson.date && lesson.date < today)
      .sort((a, b) => (b.date! > a.date! ? 1 : -1))[0];
  }

  findNextLesson(lessons: LessonDTO[] | undefined): LessonDTO | undefined {
    if (!lessons) {
      return undefined
    }
    const today = new Date().toISOString().split("T")[0];

    return lessons
      .filter(lesson => lesson.date && lesson.date > today)
      .sort((a, b) => (a.date! > b.date! ? 1 : -1))[0];
  }

}
