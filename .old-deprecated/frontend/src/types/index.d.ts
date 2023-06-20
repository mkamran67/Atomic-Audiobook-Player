export {};
import { MainResponseType } from "./library.types";

type responseFunction = () => {};

interface windowApiType {
  send: (string, string) => void;
  receive: (string, responseFunction) => void;
}

declare global {
  interface Window {
    api: windowApiType;
  }
}
