import fs from 'fs';
import { SETTINGS_LOCATION } from '../electron_constants';
import { checkIfFileExists, readAndParseTextFile } from '../utils/diskReader';
import { writeToDisk } from '../utils/diskWriter';
import { BookData } from '../../renderer/src/types/library.types';
import logger from '../utils/logger';
import { SettingsStructureType } from '../../../src/shared/types';



async function saveSettings(data: SettingsStructureType) {
	try {
		writeToDisk(SETTINGS_LOCATION, data);
		logger.info('Settings saved');
	} catch (err: any) {
		throw new Error(err);
	}
}

async function readSettings(): Promise<void | SettingsStructureType> {
	try {
		const settings = readAndParseTextFile(SETTINGS_LOCATION);
		return settings;
	} catch (err: any) {
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
			previoousBookDirectory: '',
			volume: 100
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
	let settings = await readSettings();

	if (settings) {
		let tempRootDirectories = [...settings.rootDirectories, ...data.rootDirectories];

		settings = {
			...settings,
			...data
		} as SettingsStructureType;

		settings.rootDirectories = tempRootDirectories;

		await saveSettings(settings);
	}
	return settings;
}

async function deleteADirectory(data: string) {
	let settings = await readSettings();

	if (settings) {
		const newRootDirectories = settings.rootDirectories.filter((dir) => dir !== data);
		settings.rootDirectories = newRootDirectories;
		await saveSettings(settings);
	}

	return settings;
}

export async function handleSettings(operation: string, data: any): Promise<any> {
	switch (operation) {
		case 'save': {
			await saveSettings(data);
			break;
		}
		case 'update': {
			const settings = await updateSettings(data);
			return settings;
		}
		case 'deleteADirectory': {
			await deleteADirectory(data);
			break;
		}
		case 'read': {
			const settings = await readSettings();
			return settings;
		}
		default: {
			console.log(`You've hit default`);
			break;
		}
	}
}
