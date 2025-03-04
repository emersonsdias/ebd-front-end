import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { LessonDTO } from '../../models/api/data-contracts';
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

  findLessonsByOptions(options: { startDate?: string, endDate?: string, maxRecentLessons?: number } | undefined = undefined): Observable<LessonDTO[]> {
    const params = new Map
    if (options?.startDate) params.set('startDate', options.startDate)
    if (options?.endDate) params.set('endDate', options.endDate)
    if (options?.maxRecentLessons) params.set('maxRecentLessons', options.maxRecentLessons)
    return this._apiService.httpGet(this._path, { params: params })
  }

  findById(lessonId: string) {
    return this._apiService.httpGet(`${this._path}/${lessonId}`)
  }
}
