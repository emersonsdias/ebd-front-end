import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from '../../../shared';
import { catchError, throwError } from 'rxjs';
import { StandardErrorDTO } from '../../models/api/data-contracts';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {

  const notificationService = inject(NotificationService)

  return next(req).pipe(catchError((response: HttpErrorResponse) => {

    const defaultAction = (error: any) => {
      if (error.message) {
        notificationService.error(error.message, `${response.status} - ${error.error}`);
      } else {
        notificationService.error(
          'Houve um problema e a requisição não pode ser atendida pelo servidor',
          `${response.status} - Erro interno de servidor`
        )
      }
    }

    const handle403 = () => {
      if (!response.url?.endsWith('/auth/refresh-token')) {
        notificationService.error(
          'Usuário não autenticado ou sem permissão de acesso ao recurso',
          `${response.status} - Usuário não autorizado`
        )
      }
    }

    const handle422 = (error: StandardErrorDTO) => {
      const infos = (error.additionalInfo || []).join(' / ');
      notificationService.error(infos, `${response.status} - ${error.message}`, false);
    }

    const error: StandardErrorDTO = response.error;

    switch (response.status) {
      case 403:
        handle403();
        break;
      case 422:
        handle422(error);
        break;
      case 400:
      case 401:
      case 404:
      case 409:
      case 500:
      default:
        defaultAction(error);
    }

    return throwError(() => response.message)
  }));
};
