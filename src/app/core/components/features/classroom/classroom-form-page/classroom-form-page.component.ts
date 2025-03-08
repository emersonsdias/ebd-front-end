import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AgeRangeDTO, ClassroomDTO } from '../../../../models/api/data-contracts';
import { AgeRangeService } from '../../../../services/age-range/age-range.service';
import { ClassroomService } from '../../../../services/classroom/classroom.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NotificationService } from '../../../../../shared';
import { ROUTES_KEYS } from '../../../../../shared/config/routes-keys.config';

@Component({
  selector: 'app-classroom-form-page',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './classroom-form-page.component.html',
  styleUrl: './classroom-form-page.component.scss'
})
export class ClassroomFormPageComponent implements OnInit {

  ROUTES_KEYS = ROUTES_KEYS
  classroom: FormGroup
  ageRangeList: AgeRangeDTO[] = []
  submitted: boolean = false

  constructor(
    private _formBuilder: FormBuilder,
    private _ageRangeService: AgeRangeService,
    private _classroomService: ClassroomService,
    private _notificationService: NotificationService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.classroom = this._formBuilder.group({
      id: [null],
      name: [null],
      ageRange: [null],
      teachers: [null],
      students: [null],
      lessons: [null],
      active: [null],
      createdAt: [null],
      updatedAt: [null],
    })
  }

  async ngOnInit(): Promise<void> {
    this.ageRangeList = await firstValueFrom(this._ageRangeService.findAll())

    const classroomId = Number(this._route.snapshot.paramMap.get(ROUTES_KEYS.classroomId))

    if (classroomId) {
      this._classroomService.findById(classroomId).subscribe({
        next: async classroomResponse => {
          this.classroom.patchValue(classroomResponse)
        },
        error: () => {
          this._notificationService.warning(`Não foi encontrado turma com ID '${classroomId}', redirecionado usuário`)
          this._router.navigate(['/', ROUTES_KEYS.classrooms])
        }
      })
    }
  }

  save(form: FormGroup) {
    if (form.invalid) {
      console.error('Invalid form')
      return
    }
    const classroom: ClassroomDTO = this.classroom.value
    if (classroom.id) {
      this.update(classroom)
    } else {
      this.create(classroom)
    }
  }

  create(classroom: ClassroomDTO) {
    this._classroomService.create(classroom).subscribe({
      next: (res) => {
        this.submitted = true
        this._notificationService.success(`Turma ${classroom.name} criada com sucesso`)
        this._router.navigate(['/', ROUTES_KEYS.classrooms])
      },
      error: (err) => {
        console.error('Create classroom failed.', err)
      }
    })
  }

  update(classroom: ClassroomDTO) {
    this._classroomService.update(classroom).subscribe({
      next: (res) => {
        this.submitted = true
        this._notificationService.success(`Turma ${classroom.name} alterada com sucesso`)
        this._router.navigate(['/', ROUTES_KEYS.classrooms])
      },
      error: (err) => {
        console.error('Update classroom failed.', err)
      }
    })
  }

  compareObjectId(obj1: any, obj2: any) {
    return obj1 && obj2 ? (obj1.id === obj2.id) : obj1 === obj2
  }

}
