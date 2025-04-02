import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { OfferDTOWithLesson } from '../../models/api/data-contracts';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  private _path = '/offers'

  constructor(
    private _apiService: ApiService
  ) { }

  findByPeriod(startDate: string, endDate: string): Observable<OfferDTOWithLesson[]> {
    const params = new Map
    params.set('startDate', startDate)
    params.set('endDate', endDate)
    return this._apiService.httpGet(this._path, { params })
  }

}
