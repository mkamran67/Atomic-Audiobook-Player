import { app, BrowserWindow, ipcMain, net, protocol } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import fs from 'node:fs'
import { INFO_FOLDER_LOCATION } from './backend/constants';
// import { existsSync, mkdirSync } from 'node:original-fs';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

if (!fs.existsSync(INFO_FOLDER_LOCATION)) {
  fs.mkdirSync(INFO_FOLDER_LOCATION);
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  if (isDev) {
    mainWindow.webContents.openDevTools({
      mode: 'detach'
    });
  }
};

protocol.registerSchemesAsPrivileged([{
  scheme: 'get-file',
  privileges: { secure: true, standard: true, stream: true }
}])

app.whenReady().then(async () => {
  protocol.handle("get-file", (request) => {
    console.log("👉 -> file: index.ts:62 -> request:", request.url)

    try {
      const normURI = path.normalize(decodeURI(request.url).slice("get-file://".length));
      const url = `file://${normURI[0]}:${normURI.slice(1, normURI.length)}`;
      return net.fetch(url);
    } catch (error: any) {
      console.log("👉 -> file: index.ts:69 -> error:", error)
    }
  })
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

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


ipcMain.on("requestToElectron", async (event, request) => {
  console.log("👉 -> request:", request)
  console.log("👉 -> event:", event)
  // await handleRequestFromReact(event, request)
});