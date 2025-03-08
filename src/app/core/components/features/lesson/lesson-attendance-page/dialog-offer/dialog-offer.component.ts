import { Component, Inject } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-dialog-offer',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog-offer.component.html',
  styleUrl: './dialog-offer.component.scss'
})
export class DialogOfferComponent {

  constructor(
    private _dialogRef: MatDialogRef<DialogOfferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { form: FormGroup,  attendances: FormArray, visitors: FormArray}
  ) {
  }

  save(form: FormGroup, formParent: FormGroup) {
    if (this.data.form.valid) {
      this._dialogRef.close({form: form, parent: formParent})
    }
  }

}
