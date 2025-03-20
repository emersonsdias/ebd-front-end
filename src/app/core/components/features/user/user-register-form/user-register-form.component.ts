import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserDTO, UserRole } from '../../../../models/api/data-contracts';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EnumTranslatePipe, NotificationService, ROUTES_KEYS } from '../../../../../shared';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../../../services/user/user.service';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-user-register-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    RouterModule,
    MatListModule,
    EnumTranslatePipe,
  ],
  templateUrl: './user-register-form.component.html',
  styleUrl: './user-register-form.component.scss'
})
export class UserRegisterFormComponent implements OnInit {

  user: UserDTO | undefined
  userForm: FormGroup
  submitted: boolean = false
  ROUTES_KEYS = ROUTES_KEYS
  userRoles: UserRole[] = Object.keys(UserRole).map(key => UserRole[key as keyof typeof UserRole])

  nextRoute: string = `/${ROUTES_KEYS.settings.index}`

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _notificationService: NotificationService,
  ) {
    this.userForm = this._buildUserForm()
    const isAdminRoute = this._route.snapshot.pathFromRoot.some(route  => route.url.some(segment => segment.path.includes(ROUTES_KEYS.settings.adminAccess)))
    const isTeacherRoute = this._route.snapshot.pathFromRoot.some(route  => route.url.some(segment => segment.path.includes(ROUTES_KEYS.settings.teacherAccess)))

    if (isAdminRoute) {
      this.nextRoute = `/${ROUTES_KEYS.settings.index}/${ROUTES_KEYS.settings.adminAccess}`
      const roles: UserRole[] = this.userForm.get('roles')?.value
      roles.push(UserRole.ADMIN)
      this.userForm.get('roles')?.setValue(roles)
    }
    if (isTeacherRoute) {
      this.nextRoute = `/${ROUTES_KEYS.settings.index}/${ROUTES_KEYS.settings.teacherAccess}`
      const roles: UserRole[] = this.userForm.get('roles')?.value
      roles.push(UserRole.TEACHER)
      this.userForm.get('roles')?.setValue(roles)
    }
  }

  async ngOnInit(): Promise<void> {
    const userId = this._route.snapshot.paramMap.get(ROUTES_KEYS.userId)
    if (!userId) {
      return
    }
    try {
      this.user = await firstValueFrom(this._userService.findById(userId))
      this.userForm = this._buildUserForm(this.user)
    } catch (e) {
      this._router.navigate([this.nextRoute])
    }
  }

  private _buildUserForm(user: UserDTO | undefined = undefined): FormGroup {
    const userForm = this._formBuilder.group({
      id: [user?.id || null],
      name: [user?.name || null],
      email: [user?.email || null],
      password: [user?.password || null],
      roles: this._formBuilder.control(user?.roles || []),
      active: [user?.active || null],
      createdAt: [user?.createdAt || null],
      updatedAt: [user?.updatedAt || null]
    })
    return userForm
  }

  save(form: FormGroup) {
    if (form.invalid) {
      console.error(form.errors)
      return
    }
    const user: UserDTO = form.value
    if (user.id) {
      this._update(user)
    } else {
      this._create(user)
    }
  }

  private _create(user: UserDTO) {
    this._userService.create(user).subscribe({
      next: () => {
        this.submitted = true
        this._notificationService.success(`Usuário '${user.name}' criado com sucesso`)
        this._router.navigate([this.nextRoute])
      },
      error: (err) => {
        console.error('Create user failed.', err)
      }
    })
  }

  private _update(user: UserDTO) {
    this._userService.update(user).subscribe({
      next: () => {
        this.submitted = true
        this._notificationService.success(`Usuário '${user.name}' alterado com sucesso`)
        this._router.navigate([this.nextRoute])
      },
      error: (err) => {
        console.error('Update user failed.', err)
      }
    })
  }

}
