import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CredentialsDTO, TokenResponseDTO, UserRole } from '../../models/api/data-contracts';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _path = `/auth`
  private _jwtHelper: JwtHelperService = new JwtHelperService()
  private _successfulAuthenticated$: Subject<boolean> = new Subject<boolean>()
  private _isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  private _isAdmin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(
    private _apiService: ApiService,
    private _storageService: StorageService,
    private _router: Router
  ) { }

  login(username: string, password: string, keepLoogedIn: boolean = false): Observable<void> {
    const CREDENTIALS: CredentialsDTO = { username: username, password: password }
    this._storageService.clearStorage()
    return this._apiService.httpPost(`${this._path}/login`, CREDENTIALS).pipe(
      tap((response: TokenResponseDTO) => {
        this._storageService.setKeepLoggedIn(keepLoogedIn)
        this._successfulAuthenticate(response)
      }),
      map(() => { })
    )
  }

  refreshToken(): Observable<void> {
    return this._apiService.httpPost(`${this._path}/refresh-token`).pipe(
      tap((response: TokenResponseDTO) => {
        this._successfulAuthenticate(response)
      }),
      map(() => { })
    )
  }

  logout(routeAfterLogout: string = this._router.url) {
    this._storageService.clearStorage()
    this._successfulAuthenticated$.next(false)
    this._isAuthenticated$.next(false)
    this._isAdmin$.next(false)
    this._router.navigate(['/']).then(() => this._router.navigate([routeAfterLogout]))
  }

  private _successfulAuthenticate(tokenResponse: TokenResponseDTO) {
    const LOCAL_USER = this._storageService.getLocalUser() || {}
    const TOKEN_DATA = this._jwtHelper.decodeToken(tokenResponse.access_token!)

    LOCAL_USER.accessToken = tokenResponse.access_token
    LOCAL_USER.userId = TOKEN_DATA.user_id
    LOCAL_USER.personId = TOKEN_DATA.person_id
    LOCAL_USER.nickname = TOKEN_DATA.name
    LOCAL_USER.exp = TOKEN_DATA.exp
    LOCAL_USER.roles = TOKEN_DATA.roles

    this._storageService.setLocalUser(LOCAL_USER);
    this._storageService.setRefreshToken(tokenResponse.refresh_token!)

    this._successfulAuthenticated$.next(true)
    this._isAuthenticated$.next(true)
    this._isAdmin$.next(LOCAL_USER.roles?.map(r => r.toString()).includes('ROLE_' + UserRole.ADMIN) ?? false)
  }

  isAuthenticated(): Observable<boolean> {
    return this._isAuthenticated$
  }

  isAdmin(): Observable<boolean> {
    return this._isAdmin$
  }

}
