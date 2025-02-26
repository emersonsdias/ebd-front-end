import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonService } from '../../../../services/person/person.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { EnumTranslatePipe, NotificationService, ROUTES_KEYS } from '../../../../../shared';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { Gender } from '../../../../models/enums/gender.enum';
import { MaritalStatus } from '../../../../models/enums/marital-status.enum';
import { EducationLevel } from '../../../../models/enums/education-level.enum';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-person-form-page',
  imports: [CommonModule, FormsModule, MatButtonToggleModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, EnumTranslatePipe, MatSlideToggleModule],
  templateUrl: './person-form-page.component.html',
  styleUrl: './person-form-page.component.scss'
})
export class PersonFormPageComponent implements OnInit {

  person: FormGroup
  genderList = Object.keys(Gender).map(key => Gender[key as keyof typeof Gender])
  maritalStatusList = Object.keys(MaritalStatus).map(key => MaritalStatus[key as keyof typeof MaritalStatus])
  educationLevelList = Object.keys(EducationLevel).map(key => EducationLevel[key as keyof typeof EducationLevel])


  constructor(
    private _formBuilder: FormBuilder,
    private _personService: PersonService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _notificationService: NotificationService
  ) {
    this.person = this._formBuilder.group({
      id: [null],
      name: [null],
      birthdate: [null],
      email: [null],
      gender: [null],
      educationLevel: [null],
      maritalStatus: [null],
      address: [null],
      phoneNumbers: [null],
      active: [null],
      createdAt: [null],
      updatedAt: [null]
    })
  }

  async ngOnInit(): Promise<void> {
    await setTimeout(() => { }, 0)
    const personId = this._route.snapshot.paramMap.get(ROUTES_KEYS.personId)
    if (personId) {
      this._personService.findById(personId).subscribe({
        next: res => this.person.setValue(res),
        error: () => {
          this._notificationService.warning(`Não foi encontrado pessoa com ID '${personId}', redirecionado usuário`)
          this._router.navigate(['../'])
        }
      })
    }
  }

}
