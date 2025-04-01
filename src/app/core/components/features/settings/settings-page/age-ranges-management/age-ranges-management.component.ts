import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { AgeRangeDTO } from '../../../../../models/api/data-contracts';
import { ROUTES_KEYS } from '../../../../../../shared/config/routes-keys.config';
import { AgeRangeService } from '../../../../../services/age-range/age-range.service';
import { firstValueFrom, min } from 'rxjs';

@Component({
  selector: 'app-age-ranges-management',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    RouterModule,
  ],
  templateUrl: './age-ranges-management.component.html',
  styleUrl: './age-ranges-management.component.scss'
})
export class AgeRangesManagementComponent implements OnInit {

  ageRanges: AgeRangeDTO[] = []
  ROUTES_KEYS = ROUTES_KEYS

  constructor(
    private _ageRangeService: AgeRangeService
  ) { }

  async ngOnInit(): Promise<void> {
    this.ageRanges = (await firstValueFrom(this._ageRangeService.findAll())).sort(this._sortAgeRange())
  }

  private _sortAgeRange() {
    return (a: AgeRangeDTO, b: AgeRangeDTO) => {
      if (a.active === b.active) {
        const maxAgeDiff = (a.maxAge || 999) - (b.maxAge || 999)
        if (maxAgeDiff !== 0) {
          return maxAgeDiff
        }
        const minAgeDiff = (a.minAge || 0) - (b.minAge || 999)
        return minAgeDiff
      }
      return a.active ? -1 : 1
    }
  }

}
