import { BookData } from "./library.types";

export interface ResponseFromElectronType {
  error: boolean;
  message: string;
  data: null | BookData[];
}
