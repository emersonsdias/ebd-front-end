import { Component, OnInit } from '@angular/core';
import { UserDTO, UserRole } from '../../../../../models/api/data-contracts';
import { UserService } from '../../../../../services/user/user.service';

@Component({
  selector: 'app-teacher-access',
  imports: [],
  templateUrl: './teacher-access.component.html',
  styleUrl: './teacher-access.component.scss'
})
export class TeacherAccessComponent implements OnInit {

    teacherUsers: UserDTO[] = []

    constructor(
      private _userService: UserService,
    ) { }

    ngOnInit(): void {
      this._userService.findByRoles([UserRole.TEACHER]).subscribe({
        next: usersResponse => this.teacherUsers = usersResponse
      })
    }


}
