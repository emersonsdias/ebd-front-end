import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AgeRangeDTO } from '../../models/api/data-contracts';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgeRangeService {

  private _path = '/age-ranges'

  constructor(
    private _apiService: ApiService
  ) { }

  create(ageRange: AgeRangeDTO): Observable<AgeRangeDTO> {
    return this._apiService.httpPost(this._path, ageRange)
  }

  update(ageRange: AgeRangeDTO): Observable<AgeRangeDTO> {
    return this._apiService.httpPut(`${this._path}/${ageRange.id}`, ageRange)
  }

  findById(ageRangeId: number): Observable<AgeRangeDTO> {
    return this._apiService.httpGet(`${this._path}/${ageRangeId}`)
  }

  findAll(): Observable<AgeRangeDTO[]> {
    return this._apiService.httpGet(this._path)
  }
}
