import { Component, Inject } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CustomIconComponent } from "../../../../../../shared/components/custom-icon/custom-icon.component";

@Component({
  selector: 'app-dialog-item',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    CustomIconComponent
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
