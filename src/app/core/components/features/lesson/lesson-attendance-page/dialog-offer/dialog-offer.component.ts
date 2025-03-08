import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dialog-offer',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog-offer.component.html',
  styleUrl: './dialog-offer.component.scss'
})
export class DialogOfferComponent {

  clonedOffer: FormGroup

  constructor(
    private _dialogRef: MatDialogRef<DialogOfferComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public offerControl: FormGroup
  ) {
    this.clonedOffer = this.cloneFormGroup(offerControl);
  }

  private cloneFormGroup(original: FormGroup): FormGroup {
    const cloned = this._formBuilder.group({})
    Object.keys(original.controls).forEach(key => {
      const control = original.get(key)
      const newControl = new FormControl(
        control?.value,
        control?.validator || null,
        control?.asyncValidator || null
      )
      cloned.addControl(key, newControl)
    })
    return cloned
  }


  save() {
    if (this.clonedOffer.valid) {
      this.offerControl.patchValue(this.clonedOffer.getRawValue())
      this._dialogRef.close(this.offerControl)
    }
  }


}
