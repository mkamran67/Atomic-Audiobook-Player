// File to contain all constants
// Paths, static variables
import path from 'path';
import { app } from 'electron';
const MEDIA_EXTENSIONS = ['mp3', 'm4b'];
const IMG_EXTENSIONS = ['img', 'jpeg', 'jpg', 'png'];

// Somewhat Constants -> that are system-generated <OS_TYPICAL> but will function the same.
const INFO_FOLDER_LOCATION = path.join(app.getPath('appData'), 'Atomic Audiobook Player');
const SETTINGS_LOCATION = path.join(INFO_FOLDER_LOCATION, 'settings.txt');
const ELECTRON_CONFIG_LOCATION = path.join(INFO_FOLDER_LOCATION, 'config.txt');
const LIBRARY_FILE_LOCATION = path.join(INFO_FOLDER_LOCATION, 'library.txt');
const STATS_FILE_LOCATION = path.join(INFO_FOLDER_LOCATION, 'stats.txt');
const INFO_LOG_LOCATION = path.join(INFO_FOLDER_LOCATION, 'info.log');
const ERROR_LOG_LOCATION = path.join(INFO_FOLDER_LOCATION, 'error.log');
const EXCEPTION_LOG_LOCATION = path.join(INFO_FOLDER_LOCATION, 'exceptions.log');

// The below is for response consistency
// ELECTRON_RESPONSE -> is what React is expecting
// Response constants from Electron - strings
// REVIEW -> Remove -> Migrate to shared/constants
const ELECTRON_RESPONSE_SETTINGSDATA_TYPE = 'settingsData';
const ELECTRON_RESPONSE_BOOKDATA_TYPE = 'bookData';
const ELECTRON_RESPONSE_BOOK_DETAILS_TYPE = 'bookDetails';
const ELECTRON_ERROR = 'error_type';

export {
	MEDIA_EXTENSIONS,
	STATS_FILE_LOCATION,
	EXCEPTION_LOG_LOCATION,
	IMG_EXTENSIONS,
	INFO_FOLDER_LOCATION,
	SETTINGS_LOCATION,
	ELECTRON_CONFIG_LOCATION,
	LIBRARY_FILE_LOCATION,
	INFO_LOG_LOCATION,
	ERROR_LOG_LOCATION,
	ELECTRON_RESPONSE_SETTINGSDATA_TYPE,
	ELECTRON_RESPONSE_BOOKDATA_TYPE,
	ELECTRON_RESPONSE_BOOK_DETAILS_TYPE,
	ELECTRON_ERROR
};
