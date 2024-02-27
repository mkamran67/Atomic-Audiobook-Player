import { dialog } from 'electron';
import path from 'node:path';
import {
	ADD_BOOK_DIRECTORY,
	APPEND_BOOKS,
	ELECTRON_ERROR,
	ELECTRON_WARNING,
	GET_BOOK_COVERS,
	READ_LIBRARY_FILE,
	READ_SETTINGS_FILE,
	RESPONSE_FROM_ELECTRON,
	SAVE_BOOK_PROGRESS,
	WRITE_SETTINGS_FILE
} from '../../shared/constants';
import { INFO_FOLDER_LOCATION, LIBRARY_FILE_LOCATION, STATS_FILE_LOCATION } from '../electron_constants';
import { checkIfFileExists, readAndParseTextFile } from '../utils/diskReader';
import { writeToDisk, writeToDiskAsync } from '../utils/diskWriter';
import logger from '../utils/logger';
import { searchDirectoryForBooks } from './bookData';
import { checkForDuplicateRootDirectories, handleSettings } from './settings';

export interface RequestFromReactType {
	type: string;
	data: any;
}

export function createLibraryFile(): boolean {
	if (checkIfFileExists(LIBRARY_FILE_LOCATION)) {
		return true;
	} else {
		let emptyLibraryFile: [] = [];

		writeToDisk(LIBRARY_FILE_LOCATION, emptyLibraryFile);
		return true;
	}
}

export function createStatsFile(): boolean {
	if (checkIfFileExists(STATS_FILE_LOCATION)) {
		return true;
	} else {
		const emptyStatsFile = {};

		writeToDisk(STATS_FILE_LOCATION, emptyStatsFile);
		return true;
	}
}

export function cleanUpRootLibraryFile(doorDir: string) {

	const libraryFile = readAndParseTextFile(LIBRARY_FILE_LOCATION);


}

async function addbookDirectory(event: any) {
	// 0. Show pop up for directory selection
	const { canceled, filePaths } = await dialog.showOpenDialog({
		title: 'Select a directory',
		properties: ['openDirectory']
	});

	if (canceled) {
		event.reply(RESPONSE_FROM_ELECTRON, { type: ELECTRON_WARNING, data: 'Cancelled directory selection.' });
		return;
	}

	const rootDirPath = '' + path.normalize(filePaths[0]);

	// 1. Add the new rootDirectory to the settings file
	if (checkForDuplicateRootDirectories(rootDirPath)) {
		logger.error(`Directory already exists : ${rootDirPath}`);
		event.reply(RESPONSE_FROM_ELECTRON, { type: ELECTRON_WARNING, data: 'Directory already exists.' });
		return;
	}

	// 2. Read the new rootDirectory
	const listOfbooks = await searchDirectoryForBooks(rootDirPath);
	const libraryReadyData = [
		{
			rootDirectory: rootDirPath,
			books: listOfbooks
		}
	]
	console.log("👉 -> file: library.ts:85 -> libraryReadyData:", libraryReadyData);

	// 3. Check if there are any books in the directory
	// Update settings file with new rootDirectory
	// Save new books to Library file
	if (listOfbooks.length > 0) {
		await handleSettings('update', { rootDirectories: filePaths });
		await writeToDiskAsync(LIBRARY_FILE_LOCATION, libraryReadyData, true);
		// 4. Return the new book files
		event.reply(RESPONSE_FROM_ELECTRON, { type: APPEND_BOOKS, data: listOfbooks });
	} else {
		event.reply(RESPONSE_FROM_ELECTRON, {
			type: ELECTRON_WARNING, data: 'No books found in directory.'
		});
	}

}

async function handleRendererRequest(event: any, request: RequestFromReactType) {
	const { type, data } = request;

	try {
		switch (type) {
			case READ_LIBRARY_FILE: {
				logger.info('Reading library file.');
				const data = readAndParseTextFile(LIBRARY_FILE_LOCATION);

				event.reply(RESPONSE_FROM_ELECTRON, {
					type: APPEND_BOOKS,
					data: data
				});
				break;
			}
			case READ_SETTINGS_FILE: {
				logger.info('Reading settings file.');
				break;
			}
			case WRITE_SETTINGS_FILE: {
				logger.info('Writing settings file.');
				// Data should ecnompass Action and Payload
				const results = await handleSettings(data.action, data.payload);
				event.reply(RESPONSE_FROM_ELECTRON, {
					type: READ_SETTINGS_FILE,
					data: results
				});
				break;
			}
			case ADD_BOOK_DIRECTORY: {
				logger.info('Adding new directory.');
				await addbookDirectory(event);
				break;
			}
			case SAVE_BOOK_PROGRESS: {
				logger.info('Saving book progress for book:');
				break;
			}
			case GET_BOOK_COVERS: {
				logger.info('Getting book covers.');
				break;
			}
			default: {
				console.log(`You've hit default case in handleRendererRequest with type: ${type} and data: ${data}`);
				event.reply(RESPONSE_FROM_ELECTRON, {
					type: ELECTRON_ERROR,
					data: `Whoa! Something went wrong! Check logs ${INFO_FOLDER_LOCATION}`
				});
				break;
			}
		}
	} catch (error: any) {
		logger.error('Error in handleRendererRequest');
		logger.error(error.stack);
		event.reply(RESPONSE_FROM_ELECTRON, { type: 'error', data: error });
	}
}

export { handleRendererRequest };
