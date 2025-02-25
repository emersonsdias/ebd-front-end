import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnumTranslatePipe } from '../../../../../shared';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Person } from '../../../../models/person.model';
import { PersonService } from '../../../../services/person/person.service';
import { PhoneNumber } from '../../../../models/phone-number.model';
import { RouterModule } from '@angular/router';
import { ROUTES_KEYS } from '../../../../../shared/config/routes-keys.config';
import { Subscription } from 'rxjs';
import { Gender } from '../../../../models/enums/gender.enum';
import { MaritalStatus } from '../../../../models/enums/marital-status.enum';
import { EducationLevel } from '../../../../models/enums/education-level.enum';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';

interface FilterPeople {
  searchTerm: string,
  status: boolean[],
  gender: Gender[],
  maritalStatus: MaritalStatus[],
  educationLevel: EducationLevel[]
}

@Component({
  selector: 'app-managements-page',
  imports: [CommonModule, EnumTranslatePipe, FormsModule, MatButtonModule, MatChipsModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatSelectModule, MatTableModule, ReactiveFormsModule, RouterModule],
  templateUrl: './managements-page.component.html',
  styleUrl: './managements-page.component.scss'
})
export class ManagementsPageComponent implements OnInit, OnDestroy {

  genderList = Object.keys(Gender).map(key => Gender[key as keyof typeof Gender])
  maritalStatusList = Object.keys(MaritalStatus).map(key => MaritalStatus[key as keyof typeof MaritalStatus])
  educationLevelList = Object.keys(EducationLevel).map(key => EducationLevel[key as keyof typeof EducationLevel])

  ROUTES_KEYS = ROUTES_KEYS

  filter: FormGroup
  people: Person[] = []
  filteredPeople: Person[] = []
  displayedColumns: string[] = [
    'actions',
    'name',
    'phoneNumbers',
    'email',
    'birthdate',
    'status',
    'gender',
    'educationLevel',
    'maritalStatus',
  ]
  private _subscriptions: Subscription[] = []

  constructor(
    private _personService: PersonService,
    private _formBuilder: FormBuilder,
  ) {
    this.filter = this._formBuilder.group({
      searchTerm: [null],
      status: [[]],
      gender: [[]],
      educationLevel: [[]],
      maritalStatus: [[]],
    })
  }

  async ngOnInit(): Promise<void> {
    await setTimeout(() => { }, 0)
    const peopleSubscription = this._personService.findAllPeople().subscribe({
      next: res => {
        this.people = res
        this.filteredPeople = res
      },
      error: err => console.error('Erro ao buscar pessoas:', err)
    })
    this._subscriptions.push(peopleSubscription)
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  downloadPersonPdf(personId: string) {
    const subscription = this._personService.downloadPersonPdf(personId).subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response)
        const a = document.createElement('a')
        a.href = url
        a.download = `pessoa_${personId}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
      },
      error: (err) => {
        console.error('Erro ao baixar o arquivo:', err)
      }
    })
    this._subscriptions.push(subscription)
  }

  formatPhoneNumbers(phoneNumbers: PhoneNumber[]): string {
    if (!phoneNumbers) {
      return ''
    }
    return phoneNumbers
      .map(pn => {
        const beforeLastFour = pn.phoneNumber.slice(0, -4)
        const lastFour = pn.phoneNumber.slice(-4)
        return `(${pn.areaCode}) ${beforeLastFour}-${lastFour}`
      })
      .reduce((a, b) => `${a} / ${b}`)
  }

  isFilterEmpty(): boolean {
    return Object.values(this.filter.value).every(value => value === null || value === '' || (Array.isArray(value) && value.length === 0))
  }

  removeFilter(controlName: string, value?: any) {
    const control = this.filter.get(controlName)
    if (!control) return
    if (Array.isArray(control.value)) {
      control.setValue(control.value.filter((item: any) => item !== value))
    } else {
      control.setValue('')
    }
    this.filterPeople()
  }

  filterPeople() {
    if (this.isFilterEmpty()) {
      this.filteredPeople = this.people
      return
    }
    const filter: FilterPeople = this.filter.value
    this.filteredPeople = this.people
      .filter(p => !filter.status || filter.status.length === 0 || filter.status.includes(p.active!))
      .filter(p => !filter.gender || filter.gender.length === 0 || filter.gender.includes(p.gender))
      .filter(p => !filter.educationLevel || filter.educationLevel.length === 0 || filter.educationLevel.includes(p.educationLevel))
      .filter(p => !filter.maritalStatus || filter.maritalStatus.length === 0 || filter.maritalStatus.includes(p.maritalStatus))
      .filter(p => !filter.searchTerm || p.name.toLowerCase().includes(filter.searchTerm.toLowerCase()))
  }


}
