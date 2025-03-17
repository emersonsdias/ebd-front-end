import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CustomSnackBarComponent } from '../../components/custom-snack-bar/custom-snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _snackBar: MatSnackBar) { }

  private show(message: string, type: 'success' | 'warning' | 'error' | 'info', delay: number | undefined = undefined, title: string = '') {
    const config: MatSnackBarConfig = {
      data: { title: title, message: message, type: type },
      duration: delay,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['notification', type]
    }
    this._snackBar.openFromComponent(CustomSnackBarComponent, config);
  }

  success(message: string, title: string = '', autohide: boolean = true): void {
    this.show(message, 'success', autohide ? 10000 : undefined, title);
  }

  error(message: string, title: string = '', autohide: boolean = true): void {
    this.show(message, 'error', autohide ? 10000 : undefined, title);
  }

  warning(message: string, title: string = '', autohide: boolean = true): void {
    this.show(message, 'warning', autohide ? 10000 : undefined, title);
  }

  info(message: string, title: string = '', autohide: boolean = true): void {
    this.show(message, 'info', autohide ? 10000 : undefined, title);
  }
}
