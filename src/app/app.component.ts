import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService, FooterComponent, HeaderComponent, MainContentComponent, SideNavComponent, StorageService } from './core';
import { LoaderComponent } from "./shared/components/loader/loader.component";
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, MainContentComponent, FooterComponent, SideNavComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  @ViewChild(SideNavComponent) sideNavComponent!: SideNavComponent;

  constructor(
    private _storageService: StorageService,
    private _authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    if (this._storageService.getRefreshToken()) {
      try {
        const subscribe = this._authService
          .refreshToken()
          .pipe(take(1))
          .subscribe()
      } catch (_) {
        console.error('Refresh roken failed')
      }
    }
  }

  toggleSidenav() {
    this.sideNavComponent.toggleMenu()
  }
}
