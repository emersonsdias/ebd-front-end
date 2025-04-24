import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ROUTES_KEYS } from '../../../../../shared/config/routes-keys.config';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../../services/auth/auth.service';
import { map, Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

interface MenuItem {
  route: string,
  icon: string,
  label: string,
  disable?: Observable<boolean>,
}


@Component({
  selector: 'app-settings-page',
  imports: [
    CommonModule,
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
export class SettingsPageComponent implements OnInit, OnDestroy {

  isAdmin$: Observable<boolean>
  isSmallScreen = false
  menuItems: MenuItem[][] = []
  ROUTES_KEYS = ROUTES_KEYS
  private _subscriptions: Subscription[] = []

  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _authService: AuthService,
  ) {
    this.isAdmin$ = this._authService.isAdmin()
    this.menuItems = [[
      // { route: ROUTES_KEYS.settings.attendanceScores, icon: 'star', label: 'Chamadas e pontuações' },
      { route: ROUTES_KEYS.settings.inactiveRecords, icon: 'people', label: 'Cadastros inativos' },
      // { route: ROUTES_KEYS.settings.activityLog, icon: 'lists', label: 'Registro de atividades' },
      // { route: ROUTES_KEYS.settings.departments, icon: 'account_balance', label: 'Departamentos' },
      // { route: ROUTES_KEYS.settings.headquartersManagement, icon: 'business', label: 'Gerenciamento da sede' },
      { route: ROUTES_KEYS.settings.itemsManagement, icon: 'category', label: 'Gerenciamento de itens' },
      { route: ROUTES_KEYS.settings.ageRangeManagement, icon: 'family_restroom', label: 'Gerenciamento de faixas etárias' },
    ],
    [
      { route: ROUTES_KEYS.settings.adminAccess, icon: 'admin_panel_settings', label: 'Acesso administrativo', disable: this.isAdmin$.pipe(map(isAdmin => !isAdmin)) },
      { route: ROUTES_KEYS.settings.teacherAccess, icon: 'school', label: 'Acesso professores' },
    ],
    [
      { route: ROUTES_KEYS.settings.schoolInformation, icon: 'menu_book', label: 'Dados da escola' },
      { route: ROUTES_KEYS.settings.accountInformation, icon: 'settings', label: 'Dados da conta' },
    ]
    ]
  }

  ngOnInit() {
    const breakpoint = this._breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.Handset])
      .subscribe(result => this.isSmallScreen = result.matches)
    this._subscriptions.push(breakpoint)
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => subscription.unsubscribe())
  }

}
