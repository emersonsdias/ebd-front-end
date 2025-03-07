import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ROUTES_KEYS } from '../../../../../shared/config/routes-keys.config';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AttendanceDTO, ClassroomDTO, ItemDTO, LessonDTO, StudentDTO } from '../../../../models/api/data-contracts';
import { firstValueFrom } from 'rxjs';
import { LessonService } from '../../../../services/lesson/lesson.service';
import { ClassroomService } from '../../../../services/classroom/classroom.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomIconComponent, NotificationService } from '../../../../../shared';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ItemService } from '../../../../services/item/item.service';

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
export class LessonAttendancePageComponent implements OnInit, AfterViewInit {

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
  private _isPastLesson(lesson: LessonDTO): boolean {
    if (!lesson.lessonDate) {
      return false
    }
    const today = new Date()
    const lessonDate = new Date(lesson.lessonDate)
    today.setHours(0, 0, 0, 0)
    return lessonDate < today
  }

  ngAfterViewInit(): void {
  }

  get attendances(): FormArray {
    return this.lesson.get('attendances') as FormArray
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

  countALessonItems(lesson: LessonDTO | undefined, itemId: number | undefined): number {
    if (!lesson || !itemId) {
      return 0
    }
    const studentsItems = (lesson.attendances || [])
      .flatMap(attendance => attendance.items)
      .filter(attendanceItem => attendanceItem?.item?.id === itemId)
      .reduce((sum, attendanceItem) => sum + (attendanceItem?.quantity || 0), 0)

    return studentsItems
  }

  sumLessonOffers(lesson: LessonDTO | undefined): number {
    if (!lesson) {
      return 0
    }

    const studentsOffers = (lesson.attendances || [])
    .flatMap(attendance => attendance.offers)
    .reduce((sum, attendanceOffer) => sum + (attendanceOffer?.offer?.amount || 0), 0)

    return studentsOffers
  }


}
