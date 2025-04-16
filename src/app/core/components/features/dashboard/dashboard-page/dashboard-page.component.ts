import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ClassroomDTO, ItemDTO } from '../../../../models/api/data-contracts';
import { ItemService } from '../../../../services/item/item.service';
import { firstValueFrom } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';


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
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent implements OnInit {

  absentStudents: number = 1
  classroomByPerformance: {classroom: ClassroomDTO, performance: number}[] = [
    { classroom: {name: 'Adultos'}, performance: 1 },
    { classroom: {name: 'Jovens'}, performance: 0.8 },
    { classroom: {name: 'Jóias'}, performance: 0.5 },
    { classroom: {name: 'Crianças'}, performance: 0.4 },
    { classroom: {name: 'Senior'}, performance: 0.2 },
  ]
  enrolledStudents: number = 10
  items: ItemDTO[] = []
  numberOfVisitors: number = 2
  offers: number = 0
  presentStudents: number = 5

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Pre.', 'Aus.', 'Vis.'],
    datasets: [
      {
        data: [this.presentStudents, this.absentStudents, this.numberOfVisitors],
        barThickness: 3,
      }
    ]
  }
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  }

  constructor(
    private _itemService: ItemService
  ) { }

  async ngOnInit(): Promise<void> {
    this.items = await firstValueFrom(this._itemService.findAll())
  }

  get performance() {
    if (this.enrolledStudents === 0) {
      return 0
    }
    return this.presentStudents / this.enrolledStudents
  }

}
