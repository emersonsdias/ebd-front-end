import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DialogService, NotificationService, ROUTES_KEYS } from '../../../../../../../shared';
import { ItemService } from '../../../../../../services/item/item.service';
import { ItemDTO } from '../../../../../../models/api/data-contracts';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomIconComponent } from "../../../../../../../shared/components/custom-icon/custom-icon.component";
import { DialogIconComponent } from './dialog-icon/dialog-icon.component';


@Component({
  selector: 'app-item-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    CustomIconComponent,
    RouterModule,
  ],
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.scss'
})
export class ItemFormComponent implements OnInit {

  item: ItemDTO | undefined
  itemForm: FormGroup
  ROUTES_KEYS = ROUTES_KEYS
  submitted: boolean = false

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _itemService: ItemService,
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _notificationService: NotificationService,
  ) {
    this.itemForm = this._buildItem()
  }


  async ngOnInit(): Promise<void> {
    const itemId = Number(this._route.snapshot.paramMap.get(ROUTES_KEYS.itemId))
    if (!itemId) {
      return
    }
    try {
      this.item = await firstValueFrom(this._itemService.findById(itemId))
      this.itemForm = this._buildItem(this.item)
    } catch (e) {
      this._router.navigate(['/', ROUTES_KEYS.settings.index, ROUTES_KEYS.settings.itemsManagement])
    }
  }

  private _buildItem(item: ItemDTO | undefined = undefined): FormGroup {
    return this._formBuilder.group({
      id: [item?.id ?? null],
      name: [item?.name ?? null],
      icon: [item?.icon ?? null],
      active: [item?.active ?? true],
      createdAt: [item?.createdAt ?? null],
      updatedAt: [item?.updatedAt ?? null]
    })
  }

  async selectIcon() {
    const data = { icon: this.itemForm.get('icon')?.value }
    const icon = await this._dialogService.openComponent(DialogIconComponent, data)
    if (!icon) {
      return
    }
    this.itemForm.get('icon')?.setValue(icon)
  }

  save(form: FormGroup) {
    if (form.invalid) {
      console.error(form.errors)
      return
    }
    const item: ItemDTO = form.value
    if (item.id) {
      this._update(item)
    } else {
      this._create(item)
    }
  }

  private _create(item: ItemDTO) {
    this._itemService.create(item).subscribe({
      next: () => {
        this.submitted = true
        this._notificationService.success(`Item '${item.name}' criado com sucesso`)
        this._router.navigate(['/', ROUTES_KEYS.settings.index, ROUTES_KEYS.settings.itemsManagement])
      },
      error: (err) => {
        console.error('Create item failed.', err)
      }
    })
  }

  private _update(item: ItemDTO) {
    this._itemService.update(item).subscribe({
      next: () => {
        this.submitted = true
        this._notificationService.success(`Item '${item.name}' alterado com sucesso`)
        this._router.navigate(['/', ROUTES_KEYS.settings.index, ROUTES_KEYS.settings.itemsManagement])
      },
      error: (err) => {
        console.error('Update item failed.', err)
      }
    })
  }

}
