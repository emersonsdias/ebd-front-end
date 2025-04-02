import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { OfferService } from '../../../../services/offer/offer.service';
import { OfferDTOWithLesson } from '../../../../models/api/data-contracts';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ROUTES_KEYS } from '../../../../../shared/config/routes-keys.config';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-finance-page',
  imports: [
    CommonModule,
    MatCardModule,
    BaseChartDirective,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    NgbAccordionModule,
    RouterModule,
    MatListModule,
  ],
  templateUrl: './finance-page.component.html',
  styleUrl: './finance-page.component.scss'
})
export class FinancePageComponent implements OnInit {

  ROUTES_KEYS = ROUTES_KEYS

  dailyOfferData: Map<string, OfferDTOWithLesson[]> | undefined
  reversedDailyOfferData: [string, OfferDTOWithLesson[]][] = []
  selectedMonth: Date = new Date

  totalOfferAmount: number = 0
  totalDaysCount: number = 0
  dailyOffersAverage: number = 0
  lessonOffersAverage: number = 0
  totalLessonsCount: number = 0
  offersByClassroom: Map<string, number> = new Map

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Ofertas' }
    ]
  }
  barChartOptions: ChartConfiguration<'bar'>['options'] = { responsive: true, }

  barChartDataByClassroom: ChartConfiguration<'bar'>['data'] = {
    labels: ['Turmas'],
    datasets: []
  }
  barChartOptionsByClassroom: ChartConfiguration<'bar'>['options'] = { responsive: true, indexAxis: 'x', scales: { x: { beginAtZero: true, }, } }

  constructor(
    private _offerService: OfferService,
  ) { }

  async ngOnInit(): Promise<void> {
    this._updateOffersData(this.selectedMonth)
  }

  private async _updateOffersData(date: Date) {
    this._resetOfferMetrics()

    const [startDate, endDate] = this._getMonthPeriod(date)
    const offers = await firstValueFrom(this._offerService.findByPeriod(startDate, endDate))
    this.barChartData = await this._buildDailyOfferChartData(offers)
    this.dailyOfferData = await this._buildDailyOfferData(offers)
    const dailyOffers = new Set<string>()

    offers.forEach(offer => {
      this.totalOfferAmount += offer?.amount || 0
      this.totalLessonsCount += 1
      dailyOffers.add(offer.lesson?.date || '')

      const classroomName = offer.lesson?.classroomName || ''
      this.offersByClassroom.set(classroomName, (this.offersByClassroom.get(classroomName) || 0) + (offer.amount || 0))
    })

    this.totalDaysCount = dailyOffers.size
    this.dailyOffersAverage = this.totalOfferAmount / this.totalDaysCount
    this.lessonOffersAverage = this.totalOfferAmount / this.totalLessonsCount

    this.barChartDataByClassroom = {
      labels: ['Turmas'],
      datasets: Array.from(this.offersByClassroom.entries()).map(([key, value]) => ({
        data: [value],
        label: key,
      })),
    }

    this.reversedDailyOfferData = Array.from(this.dailyOfferData.entries()).reverse();
  }

  private _resetOfferMetrics() {
    this.totalOfferAmount = 0
    this.dailyOffersAverage = 0
    this.totalDaysCount = 0
    this.lessonOffersAverage = 0
    this.totalLessonsCount = 0
    this.offersByClassroom.clear()
  }

  private _getMonthPeriod(date: Date): [string, string] {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const startDate = `${year}-${month}-01`;

    const lastDay = new Date(year, date.getMonth() + 1, 0).getDate();
    const endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

    return [startDate, endDate];
  }

  async previousMonth() {
    this.selectedMonth = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth() - 1, 1)
    this._updateOffersData(this.selectedMonth)
  }

  async nextMonth() {
    this.selectedMonth = new Date(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth() + 1, 1)
    this._updateOffersData(this.selectedMonth)
  }

  private async _buildDailyOfferChartData(offers: OfferDTOWithLesson[]): Promise<ChartConfiguration<'bar'>['data']> {
    const date = new Date(offers.find(offer => offer.lesson?.date)?.lesson?.date!)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const lastDay = new Date(year, month, 0).getDate()

    const groupedOffers = offers.reduce((acc, offer) => {
      const date = offer.lesson?.date?.split('-')[2] ?? 'Unknown Date'
      const amount = offer.amount ?? 0

      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date] += amount

      return acc
    }, {} as Record<string, number>)

    const labels = Array.from({ length: lastDay }, (_, i) => String(i + 1).padStart(2, '0'))
    const data = labels.map(label => groupedOffers[label] || 0)
    return {
      labels,
      datasets: [
        {
          label: 'Total de Ofertas por Data',
          data
        },
      ],
    }
  }

  private async _buildDailyOfferData(offers: OfferDTOWithLesson[]): Promise<Map<string, OfferDTOWithLesson[]>> {
    const groupedOffers = new Map<string, OfferDTOWithLesson[]>()

    offers.forEach(offer => {
      const date = offer.lesson?.date ?? 'Unknown Date'

      if (!groupedOffers.has(date)) {
        groupedOffers.set(date, [])
      }
      groupedOffers.get(date)?.push(offer)
    })
    return groupedOffers
  }

  getTopClassrooms(): { classroom: string, amount: number }[] {
    return Array.from(this.offersByClassroom.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([classroom, amount]) => ({ classroom, amount }))
  }

}
