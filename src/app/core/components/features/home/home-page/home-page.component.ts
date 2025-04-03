import { Component, OnInit } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { PersonService } from '../../../../services/person/person.service';
import { PersonDTO } from '../../../../models/api/data-contracts';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { ROUTES_KEYS } from '../../../../../shared/config/routes-keys.config';

@Component({
  selector: 'app-home-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatDividerModule,
    RouterModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {

  ROUTES_KEYS = ROUTES_KEYS
  birthdayPeople: PersonDTO[] = []
  startDate: Date
  endDate: Date
  periodType: 'week' | 'month' = 'week'

  constructor(
    private _personService: PersonService,
  ) {
    const [startDate, endDate] = this.getDateRange(new Date, 'week')
    this.startDate = startDate
    this.endDate = endDate
  }

  async ngOnInit(): Promise<void> {
    this._updatebirthDayPeople()
  }

  private async _updatebirthDayPeople() {
    this.birthdayPeople = await firstValueFrom(this._personService.findByBirthdatePeriod(this.startDate, this.endDate))
  }

  getDateRange(date: Date, rangeType: 'week' | 'month'): [Date, Date] {
    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    if (rangeType === 'week') {
      const startOfWeek = new Date(inputDate)
      startOfWeek.setDate(inputDate.getDate() - inputDate.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      return [startOfWeek, endOfWeek]
    }
    if (rangeType === 'month') {
      const startOfMonth = new Date(inputDate.getFullYear(), inputDate.getMonth(), 1)
      const endOfMonth = new Date(inputDate.getFullYear(), inputDate.getMonth() + 1, 0)
      return [startOfMonth, endOfMonth]
    }

    throw new Error("Invalid range type")
  }

  previousPeriod() {
    if (this.periodType === 'week') {
      const previousDate = new Date(this.startDate);
      previousDate.setDate(previousDate.getDate() - 7);
      [this.startDate, this.endDate] = this.getDateRange(previousDate, 'week');
    } else if (this.periodType === 'month') {
      const previousDate = new Date(this.startDate);
      previousDate.setMonth(previousDate.getMonth() - 1);
      [this.startDate, this.endDate] = this.getDateRange(previousDate, 'month');
    }
    this._updatebirthDayPeople()
  }

  nextPeriod() {
    if (this.periodType === 'week') {
      const nextDate = new Date(this.startDate);
      nextDate.setDate(nextDate.getDate() + 7);
      [this.startDate, this.endDate] = this.getDateRange(nextDate, 'week');
    } else if (this.periodType === 'month') {
      const nextDate = new Date(this.startDate);
      nextDate.setMonth(nextDate.getMonth() + 1);
      [this.startDate, this.endDate] = this.getDateRange(nextDate, 'month');
    }
    this._updatebirthDayPeople()
  }

  changePeriodType(periodType: 'week' | 'month') {
    const [startDate, endDate] = this.getDateRange(this.startDate, periodType)
    this.startDate = startDate
    this.endDate = endDate
    this._updatebirthDayPeople()
  }

  calculateAge(birthdateString: string | undefined): number | undefined {
    if (!birthdateString) {
      return
    }
    const birthdate = new Date(birthdateString)
    const selectedYear = birthdate.getUTCMonth() === this.startDate.getUTCMonth() ? this.startDate.getUTCFullYear() : this.endDate.getUTCFullYear()
    let age = selectedYear - birthdate.getUTCFullYear()

    return age
  }

}
