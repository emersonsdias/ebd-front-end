import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AgeRangeDTO, ClassroomDTO, PersonDTO, PersonType, StudentDTO, TeacherDTO } from '../../../../models/api/data-contracts';
import { AgeRangeService } from '../../../../services/age-range/age-range.service';
import { ClassroomService } from '../../../../services/classroom/classroom.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DialogService, NotificationService } from '../../../../../shared';
import { PersonService } from '../../../../services/person/person.service';
import { ROUTES_KEYS } from '../../../../../shared/config/routes-keys.config';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogPersonComponent } from './dialog-person/dialog-person.component';

@Component({
  selector: 'app-classroom-form-page',
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    RouterModule,
    NgbCollapseModule,
  ],
  templateUrl: './classroom-form-page.component.html',
  styleUrl: './classroom-form-page.component.scss'
})
export class ClassroomFormPageComponent implements OnInit {

  ROUTES_KEYS = ROUTES_KEYS
  classroom: FormGroup
  ageRangeList: AgeRangeDTO[] = []
  teacherList: PersonDTO[] = []
  studentList: PersonDTO[] = []
  submitted: boolean = false

  yearControl: FormControl = new FormControl(new Date)
  isCollapsed = false


  constructor(
    private _formBuilder: FormBuilder,
    private _ageRangeService: AgeRangeService,
    private _classroomService: ClassroomService,
    private _notificationService: NotificationService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _personService: PersonService,
    private _dialogService: DialogService,
  ) {
    this.classroom = this._formBuilder.group({
      id: [null],
      name: [null],
      ageRange: [null],
      teachers: this._formBuilder.array([]),
      students: this._formBuilder.array([]),
      lessons: [null],
      active: [null],
      createdAt: [null],
      updatedAt: [null],
    })
  }

  private _buildTeacher(person: PersonDTO): FormGroup {
    const year = this.yearControl.value.getFullYear()
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31)
    return this._formBuilder.group({
      id: [null],
      teachingPeriodStart: [startDate],
      teachingPeriodEnd: [endDate],
      person: [person],
      classroomId: [this.classroom.value.id],
      active: [true],
      createdAt: [null],
      updatedAt: [null]
    })
  }

  private _buildStudent(person: PersonDTO): FormGroup {
    const year = this.yearControl.value.getFullYear()
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31)
    return this._formBuilder.group({
      id: [null],
      academicPeriodStart: [startDate],
      academicPeriodEnd: [endDate],
      person: [person],
      classroomId: [this.classroom.value.id],
      active: [true],
      createdAt: [null],
      updatedAt: [null]
    })
  }

  get teachers(): FormArray {
    return this.classroom.get('teachers') as FormArray || this._formBuilder.array([])
  }

  get students(): FormArray {
    return this.classroom.get('students') as FormArray || this._formBuilder.array([]);
  }


  async ngOnInit(): Promise<void> {
    const [ageRangeList, teachers, students] = await Promise.all([
      firstValueFrom(this._ageRangeService.findAll()),
      firstValueFrom(this._personService.findByType([PersonType.TEACHER])),
      firstValueFrom(this._personService.findByType([PersonType.STUDENT]))
    ])

    this.ageRangeList = ageRangeList
    this.teacherList = teachers
    this.studentList = students

    const classroomId = Number(this._route.snapshot.paramMap.get(ROUTES_KEYS.classroomId))

    if (classroomId) {
      this._classroomService.findById(classroomId).subscribe({
        next: async classroomResponse => {
          this.classroom.patchValue(classroomResponse)
          this.classroom.setControl('teachers', this._formBuilder.array(classroomResponse.teachers || []));
          this.classroom.setControl('students', this._formBuilder.array(classroomResponse.students || []));
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


    console.log(classroom)
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

  chosenYearHandler(event: Date, datepicker: MatDatepicker<Date>) {
    this.yearControl.setValue(event)
    datepicker.close();
  }

  findTeacherIndex(control: FormControl): number {
    const formArray = this.classroom.get('teachers') as FormArray;
    return formArray.controls.findIndex(teacher => teacher === control);
  }

  findStudentIndex(control: FormControl): number {
    const formArray = this.classroom.get('students') as FormArray;
    return formArray.controls.findIndex(student => student === control);
  }

  toggleTeacherStatus(teacherForm: FormControl | AbstractControl): void {
    const index = this.findTeacherIndex(teacherForm as FormControl)
    const teacher = (this.classroom.get('teachers') as FormArray).at(index) as FormControl

    const updatedTeacher = new FormControl({
      ...teacher.value,
      active: !teacher.value.active,
    });

    const formControl = (this.classroom.get('teachers') as FormArray)
    formControl.setControl(index, updatedTeacher)
    this.classroom.markAsDirty()
  }

  toggleStudentStatus(studentForm: FormControl | AbstractControl): void {
    const index = this.findStudentIndex(studentForm as FormControl)
    const student = (this.classroom.get('students') as FormArray).at(index) as FormControl

    const updatedStudent = new FormControl({
      ...student.value,
      active: !student.value.active,
    });

    const formControl = (this.classroom.get('students') as FormArray)
    formControl.setControl(index, updatedStudent)
    this.classroom.markAsDirty()
  }

  filterStudentsByYear(students: FormArray): FormArray {
    const yearControlDate = this.yearControl.value ? new Date(this.yearControl.value) : new Date
    const filteredStudents = students.controls.filter(student => {
      const startDate = student.value.academicPeriodStart ? new Date(student.value.academicPeriodStart) : null
      const endDate = student.value.academicPeriodEnd ? new Date(student.value.academicPeriodEnd) : null

      return startDate && endDate && startDate <= yearControlDate && endDate >= yearControlDate
    });

    return this._formBuilder.array(filteredStudents)
  }

  filterTeachersByYear(teachers: FormArray): FormArray {
    const yearControlDate = this.yearControl.value ? new Date(this.yearControl.value) : new Date
    const filteredTeachers = teachers.controls.filter(teacher => {
      const startDate = teacher.value.teachingPeriodStart ? new Date(teacher.value.teachingPeriodStart) : null
      const endDate = teacher.value.teachingPeriodEnd ? new Date(teacher.value.teachingPeriodEnd) : null

      return startDate && endDate && startDate <= yearControlDate && endDate >= yearControlDate
    });

    return this._formBuilder.array(filteredTeachers)
  }

  async addTeacher(): Promise<void> {
    const data = {people: this.teacherList, type: 'teacher' }
    const responseData = await this._dialogService.openComponent(DialogPersonComponent, data)
    this.teachers.push(this._buildTeacher(responseData.person))
  }

  async addStudent(): Promise<void> {
    const data = {people: this.studentList, type: 'student' }
    const responseData = await this._dialogService.openComponent(DialogPersonComponent, data)
    this.students.push(this._buildStudent(responseData.person))
  }
}
