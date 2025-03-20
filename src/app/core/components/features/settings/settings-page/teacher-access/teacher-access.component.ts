import { Component, OnInit } from '@angular/core';
import { ClassroomDTO, UserDTO, UserRole } from '../../../../../models/api/data-contracts';
import { UserService } from '../../../../../services/user/user.service';
import { RouterModule } from '@angular/router';
import { ROUTES_KEYS } from '../../../../../../shared/config/routes-keys.config';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { ClassroomService } from '../../../../../services/classroom/classroom.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-teacher-access',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './teacher-access.component.html',
  styleUrl: './teacher-access.component.scss'
})
export class TeacherAccessComponent implements OnInit {

  classrooms: ClassroomDTO[] = []
  users: UserDTO[] = []
  ROUTES_KEYS = ROUTES_KEYS

  constructor(
    private _userService: UserService,
    private _classroomService: ClassroomService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.classrooms = await firstValueFrom(this._classroomService.findAll())

    this._userService.findByRoles([UserRole.TEACHER]).subscribe({
      next: usersResponse => this.users = usersResponse.sort(this._sortUsers())
    })
  }

  private _sortUsers() {
    return (a: UserDTO, b: UserDTO) => {
      if (a.active === b.active) {
        return (a.name || '').localeCompare(b.name || '')
      }
      return a.active ? -1 : 1
    }
  }
}
