import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../services/user/user.service';
import { UserDTO, UserRole } from '../../../../../models/api/data-contracts';

@Component({
  selector: 'app-admin-access',
  imports: [],
  templateUrl: './admin-access.component.html',
  styleUrl: './admin-access.component.scss'
})
export class AdminAccessComponent implements OnInit {

  adminUsers: UserDTO[] = []

  constructor(
    private _userService: UserService,
  ) { }

  ngOnInit(): void {
    this._userService.findByRoles([UserRole.ADMIN]).subscribe({
      next: usersResponse => this.adminUsers = usersResponse
    })
  }




}
