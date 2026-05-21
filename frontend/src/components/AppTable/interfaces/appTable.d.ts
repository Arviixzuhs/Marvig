export interface AppTableActions {
  create?: () => Promise<void>
  delete?: () => Promise<void>
  update?: () => Promise<void>
}
