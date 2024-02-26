
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
import { is } from "@electron-toolkit/utils";
import { BrowserWindow, app, ipcMain, net, protocol } from "electron";
import fs from 'fs';
import { INFO_FOLDER_LOCATION } from "./main/electron_constants";
import { getFileFromDisk } from "./main/handlers/file_reader";
import {
  createLibraryFile,
  createStatsFile,
  handleRendererRequest
} from "./main/handlers/library";
import {
  createSettingsFile
} from "./main/handlers/settings";
import {
  checkIfDirectoryExists
} from "./main/utils/diskReader";
import logger from "./main/utils/logger";
import installExtension, {
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer';
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}


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


protocol.registerSchemesAsPrivileged([{
  scheme: 'get-file',
  privileges: {
    standard: true,
    secure: true
  }
}]);


const createWindow = (): void => {

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src * 'self' data: get-file:"]
      }
    });
  });

  if (is.dev) {
    mainWindow.webContents.openDevTools();
    installExtension(REDUX_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)

app.whenReady().then(() => {

  setupConfigFiles();

  protocol.handle('get-file', async (request) => {
    try {
      return getFileFromDisk(request);
    } catch (error) {
      logger.error('Error in handling get-file protocol' + error);
      return error;
    }
  });

  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// IPC test
ipcMain.on('requestToElectron', handleRendererRequest);