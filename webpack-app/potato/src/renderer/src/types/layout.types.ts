export interface LayoutState {
  error: boolean
  loading: boolean
  message?: string
}


export type IncomingElectronResponseType {
  type: string
  data: any
}