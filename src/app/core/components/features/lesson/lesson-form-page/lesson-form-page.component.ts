import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ROUTES_KEYS } from '../../../../../shared/config/routes-keys.config';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ClassroomDTO, LessonDTO } from '../../../../models/api/data-contracts';
import { firstValueFrom } from 'rxjs';
import { ClassroomService } from '../../../../services/classroom/classroom.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LessonService } from '../../../../services/lesson/lesson.service';
import { NotificationService } from '../../../../../shared';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-lesson-form-page',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatSlideToggleModule, MatIconModule, RouterModule, MatButtonModule],
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
      lessonNumber: [null],
      lessonDate: [null],
      notes: [null],
      students: [null],
      classroomId: [null],
      visitors: [null],
      attendances: [null],
      teachings: [null],
      active: [null],
      createdAt: [null],
      updatedAt: [null],
    })
  }

  async ngOnInit(): Promise<void> {
    setTimeout(() => { }, 0)
    this.classrooms = await firstValueFrom(this._classroomService.findAllClassrooms())
    const lessonId = this._route.snapshot.paramMap.get(ROUTES_KEYS.lessonId)

    if (lessonId) {
      this._lessonService.findById(lessonId).subscribe({
        next: async lessonResponse => {
          this.lesson.patchValue(lessonResponse)
        },
        error: () => {
          this._notificationService.warning(`Não foi encontrado aula com ID '${lessonId}', redirecionado usuário`)
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
        this._notificationService.success(`Aula ${lesson.lessonNumber} criada com sucesso`)
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
        this._notificationService.success(`Aula ${lesson.lessonNumber} alterada com sucesso`)
        this._router.navigate(['/', ROUTES_KEYS.lessons])
      },
      error: (err) => {
        console.error('Update lesson failed.', err)
      }
    })
  }

  compareObjectId(obj1: any, obj2: any) {
    return obj1 && obj2 ? (obj1.id === obj2.id) : obj1 === obj2
  }
}
