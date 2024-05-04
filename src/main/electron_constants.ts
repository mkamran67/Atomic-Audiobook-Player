// File to contain all constants
// Paths, static variables
import path from 'path';
import { app } from 'electron';
export const MEDIA_EXTENSIONS = ['mp3', 'm4b']; // REVIEW update to include all
export const IMG_EXTENSIONS = ['img', 'jpeg', 'jpg', 'png'];

// Somewhat Constants -> that are system-generated <OS_TYPICAL> but will function the same.
export const INFO_FOLDER_LOCATION = path.join(app.getPath('appData'), 'Atomic Audiobook Player');
export const SETTINGS_LOCATION = path.join(INFO_FOLDER_LOCATION, 'settings.txt');
export const ELECTRON_CONFIG_LOCATION = path.join(INFO_FOLDER_LOCATION, 'config.txt');
export const LIBRARY_FILE_LOCATION = path.join(INFO_FOLDER_LOCATION, 'library.txt');
export const STATS_FILE_LOCATION = path.join(INFO_FOLDER_LOCATION, 'stats.txt');
export const FOLDER_STRUCTURE_LOCATION = path.join(INFO_FOLDER_LOCATION, 'folder_structures.txt');
export const INFO_LOG_LOCATION = path.join(INFO_FOLDER_LOCATION, 'info.log');
export const ERROR_LOG_LOCATION = path.join(INFO_FOLDER_LOCATION, 'error.log');
export const EXCEPTION_LOG_LOCATION = path.join(INFO_FOLDER_LOCATION, 'exceptions.log');