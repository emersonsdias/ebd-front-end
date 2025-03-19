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

  create(item: ItemDTO): Observable<ItemDTO> {
    return this._apiService.httpPost(this._path, item)
  }

  update(item: ItemDTO): Observable<ItemDTO> {
    return this._apiService.httpPut(`${this._path}/${item.id}`, item)
  }

  findById(itemId: number): Observable<ItemDTO> {
    return this._apiService.httpGet(`${this._path}/${itemId}`)
  }

  findAll(): Observable<ItemDTO[]> {
    return this._apiService.httpGet(this._path)
  }
}
