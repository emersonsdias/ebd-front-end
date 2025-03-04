import { Component, Optional } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { ROUTES_KEYS } from '../../../../../shared/config/routes-keys.config';
import { AuthService } from '../../../../services/auth/auth.service';
import { StorageService } from '../../../../services/storage/storage.service';
import { NotificationService } from '../../../../../shared';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, RouterModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {

  ROUTES_KEYS = ROUTES_KEYS
  hidePassword: boolean = true
  keepLoggedIn: boolean = false
  credentials: { username: string, password: string } = {
    username: '',
    password: ''
  }

  constructor(
    private _authService: AuthService,
    private _storageServive: StorageService,
    private _notificationService: NotificationService,
    private _router: Router,
    @Optional() private _dialogRef?: MatDialogRef<LoginFormComponent>
  ) {
    this.keepLoggedIn = this._storageServive.isKeepLoggedIn();
  }

  login() {
    this._authService.login(this.credentials.username, this.credentials.password, this.keepLoggedIn).subscribe({
      next: () => {
        this._notificationService.success(`Seja bem vindo ${this._storageServive.getUserNickname()}`)
        if (this._dialogRef) {
          this._dialogRef?.close({ success: true })
        } else {
          this._router.navigate(['/', ROUTES_KEYS.home])
        }
      },
      error: () => this._notificationService.error(`Não foi possível autenticar`)
    })
  }

  closeDialogAndNavigate(route: string) {
    this._router.navigate([route])
    this._dialogRef?.close({ success: false });
  }

}
