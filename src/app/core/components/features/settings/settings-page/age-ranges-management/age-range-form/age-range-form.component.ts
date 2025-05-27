import { Component, OnInit } from '@angular/core';
import { AgeRangeDTO } from '../../../../../../models/api/data-contracts';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService, ROUTES_KEYS } from '../../../../../../../shared';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AgeRangeService } from '../../../../../../services/age-range/age-range.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-age-range-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './age-range-form.component.html',
  styleUrl: './age-range-form.component.scss'
})
export class AgeRangeFormComponent implements OnInit {

  ageRange: AgeRangeDTO | undefined
  ageRangeForm: FormGroup
  ROUTES_KEYS = ROUTES_KEYS
  submitted: boolean = false

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _ageRangeService: AgeRangeService,
    private _formBuilder: FormBuilder,
    private _notificationService: NotificationService,
  ) {
    this.ageRangeForm = this._buildAgeRange()
  }

  async ngOnInit(): Promise<void> {
    const ageRangeId = Number(this._route.snapshot.paramMap.get(ROUTES_KEYS.ageRangeId))
    if (!ageRangeId) {
      return
    }
    try {
      this.ageRange = await firstValueFrom(this._ageRangeService.findById(ageRangeId))
      this.ageRangeForm = this._buildAgeRange(this.ageRange)
    } catch (e) {
      this._router.navigate(['/', ROUTES_KEYS.settings.index, ROUTES_KEYS.settings.ageRangeManagement])
    }
  }

  private _buildAgeRange(ageRange: AgeRangeDTO | undefined = undefined): FormGroup {
    return this._formBuilder.group({
      id: [ageRange?.id ?? null],
      name: [ageRange?.name ?? null],
      minAge: [ageRange?.minAge ?? null],
      maxAge: [ageRange?.maxAge ?? null],
      active: [ageRange?.active ?? true],
      createdAt: [ageRange?.createdAt ?? null],
      updatedAt: [ageRange?.updatedAt ?? null]
    })
  }

    save(form: FormGroup) {
      if (form.invalid) {
        console.error(form.errors)
        return
      }
      const ageRange: AgeRangeDTO = form.value
      if (ageRange.id) {
        this._update(ageRange)
      } else {
        this._create(ageRange)
      }
    }

    private _create(ageRange: AgeRangeDTO) {
      this._ageRangeService.create(ageRange).subscribe({
        next: () => {
          this.submitted = true
          this._notificationService.success(`Faixa etária '${ageRange.name}' criada com sucesso`)
          this._router.navigate(['/', ROUTES_KEYS.settings.index, ROUTES_KEYS.settings.ageRangeManagement])
        },
        error: (err) => {
          console.error('Create age range failed.', err)
        }
      })
    }

    private _update(ageRange: AgeRangeDTO) {
      this._ageRangeService.update(ageRange).subscribe({
        next: () => {
          this.submitted = true
          this._notificationService.success(`Faixa etária '${ageRange.name}' alterada com sucesso`)
          this._router.navigate(['/', ROUTES_KEYS.settings.index, ROUTES_KEYS.settings.ageRangeManagement])
        },
        error: (err) => {
          console.error('Update age range failed.', err)
        }
      })
    }

}
