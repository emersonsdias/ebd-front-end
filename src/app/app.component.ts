import { Component, ViewChild } from '@angular/core';
import { AuthService, FooterComponent, HeaderComponent, MainContentComponent, SideNavComponent, StorageService } from './core';
import { LoaderComponent } from "./shared/components/loader/loader.component";

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, MainContentComponent, FooterComponent, SideNavComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  @ViewChild(SideNavComponent) sideNavComponent!: SideNavComponent;

  constructor(
    _storageService: StorageService,
    _authService: AuthService,
  ) {
    if (_storageService.getRefreshToken()) {
      try {
        _authService.refreshToken()
      } catch(_) {
        console.error('Refresh roken failed')
      }
    }
  }

  toggleSidenav() {
    this.sideNavComponent.toggleMenu()
  }
}
