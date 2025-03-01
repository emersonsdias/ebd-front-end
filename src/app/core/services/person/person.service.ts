import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { Person } from '../../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private _path = '/people'

  constructor(
    private _apiService: ApiService,
  ) { }

  create(person: Person): Observable<Person> {
    return this._apiService.httpPost(this._path, person)
  }

  update(person: Person) {
    return this._apiService.httpPut(`${this._path}/${person.id}`, person)
  }

  findById(id: string): Observable<Person> {
    return this._apiService.httpGet(`${this._path}/${id}`)
  }

  findAllPeople(): Observable<Person[]> {
    return this._apiService.httpGet(this._path)
  }

  downloadPersonPdf(personId: string): Observable<Blob> {
    const url = `${this._path}/${personId}/report/pdf`;
    return this._apiService.httpGetBlob(`${this._path}/${personId}/report/pdf`)
  }

}
