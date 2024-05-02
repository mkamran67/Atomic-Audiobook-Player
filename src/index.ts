import { BrowserWindow, app, ipcMain, net, protocol } from "electron";
import path from 'path';
import handleRendererRequest from "./main/request_handler";
import { setupConfigFiles } from "./main/utils/configs";
import logger from "./main/utils/logger";
import fs from 'fs/promises';
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}


setupConfigFiles();

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'get-audio',
    privileges: {
      standard: true,
      bypassCSP: true
    }
  }
]);
const createWindow = (): void => {

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' potato:; media-src 'self' data: potato: get-audio:; "]
      }
    });
  });


  // if (is.dev) {
  // installExtension(REDUX_DEVTOOLS)
  //   .then((name) => console.log(`Added Extension:  ${name}`))
  //   .catch((err) => console.log('An error occurred: ', err));
  // installExtension(REACT_DEVELOPER_TOOLS)
  //   .then((name) => console.log(`Added Extension:  ${name}`))
  //   .catch((err) => console.log('An error occurred: ', err));
  try {
    mainWindow.webContents.openDevTools();
  } catch (error) {
    console.error('Error in opening dev tools', error);
  }
};


app.whenReady().then(() => {

  protocol.handle('potato', (request) => {
    try {

      const trimmedPath = request.url.slice('potato://'.length);
      const decodedPath = path.normalize(decodeURIComponent(trimmedPath));
      const formattedFilePath = 'file://' + decodedPath;

      return net.fetch(formattedFilePath);
    } catch (error) {
      console.error(request.url);
      logger.error('Error in handling potato protocol' + error);
    }
  });


  // protocol.handle('get-audio', (request) => {
  //   try {
  //     console.log(`\nYou've hit the get-audio protocol`);
  //     const trimmedPath = request.url.slice('get-audio://'.length);
  //     const decodedPath = path.normalize(decodeURI(trimmedPath));
  //     const formattedFilePath = 'file://' + decodedPath[0] + ':' + decodedPath.slice(1);
  //     console.log("\nfile: index.ts:109 -> formattedFilePath:", formattedFilePath);

  //     return net.fetch(formattedFilePath);
  //   } catch (error) {
  //     console.error(request.url);
  //     logger.error('Error in handling get-audio protocol' + error);
  //   }
  // });


  // REVIEW -> Trash update broke this completely

  protocol.handle('get-audio', (async req => {
    const filePath = path.normalize(decodeURI(req.url.replace('get-audio://', '')));
    const formattedFile = filePath[0] + ':' + filePath.slice(1);
    const file = await fs.readFile(formattedFile);
    const headers = {
      'Content-Type': 'audio/mpeg',
      'Content-Length': file.length.toString() // Convert to string
    };
    return new Response(file, { headers });
  }));


  // protocol.registerFileProtocol('get-audio', async (request, callback) => {
  //   try {
  //     const trimmedPath = request.url.slice('get-audio://'.length);
  //     const decodedPath = path.normalize(decodeURIComponent(trimmedPath));
  //     const audioData = await fs.readFile(decodedPath);
  //     const mimeType = 'audio/mpeg'; // replace with the appropriate MIME type for your audio files
  //     callback({ path: decodedPath, data: audioData, mimeType });
  //   } catch (error) {
  //     console.error(request.url);
  //     logger.error('Error in handling get-audio protocol' + error);
  //     callback({ error: error.message });
  //   }
  // });

  createWindow();

  console.log('\n\n\n');
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