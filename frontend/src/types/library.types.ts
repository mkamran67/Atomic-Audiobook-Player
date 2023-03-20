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