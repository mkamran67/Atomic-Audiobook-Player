export interface MainResponseType {
	results: boolean;
	filePath: string;
}

export interface BookDataType {
	title: string;
	author: string;
	cover?: string;
	dirPath: string;
}

export interface BookData {
	title: string;
	author?: string;
	cover?: string;
	dirPath: string;
	length?: number;
	isDuplicate?: boolean;
}

export interface ResponseFromElectronType {
	type: string;
	data: any;
}
