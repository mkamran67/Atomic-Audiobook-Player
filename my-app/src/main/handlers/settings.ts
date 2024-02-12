import fs from 'fs';
import { SETTINGS_LOCATION } from '../electron_constants';
import { checkIfFileExists, readAndParseTextFile } from '../utils/diskReader';
import { writeToDisk } from '../utils/diskWriter';

export interface SettingsStructureType {
  rootDirectories: string[];
  theme?: string;
  themeMode: 'dark' | 'light' | 'system';
  fontSize?: number;
  previoousBookDirectory: string;
}

async function saveSettings(data: SettingsStructureType) {
  try {
    fs.writeFile(SETTINGS_LOCATION, JSON.stringify(data), () => {
      console.log('Settings saved');
    });
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

export function createSettingsFile(): boolean {
  try {
    // Check if the file exists
    const emptySettingsFile: SettingsStructureType = {
      rootDirectories: [],
      themeMode: 'system',
      previoousBookDirectory: ''
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

export async function handleSettings(operation: string, data: any): Promise<any> {
  switch (operation) {
    case 'save': {
      await saveSettings(data);
      break;
    }
    case 'update': {
      break;
    }
    case 'delete': {
      break;
    }
    case 'default': {
      break;
    }
    case 'read': {
      await readSettings();
      break;
    }

    default: {
      console.log(`You've hit default`);
      break;
    }
  }
}
