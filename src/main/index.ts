import { app, BrowserWindow, ipcMain, protocol, shell } from 'electron';
import fs from 'fs';
import { join } from 'path';

import { electronApp, is, optimizer } from '@electron-toolkit/utils';

import icon from '../../resources/icon.png?asset';
import { INFO_FOLDER_LOCATION } from './electron_constants';
import { getFileFromDisk } from './handlers/file_reader';
import { createLibraryFile, createStatsFile, handleRendererRequest } from './handlers/library';
import { createSettingsFile } from './handlers/settings';
import { checkIfDirectoryExists } from './utils/diskReader';
import logger from './utils/logger';

// Create Config files
// 1. Settings file
// 2. Library file
// 3. Stats file

function setupConfigFiles() {
	logger.info('Setting up config files');

	// 1. Check if INFO folder exists
	if (!checkIfDirectoryExists(INFO_FOLDER_LOCATION)) {
		// Create INFO folder
		fs.mkdirSync(INFO_FOLDER_LOCATION);
	}

	// Create settings file
	const settingsResults = createSettingsFile();
	if (settingsResults) {
		logger.info('Settings file created');
	}
	// Create library file
	const libraryResults = createLibraryFile();
	if (libraryResults) {
		logger.info('Library file created');
	}
	// Create stats file
	const statsResults = createStatsFile();
	if (statsResults) {
		logger.info('Stats file created');
	}
}

function createWindow(): void {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 900,
		height: 670,
		show: false,
		autoHideMenuBar: true,
		...(process.platform === 'linux' ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, '../preload/index.js'),
			sandbox: false
		}
	});

	mainWindow.on('ready-to-show', () => {
		mainWindow.show();
	});

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: 'deny' };
	});

	// HMR for renderer base on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
		mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
	} else {
		mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
	}
}

setupConfigFiles();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	protocol.handle('get-file', getFileFromDisk);

	// Set app user model id for windows
	electronApp.setAppUserModelId('com.electron');

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	createWindow();

	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// IPC test
ipcMain.on('requestToElectron', handleRendererRequest);
