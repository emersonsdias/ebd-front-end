import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { UserDTO, UserRole } from '../../models/api/data-contracts';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _path = '/users'

  constructor(
    private _apiService: ApiService
  ) { }

  create(user: UserDTO): Observable<UserDTO> {
    return this._apiService.httpPost(this._path, user)
  }

  update(user: UserDTO): Observable<UserDTO> {
    return this._apiService.httpPut(`${this._path}/${user.id}`, user)
  }

  findById(userId: string): Observable<UserDTO> {
    return this._apiService.httpGet(`${this._path}/${userId}`)
  }

  findByRoles(userRoles: UserRole[]): Observable<UserDTO[]> {
    return this._apiService.httpGet(`${this._path}/by-role`, { params: new Map([['userRoles', userRoles]]) })
  }

}
