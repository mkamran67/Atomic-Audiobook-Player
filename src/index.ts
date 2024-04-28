import { is } from "@electron-toolkit/utils";
import { BrowserWindow, app, ipcMain, net, protocol } from "electron";
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';
import path from 'path';
import handleRendererRequest from "./main/request_handler";
import { setupConfigFiles } from "./main/utils/configs";
import logger from "./main/utils/logger";
import fs from 'fs/promises';
import * as fsSync from 'fs';
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}


setupConfigFiles();

// protocol.registerSchemesAsPrivileged([
//   {
//     scheme: 'potato://',
//     privileges: {
//       standard: true,
//       secure: true,
//     }
//   },
// ]);


// protocol.registerSchemesAsPrivileged([
//   {
//     scheme: 'get-audio',
//     privileges: {
//       standard: true,
//     }
//   },
//   {
//     scheme: 'get-audio://',
//     privileges: {
//       standard: true,
//     }
//   }
// ]);

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

  // REVIEW -> Trash update broke this completely
  // protocol.handle('get-audio', (request) => {
  //   try {
  //     // console.log(`\nfirst request: ${request.url}\n\n`);
  //     // const trimmedPath = request.url.slice('get-audio://'.length);
  //     // const decodedPath = path.normalize(decodeURIComponent(trimmedPath));
  //     // const formattedFilePath = 'file://' + decodedPath;

  //     console.log(`\n get-audio what in the flying fuck is going on here \n`);
  //     const hPath = 'file://' + path.normalize('E:/Books/Audio Books/Food, Diet/Fat for Fuel A Revolutionary Diet to Combat Cancer, Boost Brain Power, and Increase Your Energy/Fat for Fuel_ A Revo_B072L48PKB_LC_32_22050_Mono.mp3');
  //     console.log("file: index.ts:114 -> hPath:", hPath);

  //     return net.fetch(hPath);

  //     // return net.fetch('file://' + path.normalize('E:/Books/Audio Books/Food, Diet/Fat for Fuel A Revolutionary Diet to Combat Cancer, Boost Brain Power, and Increase Your Energy/Fat for Fuel_ A Revo_B072L48PKB_LC_32_22050_Mono.mp3'));
  //   } catch (err) {
  //     console.log('\n ERROR ->');
  //     console.error(request.url);
  //     console.error(err);
  //     return new Response(null, { status: 500 });
  //   }
  // });


  protocol.registerFileProtocol('get-audio', async (request, callback) => {
    try {
      const trimmedPath = request.url.slice('get-audio://'.length);
      const decodedPath = path.normalize(decodeURIComponent(trimmedPath));
      const audioData = await fs.readFile(decodedPath);
      const mimeType = 'audio/mpeg'; // replace with the appropriate MIME type for your audio files
      callback({ path: decodedPath, data: audioData, mimeType });
    } catch (error) {
      console.error(request.url);
      logger.error('Error in handling get-audio protocol' + error);
      callback({ error: error.message });
    }
  });

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