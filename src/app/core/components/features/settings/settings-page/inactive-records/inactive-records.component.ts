import { Component, OnInit } from '@angular/core';
import { PersonDTO } from '../../../../../models/api/data-contracts';
import { PersonService } from '../../../../../services/person/person.service';
import { EnumTranslatePipe } from '../../../../../../shared';
import { CommonModule } from '@angular/common';
import { ROUTES_KEYS } from '../../../../../../shared/config/routes-keys.config';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-inactive-records',
  imports: [
    MatButtonModule,
    EnumTranslatePipe,
    CommonModule,
    RouterModule,
    MatIconModule,
    NgbAccordionModule,
  ],
  templateUrl: './inactive-records.component.html',
  styleUrl: './inactive-records.component.scss'
})
export class InactiveRecordsComponent implements OnInit {

  inactivePeople: PersonDTO[] = []
  ROUTES_KEYS = ROUTES_KEYS

  constructor(
    private _personService: PersonService,
  ) { }

  ngOnInit(): void {
    this._personService.findInactive().subscribe({
      next: peopleResponse => this.inactivePeople = peopleResponse
    })
  }


}
