import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ClassroomDTO, ItemDTO, LessonDTO, SimpleLessonDTO } from '../../../../models/api/data-contracts';
import { ItemService } from '../../../../services/item/item.service';
import { firstValueFrom } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ClassroomService } from '../../../../services/classroom/classroom.service';
import { LessonService } from '../../../../services/lesson/lesson.service';
import { MatChipsModule } from '@angular/material/chips';

type ClassroomPerformance = { classroom: ClassroomDTO, absentStudents: number, presentStudents: number }
type FilteredData = {
  absentStudents?: number
  classroomsPerformances?: ClassroomPerformance[]
  enrolledStudents?: number
  numberOfVisitors?: number
  offers?: number
  presentStudents?: number
  totalClassrooms?: number
  totalLessons?: number
}

@Component({
  selector: 'app-dashboard-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatDividerModule,
    RouterModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    BaseChartDirective,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatChipsModule,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent implements OnInit {

  classrooms: ClassroomDTO[] = []
  activeFilter?: FormGroup
  filter: FormGroup
  filteredLessons: LessonDTO[] = []
  items: ItemDTO[] = []
  lessonsNumbers: number[] = []
  private _filteredData: FilteredData = {}

  constructor(
    private _itemService: ItemService,
    private _formBuilder: FormBuilder,
    private _classroomService: ClassroomService,
    private _lessonService: LessonService,
  ) {
    this.filter = this._buildFilterForm()
    this.currentSemester()
  }

  async ngOnInit(): Promise<void> {
    const [items, classrooms] = await Promise.all([
      firstValueFrom(this._itemService.findAll()),
      firstValueFrom(this._classroomService.findAll())
    ])
    this.items = items
    this.classrooms = classrooms.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    this.extractLessonsNumberByClassrooms()
  }

  private _buildFilterForm(): FormGroup {
    return this._formBuilder.group({
      startDate: [null],
      endDate: [null],
      classrooms: [[]],
      lessons: [[]],
    })
  }

  get absentStudents(): number {
    return this._filteredData.absentStudents || 0
  }

  get classroomByPerformance(): ClassroomPerformance[] {
    return this._filteredData.classroomsPerformances?.sort((a, b) => this.calculateClassroomPerfomance(b) - this.calculateClassroomPerfomance(a)) || []
  }

  get totalLessons(): number {
    return this._filteredData.totalLessons || 0
  }

  get totalClassrooms(): number {
    return this._filteredData.totalClassrooms || 0
  }

  get enrolledStudents(): number {
    return this._filteredData.enrolledStudents || 0
  }

  get numberOfVisitors(): number {
    return this._filteredData.numberOfVisitors || 0
  }

  get offers(): number {
    return this._filteredData.offers || 0
  }

  get presentStudents(): number {
    return this._filteredData.presentStudents || 0
  }

  get barChartData(): ChartConfiguration<'bar'>['data'] {
    return {
      labels: ['Pre.', 'Aus.', 'Vis.'],
      datasets: [
        {
          data: [this.presentStudents, this.absentStudents, this.numberOfVisitors],
          barThickness: 3,
        }
      ]
    }
  }

  get barChartOptions(): ChartConfiguration<'bar'>['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      }
    }
  }

  get performance() {
    const totalStudents = this.presentStudents + this.absentStudents
    if (totalStudents === 0) {
      return 0
    }
    return this.presentStudents / totalStudents
  }

  getTotalQuantityOfItem(item: ItemDTO): number {
    return this.filteredLessons
      .flatMap(lesson => lesson.items ?? [])
      .filter(lessonItem => lessonItem.item?.id === item.id)
      .map(item => item.quantity ?? 0)
      .reduce((a, b) => a! + b!, 0)
  }

  calculateClassroomPerfomance(classroomPerformance: ClassroomPerformance): number {
    return (classroomPerformance.presentStudents / (classroomPerformance.absentStudents + classroomPerformance.presentStudents)) || 0
  }

  extractLessonsNumberByClassrooms() {
    const lessonsNumbers = [... new Set(
      this.classrooms
        .flatMap(classroom => classroom.lessons ?? [])
        .filter(lesson => lesson?.number !== undefined)
        .map(lesson => lesson?.number!))
    ].sort((a, b) => a - b)

    this.lessonsNumbers = lessonsNumbers
  }

  isFilterEmpty(): boolean {
    if (!this.activeFilter) {
      return true
    }
    return Object.values(this.activeFilter.value).every(value => value === null || value === '' || (Array.isArray(value) && value.length === 0))
  }

  async filterData() {
    this._syncActiveFilter()

    const filterClassroom = (classroom: ClassroomDTO) => {
      const classroomFilter = this.filter.get('classrooms')?.value ?? []
      return classroomFilter.length === 0 || classroomFilter.some((c: any) => c.id === classroom.id)
    }

    const filterLessonPeriod = (lesson: SimpleLessonDTO) => {
      const startDate: Date | null = this.filter.get('startDate')?.value;
      const endDate: Date | null = this.filter.get('endDate')?.value;

      if (!lesson.date) return false;

      const lessonDate = new Date(lesson.date);

      return (!startDate || lessonDate >= startDate) &&
        (!endDate || lessonDate <= endDate);
    }

    const filterLessonNumber = (lesson: SimpleLessonDTO) => {
      const lessonFilter = this.filter.get('lessons')?.value ?? []
      return lessonFilter.length === 0 || lessonFilter.some((lessonNumber: number) => lessonNumber === lesson.number)
    }

    const lessonsIds = this.classrooms
      .filter(filterClassroom)
      .flatMap(classroom => classroom.lessons ?? [])
      .filter(filterLessonPeriod)
      .filter(filterLessonNumber)
      .filter(lesson => lesson?.id !== undefined)
      .map(lesson => lesson?.id!)

    this.filteredLessons = await firstValueFrom(this._lessonService.findByIds(lessonsIds))

    this._filteredData = {}

    let enrolledStudents: Set<string> = new Set
    const classroomMap = new Map<number, ClassroomPerformance>()

    this.filteredLessons.forEach(lesson => {
      const classroomId = lesson.classroomId
      const absentStudents = (lesson.attendances ?? []).filter(a => !a.present).length
      const presentStudents = (lesson.attendances ?? []).filter(a => a.present).length

      let performance = classroomMap.get(classroomId!)
      if (!performance) {
        performance = {
          classroom: {
            id: lesson.classroomId,
            name: lesson.classroomName
          },
          presentStudents: 0,
          absentStudents: 0
        }
        classroomMap.set(classroomId!, performance)
      }

      performance.absentStudents += absentStudents
      performance.presentStudents += presentStudents

      this._filteredData.absentStudents = (this._filteredData.absentStudents ?? 0) + absentStudents
      this._filteredData.presentStudents = (this._filteredData.presentStudents ?? 0) + presentStudents
      this._filteredData.numberOfVisitors = (this._filteredData.numberOfVisitors ?? 0) + (lesson.visitors ?? []).length
      this._filteredData.offers = (this._filteredData.offers ?? 0) + (lesson.offers ?? []).map(lessonOffer => lessonOffer.amount ?? 0).reduce((a, b) => a! + b!, 0)
      this._filteredData.totalLessons = (this._filteredData.totalLessons ?? 0) + 1
      lesson.attendances
        ?.map(attendance => attendance.studentId)
        .filter(studentId => studentId !== undefined)
        .forEach(studanteId => enrolledStudents.add(studanteId))
    })
    this._filteredData.classroomsPerformances = Array.from(classroomMap.values())
    this._filteredData.enrolledStudents = enrolledStudents.size
    this._filteredData.totalClassrooms = classroomMap.size
  }

  private _syncActiveFilter() {
    const controlsCopy: { [key: string]: AbstractControl } = {};

    Object.keys(this.filter.controls).forEach(key => {
      const control = this.filter.get(key)
      if (control instanceof FormControl) {
        controlsCopy[key] = new FormControl(control.value, control.validator, control.asyncValidator)
      } else if (control instanceof FormGroup) {
        controlsCopy[key] = new FormGroup({ ...control.controls })
      }
    })
    this.activeFilter = new FormGroup(controlsCopy)
  }


  currentSemester(): void {
    const today = new Date()
    const initialDate = new Date(today.getFullYear(), today.getMonth() < 6 ? 0 : 6, 1)
    const finalDate = new Date(initialDate.getFullYear(), initialDate.getMonth() + 6, 0)

    this.filter.get('startDate')?.setValue(initialDate)
    this.filter.get('endDate')?.setValue(finalDate)
  }

  currentBimester(): void {
    const today = new Date()
    const startMonth = today.getMonth() - (today.getMonth() % 2)
    const initialDate = new Date(today.getFullYear(), startMonth, 1)
    const finalDate = new Date(today.getFullYear(), startMonth + 2, 0)

    this.filter.get('startDate')?.setValue(initialDate)
    this.filter.get('endDate')?.setValue(finalDate)
  }

  currentQuarter(): void {
    const today = new Date()
    const startMonth = today.getMonth() - (today.getMonth() % 3)
    const initialDate = new Date(today.getFullYear(), startMonth, 1)
    const finalDate = new Date(today.getFullYear(), startMonth + 3, 0)

    this.filter.get('startDate')?.setValue(initialDate)
    this.filter.get('endDate')?.setValue(finalDate)
  }

  clearFilter() {
    this.filter.reset()
    this.activeFilter?.reset()
    this.filteredLessons = []
    this.currentSemester()
  }

}
