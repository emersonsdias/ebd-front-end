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

    findAllAgeRanges(): Observable<AgeRangeDTO[]> {
      return this._apiService.httpGet(this._path)
    }

}
