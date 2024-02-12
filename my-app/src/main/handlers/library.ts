import {
	ADD_BOOK_DIRECTORY,
	GET_BOOK_COVERS,
	READ_LIBRARY_FILE,
	READ_SETTINGS_FILE,
	RESPONSE_FROM_ELECTRON,
	SAVE_BOOK_PROGRESS,
	WRITE_SETTINGS_FILE
} from '../../shared/constants';
import { LIBRARY_FILE_LOCATION, SETTINGS_LOCATION, STATS_FILE_LOCATION } from '../electron_constants';
import { checkIfDirectoryExists, checkIfFileExists, readAndParseTextFile } from '../utils/diskReader';
import { writeToDisk } from '../utils/diskWriter';
import { handleSettings } from './settings';

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

	switch (type) {
		case READ_LIBRARY_FILE: {
			break;
		}
		case READ_SETTINGS_FILE: {
			break;
		}
		case WRITE_SETTINGS_FILE: {
			break;
		}
		case ADD_BOOK_DIRECTORY: {
			// 1. Add the new directory to settings file
			if (checkIfDirectoryExists(data)) {
				event.reply(RESPONSE_FROM_ELECTRON, { type: 'error', data: 'Directory already exists.' });
			}

			const settingsFile = readAndParseTextFile(SETTINGS_LOCATION);
			// 2. Push the new directory to the settings file
			let directories = settingsFile.directories;
			await handleSettings('update', directories.push(data));
			// 3. Read the new directory
			const listOfBooks = await readRootDirectory(data);
			// 4. Return the new book files

			//*. Check for duplicates
			break;
		}
		case SAVE_BOOK_PROGRESS: {
			break;
		}
		case GET_BOOK_COVERS: {
			break;
		}
		default: {
			console.log(`You've hit default case in handleRendererRequest with type: ${type} and data: ${data}`);
			break;
		}
	}
}

export { handleRendererRequest };
