import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { PersonDTO, PersonReportDTO, PersonType } from '../../models/api/data-contracts';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private _path = '/people'

  constructor(
    private _apiService: ApiService,
  ) { }

  create(person: PersonDTO): Observable<PersonDTO> {
    return this._apiService.httpPost(this._path, person)
  }

  update(person: PersonDTO) {
    return this._apiService.httpPut(`${this._path}/${person.id}`, person)
  }

  findById(id: string): Observable<PersonDTO> {
    return this._apiService.httpGet(`${this._path}/${id}`)
  }

  findPersonReportById(id: string): Observable<PersonReportDTO> {
    return this._apiService.httpGet(`${this._path}/${id}/report`)
  }

  findAll(): Observable<PersonDTO[]> {
    return this._apiService.httpGet(this._path)
  }

  findPersonPdf(personId: string): Observable<Blob> {
    const url = `${this._path}/${personId}/report/pdf`;
    return this._apiService.httpGetBlob(`${this._path}/${personId}/report/pdf`)
  }

  findByType(personTypes: PersonType[]): Observable<PersonDTO[]> {
    return this._apiService.httpGet(`${this._path}/by-type`, {params: new Map([['personTypes', personTypes]])})
  }

  findInactive(): Observable<PersonDTO[]> {
    return this._apiService.httpGet(`${this._path}/inactive`)
  }

  findWithoutUser(): Observable<PersonDTO[]> {
    return this._apiService.httpGet(`${this._path}/without-user`)
  }

}
