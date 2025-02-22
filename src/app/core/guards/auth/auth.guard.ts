import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import { DialogService, NotificationService } from '../../../shared';
import { first, firstValueFrom, lastValueFrom } from 'rxjs';
import { LoginFormComponent } from '../../components/features/auth/login-form/login-form.component';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService)
  const dialogService = inject(DialogService)
  const storageService = inject(StorageService)
  const notificationService = inject(NotificationService)

  let isAuthenticated: boolean = false;

  const checkIsAuthenticated = async () => {
    lastValueFrom(authService.isAuthenticated().pipe(first())).then(res => isAuthenticated = res)
  }

  await checkIsAuthenticated();

  if (!isAuthenticated && storageService.getRefreshToken()) {
    await firstValueFrom(authService.refreshToken())
    await checkIsAuthenticated()
  }
  if (!isAuthenticated) {
    const loginResponse = await dialogService.openComponent(LoginFormComponent)
    if (!loginResponse || loginResponse.response === false) {
      notificationService.info('Faça login para acessar a página desejada', 'Usuário não autenticado');
    }
    await checkIsAuthenticated();
  }
  return isAuthenticated;
};
