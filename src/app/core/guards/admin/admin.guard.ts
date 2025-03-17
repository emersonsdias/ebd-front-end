import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { first, lastValueFrom } from 'rxjs';
import { NotificationService } from '../../../shared';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService)
  const notification = inject(NotificationService)

  let isAdmin = false;
  const checkIsAdmin = async () => {
    lastValueFrom(authService.isAdmin().pipe(first())).then(res => isAdmin = res);
  }
  await checkIsAdmin()

  if (!isAdmin) {
    notification.info('Usuário não possui o perfil de administrador', 'Usuário não autorizado')
  }
  return isAdmin
};
