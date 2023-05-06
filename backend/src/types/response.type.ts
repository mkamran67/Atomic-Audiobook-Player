import { BookData } from "./library.types";

export interface ResponseFromElectronType {
  error: boolean;
  message: string;
  type: string;
  data: null | BookData[] | {};
}
