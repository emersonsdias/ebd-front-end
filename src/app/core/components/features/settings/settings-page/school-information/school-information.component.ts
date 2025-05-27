import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AddressDTO, CityDTO, SchoolProfileDTO, StateDTO } from '../../../../../models/api/data-contracts';
import { SchoolProfileService } from '../../../../../services/school-profile/school-profile.service';
import { LocationService } from '../../../../../services/location/location.service';
import { firstValueFrom } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationService, ViaCepService } from '../../../../../../shared';

@Component({
  selector: 'app-school-information',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './school-information.component.html',
  styleUrl: './school-information.component.scss'
})
export class SchoolInformationComponent implements OnInit {

  schoolProfileForm: FormGroup
  schoolProfile: SchoolProfileDTO | undefined
  states: StateDTO[] = []
  cities: CityDTO[] = []

  constructor(
    private _formBuilder: FormBuilder,
    private _locationService: LocationService,
    private _schoolProfileService: SchoolProfileService,
    private _notificationService: NotificationService,
    private _viaCepService: ViaCepService,
  ) {
    this.schoolProfileForm = this._buildSchoolProfileForm()
  }

  async ngOnInit(): Promise<void> {
    this.states = await firstValueFrom(this._locationService.findAllStates())
    this._schoolProfileService.findAll().subscribe({
      next: async schoolProfilesResponse => {
        this.schoolProfile = schoolProfilesResponse.length > 0 ? schoolProfilesResponse[0] || undefined : undefined
        this.schoolProfileForm = this._buildSchoolProfileForm(this.schoolProfile)
        this.schoolProfileForm.disable()
      }
    })
  }

  private _buildSchoolProfileForm(schoolProfile: SchoolProfileDTO | undefined = undefined): FormGroup {
    if (schoolProfile?.address?.city?.state) {
      this.changeState(schoolProfile?.address?.city?.state.id)
    }
    return this._formBuilder.group({
      id: [schoolProfile?.id || null],
      name: [schoolProfile?.name || null],
      subtitle: [schoolProfile?.subtitle || null],
      address: this._buildAddress(schoolProfile?.address || undefined),
      active: [schoolProfile?.active || true],
      createdAt: [schoolProfile?.createdAt || null],
      updatedAt: [schoolProfile?.updatedAt || null]
    })
  }

  private _buildAddress(address: AddressDTO | undefined = undefined): FormGroup {
    return this._formBuilder.group({
      id: [address?.id || null],
      street: [address?.street || null],
      number: [address?.number || null],
      complement: [address?.complement || null],
      neighborhood: [address?.neighborhood || null],
      zipCode: [address?.zipCode || null],
      state: [address?.city?.state || null],
      city: [address?.city || null],
      active: [address?.active || true],
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
    if (form.invalid) {
      console.error(form.errors)
      return
    }
    const schoolProfile: SchoolProfileDTO = form.value

    if (schoolProfile.id) {
      this.update(schoolProfile)
    } else {
      this.create(schoolProfile)
    }
  }

  create(schoolProfile: SchoolProfileDTO) {
    this._schoolProfileService.create(schoolProfile).subscribe({
      next: schoolProfileResponse => {
        this.schoolProfile = schoolProfileResponse
        this.schoolProfileForm = this._buildSchoolProfileForm(schoolProfileResponse)
        this._notificationService.success('Perfil da escola criado com sucesso')
        this.schoolProfileForm.disable()
      }
    })
  }

  update(schoolProfile: SchoolProfileDTO) {
    this._schoolProfileService.update(schoolProfile).subscribe({
      next: schoolProfileResponse => {
        this.schoolProfile = schoolProfileResponse
        this.schoolProfileForm = this._buildSchoolProfileForm(schoolProfileResponse)
        this._notificationService.success('Perfil da alterado criado com sucesso')
        this.schoolProfileForm.disable()
      }
    })
  }

  cancel() {
    this.schoolProfileForm = this._buildSchoolProfileForm(this.schoolProfile)
    this.schoolProfileForm.disable()
  }

  async findZipCode(zipCode: string) {
    if (zipCode.length !== 8) {
      return
    }
    const address = await this._viaCepService.findZipCode(zipCode)
    this.changeState(address.city?.state?.id)
    this.schoolProfileForm.get('address')?.patchValue(address)
    this.schoolProfileForm.get('address')?.get('state')?.patchValue(address?.city?.state)
  }

}
