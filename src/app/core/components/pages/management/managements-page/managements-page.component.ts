import { Component, OnDestroy, OnInit } from '@angular/core';
import { Person } from '../../../../models/person.model';
import { PersonService } from '../../../../services/person/person.service';
import { Subscription } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-managements-page',
  imports: [MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './managements-page.component.html',
  styleUrl: './managements-page.component.scss'
})
export class ManagementsPageComponent implements OnInit, OnDestroy {

  people: Person[] = []
  displayedColumns: string[] = ['id', 'name', 'birthdate', 'actions'];
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




}
