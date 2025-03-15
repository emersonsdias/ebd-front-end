import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PersonDTO } from '../../../../../models/api/data-contracts';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-dialog-person',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './dialog-person.component.html',
  styleUrl: './dialog-person.component.scss'
})
export class DialogPersonComponent {

  person = new FormControl(null, Validators.required)

  constructor(
    private _dialogRef: MatDialogRef<DialogPersonComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { people: PersonDTO[], type: 'teacher' | 'student' }
  ) {
  }

  save() {
    if (this.person.invalid) {
      return
    }
    this._dialogRef.close({person: this.person.value})
  }


}
