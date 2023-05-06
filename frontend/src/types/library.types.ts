export interface MainResponseType {
  results: boolean;
  filePath: string;
}

export interface BookDataType {
  title: string;
  artist: string;
  cover?: string;
  dirPath: string;
}

export interface BookData {
  title: string;
  artist?: string;
  cover?: string;
  dirPath: string;
  length?: number;
}

export interface ResponseFromElectronType {
  error: boolean;
  message: string;
  type: string;
  data: null | BookData[] | {};
}