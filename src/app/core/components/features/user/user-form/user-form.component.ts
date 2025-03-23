import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserDTO, UserRole } from '../../../../models/api/data-contracts';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DialogService, EnumTranslatePipe, NotificationService, ROUTES_KEYS } from '../../../../../shared';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../../../services/user/user.service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { DialogRandomPasswordComponent } from './dialog-random-password/dialog-random-password.component';

@Component({
  selector: 'app-user-form',
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
    MatIconModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {

  user: UserDTO | undefined
  userForm: FormGroup
  submitted: boolean = false
  ROUTES_KEYS = ROUTES_KEYS
  userRoles: UserRole[] = Object.keys(UserRole).map(key => UserRole[key as keyof typeof UserRole])
  hidePassword: boolean = true
  nextRoute: string = `/${ROUTES_KEYS.settings.index}`

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _notificationService: NotificationService,
    private _dialogService: DialogService,
  ) {
    this.userForm = this._buildUserForm()
    const isAdminRoute = this._route.snapshot.pathFromRoot.some(route => route.url.some(segment => segment.path.includes(ROUTES_KEYS.settings.adminAccess)))
    const isTeacherRoute = this._route.snapshot.pathFromRoot.some(route => route.url.some(segment => segment.path.includes(ROUTES_KEYS.settings.teacherAccess)))

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
      updatedAt: [user?.updatedAt || null],
      changePassword: [null],
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

  async setRandomPassword() {
    const randomPassword = this._generateRandomPassword()
    await this._dialogService.openComponent(DialogRandomPasswordComponent, { randomPassword: randomPassword })
    this.hidePassword = true
    this.userForm.get('password')?.setValue(randomPassword)
  }

  private _generateRandomPassword(length: number = 10) {
    const letters = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz' // removido 'I' (i maúsculo) e 'l' (L minúsculo para evitar confusão na visualização)
    const numbers = '0123456789'
    const specials = '!@#$%&*()_'

    const getRandomChar = (chars: string) => chars[Math.floor(Math.random() * chars.length)]

    let password = getRandomChar(letters) + getRandomChar(numbers) + getRandomChar(specials)

    const allChars = letters + numbers + specials;
    for (let i = password.length; i < length; i++) {
      password += getRandomChar(allChars)
    }

    return password.split('').sort(() => Math.random() - 0.5).join('')
  }

}

