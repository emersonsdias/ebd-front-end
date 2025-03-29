import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ClassroomDTO, TeacherDTO, UserDTO, UserRole } from '../../../../../models/api/data-contracts';
import { UserService } from '../../../../../services/user/user.service';
import { RouterModule } from '@angular/router';
import { ROUTES_KEYS } from '../../../../../../shared/config/routes-keys.config';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { ClassroomService } from '../../../../../services/classroom/classroom.service';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-teacher-access',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    NgbAccordionModule,
  ],
  templateUrl: './teacher-access.component.html',
  styleUrl: './teacher-access.component.scss'
})
export class TeacherAccessComponent implements OnInit {

  classrooms: ClassroomDTO[] = []
  users: UserDTO[] = []
  usersWithoutClassroom: UserDTO[] = []
  ROUTES_KEYS = ROUTES_KEYS

  constructor(
    private _userService: UserService,
    private _classroomService: ClassroomService,
    private _cdr: ChangeDetectorRef
  ) { }

  async ngOnInit(): Promise<void> {
    const [classrooms, users] = await Promise.all([
      firstValueFrom(this._classroomService.findAll()),
      firstValueFrom(this._userService.findByRoles([UserRole.TEACHER]))
    ])
    this.users = users.sort(this._sortUsers())
    this.usersWithoutClassroom = [...this.users]
    classrooms.forEach(classroom => {
      classroom.teachers = classroom.teachers?.sort(this._sortTeachers())
    })
    this.classrooms = classrooms
    this._cdr.detectChanges();
  }

  private _sortUsers() {
    return (a: UserDTO, b: UserDTO) => {
      if (a.active === b.active) {
        return (a.name || '').localeCompare(b.name || '')
      }
      return a.active ? -1 : 1
    }
  }

  private _sortTeachers() {
    return (a: TeacherDTO, b: TeacherDTO) => {
      if (a.active === b.active) {
        return (a.person?.name || '').localeCompare(b.person?.name || '')
      }
      return a.active ? -1 : 1
    }
  }

  getUserByPersonId(personId: string | undefined): UserDTO | undefined {
    if (!personId) {
      return undefined
    }
    const user = this.users.filter(user => user?.active && user?.person?.id === personId)[0]

    if (user) {
      this.usersWithoutClassroom = this.usersWithoutClassroom.filter(u => u.id !== user.id);
    }
    return user
  }

}
