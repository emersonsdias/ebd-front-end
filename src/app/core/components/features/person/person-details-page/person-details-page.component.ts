import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AddressDTO, PersonDTO, PersonReportDTO, PhoneNumberDTO } from '../../../../models/api/data-contracts';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EnumTranslatePipe } from '../../../../../shared/pipes/enum-translate/enum-translate.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService, ROUTES_KEYS, Utils } from '../../../../../shared';
import { PersonService } from '../../../../services/person/person.service';

@Component({
  selector: 'app-person-details-page',
  imports: [
    CommonModule,
    EnumTranslatePipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './person-details-page.component.html',
  styleUrl: './person-details-page.component.scss'
})
export class PersonDetailsPageComponent implements OnInit {

  ROUTES_KEYS = ROUTES_KEYS
  report: PersonReportDTO | undefined

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _personService: PersonService,
    private _notificationService: NotificationService,
  ) { }

  async ngOnInit(): Promise<void> {
    const personId = this._route.snapshot.paramMap.get(ROUTES_KEYS.personId)
    if (!personId) {
      this._router.navigate([ROUTES_KEYS.management])
      return
    }
    this._personService.findPersonReportById(personId).subscribe({
      next: async reportResponse => this.report = reportResponse,
      error: () => {
        this._notificationService.warning(`Não foi encontrado pessoa com ID '${personId}', redirecionado usuário`)
        this._router.navigate([ROUTES_KEYS.management])
      }
    })

  }

  downloadPersonPdf(person: PersonDTO) {
    if (!person.id) {
      this._notificationService.error('Não foi possível baixar PDF pois não foi encontrado o ID da pessoa')
      return
    }
    Utils.downloadPdf(`Relatório ${person.name || person.id}`, this._personService.findPersonPdf(person.id))
  }

  formatPhoneNumbers(phoneNumbers: PhoneNumberDTO[] | undefined): string {
    if (!phoneNumbers) {
      return ''
    }
    return phoneNumbers
      .filter(pn => pn.areaCode && pn.phoneNumber)
      .map(this.formatPhoneNumber)
      .reduce((a, b) => `${a} ${a === '' ? '' : '<br>'} ${b}`, '')
  }

  formatPhoneNumber(phoneNumber: PhoneNumberDTO | undefined): string {
    if (!phoneNumber || !phoneNumber.areaCode || !phoneNumber.phoneNumber) {
      return ''
    }
    const beforeLastFour = phoneNumber.phoneNumber!.slice(0, -4)
    const lastFour = phoneNumber.phoneNumber!.slice(-4)
    return `(${phoneNumber.areaCode}) ${beforeLastFour}-${lastFour}`
  }

  formatAddress(address: AddressDTO | undefined) {
    if (!address) {
      return ''
    }
    return address.street + (address.number ? ', ' + address.number : '') + (address.complement ? ', ' + address.complement : '')
  }

}
