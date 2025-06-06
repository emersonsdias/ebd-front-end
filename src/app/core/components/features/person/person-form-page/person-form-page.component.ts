import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AddressDTO, CityDTO, EducationLevel, Gender, MaritalStatus, PersonDTO, PersonType, PhoneNumberDTO, StateDTO } from '../../../../models/api/data-contracts';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EnumTranslatePipe, minArrayLength, NotificationService, ROUTES_KEYS, Utils, ViaCepService } from '../../../../../shared';
import { firstValueFrom } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocationService } from '../../../../services/location/location.service';
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

@Component({
  selector: 'app-person-form-page',
  imports: [
    CommonModule,
    EnumTranslatePipe,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './person-form-page.component.html',
  styleUrl: './person-form-page.component.scss'
})
export class PersonFormPageComponent implements OnInit {

  ROUTES_KEYS = ROUTES_KEYS
  cities: CityDTO[] = []
  educationLevelList = Object.keys(EducationLevel).map(key => EducationLevel[key as keyof typeof EducationLevel])
  genderList = Object.keys(Gender).map(key => Gender[key as keyof typeof Gender])
  maritalStatusList = Object.keys(MaritalStatus).map(key => MaritalStatus[key as keyof typeof MaritalStatus])
  personTypeList = Object.keys(PersonType).map(key => PersonType[key as keyof typeof PersonType])
  person: FormGroup
  stateControl = new FormControl<StateDTO | null>(null)
  states: StateDTO[] = []
  submitted: boolean = false

  constructor(
    private _formBuilder: FormBuilder,
    private _personService: PersonService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _notificationService: NotificationService,
    private _locationService: LocationService,
    private _viaCepService: ViaCepService,
  ) {
    this.person = this._formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      birthdate: [null],
      email: [null, [Validators.email]],
      gender: [null, [Validators.required]],
      educationLevel: [null],
      maritalStatus: [null],
      address: this._buildAddress(),
      phoneNumbers: this._formBuilder.array([]),
      types: this._formBuilder.control([PersonType.STUDENT], [minArrayLength(1)]),
      active: [true],
      createdAt: [null],
      updatedAt: [null],
    })
  }

  async ngOnInit(): Promise<void> {
    this.states = await firstValueFrom(this._locationService.findAllStates())

    const personId = this._route.snapshot.paramMap.get(ROUTES_KEYS.personId)

    if (personId) {
      this._personService.findById(personId).subscribe({
        next: async personResponse => {
          if (personResponse.address?.city?.state?.id) {
            this.stateControl.setValue(personResponse.address.city.state)
            this.cities = await firstValueFrom(this._locationService.findCitiesByStateId(personResponse.address.city?.state.id))
          }
          this.person.patchValue(personResponse)
          this.phoneNumbers.clear()
          const phoneNumbers = personResponse.phoneNumbers || []
          phoneNumbers.forEach(pn => this.phoneNumbers.push(this._buildPhoneNumber(pn)))
        },
        error: () => {
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

  private _buildPhoneNumber(phoneNumber: PhoneNumberDTO | null = null) {
    return this._formBuilder.group({
      id: [phoneNumber?.id || null],
      areaCode: [phoneNumber?.areaCode || null],
      phoneNumber: [phoneNumber?.phoneNumber || null],
      createdAt: [phoneNumber?.createdAt || null],
      updatedAt: [phoneNumber?.updatedAt || null]
    })
  }

  private _buildAddress(address: AddressDTO | null = null) {
    return this._formBuilder.group({
      id: [address?.id || null],
      street: [address?.street || null],
      number: [address?.number || null],
      complement: [address?.complement || null],
      neighborhood: [address?.neighborhood || null],
      zipCode: [address?.zipCode || null],
      city: [address?.city || null],
      createdAt: [address?.createdAt || null],
      updatedAt: [address?.updatedAt || null]
    })
  }

  async changeState(stateId: number | undefined): Promise<void> {
    if (!stateId) {
      this.cities = []
      return
    }
    this.cities = await firstValueFrom(this._locationService.findCitiesByStateId(stateId))
  }

  compareObjectId(obj1: any, obj2: any) {
    return obj1 && obj2 ? (obj1.id === obj2.id) : obj1 === obj2
  }

  save(form: FormGroup) {
    this.markAllAsTouched(form)
    if (form.invalid) {
      console.error('Invalid form')
      return
    }
    const person: PersonDTO = this.person.value
    if (person.id) {
      this.update(person)
    } else {
      this.create(person)
    }
  }

  create(person: PersonDTO) {
    this._personService.create(person).subscribe({
      next: (res) => {
        this.submitted = true
        this._notificationService.success(`Pessoa ${person.name} criada com sucesso`)
        this._router.navigate(['/', ROUTES_KEYS.management, ROUTES_KEYS.people, res.id])
      },
      error: (err) => {
        console.error('Create person failed.', err)
      }
    })
  }

  update(person: PersonDTO) {
    this._personService.update(person).subscribe({
      next: (res) => {
        this.submitted = true
        this._notificationService.success(`Pessoa ${person.name} alterada com sucesso`)
        this._router.navigate(['/', ROUTES_KEYS.management, ROUTES_KEYS.people, res.id])
      },
      error: (err) => {
        console.error('Update person failed.', err)
      }
    })
  }

  downloadPersonPdf(person: PersonDTO) {
    if (!person.id) {
      this._notificationService.error('Não foi possível baixar PDF pois não foi encontrado o ID da pessoa')
      return
    }
    Utils.downloadPdf(`Relatòrio ${person.name || person.id}`, this._personService.findPersonPdf(person.id))
  }

  async findZipCode(zipCode: string) {
    if (zipCode.length !== 8) {
      return
    }
    const address = await this._viaCepService.findZipCode(zipCode)
    this.changeState(address.city?.state?.id)
    this.person.get('address')?.patchValue(address)
    this.stateControl.setValue(address?.city?.state || null)
  }

  markAllAsTouched(form: FormGroup) {
  Object.values(form.controls).forEach(control => {
    control.markAsTouched()
    if (control instanceof FormGroup) {
      this.markAllAsTouched(control)
    }
  });
}

}
