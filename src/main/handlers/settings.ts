import { webContents } from 'electron';
import { LibraryView, SettingsStructureType } from '../../../src/shared/types';
import { SETTINGS_LOCATION } from '../electron_constants';
import { checkIfFileExists, readAndParseTextFile } from '../utils/diskReader';
import { writeToDisk } from '../utils/diskWriter';
import logger from '../utils/logger';
import { cleanUpRootLibraryFile } from './library';
import { READ_LIBRARY_FILE, RESPONSE_FROM_ELECTRON } from '../../../src/shared/constants';



async function saveSettings(data: SettingsStructureType) {
	try {
		writeToDisk(SETTINGS_LOCATION, data);
		logger.info('Settings saved');
	} catch (err: any) {
		throw new Error(err);
	}
}

function readSettings(): SettingsStructureType {
	try {
		const settings = readAndParseTextFile(SETTINGS_LOCATION);
		return settings;
	} catch (err: any) {
		logger.error('Error reading settings file');
		throw new Error(err);
	}
}

export function checkForDuplicateRootDirectories(dirPath: string) {
	// 1. Read Settings File
	const settingsFile: SettingsStructureType = readAndParseTextFile(SETTINGS_LOCATION);
	const listOfDirectories = settingsFile.rootDirectories;
	// 2. Check if directory exists return true or false -> empty = false
	return listOfDirectories.includes(dirPath);
}

export function createSettingsFile(): boolean {
	try {
		// Check if the file exists
		const emptySettingsFile: SettingsStructureType = {
			rootDirectories: [],
			themeMode: 'system',
			previousBookDirectory: '',
			volume: 100,
			libraryView: LibraryView.GALLERY
		};

		if (checkIfFileExists(SETTINGS_LOCATION)) {
			return true;
		}

		writeToDisk(SETTINGS_LOCATION, emptySettingsFile);
		return true;
	} catch (err: any) {
		return false;
	}
}

async function updateSettings(data: SettingsStructureType) {
	let settings = readSettings();

	if (settings) {
		let tempRootDirectories = [...new Set([...settings.rootDirectories, ...data.rootDirectories])];

		settings = {
			...settings,
			...data
		} as SettingsStructureType;

		settings.rootDirectories = tempRootDirectories;

		await saveSettings(settings);
		return settings;
	}
}

async function deleteADirectory(data: string) {
	let settings = readSettings();

	if (settings) {
		const newRootDirectories = settings.rootDirectories.filter((dir) => dir !== data);
		settings.rootDirectories = newRootDirectories;
		await saveSettings(settings);
		const newLibrary = await cleanUpRootLibraryFile(data);
		webContents.getAllWebContents().forEach((webContent) => {
			webContent.send(RESPONSE_FROM_ELECTRON, {
				type: READ_LIBRARY_FILE,
				data: newLibrary
			});
		});

	}

	return settings;
}

export async function handleSettings(action: string, payload: any): Promise<any> {
	switch (action) {
		case 'save': {
			return await saveSettings(payload);
		}
		case 'update': {
			return await updateSettings(payload);
		}
		case 'deleteADirectory': {
			return await deleteADirectory(payload);
		}
		case 'read': {
			return readSettings();
		}
		default: {
			console.log(`You've hit default`);
			break;
		}
	}
}
