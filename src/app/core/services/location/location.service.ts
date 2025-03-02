import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { StateDTO, CityDTO } from '../../models/api/data-contracts';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private _path = '/locations'

  constructor(
        private _apiService: ApiService,
  ) { }

    findAllStates(): Observable<StateDTO[]> {
      return this._apiService.httpGet(`${this._path}/states`)
    }

    findCitiesByStateId(stateId: number): Observable<CityDTO[]> {
      return this._apiService.httpGet(`${this._path}/states/${stateId}/cities`)
    }
}
