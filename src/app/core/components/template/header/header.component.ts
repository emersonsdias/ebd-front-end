import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { ROUTES_KEYS } from '../../../../shared/config/routes-keys.config';
import { AuthService } from '../../../services/auth/auth.service';
import { StorageService } from '../../../services/storage/storage.service';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../../../shared';
import { LoginFormComponent } from '../../features/auth/login-form/login-form.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatToolbarModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Output() toggleMenu: EventEmitter<void> = new EventEmitter()
  ROUTES_KEYS = ROUTES_KEYS;
  userNickname: string = 'Usuário'

  constructor(
    public authService: AuthService,
    private _storageService: StorageService,
    private _dialogService: DialogService,
    private _router: Router,
  ) {
    this.authService.isAuthenticated().subscribe(() => {
      this.userNickname = this._storageService.getUserNickname() ?? 'Usuário';
    })
  }

  login(): void {
    this._dialogService.openComponent(LoginFormComponent).then(res => {
      if (res?.success) {
        this._router.navigate([ROUTES_KEYS.home]);
      }
    }
    );
  }

}
