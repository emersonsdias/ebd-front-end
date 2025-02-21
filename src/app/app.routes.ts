import { Routes } from '@angular/router';
import { ClassroomsPageComponent, FinancePageComponent, HelpPageComponent, HomePageComponent, LessonsPageComponent, ManagementsPageComponent, SettingsPageComponent } from './core';
import { ROUTES_KEYS } from './shared';

export const routes: Routes = [

  { path: '', component: HomePageComponent },
  { path: ROUTES_KEYS.classrooms , component: ClassroomsPageComponent },
  { path: ROUTES_KEYS.finance , component: FinancePageComponent },
  { path: ROUTES_KEYS.help , component: HelpPageComponent },
  { path: ROUTES_KEYS.home , component: HomePageComponent },
  { path: ROUTES_KEYS.lessons , component: LessonsPageComponent },
  { path: ROUTES_KEYS.management , component: ManagementsPageComponent },
  { path: ROUTES_KEYS.settings , component: SettingsPageComponent },

];
