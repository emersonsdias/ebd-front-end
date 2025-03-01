import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { State } from '../../models/state.model';
import { Observable } from 'rxjs';
import { City } from '../../models/city.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private _path = '/locations'

  constructor(
        private _apiService: ApiService,
  ) { }

    findAllStates(): Observable<State[]> {
      return this._apiService.httpGet(`${this._path}/states`)
    }

    findCitiesByStateId(stateId: number): Observable<City[]> {
      return this._apiService.httpGet(`${this._path}/states/${stateId}/cities`)
    }
}
