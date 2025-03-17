import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClassroomDTO, LessonDTO } from '../../../../models/api/data-contracts';
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
import { NotificationService } from '../../../../../shared';
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
  ],
  templateUrl: './lesson-form-page.component.html',
  styleUrl: './lesson-form-page.component.scss'
})
export class LessonFormPageComponent implements OnInit {

  ROUTES_KEYS = ROUTES_KEYS
  lesson: FormGroup
  classrooms: ClassroomDTO[] = []
  submitted: boolean = false

  constructor(
    private _formBuilder: FormBuilder,
    private _classroomService: ClassroomService,
    private _lessonService: LessonService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _notificationService: NotificationService,
  ) {
    this.lesson = this._formBuilder.group({
      id: [null],
      number: [null],
      topic: [null],
      date: [null],
      status: [null],
      notes: [null],
      classroomId: [null],
      visitors: [null],
      attendances: [null],
      teachings: [null],
      items: [null],
      offers: [null],
      active: [null],
      createdAt: [null],
      updatedAt: [null],
    })
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
      next: (res) => {
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
