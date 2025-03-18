import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { SchoolProfileDTO } from '../../models/api/data-contracts';

@Injectable({
  providedIn: 'root'
})
export class SchoolProfileService {

  private _path = '/school-profiles'

  constructor(
    private _apiService: ApiService
  ) { }

  create(schoolProfile: SchoolProfileDTO): Observable<SchoolProfileDTO> {
    return this._apiService.httpPost(this._path, schoolProfile)
  }

  update(schoolProfile: SchoolProfileDTO): Observable<SchoolProfileDTO> {
    return this._apiService.httpPut(`${this._path}/${schoolProfile.id}`, schoolProfile)
  }

  findAll(): Observable<SchoolProfileDTO[]> {
    return this._apiService.httpGet(`${this._path}`)
  }

  findById(schoolProfileId: number): Observable<SchoolProfileDTO> {
    return this._apiService.httpGet(`${this._path}/${schoolProfileId}`)
  }
}
