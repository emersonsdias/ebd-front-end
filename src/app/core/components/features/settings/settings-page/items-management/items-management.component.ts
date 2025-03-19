import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../../../../services/item/item.service';
import { ItemDTO } from '../../../../../models/api/data-contracts';
import { firstValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { CustomIconComponent } from "../../../../../../shared/components/custom-icon/custom-icon.component";
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { ROUTES_KEYS } from '../../../../../../shared/config/routes-keys.config';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-items-management',
  imports: [
    CommonModule,
    MatIconModule,
    CustomIconComponent,
    MatButtonModule,
    MatDividerModule,
    RouterModule,
],
  templateUrl: './items-management.component.html',
  styleUrl: './items-management.component.scss'
})
export class ItemsManagementComponent implements OnInit {

  items: ItemDTO[] = []
  ROUTES_KEYS = ROUTES_KEYS

  constructor(
    private _itemService: ItemService,
  ) { }

  async ngOnInit(): Promise<void> {
    const items = await firstValueFrom(this._itemService.findAll())
    this.items = items.sort(this._sortItems())
  }

  private _sortItems() {
    return (a: ItemDTO, b:ItemDTO) => {
      if (a.active === b.active) {
        return (a.name || '').localeCompare(b.name || '')
      }
      return a.active ? -1 : 1
    }
  }

}
