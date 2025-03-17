import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserDTO } from '../../../../../models/api/data-contracts';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../../../services/user/user.service';
import { StorageService } from '../../../../../services/storage/storage.service';
import { AuthService } from '../../../../../services/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DialogService, ROUTES_KEYS } from '../../../../../../shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-information',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: './account-information.component.html',
  styleUrl: './account-information.component.scss'
})
export class AccountInformationComponent implements OnInit {

  userForm: FormGroup
  user: UserDTO | undefined
  hidePassword: boolean = true

  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _storageService: StorageService,
    private _authService: AuthService,
    private _dialogService: DialogService,
    private _router: Router,
  ) {
    this.userForm = this._buildUserForm()
  }

  ngOnInit(): void {
    const userId = this._storageService.getUserId()
    if (!userId) {
      return
    }
    this._userService.findById(userId).subscribe({
      next: userResponse => {
        this.user = userResponse
        this.userForm = this._buildUserForm(userResponse)
        this.userForm.disable()
      }
    })
  }

  private _buildUserForm(user: UserDTO | undefined = undefined) {
    return this._formBuilder.group({
      id: [user?.id || null],
      name: [user?.name || null],
      email: [user?.email || null],
      changePassword: [null],
      password: [null],
      passwordConfirmation: [null],
      roles: this._formBuilder.array(user?.roles || []),
      active: [user?.active || null],
      createdAt: [user?.createdAt || null],
      updatedAt: [user?.updatedAt || null],
    })
  }

  async save(form: FormGroup) {
    if (form.invalid) {
      console.error(form.errors)
      return
    }
    const user: UserDTO = form.value

    let confirmLogout: boolean | undefined = false

    if (user.email !== this.user?.email || form.get('changePassword')?.value) {
      confirmLogout = await this._dialogService.openConfirmation({
        title: 'Confirma alteração?',
        message: 'Ao alterar e-mail ou senha, será fazer login novamente, confirma alteração?'
      })
      if (!confirmLogout) {
        return
      }
    }

    this._userService.update(user).subscribe({
      next: userResponse => {
        this.user = userResponse
        this.userForm = this._buildUserForm(userResponse)
        this.userForm.disable()
        this._authService.refreshToken().subscribe()
      }
    })

    if (confirmLogout) {
      this._authService.logout()
      window.location.reload()
    }
  }

  cancel() {
    this.userForm = this._buildUserForm(this.user)
    this.userForm.disable()
  }

}
