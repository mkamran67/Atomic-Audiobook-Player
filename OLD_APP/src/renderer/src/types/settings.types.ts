export interface DataRequestType {
  type: DataRequestEnum
  data: null
}

export enum DataRequestEnum {
  GET_BOOKS,
  GET_SETTINGS
}
