import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnumTranslatePipe } from '../../../../../shared';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { Person } from '../../../../models/person.model';
import { PersonService } from '../../../../services/person/person.service';
import { PhoneNumber } from '../../../../models/phone-number.model';
import { RouterModule } from '@angular/router';
import { ROUTES_KEYS } from '../../../../../shared/config/routes-keys.config';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-managements-page',
  imports: [CommonModule, EnumTranslatePipe, MatButtonModule, MatIconModule, MatMenuModule, MatTableModule, RouterModule],
  templateUrl: './managements-page.component.html',
  styleUrl: './managements-page.component.scss'
})
export class ManagementsPageComponent implements OnInit, OnDestroy {

  ROUTES_KEYS = ROUTES_KEYS
  people: Person[] = []
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
  ];
  private _subscriptions: Subscription[] = [];

  constructor(
    private _personService: PersonService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await setTimeout(() => { }, 0)
    const peopleSubscription = this._personService.findAllPeople().subscribe({
      next: res => this.people = res,
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
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pessoa_${personId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erro ao baixar o arquivo:', err);
      }
    });
    this._subscriptions.push(subscription);
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

}
