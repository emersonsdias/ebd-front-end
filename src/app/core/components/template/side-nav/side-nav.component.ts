import { Component, Input, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-side-nav',
  imports: [MatButtonModule, MatIconModule, MatListModule, MatSidenavModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {

  @ViewChild('drawer') drawer: MatDrawer | undefined
  showSideNav: boolean = true
  isSmallScreen: boolean = false

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait])
      .subscribe(result => {
        this.isSmallScreen = result.matches
        this.showSideNav = !result.matches
      });
  }

  navigateTo(path: string) {
    console.log("Navigate to", path)
  }

  toggleMenu(showSideNav: boolean | undefined = undefined) {
    this.showSideNav = showSideNav != undefined ? showSideNav : !this.showSideNav
  }

}
