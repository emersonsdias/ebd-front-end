import { Component, ViewChild } from '@angular/core';
import { FooterComponent, HeaderComponent, MainContentComponent, SideNavComponent } from './core';
import { LoaderComponent } from "./shared/components/loader/loader.component";

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, MainContentComponent, FooterComponent, SideNavComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  @ViewChild(SideNavComponent) sideNavComponent!: SideNavComponent;

  toggleSidenav() {
    this.sideNavComponent.toggleMenu()
  }
}
