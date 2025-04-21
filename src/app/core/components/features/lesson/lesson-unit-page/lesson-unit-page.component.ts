import { Component, OnInit } from '@angular/core';
import { LessonService } from '../../../../services/lesson/lesson.service';
import { ActivatedRoute } from '@angular/router';
import { ROUTES_KEYS } from '../../../../../shared';
import { firstValueFrom } from 'rxjs';
import { ItemDTO, LessonDTO, LessonItemDTO, LessonStatus, SchoolProfileDTO } from '../../../../models/api/data-contracts';
import { SchoolProfileService } from '../../../../services/school-profile/school-profile.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ItemService } from '../../../../services/item/item.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface LessonUnitReport {
  classroomName?: string,
  enrolled?: number,
  absent?: number,
  present?: number,
  visitors?: number,
  items?: LessonItemDTO[],
  offers?: number
}

@Component({
  selector: 'app-lesson-unit-page',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './lesson-unit-page.component.html',
  styleUrl: './lesson-unit-page.component.scss'
})
export class LessonUnitPageComponent implements OnInit {

  lessonNumber?: number
  startDate?: string
  endDate?: string

  items: ItemDTO[] = []
  lessons: LessonDTO[] = []
  schoolProfile: SchoolProfileDTO | undefined

  reportDataSource = new MatTableDataSource<LessonUnitReport>([])
  displayedColumns: string[] = []

  constructor(
    private _route: ActivatedRoute,
    private _lessonService: LessonService,
    private _itemService: ItemService,
    private _schoolProfileService: SchoolProfileService
  ) { }

  async ngOnInit(): Promise<void> {
    const params = await firstValueFrom(this._route.queryParams)

    this.lessonNumber = params[ROUTES_KEYS.units.params.lessonNumber]
    this.startDate = params[ROUTES_KEYS.units.params.startDate]
    this.endDate = params[ROUTES_KEYS.units.params.endDate]

    const options = {
      lessonNumber: this.lessonNumber,
      startDate: this.startDate,
      endDate: this.endDate,
      lessonStatus: LessonStatus.FINALIZED
    }

    const [lessons, schoolProfiles, items] = await Promise.all([
      firstValueFrom(this._lessonService.findByOptions(options)),
      firstValueFrom(this._schoolProfileService.findAll()),
      firstValueFrom(this._itemService.findAll())
    ])

    this.lessons = lessons
    this.schoolProfile = schoolProfiles[0]
    this.items = items

    this._buildDisplayedColumns()
    const report: LessonUnitReport[] = this.lessons.map(lesson => this.convertLessonToReport(lesson)).sort(this._sortReportByName())
    this.reportDataSource.data = report
  }

  private _sortReportByName() {
    return (a: LessonUnitReport, b: LessonUnitReport) => {
      if (a.classroomName && b.classroomName) {
        return a.classroomName.localeCompare(b.classroomName)
      }
      return a.classroomName ? 1 : -1
    }
  }

  convertLessonToReport(lesson: LessonDTO): LessonUnitReport {
    const report: LessonUnitReport = {
      classroomName: lesson.classroomName,
      enrolled: lesson.attendances?.length,
      absent: lesson.attendances?.filter(a => !a.present).length,
      present: lesson.attendances?.filter(a => a.present).length,
      visitors: lesson.visitors?.length,
      items: lesson.items,
      offers: lesson.offers?.filter(o => o.amount).map(o => o.amount!).reduce((a, b) => a + b, 0)
    }
    return report;
  }

  private _buildDisplayedColumns() {
    const itemsNames: string[] = this.items.filter(item => item.name !== undefined).map(item => item.name!)
    this.displayedColumns = [
      'classroomName',
      'enrolled',
      'absent',
      'present',
      'visitors',
      ...itemsNames,
      'offers',
      'performance'
    ]
  }

  countItems(items: LessonItemDTO[], item: ItemDTO) {
    return items.filter(i => i.item?.id === item.id)
      .filter(i => i.quantity !== undefined)
      .map(i => i.quantity!)
      .reduce((a, b) => a + b, 0)
  }

  countItemsTotal(item: ItemDTO) {
    return this.reportDataSource.data.flatMap(lesson => lesson.items)
      .filter(i => i?.item && i?.quantity)
      .filter(i => i?.item?.id === item.id)
      .map(i => i?.quantity!)
      .reduce((a, b) => a + b, 0)
  }

  getTotal(field: keyof LessonUnitReport): number {
    return this.reportDataSource.data.reduce((sum, row) => {
      const value = row[field]
      return typeof value === 'number' ? sum + value : sum
    }, 0)
  }

  get classroomsByPerformance(): LessonUnitReport[] {
    const sortReportData = (a: LessonUnitReport, b: LessonUnitReport) => {
      const performanceA = (a.present || 0) / (a.enrolled || 0) || 0
      const performanceB = (b.present || 0) / (b.enrolled || 0) || 0
      return performanceB - performanceA
    }
    return [...this.reportDataSource.data].sort(sortReportData)
  }

}
