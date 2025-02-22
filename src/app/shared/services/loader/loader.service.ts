import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _requests: HttpRequest<any>[] = [];

  show(): void {
    this._isLoading.next(true);
  }

  hide(): void {
    this._isLoading.next(false);
  }

  isLoading(): Observable<boolean> {
    return this._isLoading.asObservable();
  }

  add(req: HttpRequest<any>) {
    this._requests.push(req);
    this._isLoading.next(this._requests.length > 0);
  }

  remove(req: HttpRequest<any>) {
    const index = this._requests.indexOf(req);
    if (index !== -1) {
      this._requests.splice(index, 1);
    }
    this._isLoading.next(this._requests.length > 0);
  }
}
