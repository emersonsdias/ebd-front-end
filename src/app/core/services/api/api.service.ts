import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface HttpRequestOptions {
  params?: Map<string, string>
  headers?: Map<string, string>
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _http: HttpClient) { }

  httpGetBlob(path: string): Observable<any>  {
    const url = `${environment.apiUrl}${path}`
    return this._http.get<Blob>(url, {responseType: 'blob' as 'json'})
  }

  httpGet(path: string, options?: HttpRequestOptions): Observable<any> {
    return this._http.get<any>(`${environment.apiUrl}${path}`, { headers: this._mapToHeaders(options?.headers), params: this._optionsToParams(options) }).pipe(take(1))
  }

  httpPost(path: string, body?: any, options?: HttpRequestOptions): Observable<any> {
    return this._http.post(`${environment.apiUrl}${path}`, body, { headers: this._mapToHeaders(options?.headers), params: this._optionsToParams(options) }).pipe(take(1))
  }

  httpPut(path: string, body?: any, options?: HttpRequestOptions): Observable<any> {
    return this._http.put(`${environment.apiUrl}${path}`, body, { headers: this._mapToHeaders(options?.headers), params: this._optionsToParams(options) }).pipe(take(1))
  }

  httpPatch(path: string, body?: any, options?: HttpRequestOptions): Observable<any> {
    return this._http.patch(`${environment.apiUrl}${path}`, body, { headers: this._mapToHeaders(options?.headers), params: this._optionsToParams(options) }).pipe(take(1))
  }

  httpDelete(path: string, options?: HttpRequestOptions): Observable<any> {
    return this._http.delete(`${environment.apiUrl}${path}`, { headers: this._mapToHeaders(options?.headers), params: this._optionsToParams(options) }).pipe(take(1))
  }

  httpPostWithReadHeaders(path: string, body?: any, options?: HttpRequestOptions): Observable<any> {
    return this._http.post(`${environment.apiUrl}${path}`, body, {
      observe: 'response',
      responseType: 'text',
      headers: this._mapToHeaders(options?.headers),
      params: this._optionsToParams(options)
    }).pipe(take(1))
  }

  private _mapToHeaders(headersMap?: Map<string, string>): HttpHeaders {
    let httpHeaders = new HttpHeaders();
    if (headersMap != null && headersMap != undefined) {
      headersMap.forEach((value, key) => {
        httpHeaders = httpHeaders.set(key, value)
      });
    }
    return httpHeaders
  }

  private _optionsToParams(options: HttpRequestOptions | undefined): HttpParams {
    let httpParams = new HttpParams();
    if (!options) {
      return httpParams
    }
    if (options.params) {
      options.params.forEach((value, key) => {
        httpParams = httpParams.set(key, value)
      });
    }
    return httpParams
  }

}
