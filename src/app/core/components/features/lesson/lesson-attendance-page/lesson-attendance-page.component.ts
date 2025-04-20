import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AttendanceDTO, ClassroomDTO, ItemDTO, LessonDTO, OfferDTO, StudentDTO, VisitorDTO, LessonItemDTO, LessonStatus } from '../../../../models/api/data-contracts';
import { firstValueFrom } from 'rxjs';
import { ClassroomService } from '../../../../services/classroom/classroom.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CustomIconComponent, DialogService, NotificationService } from '../../../../../shared';
import { DialogVisitorComponent } from './dialog-visitor/dialog-visitor.component';
import { ItemService } from '../../../../services/item/item.service';
import { LessonService } from '../../../../services/lesson/lesson.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ROUTES_KEYS } from '../../../../../shared/config/routes-keys.config';
import { DialogOfferComponent } from './dialog-offer/dialog-offer.component';
import { Utils } from '../../../../../shared/utils/utils';

@Component({
  selector: 'app-lesson-attendance-page',
  imports: [
    CommonModule,
    CustomIconComponent,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './lesson-attendance-page.component.html',
  styleUrl: './lesson-attendance-page.component.scss'
})
export class LessonAttendancePageComponent implements OnInit {

  ROUTES_KEYS = ROUTES_KEYS
  lesson: FormGroup
  classroom: ClassroomDTO | undefined
  items: ItemDTO[] = []
  submitted: boolean = false

  readonly maxNotesLength = 255

  constructor(
    private _formBuilder: FormBuilder,
    private _itemService: ItemService,
    private _lessonService: LessonService,
    private _classroomService: ClassroomService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _notificationService: NotificationService,
    private _dialogService: DialogService,
  ) {
    this.lesson = this._buildLesson()
  }

  async ngOnInit(): Promise<void> {
    const lessonId = Number(this._route.snapshot.paramMap.get(ROUTES_KEYS.lessonId))
    try {
      if (!lessonId) {
        this._router.navigate(['/', ROUTES_KEYS.lessons])
        this._notificationService.error('Não foi possível localizar o id da aula')
        return
      }

      const [items, lesson] = await Promise.all([
        firstValueFrom(this._itemService.findAll()),
        firstValueFrom(this._lessonService.findById(lessonId))
      ])

      this.items = items
      this.lesson.patchValue(lesson)

      this.lesson.setControl('visitors', this._formBuilder.array(
        (lesson.visitors || []).map(visitor => this._buildVisitor(visitor))
      ))

      if (!lesson?.classroomId) {
        console.error('It is not possible to call a class without an associated group');
        this._router.navigate(['/', ROUTES_KEYS.lessons]);
        return;
      }
      this.classroom = await firstValueFrom(this._classroomService.findById(lesson.classroomId))
      if (!this.classroom) {
        console.error('It is not possible to call a class without an associated group');
        this._router.navigate(['/', ROUTES_KEYS.lessons]);
        return;
      }
      const attendances: AttendanceDTO[] = lesson.attendances || []

      const students = this.classroom?.students || []
      const filterStudents = (student: StudentDTO) => {
        const hasNoAttendanceRecord: boolean = !attendances.some(attendance => attendance.studentId === student.id)
        const isEnrolledInPeriod: boolean = this._isLessonWithinAcademicPeriod(student, lesson)
        return hasNoAttendanceRecord && isEnrolledInPeriod
      }
      if (lesson.status !== LessonStatus.FINALIZED) {
        attendances.push(...students
          .filter(filterStudents)
          .map(this._studentToAttendance())
        )
      }

      this.attendances.clear()
      attendances
        .sort((a, b) => (a.studentName || '').localeCompare(b.studentName || ''))
        .map(attendance => this._buildAttendance(attendance))
        .forEach(attendanceForm => this.attendances.push(attendanceForm))
    } catch (e) {
      console.error(`Error fetching lesson with id '${lessonId}.'`, e)
      this._router.navigate(['/', ROUTES_KEYS.lessons]);
      return
    }

    if (!this._isOpenLesson(this.lesson.value)) {
      this._closedAttendanceNotification(this.lesson.value)
      this.lesson.disable()
    }
  }

  private async _closedAttendanceNotification(lesson: LessonDTO) {
    const options = {
      title: 'Não é possível editar chamada',
      message: 'Para fazer alteração, solicite para um administrador alterar o status da aula',
      confirmButton: 'Ok',
      hideDenyButton: true
    }
    if (lesson.status === LessonStatus.FINALIZED) {
      options.title = 'Não é possível editar chamada já finalizada'
    } else if (lesson.status === LessonStatus.CLOSED) {
      options.title = 'Não é possível editar chamada com status \'Fechado\''
    } else if (lesson.status === LessonStatus.OPEN_SAME_DAY && !Utils.isToday(lesson.date)) {
      options.title = 'Somente é possível editar essa na sua data de realização'
    }
    this._dialogService.openConfirmation(options)
  }

  private _buildLesson(lesson: LessonDTO | undefined = undefined) {
    return this._formBuilder.group({
      id: [lesson?.id || null],
      number: [lesson?.id || null],
      topic: [lesson?.id || null],
      date: [lesson?.id || null],
      status: [lesson?.id || null],
      notes: [lesson?.id || null, [Validators.maxLength(this.maxNotesLength)]],
      classroomId: [lesson?.id || null],
      visitors: this._formBuilder.array(lesson?.visitors || []),
      attendances: this._formBuilder.array(lesson?.attendances || []),
      teachings: this._formBuilder.array(lesson?.teachings || []),
      items: this._formBuilder.array(lesson?.items || []),
      offers: this._formBuilder.array(lesson?.offers || []),
      active: [null],
      createdAt: [null],
      updatedAt: [null]
    })
  }

  private _buildAttendance(attendance: AttendanceDTO | undefined = undefined): FormGroup {
    return this._formBuilder.group({
      id: [attendance?.id || null],
      present: [attendance?.present ?? null],
      studentId: [attendance?.studentId || null],
      studentName: [attendance?.studentName || null],
      lesson: [attendance?.lesson || null],
      active: [attendance?.active || null],
      createdAt: [attendance?.createdAt || null],
      updatedAt: [attendance?.updatedAt || null]
    })
  }

  private _buildVisitor(visitor: VisitorDTO | undefined = undefined): FormGroup {
    return this._formBuilder.group({
      id: [visitor?.id || null],
      name: [visitor?.name || null, [Validators.required]],
      lessonId: [visitor?.lessonId || null],
      active: [visitor?.active ?? true],
      createdAt: [visitor?.createdAt || null],
      updatedAt: [visitor?.updatedAt || null]
    })
  }

  private _buildOffer(offer: OfferDTO | undefined = undefined): FormGroup {
    return this._formBuilder.group({
      id: [offer?.id || null],
      amount: [offer?.amount || null, [Validators.required, Validators.min(0.00)]],
      active: [offer?.active || null],
      createdAt: [offer?.createdAt || null],
      updatedAt: [offer?.updatedAt || null]
    })
  }

  private _buildLessonItem(item: ItemDTO, quantity: number | null = null): FormGroup {
    return this._formBuilder.group({
      id: [null],
      quantity: [quantity],
      item: [item],
      createdAt: [null],
      updatedAt: [null]
    })
  }

  get offers(): FormArray {
    return this.lesson.get('offers') as FormArray
  }

  get attendances(): FormArray {
    return this.lesson.get('attendances') as FormArray
  }

  get visitors(): FormArray {
    return this.lesson.get('visitors') as FormArray
  }

  private _isOpenLesson(lesson: LessonDTO) {
    if (LessonStatus.OPEN_ANY_DAY === lesson.status) {
      return true
    }
    if (LessonStatus.CLOSED === lesson.status || LessonStatus.FINALIZED === lesson.status) {
      return false
    }
    if (LessonStatus.OPEN_SAME_DAY === lesson.status) {
      if (!lesson.date) {
        return false
      }
      return Utils.isToday(lesson.date)
    }
    return false
  }

  private _studentToAttendance(): (student: StudentDTO) => AttendanceDTO {
    return student => ({
      id: undefined,
      present: undefined,
      studentId: student.id,
      studentName: student.person?.name,
      lesson: this.lesson.value,
      active: true,
      createdAt: undefined,
      updatedAt: undefined
    })
  }

  countLessonItems(lesson: LessonDTO | undefined, itemId: number | undefined): number {
    if (!lesson || !itemId) {
      return 0
    }
    return (lesson.items || [])
      .filter(lessonItem => lessonItem?.item?.id === itemId)
      .reduce((sum, attendanceItem) => sum + (Number(attendanceItem?.quantity) || 0), 0)
  }

  async addItem(lesson: FormGroup, item: ItemDTO): Promise<void> {
    const lessonItems = lesson.get('items') as FormArray
    const lessonItem = lessonItems.controls.find((control) => (control as FormGroup).get('item')?.value?.id === item.id) as FormGroup | undefined

    if (!lessonItem) {
      lessonItems.push(this._buildLessonItem(item, 1))
    } else {
      const quantityControl = lessonItem.get('quantity')
      if (quantityControl) {
        quantityControl.setValue(quantityControl.value + 1)
      }
    }
  }

  async removeItem(lesson: FormGroup, item: ItemDTO): Promise<void> {
    const lessonItems = lesson.get('items') as FormArray
    const lessonItemIndex = lessonItems.controls.findIndex((control) => (control as FormGroup).get('item')?.value?.id === item.id)

    if (lessonItemIndex === -1) {
      return
    }
    const lessonItem = lessonItems.at(lessonItemIndex) as FormGroup
    const quantityControl = lessonItem.get('quantity')

    if (quantityControl) {
      const currentQuantity = quantityControl.value

      if (currentQuantity > 1) {
        quantityControl.setValue(currentQuantity - 1)
      } else {
        lessonItems.removeAt(lessonItemIndex)
      }
    }
  }

  async manageOffers(): Promise<void> {
    const offersArray = this.lesson.get('offers') as FormArray
    if (offersArray.length === 0) {
      offersArray.push(this._buildOffer())
    }
    const offerControl = offersArray.at(0) as FormGroup;
    await this._dialogService.openComponent(DialogOfferComponent, offerControl)
  }

  async addVisitor(visitorData: VisitorDTO | undefined = undefined): Promise<void> {
    const visitor: FormGroup = await this._dialogService.openComponent(DialogVisitorComponent, this._buildVisitor(visitorData)).then()
    if (visitor && visitor.valid) {
      this.visitors.push(visitor)
    }
  }

  async editVisitor(visitorData: AbstractControl): Promise<void> {
    await this._dialogService.openComponent(DialogVisitorComponent, visitorData || {}).then()
  }

  async removeVisitor(visitor: AbstractControl): Promise<void> {
    const index = this.visitors.controls.indexOf(visitor)
    if (index !== -1) {
      this.visitors.removeAt(index)
    }
  }

  async save(form: FormGroup, sendReport: boolean = false) {
    if (form.invalid) {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field)
        if (control && control.invalid) {
          console.error(`Field error "${field}":`, control.errors)
        }
      })
      return
    }
    const lesson: LessonDTO = this.lesson.value

    if (sendReport) {
      const userConfirm = await this._dialogService.openConfirmation({
        title: 'Confirma envio do relatório?',
        message: 'Após enviado o relatório não é mais possível editar a chamada'
      })
      if (!userConfirm) {
        return
      }
      lesson.status = LessonStatus.FINALIZED
    }

    this._lessonService.update(lesson).subscribe({
      next: (_) => {
        this._notificationService.success('Chamada realizada com sucesso')
        this._router.navigate(['/', ROUTES_KEYS.lessons])
      }
    })
  }

  private _isLessonWithinAcademicPeriod(student: StudentDTO, lesson: LessonDTO): boolean {
    if (!student.academicPeriodStart || !student.academicPeriodEnd || !lesson.date) {
      return false;
    }

    const lessonDate = new Date(lesson.date);
    const periodStart = new Date(student.academicPeriodStart);
    const periodEnd = new Date(student.academicPeriodEnd);

    return lessonDate >= periodStart && lessonDate <= periodEnd;
  }

  isFormLessonDisabled(): boolean {
    return this.lesson.disabled
  }


}
