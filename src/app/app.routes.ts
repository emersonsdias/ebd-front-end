import { Routes } from '@angular/router';
import { AccountInformationComponent, ActivityLogComponent, AdminAccessComponent, adminGuard, AgeRangeFormComponent, AgeRangesManagementComponent, AttendanceScoresComponent, authGuard, ClassroomFormPageComponent, ClassroomsPageComponent, DashboardPageComponent, DepartmentsComponent, FinancePageComponent, ForgotPasswordPageComponent, HeadquartersManagementComponent, HelpPageComponent, HomePageComponent, InactiveRecordsComponent, ItemFormComponent, ItemsManagementComponent, LessonAttendancePageComponent, LessonFormPageComponent, LessonsPageComponent, LessonUnitPageComponent, LoginPageComponent, ManagementsPageComponent, PersonDetailsPageComponent, PersonFormPageComponent, SchoolInformationComponent, SettingsPageComponent, TeacherAccessComponent, UserFormComponent, UserRegisterPageComponent } from './core';
import { NotFoundPageComponent, ROUTES_KEYS, unsavedChangesGuard } from './shared';

export const routes: Routes = [

  { path: ROUTES_KEYS.forgotPassword, component: ForgotPasswordPageComponent, title: 'Esqueci minha senha' },
  { path: ROUTES_KEYS.help, component: HelpPageComponent, title: 'Ajuda e suporte' },
  { path: ROUTES_KEYS.login, component: LoginPageComponent, title: 'Login' },
  { path: ROUTES_KEYS.signUp, component: UserRegisterPageComponent, title: 'Cadastro de usuário' },
  {
    path: '', canActivate: [authGuard], children:
      [
        { path: '', component: HomePageComponent, title: 'Início' },
        { path: ROUTES_KEYS.home, component: HomePageComponent, title: 'Início' },
        { path: ROUTES_KEYS.notFound, component: NotFoundPageComponent, title: 'Essa página não existe' },
        {
          path: ROUTES_KEYS.classrooms, children:
            [
              { path: '', component: ClassroomsPageComponent, title: 'Turmas' },
              { path: ROUTES_KEYS.register, canDeactivate: [unsavedChangesGuard], component: ClassroomFormPageComponent, title: 'Cadastrar turma' },
              { path: `:${ROUTES_KEYS.classroomId}`, canDeactivate: [unsavedChangesGuard], component: ClassroomFormPageComponent, title: 'Editar turma' }
            ]
        },
        { path: ROUTES_KEYS.dashboard, canActivate: [adminGuard], component: DashboardPageComponent, title: 'Dashboard' },
        { path: ROUTES_KEYS.finance, canActivate: [adminGuard], component: FinancePageComponent, title: 'Financeiro' },
        {
          path: ROUTES_KEYS.lessons, children:
            [
              { path: '', component: LessonsPageComponent, title: 'Aulas' },
              { path: `${ROUTES_KEYS.units.index}`, component: LessonUnitPageComponent, title: 'Relatório lições' },
              { path: `${ROUTES_KEYS.register}`, canDeactivate: [unsavedChangesGuard], component: LessonFormPageComponent, title: 'Cadastro de aula' },
              { path: `:${ROUTES_KEYS.lessonId}`, canDeactivate: [unsavedChangesGuard], component: LessonFormPageComponent, title: 'Editar aula' },
              { path: `:${ROUTES_KEYS.lessonId}/${ROUTES_KEYS.lessonAttendance}`, canDeactivate: [unsavedChangesGuard], component: LessonAttendancePageComponent, title: 'Realizar chamada' },
            ]
        },
        {
          path: ROUTES_KEYS.management, children:
            [
              { path: '', component: ManagementsPageComponent, title: 'Cadastros' },
              { path: `${ROUTES_KEYS.people}/${ROUTES_KEYS.register}`, canDeactivate: [unsavedChangesGuard], component: PersonFormPageComponent, title: 'Cadastrar pessoa' },
              { path: `${ROUTES_KEYS.people}/:${ROUTES_KEYS.personId}`, component: PersonDetailsPageComponent, title: 'Detalhes de pessoa' },
              { path: `${ROUTES_KEYS.people}/:${ROUTES_KEYS.personId}/${ROUTES_KEYS.edit}`, canDeactivate: [unsavedChangesGuard], component: PersonFormPageComponent, title: 'Editar pessoa' }
            ]
        },
        {
          path: ROUTES_KEYS.settings.index, component: SettingsPageComponent, title: 'Configurações', children: [
            { path: '', component: AccountInformationComponent, title: 'Configurações - Dados da conta' },
            { path: ROUTES_KEYS.settings.accountInformation, component: AccountInformationComponent, title: 'Configurações - Dados da conta' },
            { path: ROUTES_KEYS.settings.activityLog, component: ActivityLogComponent, title: 'Configurações - Registro de atividades' },
            {
              path: ROUTES_KEYS.settings.adminAccess, children:
                [
                  { path: '', component: AdminAccessComponent, title: 'Configurações - Acesso administrativo' },
                  { path: ROUTES_KEYS.register, canDeactivate: [unsavedChangesGuard], component: UserFormComponent, title: 'Configurações - Acesso administrativo' },
                  { path: `:${ROUTES_KEYS.userId}/${ROUTES_KEYS.edit}`, canDeactivate: [unsavedChangesGuard], component: UserFormComponent, title: 'Configurações - Acesso administrativo' }
                ]
            },
            { path: ROUTES_KEYS.settings.attendanceScores, component: AttendanceScoresComponent, title: 'Configurações - Chamadas e pontuações' },
            { path: ROUTES_KEYS.settings.departments, component: DepartmentsComponent, title: 'Configurações - Departamentos' },
            { path: ROUTES_KEYS.settings.headquartersManagement, component: HeadquartersManagementComponent, title: 'Configurações - Gerenciamento da sede' },
            { path: ROUTES_KEYS.settings.inactiveRecords, component: InactiveRecordsComponent, title: 'Configurações - Cadastros inativos' },
            {
              path: ROUTES_KEYS.settings.itemsManagement, children:
                [
                  { path: '', component: ItemsManagementComponent, title: 'Configurações - Gerenciamento de itens' },
                  { path: ROUTES_KEYS.register, canDeactivate: [unsavedChangesGuard], component: ItemFormComponent, title: 'Configurações - Novo item' },
                  { path: `:${ROUTES_KEYS.itemId}/${ROUTES_KEYS.edit}`, canDeactivate: [unsavedChangesGuard], component: ItemFormComponent, title: 'Configurações - Editar item' },
                ]
            },
            {
              path: ROUTES_KEYS.settings.ageRangeManagement, children:
                [
                  { path: '', component: AgeRangesManagementComponent, title: 'Configurações - Gerenciamento de faixas etárias' },
                  { path: ROUTES_KEYS.register, canDeactivate: [unsavedChangesGuard], component: AgeRangeFormComponent, title: 'Configurações - Nova faixa etária' },
                  { path: `:${ROUTES_KEYS.ageRangeId}/${ROUTES_KEYS.edit}`, canDeactivate: [unsavedChangesGuard], component: AgeRangeFormComponent, title: 'Configurações - Editar faixa etária' },
                ]
            },
            { path: ROUTES_KEYS.settings.schoolInformation, component: SchoolInformationComponent, title: 'Configurações - Dados da escola' },
            {
              path: ROUTES_KEYS.settings.teacherAccess, children:
                [
                  { path: '', component: TeacherAccessComponent, title: 'Configurações - Acesso professor' },
                  { path: ROUTES_KEYS.register, canDeactivate: [unsavedChangesGuard], component: UserFormComponent, title: 'Configurações - Acesso professor' },
                  { path: `:${ROUTES_KEYS.userId}/${ROUTES_KEYS.edit}`, canDeactivate: [unsavedChangesGuard], component: UserFormComponent, title: 'Configurações - Acesso professor' }
                ]
            }
          ]
        },
      ]
  },

  { path: '**', component: NotFoundPageComponent, title: 'Essa página não existe' }

];
