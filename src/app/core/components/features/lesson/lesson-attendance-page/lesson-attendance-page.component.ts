import { Component, OnInit } from '@angular/core';
import { ROUTES_KEYS } from '../../../../../shared/config/routes-keys.config';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AttendanceDTO, AttendanceOfferDTO, ClassroomDTO, ItemDTO, LessonDTO, OfferDTO, StudentDTO, VisitorDTO, VisitorItemDTO, VisitorOfferDTO } from '../../../../models/api/data-contracts';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { LessonService } from '../../../../services/lesson/lesson.service';
import { ClassroomService } from '../../../../services/classroom/classroom.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomIconComponent, DialogService, NotificationService } from '../../../../../shared';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ItemService } from '../../../../services/item/item.service';
import { DialogVisitorComponent } from './dialog-visitor/dialog-visitor.component';
import { DialogOfferComponent } from './dialog-offer/dialog-offer.component';
import { DialogOfferManagementComponent } from './dialog-offer-management/dialog-offer-management.component';
import { DialogItemComponent } from './dialog-item/dialog-item.component';
import { DialogItemManagementComponent } from './dialog-item-management/dialog-item-management.component';

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
  offerSubject = new BehaviorSubject<number>(0)

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
    this.lesson = this._formBuilder.group({
      id: [null],
      lessonNumber: [null],
      lessonDate: [null],
      status: [null],
      notes: [null, [Validators.maxLength(this.maxNotesLength)]],
      classroomId: [null],
      visitors: this._formBuilder.array([]),
      attendances: this._formBuilder.array([]),
      teachings: this._formBuilder.array([]),
      active: [null],
      createdAt: [null],
      updatedAt: [null]
    })
  }

  async ngOnInit(): Promise<void> {
    const lessonId = Number(this._route.snapshot.paramMap.get(ROUTES_KEYS.lessonId))

    this.items = await firstValueFrom(this._itemService.findAll())

    let lesson: LessonDTO

    try {
      lesson = await firstValueFrom(this._lessonService.findById(lessonId))
      this.lesson.patchValue(lesson)
      this._sumLessonOffers()
      if (!lesson?.classroomId) {
        console.error('It is not possible to call a class without an associated group');
        this._router.navigate(['/', ROUTES_KEYS.lessons]);
        return;
      }
    } catch (e) {
      console.error(`Error fetching lesson with id '${lessonId}.'`, e)
      this._router.navigate(['/', ROUTES_KEYS.lessons]);
      return
    }

    try {
      this.classroom = await firstValueFrom(this._classroomService.findById(lesson.classroomId))
      if (!this.classroom) {
        console.error('It is not possible to call a class without an associated group');
        this._router.navigate(['/', ROUTES_KEYS.lessons]);
        return;
      }
    } catch (e) {
      this._notificationService.error(`Falha ao buscar a turma com id '${lesson.classroomId}'`)
      this._router.navigate(['/', ROUTES_KEYS.lessons])
    }

    const attendances: AttendanceDTO[] = lesson.attendances || []

    if (attendances.length === 0 || !this._isPastLesson(lesson)) {
      const students = this.classroom?.students || []
      const filterStudents = (student: StudentDTO) => !attendances.some(attendance => attendance.studentId === student.id)
      attendances.push(...students.filter(filterStudents).map(this._studentToAttendance()))
    }

    this.attendances.clear()
    attendances
      .sort((a, b) => (a.studentName || '').localeCompare(b.studentName || ''))
      .map(attendance => this._buildAttendanceForm(attendance))
      .forEach(attendanceForm => this.attendances.push(attendanceForm))
  }

  get attendances(): FormArray {
    return this.lesson.get('attendances') as FormArray
  }

  get visitors(): FormArray {
    return this.lesson.get('visitors') as FormArray
  }

  private _isPastLesson(lesson: LessonDTO): boolean {
    if (!lesson.lessonDate) {
      return false
    }
    const today = new Date()
    const lessonDate = new Date(lesson.lessonDate)
    today.setHours(0, 0, 0, 0)
    return lessonDate < today
  }

  private _studentToAttendance(): (student: StudentDTO) => AttendanceDTO {
    return student => ({
      id: undefined,
      present: undefined,
      studentId: student.id,
      studentName: student.personName,
      lesson: this.lesson.value,
      items: [],
      offers: [],
      active: true,
      createdAt: undefined,
      updatedAt: undefined
    })
  }

  private _buildAttendanceForm(attendance: AttendanceDTO): FormGroup {
    return this._formBuilder.group({
      id: [null],
      present: [attendance.present],
      studentId: [attendance.studentId],
      studentName: [attendance.studentName],
      lesson: [attendance.lesson],
      items: this._formBuilder.array(attendance.items || []),
      offers: this._formBuilder.array(attendance.offers || []),
      active: [null],
      createdAt: [null],
      updatedAt: [null]
    })
  }

  private _buildVisitor(visitor: VisitorDTO | undefined) {
    return this._formBuilder.group({
      id: [visitor?.id || null],
      name: [visitor?.name || null, [Validators.required]],
      lessonId: [visitor?.lessonId || null],
      items: this._formBuilder.array(visitor?.items || []),
      offers: this._formBuilder.array(visitor?.offers || []),
      createdAt: [visitor?.createdAt || null],
      updatedAt: [visitor?.updatedAt || null]
    })
  }

  private _buildOffer(offer: OfferDTO | undefined) {
    return this._formBuilder.group({
      id: [offer?.id || null],
      amount: [offer?.amount || null, [Validators.required, Validators.min(0.01)]],
      active: [offer?.active || null],
      createdAt: [offer?.createdAt || null],
      updatedAt: [offer?.updatedAt || null]
    })
  }

  private _buildLessonItem(item: ItemDTO) {
    return this._formBuilder.group({
      id: [null],
      quantity: [null],
      item: [item],
      createdAt: [null],
      updatedAt: [null]
    })
  }

  countALessonItems(lesson: LessonDTO | undefined, itemId: number | undefined): number {
    if (!lesson || !itemId) {
      return 0
    }
    const studentsItems = (lesson.attendances || [])
      .flatMap(attendance => attendance.items)
      .filter(attendanceItem => attendanceItem?.item?.id === itemId)
      .reduce((sum, attendanceItem) => sum + (Number(attendanceItem?.quantity) || 0), 0)

    const visitorsItems = (lesson.visitors || [])
      .flatMap(visitor => visitor.items)
      .filter(visitorItem => visitorItem?.item?.id === itemId)
      .reduce((sum, attendanceItem) => sum + (Number(attendanceItem?.quantity) || 0), 0)

    return studentsItems + visitorsItems
  }

  private _sumLessonOffers(): void {
    const lesson: LessonDTO = this.lesson.value
    if (!lesson) {
      this.offerSubject.next(0)
      return
    }

    const studentsOffers = (lesson.attendances || [])
      .flatMap((attendance: AttendanceDTO) => attendance.offers)
      .map((attendandanceOffer?: AttendanceOfferDTO) => attendandanceOffer?.offer)
      .map((offer?: OfferDTO) => offer?.amount || 0)
      .reduce((sum: number, offerAmount: number) => sum! + Number(offerAmount), 0)

    const visitorsOffers = (lesson.visitors || [])
      .flatMap((visitor: VisitorDTO) => visitor.offers)
      .map((visitorOffer?: VisitorOfferDTO) => visitorOffer?.offer)
      .map((offer?: OfferDTO) => offer?.amount || 0)
      .reduce((sum: number, offerAmount: number) => sum! + Number(offerAmount), 0)

    this.offerSubject.next(studentsOffers + visitorsOffers)
  }

  async addOffer(offerData: OfferDTO | undefined = undefined): Promise<void> {
    const data = {
      form: this._buildOffer(offerData),
      attendances: this.attendances,
      visitors: this.visitors
    }
    const response = await this._dialogService.openComponent(DialogOfferComponent, data).then()

    if (response?.form?.valid && response.parent?.valid) {
      const offer = this._formBuilder.group({
        offer: response.form
      })
      response.parent.get('offers')?.push(offer)
    }
    this._sumLessonOffers()
  }

  async addItem(item: ItemDTO) {
    const data = {
      form: this._buildLessonItem(item),
      attendances: this.attendances,
      visitors: this.visitors
    }
    const response = await this._dialogService.openComponent(DialogItemComponent, data).then()
    if (response?.form?.valid && response.parent?.valid) {
      response.parent.get('items')?.push(response?.form)
    }
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

  removeVisitor(visitor: AbstractControl) {
    const index = this.visitors.controls.indexOf(visitor)
    if (index !== -1) {
      this.visitors.removeAt(index)
    }
    this._sumLessonOffers()
  }


  save(form: FormGroup) {
    if (form.invalid) {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field)
        if (control && control.invalid) {
          console.error(`Field error "${field}":`, control.errors)
        }
      })
      return
    }
    console.log(form.value)
  }

  async managementOffers(): Promise<void> {
    const data = { attendances: this.attendances, visitors: this.visitors }
    await this._dialogService.openComponent(DialogOfferManagementComponent, data).then()
    this._sumLessonOffers()
  }

  async managementItems(item: ItemDTO): Promise<void> {
    const data = { item: item, attendances: this.attendances, visitors: this.visitors }
    await this._dialogService.openComponent(DialogItemManagementComponent, data).then()
  }

}
