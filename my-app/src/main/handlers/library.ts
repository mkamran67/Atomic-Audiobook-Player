import { dialog } from 'electron';
import {
	ADD_BOOK_DIRECTORY,
	GET_BOOK_COVERS,
	READ_LIBRARY_FILE,
	READ_SETTINGS_FILE,
	RESPONSE_FROM_ELECTRON,
	SAVE_BOOK_PROGRESS,
	WRITE_SETTINGS_FILE
} from '../../shared/constants';
import { LIBRARY_FILE_LOCATION, STATS_FILE_LOCATION } from '../electron_constants';
import { checkIfFileExists } from '../utils/diskReader';
import { writeToDisk, writeToDiskAsync } from '../utils/diskWriter';
import logger from '../utils/logger';
import { checkForDuplicateRootDirectories, handleSettings } from './settings';
import path from 'node:path';
import { checkDuplicatesBooks, searchDirectoryForBooks } from './bookData';
import { spawn } from 'node:child_process';

export interface RequestFromReactType {
	type: string;
	data: any;
}

export function createLibraryFile(): boolean {
	if (checkIfFileExists(LIBRARY_FILE_LOCATION)) {
		return true;
	} else {
		const emptyLibraryFile = [];

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

async function handleRendererRequest(event: any, request: RequestFromReactType) {
	const { type, data } = request;

	try {
		switch (type) {
			case READ_LIBRARY_FILE: {
				logger.info('Reading library file.');
				break;
			}
			case READ_SETTINGS_FILE: {
				logger.info('Reading settings file.');
				break;
			}
			case WRITE_SETTINGS_FILE: {
				logger.info('Writing settings file.');
				break;
			}
			case ADD_BOOK_DIRECTORY: {
				logger.info('Adding new directory.');

				// 0. Show pop up for directory selection
				const { canceled, filePaths } = await dialog.showOpenDialog({
					title: 'Select a directory',
					properties: ['openDirectory']
				});

				if (canceled) {
					event.reply(RESPONSE_FROM_ELECTRON, { type: 'error', data: 'Cancelled directory selection.' });
					return;
				}

				const rootDirPath = '' + path.normalize(filePaths[0]);

				// 1. Add the new rootDirectory to the settings file
				if (checkForDuplicateRootDirectories(rootDirPath)) {
					logger.error(`Directory already exists : ${rootDirPath}`);
					event.reply(RESPONSE_FROM_ELECTRON, { type: 'error', data: 'Directory already exists.' });
					break;
				}

				// 2. Read the new rootDirectory
				const listOfbooks = await searchDirectoryForBooks(rootDirPath);

				// 3. Check if there are any books in the directory
				// Update settings file with new rootDirectory
				// Save new books to Library file
				if (listOfbooks.length > 0) {
					await handleSettings('update', { rootDirectories: filePaths });
					await writeToDiskAsync(LIBRARY_FILE_LOCATION, listOfbooks, true);
					// 4. Return the new book files
					event.reply(RESPONSE_FROM_ELECTRON, { type: 'newBooks', data: listOfbooks });
				} else {
					event.reply(RESPONSE_FROM_ELECTRON, { type: 'warning', data: 'No books found in directory.' });
				}

				const res = await checkDuplicatesBooks();

				if (!res.error) {
					event.reply(RESPONSE_FROM_ELECTRON, { type: 'newBooks', data: res });
				} else {
					event.reply(RESPONSE_FROM_ELECTRON, res);
				}

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
