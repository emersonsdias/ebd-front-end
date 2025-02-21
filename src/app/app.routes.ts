import { Routes } from '@angular/router';
import { ClassroomsPageComponent, FinancePageComponent, HelpPageComponent, HomePageComponent, LessonsPageComponent, ManagementsPageComponent, SettingsPageComponent } from './core';
import { ROUTES_KEYS } from './shared';

export const routes: Routes = [

  { path: '', component: HomePageComponent, title: 'Início' },
  { path: ROUTES_KEYS.classrooms , component: ClassroomsPageComponent, title: 'Turmas' },
  { path: ROUTES_KEYS.finance , component: FinancePageComponent, title: 'Financeiro' },
  { path: ROUTES_KEYS.help , component: HelpPageComponent, title: 'Ajuda e suporte' },
  { path: ROUTES_KEYS.home , component: HomePageComponent, title: 'Início' },
  { path: ROUTES_KEYS.lessons , component: LessonsPageComponent, title: 'Aulas' },
  { path: ROUTES_KEYS.management , component: ManagementsPageComponent, title: 'Cadastros' },
  { path: ROUTES_KEYS.settings , component: SettingsPageComponent, title: 'Configurações' },

];
