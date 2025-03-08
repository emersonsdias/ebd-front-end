import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dialog-visitor',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog-visitor.component.html',
  styleUrl: './dialog-visitor.component.scss'
})
export class DialogVisitorComponent {

  clonedVisitor: FormGroup

  constructor(
    private _dialogRef: MatDialogRef<DialogVisitorComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public visitor: FormGroup
  ) {
    this.clonedVisitor = this.cloneFormGroup(visitor);
  }

  private cloneFormGroup(original: FormGroup): FormGroup {
    const cloned = this._formBuilder.group({})
    Object.keys(original.controls).forEach(key => {
      cloned.addControl(key, new FormControl(original.get(key)?.value))
    })
    return cloned
  }

  save() {
    if (this.clonedVisitor.valid) {
      this.visitor.patchValue(this.clonedVisitor.getRawValue());
      this._dialogRef.close(this.visitor);    }
  }
}
