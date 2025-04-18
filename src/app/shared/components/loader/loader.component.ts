import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from '../../services/loader/loader.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-loader',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {

  public isLoading$: Observable<boolean>

  constructor(private _loadingService: LoaderService) {
    this.isLoading$ = this._loadingService.isLoading()
  }

  closeLoader() {
    this._loadingService.clearRequests()
  }

}
