import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from './storage-keys.config';
import { UserPreferences } from '../models/user-preferences.model';

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
      this.removeItem(STORAGE_KEYS.userPreferences);
    } else {
      this.setItem(STORAGE_KEYS.userPreferences, JSON.stringify(userPreferences));
    }
  }

  removeItem(key: string): void {
    this._getStorage(key).removeItem(key);
  }

  setItem(key: string, value: any): void {
    const storage = this._getStorage(key);
    storage.setItem(key, value);
  }

  getItem(key: string): any {
    const storage = this._getStorage(key)
    const item = storage.getItem(key)
    try {
      return item ? JSON.parse(item) : null
    } catch (e) {
      return item
    }
  }

  getUserPreferences(): UserPreferences | null {
    const userPreferences = this.getItem(STORAGE_KEYS.userPreferences);
    try {
      return (userPreferences == null) ? null : JSON.parse(userPreferences);
    } catch (e) {
      console.error(e)
      return null
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
}
