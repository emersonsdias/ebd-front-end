import { Pipe, PipeTransform } from '@angular/core';
import { EducationLevel, Gender, LessonStatus, MaritalStatus, PersonType, UserRole } from '../../../core';

@Pipe({
  name: 'enumTranslate'
})
export class EnumTranslatePipe implements PipeTransform {

  transform(value: Gender | EducationLevel | MaritalStatus | PersonType | UserRole | LessonStatus | undefined, ...args: unknown[]): string {

    if (!value) {
      return ''
    }

    if (Object.values(Gender).includes(value as Gender)) {
      switch (value) {
        case Gender.FEMALE:
          return 'Feminino'
        case Gender.MALE:
          return 'Masculino'
      }
    }

    if (Object.values(EducationLevel).includes(value as EducationLevel)) {
      switch (value) {
        case EducationLevel.ELEMENTARY:
          return 'Ensino fundamento incompleto'
        case EducationLevel.MIDDLE_SCHOOL:
          return 'Ensino fundamental'
        case EducationLevel.HIGH_SCHOOL:
          return 'Ensino médio'
        case EducationLevel.TECHNICAL:
          return 'Ensino técnico'
        case EducationLevel.INCOMPLETE_HIGHER_EDUCATION:
          return 'Superior incompleto'
        case EducationLevel.HIGHER_EDUCATION:
          return 'Superior completo'
        case EducationLevel.POSTGRADUATE:
          return 'Pós graduação'
      }
    }

    if (Object.values(MaritalStatus).includes(value as MaritalStatus)) {
      switch (value) {
        case MaritalStatus.SINGLE:
          return 'Solteiro(a)'
        case MaritalStatus.MARRIED:
          return 'Casado(a)'
        case MaritalStatus.DIVORCED:
          return 'Divorciado(a)'
        case MaritalStatus.WIDOWED:
          return 'Viúvo(a)'
      }
    }

    if (Object.values(PersonType).includes(value as PersonType)) {
      switch (value) {
        case PersonType.STUDENT:
          return 'Estudante'
        case PersonType.TEACHER:
          return 'Professor'
      }
    }

    if (Object.values(UserRole).includes(value as UserRole)) {
      switch (value) {
        case UserRole.ADMIN:
          return 'Administrador'
        case UserRole.TEACHER:
          return 'Professor'
      }
    }

    if (Object.values(LessonStatus).includes(value as LessonStatus)) {
      switch (value) {
        case LessonStatus.OPEN_SAME_DAY:
          return 'Aberta para edição no dia da aula'
        case LessonStatus.OPEN_ANY_DAY:
          return 'Aberta qualquer dia'
        case LessonStatus.CLOSED:
          return 'Fechada'
        case LessonStatus.FINALIZED:
          return 'Finalizada'
      }
    }

    return value.toString();
  }

}
