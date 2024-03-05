import { is } from "@electron-toolkit/utils";
import { BrowserWindow, app, ipcMain, protocol } from "electron";
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';
import { getFileFromDisk } from "./main/handlers/file_reader";
import handleRendererRequest from "./main/request_handler";
import { setupConfigFiles } from "./main/utils/configs";
import logger from "./main/utils/logger";


// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

setupConfigFiles();

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
        'Content-Security-Policy': ["default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: get-file:; media-src 'self' data: get-file:;"]
      }
    });
  });


  if (is.dev) {
    installExtension(REDUX_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
    mainWindow.webContents.openDevTools();
  }
};

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

// Handle requests from the renderer process
ipcMain.on('requestToElectron', handleRendererRequest);