import { Routes } from '@angular/router';
import { authGuard, ClassroomsPageComponent, FinancePageComponent, ForgotPasswordPageComponent, HelpPageComponent, HomePageComponent, LessonsPageComponent, LoginPageComponent, ManagementsPageComponent, PersonFormPageComponent, SettingsPageComponent, UserRegisterPageComponent } from './core';
import { NotFoundPageComponent, ROUTES_KEYS, unsavedChangesGuard } from './shared';

export const routes: Routes = [

  { path: '', component: HomePageComponent, title: 'Início' },
  { path: ROUTES_KEYS.forgotPassword, component: ForgotPasswordPageComponent, title: 'Esqueci minha senha' },
  { path: ROUTES_KEYS.help, component: HelpPageComponent, title: 'Ajuda e suporte' },
  { path: ROUTES_KEYS.home, component: HomePageComponent, title: 'Início' },
  { path: ROUTES_KEYS.login, component: LoginPageComponent, title: 'Login' },
  { path: ROUTES_KEYS.notFound, component: NotFoundPageComponent, title: 'Essa página não existe' },
  { path: ROUTES_KEYS.signUp, component: UserRegisterPageComponent, title: 'Cadastro de usuário' },
  {
    path: '', canActivate: [authGuard], children: [
      { path: ROUTES_KEYS.classrooms, component: ClassroomsPageComponent, title: 'Turmas' },
      { path: ROUTES_KEYS.finance, component: FinancePageComponent, title: 'Financeiro' },
      { path: ROUTES_KEYS.lessons, component: LessonsPageComponent, title: 'Aulas' },
      { path: ROUTES_KEYS.management, component: ManagementsPageComponent, title: 'Cadastros' },
      {
        path: `${ROUTES_KEYS.management}/${ROUTES_KEYS.people}/${ROUTES_KEYS.register}`,
        canDeactivate: [unsavedChangesGuard],
        component: PersonFormPageComponent,
        title: 'Cadastrar pessoa'
      },
      {
        path: `${ROUTES_KEYS.management}/${ROUTES_KEYS.people}/:${ROUTES_KEYS.personId}`,
        component: PersonFormPageComponent,
        canDeactivate: [unsavedChangesGuard],
        title: 'Editar pessoa'
      },
      { path: ROUTES_KEYS.settings, component: SettingsPageComponent, title: 'Configurações' },
    ]
  },

  { path: '**', component: NotFoundPageComponent, title: 'Essa página não existe' }

];
