import { Component, Inject } from '@angular/core';
import { CustomIconComponent } from "../../../../../../shared";
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-dialog-item',
  imports: [
    CustomIconComponent,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog-item.component.html',
  styleUrl: './dialog-item.component.scss'
})
export class DialogItemComponent {

  constructor(
    private _dialogRef: MatDialogRef<DialogItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { form: FormGroup, attendances: FormArray, visitors: FormArray }
  ) {
  }

  save(form: FormGroup, formParent: FormGroup) {
    if (this.data.form.valid) {
      this._dialogRef.close({ form: form, parent: formParent })
    }
  }

}
