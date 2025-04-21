import { UserRole } from "../../core"

export interface LocalUser {

  email?: string
  exp?: number
  nickname?: string
  userId?: string
  personId?: string
  accessToken?: string
  roles?: UserRole[]

}
