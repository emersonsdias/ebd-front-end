import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../services/user/user.service';
import { UserDTO, UserRole } from '../../../../../models/api/data-contracts';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ROUTES_KEYS } from '../../../../../../shared/config/routes-keys.config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-access',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './admin-access.component.html',
  styleUrl: './admin-access.component.scss'
})
export class AdminAccessComponent implements OnInit {

  users: UserDTO[] = []

  ROUTES_KEYS = ROUTES_KEYS

  constructor(
    private _userService: UserService,
  ) { }

  ngOnInit(): void {
    this._userService.findByRoles([UserRole.ADMIN]).subscribe({
      next: usersResponse => this.users = usersResponse.sort(this._sortUsers())
    })
  }

  private _sortUsers() {
    return (a: UserDTO, b:UserDTO) => {
      if (a.active === b.active) {
        return (a.name || '').localeCompare(b.name || '')
      }
      return a.active ? -1 : 1
    }
  }


}
