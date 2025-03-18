import { Component, OnInit } from '@angular/core';
import { PersonDTO } from '../../../../../models/api/data-contracts';
import { PersonService } from '../../../../../services/person/person.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { EnumTranslatePipe } from '../../../../../../shared';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-inactive-records',
  imports: [
    MatExpansionModule,
    EnumTranslatePipe,
    CommonModule,
  ],
  templateUrl: './inactive-records.component.html',
  styleUrl: './inactive-records.component.scss'
})
export class InactiveRecordsComponent implements OnInit {

  inactivePeople: PersonDTO[] = []

  constructor(
    private _personService: PersonService,
  ) { }

  ngOnInit(): void {
    this._personService.findInactive().subscribe({
      next: peopleResponse => this.inactivePeople = peopleResponse
    })
  }


}
