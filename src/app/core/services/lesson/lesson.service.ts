import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { LessonDTO, LessonStatus } from '../../models/api/data-contracts';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  private _path = '/lessons'

  constructor(
    private _apiService: ApiService
  ) { }

  create(lesson: LessonDTO): Observable<LessonDTO> {
    return this._apiService.httpPost(this._path, lesson)
  }

  update(lesson: LessonDTO): Observable<LessonDTO> {
    return this._apiService.httpPut(`${this._path}/${lesson.id}`, lesson)
  }

  findByOptions(options: { startDate?: string, endDate?: string, maxRecentLessons?: number, lessonNumber?: number, lessonStatus?: LessonStatus } | undefined = undefined): Observable<LessonDTO[]> {
    const params = new Map
    if (options?.startDate) params.set('startDate', options.startDate)
    if (options?.endDate) params.set('endDate', options.endDate)
    if (options?.maxRecentLessons) params.set('maxRecentLessons', options.maxRecentLessons)
    if (options?.lessonNumber) params.set('lessonNumber', options.lessonNumber)
    if (options?.lessonStatus) params.set('lessonStatus', options.lessonStatus)
    return this._apiService.httpGet(this._path, { params: params })
  }

  findById(lessonId: number): Observable<LessonDTO> {
    return this._apiService.httpGet(`${this._path}/${lessonId}`)
  }

  findByIds(lessonsIds: number[]): Observable<LessonDTO[]> {
    return this._apiService.httpPost(`${this._path}/batch`, lessonsIds)
  }

  findLessonReportPdf(lessonNumber: number, startDate: string, endDate: string): Observable<Blob> {
    const params = new Map
    params.set('lessonNumber', lessonNumber)
    params.set('startDate', startDate)
    params.set('endDate', endDate)
    return this._apiService.httpGetBlob(`${this._path}/report/pdf`, { params: params})
  }
}
