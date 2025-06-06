import { Component, HostListener, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirm',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './dialog-confirm.component.html',
  styleUrl: './dialog-confirm.component.scss',
})
export class DialogConfirmComponent {

  constructor(
    private _dialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      message: string,
      confirmButton: string,
      denyButton: string,
      hideDenyButton?: boolean
    }
  ) { }

  confirm() {
    this._close(true);
  }

  deny() {
    this._close(false);
  }

  private _close(value: boolean | undefined) {
    this._dialogRef.close(value);
  }

  @HostListener("keydown.esc")
  public onEsc() {
    this._close(undefined);
  }

}
