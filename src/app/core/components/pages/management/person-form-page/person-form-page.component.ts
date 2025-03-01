import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Address } from '../../../../models/address.model';
import { City } from '../../../../models/city.model';
import { CommonModule } from '@angular/common';
import { EducationLevel } from '../../../../models/enums/education-level.enum';
import { EnumTranslatePipe, NotificationService, ROUTES_KEYS, Utils } from '../../../../../shared';
import { firstValueFrom } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Gender } from '../../../../models/enums/gender.enum';
import { LocationService } from '../../../../services/location/location.service';
import { MaritalStatus } from '../../../../models/enums/marital-status.enum';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PersonService } from '../../../../services/person/person.service';
import { PhoneNumber } from '../../../../models/phone-number.model';
import { State } from '../../../../models/state.model';
import { Person } from '../../../../models/person.model';

@Component({
  selector: 'app-person-form-page',
  imports: [CommonModule, FormsModule, MatButtonModule, MatButtonToggleModule, MatDatepickerModule, MatDividerModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, EnumTranslatePipe, MatSlideToggleModule, RouterModule],
  templateUrl: './person-form-page.component.html',
  styleUrl: './person-form-page.component.scss'
})
export class PersonFormPageComponent implements OnInit {

  ROUTES_KEYS = ROUTES_KEYS
  cities: City[] = []
  educationLevelList = Object.keys(EducationLevel).map(key => EducationLevel[key as keyof typeof EducationLevel])
  genderList = Object.keys(Gender).map(key => Gender[key as keyof typeof Gender])
  maritalStatusList = Object.keys(MaritalStatus).map(key => MaritalStatus[key as keyof typeof MaritalStatus])
  person: FormGroup
  stateControl = new FormControl<State | null>(null)
  states: State[] = []
  submitted: boolean = false

  constructor(
    private _formBuilder: FormBuilder,
    private _personService: PersonService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _notificationService: NotificationService,
    private _locationService: LocationService,
  ) {
    this.person = this._formBuilder.group({
      id: [null],
      name: [null],
      birthdate: [null],
      email: [null],
      gender: [null],
      educationLevel: [null],
      maritalStatus: [null],
      address: this._buildAddress(),
      phoneNumbers: this._formBuilder.array([]),
      active: [null],
      createdAt: [null],
      updatedAt: [null],
    })
  }

  async ngOnInit(): Promise<void> {
    await setTimeout(() => { }, 0)

    this.states = await firstValueFrom(this._locationService.findAllStates())

    const personId = this._route.snapshot.paramMap.get(ROUTES_KEYS.personId)

    if (personId) {
      this._personService.findById(personId).subscribe({
        next: async personResponse => {
          if (personResponse.address.city?.state.id) {
            this.stateControl.setValue(personResponse.address.city.state)
            this.cities = await firstValueFrom(this._locationService.findCitiesByStateId(personResponse.address.city?.state.id))
          }
          this.person.patchValue(personResponse)
          this.phoneNumbers.clear()
          const phoneNumbers = personResponse.phoneNumbers || []
          phoneNumbers.forEach(pn => this.phoneNumbers.push(this._buildPhoneNumber(pn)))
        },
        error: () => {
          this._notificationService.warning(`Não foi encontrado pessoa com ID '${personId}', redirecionado usuário`)
          this._router.navigate(['../'])
        }
      })
    }
  }

  get phoneNumbers(): FormArray {
    return this.person.get('phoneNumbers') as FormArray
  }

  removePhoneNumber(index: number) {
    const phoneNumbers = this.person.get('phoneNumbers') as FormArray
    phoneNumbers.removeAt(index)
    this.person.setControl('phoneNumbers', phoneNumbers)
  }

  addPhoneNumber() {
    this.phoneNumbers.push(this._buildPhoneNumber())
  }

  private _buildPhoneNumber(phoneNumber: PhoneNumber | null = null) {
    return this._formBuilder.group({
      id: [phoneNumber?.id || null],
      areaCode: [phoneNumber?.areaCode || null],
      phoneNumber: [phoneNumber?.phoneNumber || null],
      createdAt: [phoneNumber?.createdAt || null],
      updatedAt: [phoneNumber?.updatedAt || null]
    })
  }

  private _buildAddress(address: Address | null = null) {
    return this._formBuilder.group({
      id: [address?.id || null],
      street: [address?.street || null],
      number: [address?.number || null],
      complement: [address?.complement || null],
      neighborhood: [address?.neighborhood || null],
      zipCode: [address?.zipCode || null],
      city: [address?.city || null],
      active: [address?.active || null],
      createdAt: [address?.createdAt || null],
      updatedAt: [address?.updatedAt || null]
    })
  }

  changeState(stateId: number): void {
    this._locationService.findCitiesByStateId(stateId).subscribe({
      next: res => this.cities = res
    })
  }

  compareObjectId(obj1: any, obj2: any) {
    return obj1 && obj2 ? (obj1.id === obj2.id) : obj1 === obj2
  }

  save(form: FormGroup) {
    console.log(form.value)
    if (form.invalid) {
      console.error('Invalid form')
      return
    }
    const person: Person = this.person.value
    if (person.id) {
      this.update(person)
    } else {
      this.create(person)
    }
  }

  create(person: Person) {
    this._personService.create(person).subscribe({
      next: () => {
        this.submitted = true
        this._notificationService.success(`Pessoa ${person.name} criada com sucesso`)
        this._router.navigate([ROUTES_KEYS.management])
      },
      error: (err) => {
        console.error('Create person failed.', err)
      }
    })

  }

  update(person: Person) {
    this._personService.update(person).subscribe({
      next: () => {
        this.submitted = true
        this._notificationService.success(`Pessoa ${person.name} alterada com sucesso`)
        this._router.navigate([ROUTES_KEYS.management])
      },
      error: (err) => {
        console.error('Update person failed.', err)
      }
    })
  }

  downloadPersonPdf(person: Person) {
    console.log(person)
    if (!person.id) {
      this._notificationService.error('Não foi possível baixar PDF pois não foi encontrado o ID da pessoa')
      return
    }
    Utils.downloadPdf(person.name, this._personService.findPersonPdf(person.id))
  }

}
