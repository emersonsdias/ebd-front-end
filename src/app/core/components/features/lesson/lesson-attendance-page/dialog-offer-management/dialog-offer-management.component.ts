import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dialog-offer-management',
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './dialog-offer-management.component.html',
  styleUrl: './dialog-offer-management.component.scss'
})
export class DialogOfferManagementComponent {

  clonedAttendances: FormArray
  clonedvisitors: FormArray

  constructor(
    private _dialogRef: MatDialogRef<DialogOfferManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { attendances: FormArray, visitors: FormArray }
  ) {
    this.clonedAttendances = this._cloneFormArray(data.attendances)
    this.clonedvisitors = this._cloneFormArray(data.visitors)
  }

  getOffers(control: AbstractControl): FormArray {
    return control.get('offers') as FormArray;
  }

  private _cloneFormArray(formArray: FormArray): FormArray {
    return new FormArray(
      formArray.controls.map(control => {
        if (control instanceof FormGroup) {
          return new FormGroup(
            Object.keys(control.controls).reduce((acc, key) => {
              acc[key] = this._cloneAbstractControl(control.controls[key])
              return acc;
            }, {} as { [key: string]: AbstractControl })
          )
        } else if (control instanceof FormArray) {
          return this._cloneFormArray(control)
        } else {
          return new FormControl(control.value, control.validator, control.asyncValidator)
        }
      })
    );
  }

  private _cloneAbstractControl(control: AbstractControl): AbstractControl {
    if (control instanceof FormGroup) {
      return new FormGroup(
        Object.keys(control.controls).reduce((acc, key) => {
          acc[key] = this._cloneAbstractControl(control.controls[key])
          return acc
        }, {} as { [key: string]: AbstractControl })
      );
    } else if (control instanceof FormArray) {
      return this._cloneFormArray(control)
    } else {
      return new FormControl(control.value, control.validator, control.asyncValidator)
    }
  }


  removeAttendanceOffer(attendance: AbstractControl, offerIndex: number) {
    const offers = this.getOffers(attendance);
    offers.removeAt(offerIndex);
  }

  removeVisitorOffer(visitor: AbstractControl, offerIndex: number) {
    const offers = this.getOffers(visitor);
    offers.removeAt(offerIndex);
  }

  save() {
    if (this.clonedAttendances.valid && this.clonedvisitors.valid) {
      this._replaceFormArray(this.data.attendances, this.clonedAttendances);
      this._replaceFormArray(this.data.visitors, this.clonedvisitors);
    }

    this._dialogRef.close({});
  }

  private _replaceFormArray(original: FormArray, cloned: FormArray) {
    while (original.length > 0) {
      original.removeAt(0);
    }

    cloned.controls.forEach(control => {
      original.push(control);
    });
  }

  hasOffers(): boolean {
    return (
      this.clonedAttendances.controls.some(attendance => this.getOffers(attendance).controls.length > 0) ||
      this.clonedvisitors.controls.some(visitor => this.getOffers(visitor).controls.length > 0)
    );
  }

}
