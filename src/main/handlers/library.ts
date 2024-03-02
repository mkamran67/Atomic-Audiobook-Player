import { dialog } from 'electron';
import path from 'node:path';
import { LibraryStructure } from '../../../src/shared/types';
import {
	APPEND_BOOKS, ELECTRON_WARNING, READ_SETTINGS_FILE, RESPONSE_FROM_ELECTRON
} from '../../shared/constants';
import { LIBRARY_FILE_LOCATION, STATS_FILE_LOCATION } from '../electron_constants';
import { checkIfFileExists, readAndParseTextFile } from '../utils/diskReader';
import { writeToDisk, writeToDiskAsync } from '../utils/diskWriter';
import logger from '../utils/logger';
import { searchDirectoryForBooks } from './bookData';
import { checkForDuplicateRootDirectories, handleSettings } from './settings';

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

export async function cleanUpRootLibraryFile(toRemoveDirectory: string) {

	const libraryFile: LibraryStructure = readAndParseTextFile(LIBRARY_FILE_LOCATION);

	const newLibraryFile = libraryFile.filter((rootDir) => rootDir.rootDirectory !== toRemoveDirectory);

	await writeToDiskAsync(LIBRARY_FILE_LOCATION, newLibraryFile, false);

	return newLibraryFile;

}

export async function addbookDirectory(event: any) {
	// 0. Show pop up for directory selection
	const { canceled, filePaths } = await dialog.showOpenDialog({
		title: 'Select a directory',
		properties: ['openDirectory']
	});

	if (canceled) {
		event.reply(RESPONSE_FROM_ELECTRON, {
			type: ELECTRON_WARNING,
			data: 'Cancelled directory selection.'
		});
		return;
	}

	const rootDirPath = '' + path.normalize(filePaths[0]);

	// 1. Check if Directory is already in the settings file
	if (checkForDuplicateRootDirectories(rootDirPath)) {
		logger.error(`Directory already exists : ${rootDirPath}`);
		event.reply(RESPONSE_FROM_ELECTRON, {
			type: ELECTRON_WARNING,
			data: 'Directory already exists.'
		});
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

	// 3. Check if there are any books in the directory
	// Update settings file with new rootDirectory
	// Save new books to Library file
	if (listOfbooks.length > 0) {
		const newSettings = await handleSettings('update', { rootDirectories: filePaths });
		await writeToDiskAsync(LIBRARY_FILE_LOCATION, libraryReadyData, true);
		// 4. Return the new book files
		event.reply(RESPONSE_FROM_ELECTRON, {
			type: APPEND_BOOKS,
			data: libraryReadyData
		});

		event.reply(RESPONSE_FROM_ELECTRON, {
			type: READ_SETTINGS_FILE,
			data: newSettings
		});
	} else {
		event.reply(RESPONSE_FROM_ELECTRON, {
			type: ELECTRON_WARNING,
			data: 'No books found in directory.'
		});
	}

}


