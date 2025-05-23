import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from './storage-keys.config';
import { LocalUser, UserPreferences } from '../../../shared';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage
  private _uniqueSessionStorage: string[] = [STORAGE_KEYS.localUser]
  private _uniqueLocalStorage: string[] = [STORAGE_KEYS.userPreferences]

  constructor() {
    this._storage = this.isKeepLoggedIn() ? localStorage : sessionStorage
  }

  private _getStorage(key: string | undefined = undefined): Storage {
    if (!key) {
      return this._storage
    } else if (this._uniqueSessionStorage.indexOf(key) >= 0) {
      return sessionStorage
    } else if (this._uniqueLocalStorage.indexOf(key) >= 0) {
      return localStorage
    }
    return this._storage
  }

  private _setUserPreferences(userPreferences: UserPreferences | null): void {
    if (userPreferences === null) {
      this.removeItem(STORAGE_KEYS.userPreferences)
    } else {
      this.setItem(STORAGE_KEYS.userPreferences, JSON.stringify(userPreferences))
    }
  }

  removeItem(key: string): void {
    this._getStorage(key).removeItem(key)
  }

  setItem(key: string, value: any): void {
    const storage = this._getStorage(key)
    storage.setItem(key, value);
  }

  getItem(key: string): any {
    const storage = this._getStorage(key)
    return storage.getItem(key)
  }

  getUserPreferences(): UserPreferences {
    const userPreferences = this.getItem(STORAGE_KEYS.userPreferences);
    try {
      return userPreferences ? JSON.parse(userPreferences) : {}
    } catch (_) {
      return {};
    }
  }

  setKeepLoggedIn(keepLoggedIn: boolean): void {
    const userPreferences = this.getUserPreferences() || {}
    userPreferences.keepLoggedIn = keepLoggedIn
    this._setUserPreferences(userPreferences)
    if (keepLoggedIn) {
      this._storage = localStorage
    }
    else {
      this._storage = sessionStorage
    }
  }

  isKeepLoggedIn(): boolean {
    const userPreferences = this.getUserPreferences()
    if (userPreferences?.keepLoggedIn) {
      return userPreferences.keepLoggedIn
    }
    return false
  }

  setLocalUser(localUser: LocalUser | null) {
    if (localUser == null) {
      this.removeItem(STORAGE_KEYS.localUser)
    } else {
      this.setItem(STORAGE_KEYS.localUser, JSON.stringify(localUser))
    }
  }

  getLocalUser(): LocalUser {
    const localUser = this.getItem(STORAGE_KEYS.localUser)
    try {
      return localUser ? JSON.parse(localUser) : {}
    } catch(_) {
      return {}
    }
  }

  setRefreshToken(token: string): void {
    this.setItem(STORAGE_KEYS.refreshToken, token)
  }

  getRefreshToken(): string | null {
    const refreshToken = this.getItem(STORAGE_KEYS.refreshToken)
    return refreshToken
  }

  clearStorage() {
    const userPreferences = this.getUserPreferences()
    localStorage.clear();
    sessionStorage.clear();
    this._setUserPreferences(userPreferences);
  }

  getUserId(): string | null {
    return this.getLocalUser().userId || null
  }

  getPersonId(): string | null {
    return this.getLocalUser().personId || null
  }

  getUserNickname(): string | null {
    return this.getLocalUser().nickname || null
  }
}
