import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ROUTES_KEYS } from '../../../../../shared/config/routes-keys.config';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-settings-page',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatListModule,
    MatDividerModule,
    MatMenuModule,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {

  isSmallScreen = false;
  menuItems = [
    [
      { route: ROUTES_KEYS.settings.attendanceScores, icon: 'star', label: 'Chamadas e pontuações', last: false },
      { route: ROUTES_KEYS.settings.inactiveRecords, icon: 'people', label: 'Cadastros inativos', last: false },
      { route: ROUTES_KEYS.settings.activityLog, icon: 'lists', label: 'Registro de atividades', last: false },
      { route: ROUTES_KEYS.settings.departments, icon: 'account_balance', label: 'Departamentos', last: false },
      { route: ROUTES_KEYS.settings.headquartersManagement, icon: 'business', label: 'Gerenciamento da sede', last: false },
    ],
    [
      { route: ROUTES_KEYS.settings.adminAccess, icon: 'admin_panel_settings', label: 'Acesso administrativo', last: false },
      { route: ROUTES_KEYS.settings.teacherAccess, icon: 'school', label: 'Acesso professores', last: false },
    ],
    [
      { route: ROUTES_KEYS.settings.schoolInformation, icon: 'menu_book', label: 'Dados da escola', last: false },
      { route: ROUTES_KEYS.settings.accountInformation, icon: 'settings', label: 'Dados da conta', last: true },
    ]
  ]
  ROUTES_KEYS = ROUTES_KEYS

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.Handset])
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });
  }


}
