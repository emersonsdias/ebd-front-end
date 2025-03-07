import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { ItemDTO } from '../../models/api/data-contracts';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private _path = '/items'

  constructor(
    private _apiService: ApiService
  ) { }

  findAll(): Observable<ItemDTO[]> {
    return this._apiService.httpGet(this._path)
  }
}
