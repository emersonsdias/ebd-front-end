import { State } from "./state.model"

export interface City {
  id?: number
  name: string
  state: State
  active?: boolean
  createdAt?: Date
  updatedAt?: Date
}
