import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClassroomDTO, LessonDTO, LessonStatus } from '../../../../models/api/data-contracts';
import { ClassroomService } from '../../../../services/classroom/classroom.service';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LessonService } from '../../../../services/lesson/lesson.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { EnumTranslatePipe, NotificationService } from '../../../../../shared';
import { ROUTES_KEYS } from '../../../../../shared/config/routes-keys.config';

@Component({
  selector: 'app-lesson-form-page',
  imports: [
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    RouterModule,
    EnumTranslatePipe,
  ],
  templateUrl: './lesson-form-page.component.html',
  styleUrl: './lesson-form-page.component.scss'
})
export class LessonFormPageComponent implements OnInit {

  ROUTES_KEYS = ROUTES_KEYS
  lesson: FormGroup
  classrooms: ClassroomDTO[] = []
  submitted: boolean = false
  lessonStatusList = Object.keys(LessonStatus).map(key => LessonStatus[key as keyof typeof LessonStatus])

  constructor(
    private _formBuilder: FormBuilder,
    private _classroomService: ClassroomService,
    private _lessonService: LessonService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _notificationService: NotificationService,
  ) {
    this.lesson = this._buildLesson()
  }

  async ngOnInit(): Promise<void> {
    this.classrooms = await firstValueFrom(this._classroomService.findAll())
    const lessonId = Number(this._route.snapshot.paramMap.get(ROUTES_KEYS.lessonId))

    if (lessonId) {
      this._lessonService.findById(lessonId).subscribe({
        next: async lessonResponse => {
          this.lesson.patchValue(lessonResponse)
        },
        error: () => {
          this._router.navigate(['/', ROUTES_KEYS.lessons])
        }
      })
    }
  }

  private _buildLesson(lesson: LessonDTO | undefined = undefined): FormGroup {
    return this._formBuilder.group({
      id: [lesson?.id || null],
      number: [lesson?.number || null],
      topic: [lesson?.topic || null],
      date: [lesson?.date || null],
      status: [lesson?.status || LessonStatus.OPEN_SAME_DAY],
      notes: [lesson?.notes || null],
      classroomId: [lesson?.classroomId || null],
      visitors: [lesson?.visitors || null],
      attendances: [lesson?.attendances || null],
      teachings: [lesson?.teachings || null],
      items: [lesson?.items || null],
      offers: [lesson?.offers || null],
      active: [lesson?.active ?? true],
      createdAt: [lesson?.createdAt || null],
      updatedAt: [lesson?.updatedAt || null],
    })
  }

  save(form: FormGroup) {
    if (form.invalid) {
      console.error('Invalid form')
      return
    }
    const lesson: LessonDTO = form.value
    if (lesson.id) {
      this.update(lesson)
    } else {
      this.create(lesson)
    }
  }

  create(lesson: LessonDTO) {
    this._lessonService.create(lesson).subscribe({
      next: (_) => {
        this.submitted = true
        this._notificationService.success(`Aula ${lesson.number} criada com sucesso`)
        this._router.navigate(['/', ROUTES_KEYS.lessons])
      },
      error: (err) => {
        console.error('Create lesson failed.', err)
      }
    })
  }

  update(lesson: LessonDTO) {
    this._lessonService.update(lesson).subscribe({
      next: (res) => {
        this.submitted = true
        this._notificationService.success(`Aula ${lesson.number} alterada com sucesso`)
        this._router.navigate(['/', ROUTES_KEYS.lessons])
      },
      error: (err) => {
        console.error('Update lesson failed.', err)
      }
    })
  }

}
