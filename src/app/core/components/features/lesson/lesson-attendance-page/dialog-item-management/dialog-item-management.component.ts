import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ItemDTO } from '../../../../../models/api/data-contracts';
import { CustomIconComponent } from "../../../../../../shared/components/custom-icon/custom-icon.component";

@Component({
  selector: 'app-dialog-item-management',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    CustomIconComponent
],
  templateUrl: './dialog-item-management.component.html',
  styleUrl: './dialog-item-management.component.scss'
})
export class DialogItemManagementComponent {

  clonedAttendances: FormArray
  clonedvisitors: FormArray

  constructor(
    private _dialogRef: MatDialogRef<DialogItemManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: ItemDTO, attendances: FormArray, visitors: FormArray }
  ) {
    this.clonedAttendances = this._cloneFormArray(data.attendances)
    this.clonedvisitors = this._cloneFormArray(data.visitors)
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

  getItems(control: AbstractControl): FormArray {
    return control.get('items') as FormArray
  }

  removeItem(abstractControl: AbstractControl, index: number) {
    const items = this.getItems(abstractControl);
    items.removeAt(index);
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

  hasItems(): boolean {
    return (
      this.clonedAttendances.controls.some(attendance => this.getItems(attendance).controls.filter(i => i.get('item')?.value.id === this.data.item.id).length > 0) ||
      this.clonedvisitors.controls.some(visitor => this.getItems(visitor).controls.filter(i => i.get('item')?.value.id === this.data.item.id).length > 0)
    );
  }

}
