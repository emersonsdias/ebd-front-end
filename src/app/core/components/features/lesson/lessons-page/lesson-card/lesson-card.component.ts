import { Component, Input } from '@angular/core';
import { AttendanceDTO, LessonDTO } from '../../../../../models/api/data-contracts';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { ROUTES_KEYS } from '../../../../../../shared/config/routes-keys.config';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../../services/auth/auth.service';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-lesson-card',
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatDividerModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './lesson-card.component.html',
  styleUrl: './lesson-card.component.scss'
})
export class LessonCardComponent {

  @Input({ required: true }) lesson!: LessonDTO

  isAdmin: Observable<boolean>
  ROUTES_KEYS = ROUTES_KEYS

  constructor(
    _authService: AuthService,
  ) {
    this.isAdmin = _authService.isAdmin()
  }

  countPresentStudents(attendances: AttendanceDTO[] | undefined): number {
    if (!attendances) {
      return 0
    }
    return attendances.filter(a => a.present).length
  }

  countAbsentStudents(attendances: AttendanceDTO[] | undefined): number {
    if (!attendances) {
      return 0
    }
    return attendances.filter(a => !a.present).length
  }

}
