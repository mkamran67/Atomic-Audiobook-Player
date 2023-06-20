import { BookData } from "./library.types";

export interface ResponseFromElectronType {
  type: string;
  data: null | BookData[] | {};
}

export interface RequestFromReactType {
  type: string;
  data: any;
}
