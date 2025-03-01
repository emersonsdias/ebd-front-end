import { FormGroup } from '@angular/forms';
import { CanDeactivateFn } from '@angular/router';
import { DialogService } from '../../services/dialog/dialog.service';
import { inject } from '@angular/core';

export const unsavedChangesGuard: CanDeactivateFn<any> = async (component, currentRoute, currentState, nextState) => {
  const form = Object.values(component).find(prop => prop instanceof FormGroup) as FormGroup | undefined;
  if (form && form.dirty) {
    const dialog = inject(DialogService)
    if (!component.submitted || component?.submitted === false) {
      return await dialog.openConfirmation({ title: 'Tem certeza que deseja sair?', message: 'Existem dados não salvos' }).then() || false;
    }
  }
  return true;
};
