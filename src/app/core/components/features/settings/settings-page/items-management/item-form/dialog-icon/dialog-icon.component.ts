import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CustomIconComponent } from '../../../../../../../../shared';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs';

interface MaterialIcons {
  categories: string[]
  codepoint: number
  name: string
  popularity: number
  tags: string[]
  unsupported_families: string[]
  version: number
}

@Component({
  selector: 'app-dialog-icon',
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    CustomIconComponent
  ],
  templateUrl: './dialog-icon.component.html',
  styleUrl: './dialog-icon.component.scss'
})
export class DialogIconComponent {

  icons = [...CUSTOM_ICONS, ...MAT_ICONS]
  previousIcon: string | undefined
  currentIcon: string | undefined

  constructor(
    private _dialogRef: MatDialogRef<DialogIconComponent>,
    private _httpClient: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: { icon: string | undefined }
  ) {
    this.previousIcon = data.icon
    if (this.previousIcon && this.icons.findIndex(i => i === this.previousIcon) < 0) {
      this.icons.unshift(this.previousIcon)
    }
  }

  findIcons() {
    this._httpClient.get('assets/icons/icons.json').pipe(take(1)).subscribe((response: any) => {
      const matIcons: MaterialIcons[] = response.icons;
      const icons: string[] = matIcons.filter(i => i.unsupported_families.indexOf('Material Icons') < 0)
        .filter(i => this.icons.indexOf(i.name) < 0)
        .sort((a, b) => b.version - a.version)
        .sort((a, b) => b.popularity - a.popularity)
        .map(matIcon => matIcon.name)

      this.icons.push(...icons)
    })
  }

  save() {
    this._dialogRef.close(this.currentIcon)
  }

}

const CUSTOM_ICONS: string[] = [
  'svg:bible'
]

const MAT_ICONS: string[] = [
  'home',
  'restaurant',
  'pets',
  'electric_bolt',
  'checkroom',
  'water_drop',
  'school',
  'directions_bike',
  'directions_bus',
  'directions_car',
  'flight',
  'clean_hands',
  'photo_camera',
  'headphones',
  'audiotrack',
  'power',
  'sports_esports',
  'health_and_safety',
  'volunteer_activism',
  'celebration',
  'sports_bar',
  'local_bar',
  'favorite',
  'shopping_cart',
  'menu_book',
  'redeem',
  'self_improvement',
  'stroller',
  'child_care',
  'savings',
  'account_balance',
  'credit_card',
  'money',
  'sports_motorsports',
  'grade',
  'key',
  'rocket_launch',
  'recycling',
  'interests',
  'cell_tower',
  'credit_card',
  'payments',
  'handyman',
  'factory',
  'fastfood',
  'construction',
  'sports_score',
  'smartphone',
  'computer',
  'balance',
  'apartment',
  'icecream',
  'family_restroom',
  'cast',
  'ondemand_video',
]
