import { Component, Input, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DialogService, ROUTES_KEYS } from '../../../../shared';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-nav',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatListModule, MatSidenavModule, RouterModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {

  @ViewChild('drawer') drawer: MatDrawer | undefined
  showSideNav: boolean = true
  isSmallScreen: boolean = false
  ROUTES_KEYS = ROUTES_KEYS;

  constructor(
    public authService: AuthService,
    private _breakpointObserver: BreakpointObserver,
    private _dialogService: DialogService,
  ) { }

  ngOnInit() {
    this._breakpointObserver.observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait])
      .subscribe(result => {
        this.isSmallScreen = result.matches
        this.showSideNav = !result.matches
      })
    this.authService.isAuthenticated().subscribe({
      next: (res) => {
        if (!res) {
          this.showSideNav = false
        } else {
          if (!this.isSmallScreen) {
            this.showSideNav = true
          }
        }
      }
    })

  }

  toggleMenu(showSideNav: boolean | undefined = undefined) {
    this.showSideNav = showSideNav != undefined ? showSideNav : !this.showSideNav
  }

  closeDrawerIfOver() {
    if (this.isSmallScreen) {
      this.toggleMenu(false)
    }
  }

  logout() {
    const options = {
      title: 'Sair',
      message: 'Você tem certeza que deseja sair?'
    }
    this._dialogService.openConfirmation(options).then(res => {
      if (res) {
        this.authService.logout(ROUTES_KEYS.login)
      }
    })
  }

}
