import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService, FooterComponent, HeaderComponent, MainContentComponent, SideNavComponent, StorageService } from './core';
import { LoaderComponent } from "./shared/components/loader/loader.component";
import { firstValueFrom, take } from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

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
    private _iconRegistry: MatIconRegistry,
    private _sanitizer: DomSanitizer
  ) {
    this._iconRegistry.addSvgIcon('bible',this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/bible.svg'))
  }

  async ngOnInit(): Promise<void> {
    if (this._storageService.getRefreshToken()) {
      try {
        await firstValueFrom(this._authService.refreshToken())
      } catch (e) {
        console.error('Refresh token failed', e)
      }
    }
  }

  toggleSidenav() {
    setTimeout(() => {
      this.sideNavComponent.toggleMenu()
    }, 0)
  }
}
