import { Address } from "./address.model"
import { EducationLevel } from "./enums/education-level.enum"
import { Gender } from "./enums/gender.enum"
import { MaritalStatus } from "./enums/marital-status.enum"
import { PhoneNumber } from "./phone-number.model"

export interface Person {
  id?: string
  name: string
  birthdate: string
  email: string
  gender: Gender
  educationLevel: EducationLevel
  maritalStatus: MaritalStatus
  address: Address
  phoneNumbers: PhoneNumber[]
  active?: boolean
  createdAt?: Date
  updatedAt?: Date
}
