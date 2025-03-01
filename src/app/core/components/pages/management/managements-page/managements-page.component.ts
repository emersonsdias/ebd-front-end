import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EducationLevel } from '../../../../models/enums/education-level.enum';
import { EnumTranslatePipe } from '../../../../../shared';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Gender } from '../../../../models/enums/gender.enum';
import { MaritalStatus } from '../../../../models/enums/marital-status.enum';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Person } from '../../../../models/person.model';
import { PersonService } from '../../../../services/person/person.service';
import { PhoneNumber } from '../../../../models/phone-number.model';
import { RouterModule } from '@angular/router';
import { ROUTES_KEYS } from '../../../../../shared/config/routes-keys.config';
import { Subscription } from 'rxjs';


interface FilterPeople {
  searchTerm: string,
  status: boolean[],
  gender: Gender[],
  maritalStatus: MaritalStatus[],
  educationLevel: EducationLevel[],
  startBirthdate: Date,
  endBirthdate: Date
}

@Component({
  selector: 'app-managements-page',
  imports: [CommonModule, EnumTranslatePipe, FormsModule, MatButtonModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatSelectModule, MatSortModule, MatTableModule, ReactiveFormsModule, RouterModule],
  templateUrl: './managements-page.component.html',
  styleUrl: './managements-page.component.scss',
  providers: [EnumTranslatePipe]
})
export class ManagementsPageComponent implements OnInit, AfterViewInit, OnDestroy {

  genderList = Object.keys(Gender).map(key => Gender[key as keyof typeof Gender])
  maritalStatusList = Object.keys(MaritalStatus).map(key => MaritalStatus[key as keyof typeof MaritalStatus])
  educationLevelList = Object.keys(EducationLevel).map(key => EducationLevel[key as keyof typeof EducationLevel])

  ROUTES_KEYS = ROUTES_KEYS

  filter: FormGroup
  people: Person[] = []
  filteredPeople = new MatTableDataSource<Person>([]);
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
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _personService: PersonService,
    private _formBuilder: FormBuilder,
    private _enumTranslatePipe: EnumTranslatePipe
  ) {
    this.filter = this._formBuilder.group({
      searchTerm: [null],
      status: [[]],
      gender: [[]],
      educationLevel: [[]],
      maritalStatus: [[]],
      startBirthdate: null,
      endBirthdate: null
    })
  }

  async ngOnInit(): Promise<void> {
    await setTimeout(() => { }, 0)
    const peopleSubscription = this._personService.findAllPeople().subscribe({
      next: res => {
        this.people = res
        this.filterPeople()
      },
      error: err => console.error('Erro ao buscar pessoas:', err)
    })
    this._subscriptions.push(peopleSubscription)

    const valueChangesSubscription = this.filter.valueChanges.subscribe(() => {
      this.filterPeople()
    })
    this._subscriptions.push(valueChangesSubscription)
  }

  async ngAfterViewInit(): Promise<void> {
    const MAX_ATTEMPTS = 10
    let count = 0
    do {
      await new Promise((resolve) =>
        setTimeout(() => {
          if (this.sort) {
            this.filteredPeople.sort = this.sort;
            this.filteredPeople.sortingDataAccessor = (data: Person, sortHeaderId: string) => {
              switch (sortHeaderId) {
                case 'maritalStatus':
                case 'gender':
                case 'educationLevel':
                  return this._enumTranslatePipe.transform(data[sortHeaderId])
                case 'birthdate':
                  if (data.birthdate) {
                    return data.birthdate.substring(5,10)
                  }
                  return ''
                default:
                  return (data as any)[sortHeaderId]
              }
            }
          }
          resolve(null)
        }, count * 100)
      )
      count++;
    } while (!this.filteredPeople.sort && count < MAX_ATTEMPTS);
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
      .reduce((a, b) => `${a} / ${b}`, '')
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
      this.filteredPeople.data = this.people
      return
    }
    const filter: FilterPeople = this.filter.value

    this.filteredPeople.data = this.people
      .filter(p => !filter.status || filter.status.length === 0 || filter.status.includes(p.active!))
      .filter(p => !filter.gender || filter.gender.length === 0 || filter.gender.includes(p.gender))
      .filter(p => !filter.educationLevel || filter.educationLevel.length === 0 || filter.educationLevel.includes(p.educationLevel))
      .filter(p => !filter.maritalStatus || filter.maritalStatus.length === 0 || filter.maritalStatus.includes(p.maritalStatus))
      .filter(p => !filter.searchTerm || p.name?.toLowerCase().includes(filter.searchTerm.toLowerCase()) || p.email?.toLowerCase().includes(filter.searchTerm.toLowerCase()))
      .filter(p => {
        if (!filter.startBirthdate || !filter.endBirthdate) {
          return true
        }
        const birthdate = new Date(p.birthdate + 'T03:00:00Z')
        const startBirthdate = new Date(filter.startBirthdate)
        const endBirthdate = new Date(filter.endBirthdate)

        const [dayStart, monthStart] = [startBirthdate.getDate(), startBirthdate.getMonth() + 1]
        const [dayEnd, monthEnd] = [endBirthdate.getDate(), endBirthdate.getMonth() + 1]
        const [birthDay, birthMonth] = [birthdate.getDate(), birthdate.getMonth() + 1]

        const numA = monthStart * 100 + dayStart
        const numB = monthEnd * 100 + dayEnd
        const numC = birthMonth * 100 + birthDay

        if (numA <= numB) {
          return numC >= numA && numC <= numB
        } else {
          return numC >= numA || numC <= numB
        }
      })
  }

  pastWeek() {
    const today = new Date()
    const day = today.getDay()
    const initialDate = new Date(today)
    initialDate.setDate(today.getDate() - day - 7)
    const finalDate = new Date(today)
    finalDate.setDate(today.getDate() - day - 1)

    this.filter.get('startBirthdate')?.setValue(initialDate)
    this.filter.get('endBirthdate')?.setValue(finalDate)
  }

  thisWeek() {
    const today = new Date()
    const day = today.getDay()

    const initialDate = new Date(today)
    initialDate.setDate(today.getDate() - day)

    const finalDate = new Date(today)
    finalDate.setDate(today.getDate() - day + 6)

    this.filter.get('startBirthdate')?.setValue(initialDate)
    this.filter.get('endBirthdate')?.setValue(finalDate)
  }

  nextWeek() {
    const today = new Date()
    const day = today.getDay()

    const initialDate = new Date(today)
    initialDate.setDate(today.getDate() - day + 7)

    const finalDate = new Date(today)
    finalDate.setDate(today.getDate() - day + 13)

    this.filter.get('startBirthdate')?.setValue(initialDate)
    this.filter.get('endBirthdate')?.setValue(finalDate)
  }


}
