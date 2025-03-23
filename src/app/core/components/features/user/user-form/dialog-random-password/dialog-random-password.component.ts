import { Component, Inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-dialog-random-password',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './dialog-random-password.component.html',
  styleUrl: './dialog-random-password.component.scss'
})
export class DialogRandomPasswordComponent {

  @ViewChild('tooltip') tooltip!: MatTooltip;
  hidePassword = true
  tooltipDisabled = true

  constructor(
    private _clipboard: Clipboard,
    @Inject(MAT_DIALOG_DATA) public data: { randomPassword: string }
  ) { }

  copyToClipboard(): void {
    if (this.data.randomPassword) {
      this._clipboard.copy(this.data.randomPassword)

      this._showTooltip()
    }
  }

  private _showTooltip(viewingTime: number = 2000) {
    this.tooltip.disabled = false
    this.tooltip.show()
    setTimeout(() => {
      this.tooltip.disabled = true
    }, viewingTime)
  }

  showPassword() {
    if (!this.hidePassword) {
      this.hidePassword = true
      return
    }
    this.hidePassword = false
    setTimeout(() => {
      this.hidePassword = true
    }, 8000)
  }

}
