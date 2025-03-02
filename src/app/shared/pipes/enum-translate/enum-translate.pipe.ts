import { Pipe, PipeTransform } from '@angular/core';
import { EducationLevel, Gender, MaritalStatus } from '../../../core';

@Pipe({
  name: 'enumTranslate'
})
export class EnumTranslatePipe implements PipeTransform {

  transform(value: Gender | EducationLevel | MaritalStatus | undefined, ...args: unknown[]): string {

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

    return value.toString();
  }

}
