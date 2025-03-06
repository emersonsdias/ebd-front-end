import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ClassroomDTO } from '../../models/api/data-contracts';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {

  private _path = '/classrooms'

  constructor(
    private _apiService: ApiService
  ) { }

  create(classroom: ClassroomDTO): Observable<ClassroomDTO> {
    return this._apiService.httpPost(this._path, classroom)
  }

  update(classroom: ClassroomDTO): Observable<ClassroomDTO> {
    return this._apiService.httpPut(`${this._path}/${classroom.id}`, classroom)
  }

  findAll(): Observable<ClassroomDTO[]> {
    return this._apiService.httpGet(this._path)
  }

  findById(classroomId: number): Observable<ClassroomDTO> {
    return this._apiService.httpGet(`${this._path}/${classroomId}`)
  }

}
