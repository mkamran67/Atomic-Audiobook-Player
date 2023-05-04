// const { scanBooks } = require("./electron-utils/utils");
// const path = require("path");
// const { app, BrowserWindow, dialog, ipcMain } = require("electron");
// const isDev = require("electron-is-dev");
import os from "os";
import scanBooks from "./electron-utils/utils";
import path from "path";
import { app, BrowserWindow, dialog, ipcMain, protocol, session } from "electron";
import isDev from "electron-is-dev";
import { INFO_FOLDER_LOCATION, BOOKS_LIST_LOCATION } from "./electron-utils/constants";
import { existsSync, readFileSync } from "original-fs";
import getSimpleBookData from "./electron-utils/bookData";
import { ResponseFromElectronType } from "./types/response.type";
import { BookData } from "./types/library.types";

const reactDevToolsPath = path.join(
  os.homedir(),
  "AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\lmhkpmbekcpmknklioeibfkpmmfibljd\\3.0.19_0"
);

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, "electron-utils", "preload.js"),
    },
    autoHideMenuBar: true,
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(isDev ? "http://localhost:5173" : `file://${path.join(__dirname, "../build/index.html")}`);
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  protocol.registerFileProtocol("image-file", (request, callback) => {
    const url = request.url.replace("image-file://", "");
    try {
      return callback(url);
    } catch (err) {
      console.error(err);
      return callback("404");
    }
  });

  session.defaultSession
    .loadExtension(reactDevToolsPath)
    .then(() => {
      createWindow();
    })
    .catch((err) => {
      console.error(err);
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// app.on("activate", () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });

// ------------------------------- Event Listeners Below -------------------------------
//
//
// Listeners below will be called by React.
//
//
//
//
// This listener will send back all the books data to React
ipcMain.on("requestToElectron", async (event, data) => {
  // Determines what actions to take
  switch (data.type) {
    // Returns the Library data to React -> Does not Scan or ReScan.
    case "getAllBooksSimplified": {
      try {
        let results: ResponseFromElectronType = {
          error: false,
          message: "Successfully scanned",
          data: null,
        };

        results.data = getSimpleBookData();
        event.reply("responseFromElectron", results);
      } catch (err) {
        console.error(err);
        let results: ResponseFromElectronType = {
          error: true,
          message: err.message,
          data: null,
        };
        event.reply("responseFromElectron", results);
      }
      break;
    }
    // Scans a directory for audiobooks
    case "newAudioBookDirectory": {
      // Get directory path from user
      const dirPath = await dialog.showOpenDialog({
        properties: ["openDirectory"],
        message: "Select the root directory containing your Audiobooks",
      });

      if (dirPath && dirPath.canceled) {
        // Tell React it failed/canceled
        const results: ResponseFromElectronType = {
          error: true,
          message: "Failed to get a directory",
          data: null,
        };

        event.reply("responseFromElectron", results);
      } else if (dirPath) {
        try {
          const rootPathForBooks = dirPath.filePaths[0];

          // Scan for books and build a save file
          // This will take place in a sub process
          const arrayOfBooks: BookData[] = await scanBooks(rootPathForBooks);

          const results: ResponseFromElectronType = {
            error: false,
            message: "Successfully scanned",
            data: arrayOfBooks,
          };

          if (arrayOfBooks) {
            console.log(`Replying to React`);
            event.reply("responseFromElectron", results);
          }
        } catch (err) {
          event.reply("responseFromElectron", {
            error: true,
            message: err.message,
            data: null,
          });
        }
      }
      break;
    }
    default: {
      console.log(`You've hit default -> ${data.type}`);
      break;
    }
  }
});
