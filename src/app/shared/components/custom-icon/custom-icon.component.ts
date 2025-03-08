import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-icon',
  imports: [CommonModule, MatIconModule],
  templateUrl: './custom-icon.component.html',
  styleUrl: './custom-icon.component.scss'
})
export class CustomIconComponent {

  @Input({ required: true }) icon: string | undefined
  @Input() size: number | undefined

  isSvgIcon(icon: string | undefined): boolean {
    if (!icon) {
      return false
    }
    return icon.includes('svg:')
  }

}
