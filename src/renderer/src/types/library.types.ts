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

export interface LibraryBookSetType {
	books: BookDataType[];
	rootDirectory: string;
}

export interface ResponseFromElectronType {
	type: string;
	data: any;
}
