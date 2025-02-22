import { City } from "./city.model"

export interface Address {
  id?: string
  street: string
  number?: string
  complement?: string
  neighborhood?: string
  zipCode?: string
  city?: City
  active?: boolean
  createdAt?: Date
  updatedAt?: Date
}
