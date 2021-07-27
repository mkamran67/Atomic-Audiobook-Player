import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";
import fs from "graceful-fs";
import isDev from "electron-is-dev"; // New Import
import Book from "./electron_Interfaces/Book";
import * as mm from "music-metadata";
import uniqid from "uniqid";
const libraryPath = `${app.getPath("userData")}\\myLibrary.json`;
const settingsPath = `${app.getPath("userData")}\\mySettings.json`;

// Child Process
import { fork } from "child_process";

const childProcess = fork("src/main/child_processes/createLibrary.js"); // Forking child code

// Function that creates the main window
const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // Removed preload JS since latest Electron - React supports ipchandler as a module
      // preload: __dirname + "/preload.js",
    },
  });

  // React Loaded
  mainWindow.loadURL(
    isDev ? "http://localhost:9000" : `file://${app.getAppPath()}/index.html`
  );

  // Worker Window
  // const workerWindow = new BrowserWindow({
  //   show: false,
  //   webPreferences: { nodeIntegration: true },
  // });

  // workerWindow.loadFile("worker.html");

  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// This method is equivalent to 'app.on('ready', function())'
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their
  // menu bar to stay active until the user quits
  // explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the
  // app when the dock icon is clicked and there are no
  // other windows open
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/* -------------------------------------------------------------------------- */
/*                       Functions and Listeneres below                       */
/* -------------------------------------------------------------------------- */

// Interface -> Get List of Audiobooks
ipcMain.on("asynchronous-open", async (event, arg) => {
  console.log(`\nOpened folder`);

  try {
    let booksList = [] as Book[];

    let result = await dialog.showOpenDialog({
      filters: [{ name: "Audio", extensions: ["mp3", "ogg", "wav"] }],
      title: "Select a root directory",
      buttonLabel: "Select directory",
      properties: ["openDirectory"],
    });

    let openedDirectory: null | string = null;

    // If user selected a directory
    if (!result.canceled) {
      openedDirectory = result.filePaths[0];

      childProcess.send({
        dirPath: openedDirectory,
        libraryPath,
        settingsPath,
      });

      childProcess.on("message", (data: any) => {
        console.log(data.status);
        // if (fs.existsSync(settingsPath)) {
        //   //file exists - Append to file
        //   // 1. Parse previous data
        //   fs.readFile(settingsPath, "json", (err, data) => {
        //     if (err) throw err;
        //     let settings = JSON.parse(data);
        //     settings.rootDirectory = data.openedDirectory; // Save to local too?
        //     fs.writeFile(settingsPath, JSON.stringify(settings), (err) => {
        //       if (err) throw err;
        //     });
        //   });
        //   // 2. Append new data removing old data
        // } else {
        //   // Write to new file
        //   fs.writeFileSync(settingsPath, JSON.stringify(openedDirectory));
        // }
        // 3. Send Library location
        // Reply to React with the path to library.json and settings.json
        event.reply("asynchronous-reply", data);
        // Remove
      });
    } else {
      event.reply("asynchronous-reply", [result.canceled, result.filePaths]);
    }
  } catch (err) {
    console.error(err);
  }
});

// Startup -> Check if library exists
// ipcMain.on("start-up-checks", (event, arg) => {
//   try {
//     if (fs.existsSync(app.getPath("appData"))) {
//       event.reply("start-up-checks-reply", true);
//     } else {
//       event.reply("start-up-checks-reply", false);
//     }
//   } catch (err) {
//     console.error(err);
//   }
// });

/* -------------------------------------------------------------------------- */
/*                                 this is app                                */
/* -------------------------------------------------------------------------- */

console.log(`\n🚀 Electron App is running\n`);
