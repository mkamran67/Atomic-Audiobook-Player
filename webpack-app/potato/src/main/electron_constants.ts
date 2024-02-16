// File to contain all constants
// Paths, static variables
import path from 'path';
import { app } from 'electron';
export const MEDIA_EXTENSIONS = ['mp3', 'm4b'];
export const IMG_EXTENSIONS = ['img', 'jpeg', 'jpg', 'png'];

// Somewhat Constants -> that are system-generated <OS_TYPICAL> but will function the same.
export const INFO_FOLDER_LOCATION = path.join(app.getPath('appData'), 'Atomic Audiobook Player');
export const SETTINGS_LOCATION = path.join(INFO_FOLDER_LOCATION, 'settings.txt');
export const ELECTRON_CONFIG_LOCATION = path.join(INFO_FOLDER_LOCATION, 'config.txt');
export const LIBRARY_FILE_LOCATION = path.join(INFO_FOLDER_LOCATION, 'library.txt');
export const STATS_FILE_LOCATION = path.join(INFO_FOLDER_LOCATION, 'stats.txt');
export const INFO_LOG_LOCATION = path.join(INFO_FOLDER_LOCATION, 'info.log');
export const ERROR_LOG_LOCATION = path.join(INFO_FOLDER_LOCATION, 'error.log');
export const EXCEPTION_LOG_LOCATION = path.join(INFO_FOLDER_LOCATION, 'exceptions.log');

// API Request channels
export const REQUEST_TO_ELECTRON = 'requestToElectron';
export const RESPONSE_FROM_ELECTRON = 'responseFromElectron';

// API Request types
export const READ_LIBRARY_FILE = 'readLibraryFile';
export const READ_SETTINGS_FILE = 'readSettingsFile';
export const WRITE_SETTINGS_FILE = 'writeSettingsFile';
export const ADD_BOOK_DIRECTORY = 'addBookDirectory';
export const SAVE_BOOK_PROGRESS = 'saveBookProgress';
export const GET_BOOK_COVERS = 'getbookCovers';
export const ELECTRON_ERROR = 'electronError';
export const ELECTRON_WARNING = 'electronWarning';
export const APPEND_BOOKS = 'appendBooks';
export const GET_BOOK_DETAILS = 'getBookDetails';
